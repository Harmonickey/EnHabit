#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deployment_base}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

def create_listing(userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags, pictures)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["UserId"] = userId
    listing_obj["Landlord"] = landlord if not landlord.nil? and not landlord.empty?
    listing_obj["LandlordId"] = landlordId if not landlordId.nil? and not landlordId.empty?
    listing_obj["Price"] = price.to_i
    listing_obj["Address"] = address
    listing_obj["Unit"] = unit if not unit.nil? and not unit.empty?
    listing_obj["Bedrooms"] = bedrooms.to_i
    listing_obj["Bathrooms"] = bathrooms.to_i
    listing_obj["HasAnimals"] = animals.to_b
    listing_obj["HasLaundry"] = laundry.to_b
    listing_obj["HasParking"] = parking.to_b
    listing_obj["HasAirConditioning"] = airConditioning.to_b
    listing_obj["Type"] = type
    listing_obj["Start"] = Date.strptime(start, "%m/%d/%Y").mongoize
    listing_obj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listing_obj["University"] = university
    listing_obj["Tags"] = tags
    listing_obj["Pictures"] = pictures
    
    query_obj = Hash.new
    query_obj["UserId"] = userId
    
    document = Hash.new
    
    begin
        mongo_session.with(safe: true) do |session|
            curr_listings = session[:listings].find(query_obj).to_a
            
            #restrict more than one listing to landlords
            if curr_listings.count > 0 and landlordId.nil?
                document["error"] = "Tenants can only have one listing at a time."
            else
                session[:listings].insert(listing_obj)
                
                ret_query_obj = Hash.new
                ret_query_obj["$and"] = []
                ret_query_obj["$and"].push({"Address" => address})
                
                # if we already had some listings, only grab the new one we just put in
                ret_query_obj["$and"].push({"$nin" => curr_listings.collect{|l| l["_id"]}}) if curr_listings.count > 0
                
                document = session[:listings].find(ret_query_obj).select(_id: 1, Price: 1, Address: 1, Unit: 1, Bedrooms: 1, Bathrooms: 1, HasAnimals: 1, HasLaundry: 1, HasParking: 1, HasAirConditioning: 1, Type: 1, Start: 1, WorldCoordinates: 1, Landlord: 1, Tags: 1, Pictures: 1).one
            end
        end
    rescue Moped::Errors::OperationFailure => e
        document["error"] = e
    end
    
	mongo_session.disconnect
    return document
end

def get_landlord_id(landlord)
    
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    begin
        query_obj = Hash.new
        query_obj["Landlord"] = landlord
        
        account = Array.new
        mongo_session.with(safe: true) do |session|
            account = session[:accounts].find(query_obj).to_a
        end
        
        if account.count == 0
            return "No Match"
        else
            return account[0]["LandlordId"]
        end
    rescue Moped::Errors::OperationFailure => e
        return "No Match"
    end
end

def get_user_id(user)
    
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    begin
        query_obj = Hash.new
        query_obj["Username"] = user
        
        account = Array.new
        mongo_session.with(safe: true) do |session|
            account = session[:accounts].find(query_obj).to_a
        end
        
        if account.count == 0
            return "No Match"
        else
            return account[0]["UserId"]
        end
    rescue Moped::Errors::OperationFailure => e
        return "No Match"
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    id = ARGV[1]
    # key = ARGV[2]
    is_admin = ARGV[3].to_b
    landlord = data["landlord"]
    landlordId = nil
    
    if landlordId.nil? or landlordId.empty?
        landlordId = get_landlord_id(landlord) unless landlord.nil?
        landlordId = "" if landlordId == "No Match" or landlordId.nil?
    end
    
    result = create_listing(id, landlord, landlordId, data["rent"], data["address"], data["unit"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["airConditioning"], data["type"], data["start"], data["latitude"], data["longitude"], data["university"], data["tags"], data["pictures"])

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end
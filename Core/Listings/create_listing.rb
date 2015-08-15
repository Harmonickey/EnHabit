#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
@deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deployment_base}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

Moped::BSON = BSON

def create_listing(is_admin, key, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags, pictures)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["Username"] = user unless user.nil?
    listing_obj["UserId"] = userId unless userId.nil?
    listing_obj["Landlord"] = landlord unless landlord.nil?
    listing_obj["LandlordId"] = landlordId unless landlordId.nil?
    listing_obj["Price"] = price.to_i
    listing_obj["Address"] = address
    listing_obj["Unit"] = unit unless unit.nil?
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
    unless is_admin
        if key == "UserId"
            query_obj[key] = userId
        elsif key == "LandlordId"
            query_obj[key] = landlordId
        end
    end
    
    document = Hash.new
    
    begin
        mongo_session.with(safe: true) do |session|
            curr_listings = session[:listings].find(query_obj).to_a
            
            #restrict more than one listing to landlords
            unless is_admin and curr_listings.count > 0 and landlordId.nil?
                document["error"] = "Tenants can only have one listing at a time."
                
                remove_uploaded_pics pictures
            else
                session[:listings].insert(listing_obj)
                
                ret_query_obj = Hash.new
                ret_query_obj["$and"] = []
                ret_query_obj["$and"].push({"Address" => address})
                
                # if we already had some listings, only grab the new one we just put in
                ret_query_obj["$and"].push({"_id" => {"$nin" => curr_listings.collect{|l| l["_id"]}}}) if curr_listings.count > 0
                
                document = session[:listings].find(ret_query_obj).select(_id: 1, Username: 1, Price: 1, Address: 1, Unit: 1, Bedrooms: 1, Bathrooms: 1, HasAnimals: 1, HasLaundry: 1, HasParking: 1, HasAirConditioning: 1, Type: 1, Start: 1, WorldCoordinates: 1, Landlord: 1, University: 1, Tags: 1, Pictures: 1).one
            end
        end
    rescue Moped::Errors::OperationFailure => e
        document["error"] = e
        
        remove_uploaded_pics pictures
    end
    
	mongo_session.disconnect
    return document
end

def remove_uploaded_pics(pictures)

    return if pictures.nil?

    # delete all these pictures because we failed a query
    pictures.each do |pic|
        filename = "#{@deployment_base}/../images/enhabit/images/" + pic 
        File.delete(filename) if File.exist? filename
    end         
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
            return nil
        else
            return account[0]["LandlordId"]
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
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
            return nil
        else
            return account[0]["UserId"]
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    
    id = ARGV[1]
    key = ARGV[2]
    is_admin = ARGV[3].to_b
    
    landlord = data["landlord"]
    user = data["user"]
    
    userId = get_user_id(user) unless user.nil?
    landlordId = get_landlord_id(landlord) unless landlord.nil?
    
    unless is_admin
        if key == "UserId"
            userId = id
        elsif key == "LandlordId"
            landlordId = id
        end
    end
    
    result = create_listing(is_admin, key, user, userId, landlord, landlordId, data["rent"], data["address"], data["unit"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["airConditioning"], data["type"], data["start"], data["latitude"], data["longitude"], data["university"], data["tags"], data["pictures"])

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    
    data = JSON.parse(ARGV[0].delete('\\'))
    pictures = data["pictures"]
    remove_uploaded_pics pictures
    
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end
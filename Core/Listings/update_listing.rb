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

def update_listing(id, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags, pictures)
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])
    mongo_session.use("enhabit")

    #object to insert/update with
    listing_obj = Hash.new
    listing_obj["UserId"] = userId if not userId.nil? and not userId.empty?
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
    
    #object to search with
    query_obj = Hash.new
    query_obj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    ret_msg = ""
 
    begin
        # for pictures, we need to do something special
        # delete all the pictures on disk that aren't in the updated list
        mongo_session.with(safe: true) do |session|
            document = session[:listings].find(query_obj).select(Pictures: 1).one
            if not document["Pictures"].nil?
                document["Pictures"].each do |pic|
                    if not pictures.nil? and not pictures.include? pic
                        filename = "#{@deployment_base}/../images/enhabit/images/" + pic
                        File.delete(filename) if File.exist? filename
                    elsif pictures.count == 0
                        filename = "#{@deployment_base}/../images/enhabit/images/" + pic
                        File.delete(filename) if File.exist? filename
                    end
                end
            end
        end
    
    
        mongo_session.with(safe: true) do |session|
            session[:listings].find(query_obj).update('$set' => listing_obj)
        end
        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e
    end
    
	mongo_session.disconnect
    return ret_msg
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

begin
    # when user updates a listing they only input a landlord (optional)
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].nil?
    
    landlord = data["landlord"] unless data["landlord"].nil? and not data["landlord"].empty?
    landlordId = (data["landlordId"].nil? ? "" : data["landlordId"])
    
    if landlordId.empty?
        landlordId = get_landlord_id(landlord);
        landlordId = "" if landlordId == "No Match"
    end
    
    puts update_listing(data["id"], data["userId"], landlord, landlordId, data["rent"], data["address"], data["unit"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["airConditioning"], data["type"], data["start"], data["latitude"], data["longitude"], data["university"], data["tags"], data["pictures"])
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    message = Hash.new
    message.error = e.inspect
    puts message
end
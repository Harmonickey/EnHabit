#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

Moped::BSON = BSON

def CreateListing(isAdmin, key, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags, pictures)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    listingObj = Hash.new
    listingObj["Username"] = user unless user.nil?
    listingObj["UserId"] = userId unless userId.nil?
    listingObj["Landlord"] = landlord unless landlord.nil?
    listingObj["LandlordId"] = landlordId unless landlordId.nil?
    listingObj["Price"] = price.to_i
    listingObj["Address"] = address
    listingObj["Unit"] = unit unless unit.nil?
    listingObj["Bedrooms"] = bedrooms.to_i
    listingObj["Bathrooms"] = bathrooms.to_i
    listingObj["HasAnimals"] = animals.to_b
    listingObj["HasLaundry"] = laundry.to_b
    listingObj["HasParking"] = parking.to_b
    listingObj["HasAirConditioning"] = airConditioning.to_b
    listingObj["Type"] = type
    listingObj["Start"] = Date.strptime(start, "%m/%d/%Y").mongoize
    listingObj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listingObj["University"] = university
    listingObj["Tags"] = tags
    listingObj["Pictures"] = pictures
    
    queryObj = Hash.new
    unless isAdmin
        if key == "UserId"
            queryObj[key] = userId
        elsif key == "LandlordId"
            queryObj[key] = landlordId
        end
    end
    
    document = Hash.new
    
    begin
        mongoSession.with(safe: true) do |session|
            currListings = session[:listings].find(queryObj).to_a
            
            #restrict more than one listing to landlords
            if currListings.count > 0 and not userId.nil?
                document["error"] = "Tenants can only have one listing at a time."
                
                RemoveUploaded_pics pictures
            else
                session[:listings].insert(listingObj)
                
                retQueryObj = Hash.new
                retQueryObj["$and"] = []
                retQueryObj["$and"].push({"Address" => address})
                
                # if we already had some listings, only grab the new one we just put in
                retQueryObj["$and"].push({"_id" => {"$nin" => currListings.collect{|l| l["_id"]}}}) if currListings.count > 0
                
                document = session[:listings].find(retQueryObj).select(_id: 1, Username: 1, Price: 1, Address: 1, Unit: 1, Bedrooms: 1, Bathrooms: 1, HasAnimals: 1, HasLaundry: 1, HasParking: 1, HasAirConditioning: 1, Type: 1, Start: 1, WorldCoordinates: 1, Landlord: 1, University: 1, Tags: 1, Pictures: 1).one
            end
        end
    rescue Moped::Errors::OperationFailure => e
        document["error"] = e
        
        RemoveUploadedPics pictures
    end
    
	mongoSession.disconnect
    return document
end

def RemoveUploadedPics(pictures)

    return if pictures.nil?

    # delete all these pictures because we failed a query
    pictures.each do |pic|
        filename = "#{@deploymentBase}/../images/enhabit/images/" + pic 
        File.delete(filename) if File.exist? filename
    end         
end

def GetLandlordId(landlord)
    
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["Landlord"] = landlord
        
        account = Array.new
        mongoSession.with(safe: true) do |session|
            account = session[:accounts].find(queryObj).to_a
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

def GetUserId(user)
    
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["Username"] = user
        
        account = Array.new
        mongoSession.with(safe: true) do |session|
            account = session[:accounts].find(queryObj).to_a
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
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    id = ARGV[1] if not ARGV[0].nil?
    key = ARGV[2]
    isAdmin = ARGV[3].to_b
    
    landlord = data["Landlord"]
    user = data["User"]
    
    userId = GetUserId(user) unless user.nil?
    landlordId = GetLandlordId(landlord) unless landlord.nil?
    
    unless isAdmin
        if key == "UserId"
            userId = id
        elsif key == "LandlordId"
            landlordId = id
        end
    end
    
    result = CreateListing(isAdmin, key, user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["Type"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Tags"], data["Pictures"])

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    pictures = data["Pictures"] unless data["Pictures"].nil?
    RemoveUploadedPics pictures
    
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end
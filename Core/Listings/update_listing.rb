#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'
require 'rmagick'

Moped::BSON = BSON

def UpdateListing(isAdmin, key, id, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, leaseType, buildingType, notes, start, latitude, longitude, university, tags, pictures)
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])
    mongoSession.use("enhabit")

    #object to insert/update with
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
    listingObj["LeaseType"] = leaseType
    listingObj["BuildingType"] = buildingType
    listingObj["Notes"] = (notes.nil? ? "" : notes)
    listingObj["Start"] = Date.strptime(start, "%m/%d/%Y").mongoize
    listingObj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listingObj["University"] = university
    listingObj["Tags"] = tags
    listingObj["Pictures"] = pictures
    if not pictures.nil? and pictures.length > 0
        thumbnails = []
        pictures.each do |filename|
            thumbFileName = filename + "_thumbnail"
            if filename.include? "."
                parts = filename.split(".")
                parts[-2] += "_thumbnail"
                thumbFileName = parts.join(".")
            end
            
            # scale down halfway and interlace the image
            Magick::Image::read("#{@deploymentBase}/images/enhabit/images/" + filename)[0].scale(0.5).write("#{@deploymentBase}/images/enhabit/images/" + thumbFileName) do |f| 
                f.interlace = Magick::PlaneInterlace
            end
            
            thumbnails.push(thumbFileName)
        end
    
        listingObj["Thumbnails"] = thumbnails
    end
    
    #object to search with
    queryObj = Hash.new
    queryObj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    unless isAdmin
        if key == "UserId"
            queryObj[key] = userId
        elsif key == "LandlordId"
            queryObj[key] = landlordId
        end
    end
    
    retMsg = ""
 
    begin
        # for pictures, we need to do something special
        # delete all the pictures on disk that aren't in the updated list
        mongoSession.with(safe: true) do |session|
            document = session[:listings].find(queryObj).select(Pictures: 1, Thumbnails: 1).one
            unless document["Pictures"].nil?
                document["Pictures"].each do |pic|
                    filename = "#{@deploymentBase}/images/enhabit/images/" + pic
                    if ((not pictures.nil? and not pictures.include? pic) or 
                        (pictures.nil? or pictures.count == 0))
                        File.delete(filename) if File.exist? filename
                        
                        # now delete the thumbnail associated with the picture
                        thumb = pic + "_thumbnail"
                        if pic.include? "."
                            parts = pic.split(".")
                            parts[-2] += "_thumbnail"
                            thumb = parts.join(".")
                        end
                        thumbFilename = "#{@deploymentBase}/images/enhabit/images/" + thumb
                        File.delete(thumbFilename) if File.exist? thumbFilename
                    end
                end
            end
        end
        
        mongoSession.with(safe: true) do |session|
            session[:listings].find(queryObj).update('$set' => listingObj)
        end
        retMsg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retMsg = e
    end
    
	mongoSession.disconnect
    return retMsg
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
    # when user updates a listing they only input a landlord (optional)
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?

    id = ARGV[1].split(",")[0] unless ARGV[1].empty?
    key = ARGV[2] unless ARGV[2].empty?
    isAdmin = ARGV[3].to_b unless ARGV[3].empty?
    
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
    
    puts UpdateListing(isAdmin, key, data["id"], user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["LeaseType"], data["BuildingType"], data["Notes"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Tags"], data["Pictures"])
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    message = Hash.new
    message.error = e.inspect
    puts message
end

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

def CreateListing(isAdmin, key, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, leaseType, buildingType, notes, start, latitude, longitude, university, pictures, threshold, isPastThreshold)
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
    listingObj["LeaseType"] = leaseType
    listingObj["BuildingType"] = buildingType
    listingObj["Notes"] = (notes.nil? ? "" : notes)
    listingObj["Start"] = Date.strptime(start, "%m/%d/%Y").mongoize
    listingObj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listingObj["University"] = university
    listingObj["IsRented"] = false
    listingObj["IsPastThreshold"] = isPastThreshold
    listingObj["IsActive"] = (not pictures.nil? and pictures.length > 0 and not isPastThreshold ? true : false)
    listingObj["IsFeatured"] = false
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

                removalPics = (listingObj["Pictures"].nil? ? [] : listingObj["Pictures"]) + (listingObj["Thumbnails"].nil? ? [] : listingObj["Thumbnails"])
                
                RemoveUploadedPics removalPics
            else
                session[:listings].insert(listingObj)
                
                retQueryObj = Hash.new
                retQueryObj["$and"] = []
                retQueryObj["$and"].push({"Address" => address})
                
                # if we already had some listings, only grab the new one we just put in
                retQueryObj["$and"].push({"_id" => {"$nin" => currListings.collect{|l| l["_id"]}}}) if currListings.count > 0
                
                document = session[:listings].find(retQueryObj).select(_id: 1, Username: 1, Price: 1, Address: 1, Unit: 1, Bedrooms: 1, Bathrooms: 1, HasAnimals: 1, HasLaundry: 1, HasParking: 1, HasAirConditioning: 1, LeaseType: 1, BuildingType: 1, Notes: 1, Start: 1, WorldCoordinates: 1, Landlord: 1, University: 1, Pictures: 1, Thumbnails: 1, IsActive: 1, IsPastThreshold: 1).one
                
                document[:Threshold] = threshold
            end
        end
    rescue Moped::Errors::OperationFailure => e
        document["error"] = e
        
        removalPics = (listingObj["Pictures"].nil? ? [] : listingObj["Pictures"]) + (listingObj["Thumbnails"].nil? ? [] : listingObj["Thumbnails"])
                
        RemoveUploadedPics removalPics
    end
    
	mongoSession.disconnect
    return document
end

def RemoveUploadedPics(pictures)

    return if pictures.nil?

    # delete all these pictures because we failed a query
    pictures.each do |pic|
        filename = "#{@deploymentBase}/images/enhabit/images/" + pic 
        File.delete(filename) if File.exist? filename
    end  
end

def GetLandlordId(landlord)
    
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["Username"] = landlord
        
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

def GetUniversity(universityName)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["UniversityName"] = universityName
        
        university = Array.new
        mongoSession.with(safe: true) do |session|
            university = session[:universities].find(queryObj).to_a
        end
        
        if university.count == 0
            return nil
        else
            return {:X => university[0]["WorldCoordinates"]["x"], :Y => university[0]["WorldCoordinates"]["y"], :Threshold => university[0]["Threshold"]}
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    id = ARGV[1].split(",")[0] if not ARGV[0].nil?
    key = ARGV[2] if not ARGV[2].nil?
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
    
    university = GetUniversity(data["University"])
    
    if university.nil?
        puts "Unable to get university"
    else
        isPastThreshold = (ComputeDistance(university[:X], university[:Y], data["Latitude"], data["Longitude"]) > university[:Threshold].to_f)
    
        result = CreateListing(isAdmin, key, user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["LeaseType"], data["BuildingType"], data["Notes"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Pictures"], university[:Threshold], isPastThreshold)

        puts result.to_json
    end
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

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

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
def UpdateListing(isAdmin, key, id, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, leaseType, buildingType, notes, start, latitude, longitude, university, pictures, isActive, isPastThreshold, isFeatured)
=======
def UpdateListing(isAdmin, key, id, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, leaseType, buildingType, notes, start, latitude, longitude, university, pictures)
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
def UpdateListing(isAdmin, key, id, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, leaseType, buildingType, notes, start, latitude, longitude, university, pictures, isActive)
>>>>>>> 4e2c6fb... 107 active changes
=======
def UpdateListing(isAdmin, key, id, user, userId, landlord, landlordId, price, address, unit, bedrooms, bathrooms, animals, laundry, parking, airConditioning, leaseType, buildingType, notes, start, latitude, longitude, university, pictures, isActive, isPastThreshold)
>>>>>>> da5fc3d... 119 hash usage
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    listingObj["IsPastThreshold"] = isPastThreshold
    listingObj["IsActive"] = false
    listingObj["IsFeatured"] = isFeatured
    listingObj["Pictures"] = pictures
    
    if not pictures.nil? and pictures.length > 0
        listingObj["IsActive"] = isActive.to_b and isPastThreshold
        
=======
    listingObj["IsActive"] = (not pictures.nil? and pictures.length > 0)
    listingObj["Pictures"] = pictures
    if not pictures.nil? and pictures.length > 0
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
=======
    listingObj["IsPastThreshold"] = isPastThreshold
>>>>>>> da5fc3d... 119 hash usage
    listingObj["IsActive"] = false
    listingObj["Pictures"] = pictures
    
    if not pictures.nil? and pictures.length > 0
        listingObj["IsActive"] = isActive.to_b and isPastThreshold
        
>>>>>>> 4e2c6fb... 107 active changes
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
<<<<<<< HEAD
<<<<<<< HEAD
            return {:X => university[0]["WorldCoordinates"]["x"], :Y => university[0]["WorldCoordinates"]["y"], :Threshold => university[0]["Threshold"]}
=======
            return {"X": university[0]["WorldCoordinates"]["x"], "Y": university[0]["WorldCoordinates"]["y"], "Threshold": university[0]["Threshold"]}
>>>>>>> 615f1c4... 119 distance from university
=======
            return {:X => university[0]["WorldCoordinates"]["x"], :Y => university[0]["WorldCoordinates"]["y"], :Threshold => university[0]["Threshold"]}
>>>>>>> f7415c1... 119 ruby syntax fix
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end
<<<<<<< HEAD
<<<<<<< HEAD
=======

def ComputeDistance(lat1, lon1, lat2, lon2)

    phi1 = lat1.to_rad
    phi2 = lat2.to_rad
    deltaphi = (lat2-lat1).to_rad
    deltalamba = (lon2-lon1).to_rad

    a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    d = 6371000 * c # meters
    
    return d * 0.000621371; # to miles
end
>>>>>>> 615f1c4... 119 distance from university
=======
>>>>>>> 6d6307e... 119 move to tools.rb

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
    
    university = GetUniversity(data["University"])
    
<<<<<<< HEAD
<<<<<<< HEAD
    if university.nil?
        puts "Unable to get university"
    else
        isPastThreshold = (ComputeDistance(university[:X], university[:Y], data["Latitude"], data["Longitude"]) > university[:Threshold].to_f)
=======
    raise "Unable to get university" if university.nil?
<<<<<<< HEAD
<<<<<<< HEAD
    raise "Listing is too far from campus" if ComputeDistance(university["X"], university["Y"], data["Latitude"], data["Longitude"]) > university["Threshold"]
>>>>>>> 615f1c4... 119 distance from university
=======
    raise "Listing is too far from campus" if ComputeDistance(university[:X], university[:Y], data["Latitude"], data["Longitude"]) > university[:Threshold]
>>>>>>> f7415c1... 119 ruby syntax fix
=======
    raise "Listing is too far from campus" if ComputeDistance(university[:X], university[:Y], data["Latitude"], data["Longitude"]) > university[:Threshold].to_f
>>>>>>> 004dc8e... 119 error fix
    
<<<<<<< HEAD
<<<<<<< HEAD
        puts UpdateListing(isAdmin, key, data["id"], user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["LeaseType"], data["BuildingType"], data["Notes"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Pictures"], data["IsActive"],isPastThreshold, data["IsFeatured"])
    end
=======
    puts UpdateListing(isAdmin, key, data["id"], user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["LeaseType"], data["BuildingType"], data["Notes"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Pictures"])
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
    puts UpdateListing(isAdmin, key, data["id"], user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["LeaseType"], data["BuildingType"], data["Notes"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Pictures"], data["IsActive"])
>>>>>>> 4e2c6fb... 107 active changes
=======
    if university.nil?
        puts "Unable to get university"
    else
        isPastThreshold = (ComputeDistance(university[:X], university[:Y], data["Latitude"], data["Longitude"]) > university[:Threshold].to_f)
    
        puts UpdateListing(isAdmin, key, data["id"], user, userId, landlord, landlordId, data["Rent"], data["Address"], data["Unit"], data["Bedrooms"], data["Bathrooms"], data["Animals"], data["Laundry"], data["Parking"], data["AirConditioning"], data["LeaseType"], data["BuildingType"], data["Notes"], data["Start"], data["Latitude"], data["Longitude"], data["University"], data["Pictures"], data["IsActive"],isPastThreshold)
    end
>>>>>>> 29c0140... 119 better error message
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    message = Hash.new
    message.error = e.inspect
    puts message
end

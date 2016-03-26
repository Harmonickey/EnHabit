#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'securerandom'

<<<<<<< HEAD
<<<<<<< HEAD
def InsertUniversity(universityName, address, threshold, latitude, longitude)
=======
def InsertUniversity(universityName, address, latitude, longitude)
>>>>>>> f518129... 107 universities
=======
def InsertUniversity(universityName, address, threshold, latitude, longitude)
>>>>>>> 33457ff... 119 getting distance calculations

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    univObj = Hash.new
    univObj["UniversityId"] = SecureRandom.uuid
    univObj["UniversityName"] = universityName
    univObj["Address"] = address
    univObj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
<<<<<<< HEAD
<<<<<<< HEAD
    univObj["Threshold"] = threshold
=======
>>>>>>> f518129... 107 universities
=======
    univObj["Threshold"] = threshold
>>>>>>> 33457ff... 119 getting distance calculations
 
    document = Hash.new
 
    begin
        mongoSession.with(safe: true) do |session|
            session[:universities].insert(univObj)
        end
        
        queryObj = Hash.new
        queryObj["UniversityId"] = univObj["UniversityId"]
        
        mongoSession.with(safe: true) do |session|
            document = session[:universities].find(queryObj).select(_id: 1, UniversityName: 1, Address: 1).one
        end
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 6d4d791... 115 backend functions
        
        # also insert default pricing for that university
        universityId = document["UniversityId"]
        
        pricingObj = Hash.new
        pricingObj["UniversityId"] = universityId
        pricingObj["ListingMarkup"] = 1
        pricingObj["FeaturedMarkup"] = 20
        
        mongoSession.with(safe: true) do |session|
            session[:universities].insert(pricingObj)
        end
        
<<<<<<< HEAD
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$UniversityName_1"
            document["error"] = "That university name already exists!"
=======
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$UniversityName_1"
            document["error"] = "That username already exists!"
>>>>>>> f518129... 107 universities
=======
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$UniversityName_1"
            document["error"] = "That university name already exists!"
>>>>>>> 6d4d791... 115 backend functions
        end
    end
    
	mongoSession.disconnect
    return document.to_json
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    
<<<<<<< HEAD
<<<<<<< HEAD
    puts InsertUniversity(data["UniversityName"], data["Address"], data["Threshold"], data["Latitude"], data["Longitude"])
=======
    puts InsertUniversity(data["UniversityName"], data["Address"], data["Latitude"], data["Longitude"])
>>>>>>> f518129... 107 universities
=======
    puts InsertUniversity(data["UniversityName"], data["Address"], data["Threshold"], data["Latitude"], data["Longitude"])
>>>>>>> 33457ff... 119 getting distance calculations
rescue Exception => e
    puts e.inspect
end

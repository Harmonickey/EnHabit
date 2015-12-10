#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'securerandom'

def InsertUniversity(universityName, address, threshold, latitude, longitude)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    univObj = Hash.new
    univObj["UniversityId"] = SecureRandom.uuid
    univObj["UniversityName"] = universityName
    univObj["Address"] = address
    univObj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    univObj["Threshold"] = threshold
 
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
        
        # also insert default pricing for that university
        universityId = document["UniversityId"]
        
        pricingObj = Hash.new
        pricingObj["UniversityId"] = universityId
        pricingObj["ListingMarkup"] = 1
        pricingObj["FeaturedMarkup"] = 20
        
        mongoSession.with(safe: true) do |session|
            session[:universities].insert(pricingObj)
        end
        
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$UniversityName_1"
            document["error"] = "That university name already exists!"
        end
    end
    
	mongoSession.disconnect
    return document.to_json
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    
    puts InsertUniversity(data["UniversityName"], data["Address"], data["Threshold"], data["Latitude"], data["Longitude"])
rescue Exception => e
    puts e.inspect
end

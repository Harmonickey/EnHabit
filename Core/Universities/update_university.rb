#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'
require 'tools'

Moped::BSON = BSON

def UpdateUniversity(id, universityName, address, latitude, longitude)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    univObj = Hash.new
    univObj["UniversityName"] = universityName
    univObj["Address"] = address
    univObj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    
    queryObj = Hash.new
    queryObj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    retMsg = ""
 
    begin
        mongoSession.with(safe: true) do |session|
            session[:universities].find(queryObj).update('$set' => univObj)
        end
    
        retMsg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.universities.$UniversityName_1"
            retMsg = "That university already exists!"
        end
    end
    
	mongoSession.disconnect
    return retMsg
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    
    puts UpdateUniversity(data["id"], data["UniversityName"], data["Address"], data["Latitude"], data["Longitude"])
rescue Exception => e
    puts e.inspect
end

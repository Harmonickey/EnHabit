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

def UpdateListing(id)
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])
    mongoSession.use("enhabit")

    #object to update with
    listingObj = Hash.new
    listingObj["IsFeatured"] = true
    
    #object to search with
    queryObj = Hash.new
    queryObj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    retMsg = ""
 
    begin
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

begin
    # when user updates a listing they only input a landlord (optional)
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?

    puts UpdateToFeatured(data["uid"])
    
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    message = Hash.new
    message.error = e.inspect
    puts message
end

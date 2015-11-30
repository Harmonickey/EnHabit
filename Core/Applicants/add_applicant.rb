#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'tools'

Moped::BSON = BSON

def InsertApplicant(userId, listingId, landlordId, salary, jobTitle)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    applicantsObj = Hash.new
    applicantsObj["UserId"] = userId
    applicantsObj["ListingId"] = listingId
    applicantsObj["LandlordId"] = landlordId
 
    retVal = nil
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            session[:applicants].insert(applicantsObj)
        end
        
        retVal = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retVal = e
    end
    
	mongoSession.disconnect
    return retVal
end

def GetListingData(listingId)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
        
        listing = Array.new
        mongoSession.with(safe: true) do |session|
            listing = session[:listings].find(queryObj).to_a
        end
        
        if listing.count == 0
            return nil
        else
            return { :LandlordId => listing[0]["LandlordId"] }
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

# This is called from the user at the front end layer
# need ListingId, Salary, JobTitle, and any other information at least
# userId is provided by session and landlordId is provided by ListingId
begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    userId = ARGV[1].split(",")[0] if not ARGV[1].nil?
    key = ARGV[2] if not ARGV[2].nil?
    isAdmin = ARGV[3].to_b
    
    listingData = GetListingData(data["ListingId"]) # ListingId (oid), LandlordId
    raise "No Listing Data" if listingData.nil?
    
    puts InsertApplicant(userId, data["ListingId"], listingData[:LandlordId])
rescue Exception => e
    puts e.inspect
end

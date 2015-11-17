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

def InsertRenter(userId, landlordId, address, unit, rent, listingId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    renterObj = Hash.new
    renterObj["RenterId"] = userId
    renterObj["LandlordId"] = landlordId
    renterObj["Address"] = address
    renterObj["Unit"] = unit
    renterObj["Rent"] = rent
 
    document = Hash.new
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            session[:renters].insert(renterObj)
        end
        
        queryObj = Hash.new
        queryObj["RenterId"] = renterObj["RenterId"]
        
        #grab listing associated data
        mongoSession.with(safe: true) do |session|
            document = session[:renters].find(queryObj).select(_id: 1, RenterId: 1, Rent: 1, Address: 1, Unit: 1).one
        end
        
        #grab user associated data
        mongoSession.with(safe: true) do |session|
            userData = session[:accounts].find({:UserId => document["RenterId"]}).select(FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).one

            document["FirstName"] = userData["FirstName"]
            document["LastName"] = userData["LastName"]
            document["Email"] = userData["Email"]
            document["PhoneNumber"] = userData["PhoneNumber"]
            document.delete("UserId") #we don't need to expose this to the front end
        end
        
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
        
        session[:listings].find(queryObj).update('$set' => {:IsRented => true})
        
    rescue Moped::Errors::OperationFailure => e
        document["Error"] = e
    end
    
	mongoSession.disconnect
    return document.to_json
end

#since usernames are unique I can find the id by their username
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
            return { :Rent => listing[0]["Price"], 
                     :Address => listing[0]["Address"], 
                     :Unit => listing[0]["Unit"],
                     :LandlordId => listing[0]["LandlordId"]}
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

# this needs to return
# Address, Unit, Rent
def GetApplicantData(applicantId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    applicantData = Hash.new
    
    begin
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(applicantId.to_s)
        
        # get the applicant stuff
        applicant = Array.new
        mongoSession.with(safe: true) do |session|
            applicant = session[:applicant].find(queryObj).to_a
        end
        
        if applicant.count == 0
            return nil
        else
            applicantData = { :ListingId => applicant[0]["ListingId"], 
                              :LandlordId => applicant[0]["LandlordId"], 
                              :UserId => applicant[0]["UserId"] }
                              
            return nil if applicantData[:ListingId].nil? || applicantData[:LandlordId].nil? || applicantData[:UserId].nil?
        end
        
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(applicantData["ListingId"].to_s)
        
        mongoSession.with(safe: true) do |session|
            listing = session[:listings].find(queryObj).to_a
        end
        
        if listing.count == 0
            return nil
        else
            applicantData = applicantData.merge({ :Address => listing[0]["Address"], 
                                                  :Unit => listing[0]["Unit"], 
                                                  :Rent => listing[0]["Price"] })
                                  
            return nil if applicantData[:Address].nil? || applicantData[:Rent].nil?
        end
        
    rescue Moped::Errors::OperationFailure => e
        return nil
    end

    return applicantData
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    isAdmin = ARGV[3].to_b
    
    if isAdmin #admins have a different entry point to be able to add renters
        userId = GetUserId(data["Renter"])
        raise "No UserId" if userId.nil?
        listingData = GetListingData(data["ListingId"])
        raise "No Listing Data" if listingData.nil?
    
        puts InsertRenter(userId, listingData[:LandlordId], listingData[:Address], listingData[:Unit], listingData[:Rent], data["ListingId"])
    else #landlord endpoint only has access to the applicant object id
        applicantData = GetApplicantData(data["ApplicantId"])
        
        raise "No Applicant Data" if applicantData.nil?
        
        puts InsertRenter(applicantData[:UserId], applicantData[:LandlordId], applicantData[:Address], applicantData[:Unit], applicantData[:Rent], applicantData[:ListingId])
    end
rescue Exception => e
    puts e.inspect
end

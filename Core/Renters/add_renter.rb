#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'

Moped::BSON = BSON

def InsertRenter(userId, landlordId, address, unit, rent)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    renterObj = Hash.new
    renterObj["RenterId"] = userId
    renterObj["LandlordId"] = landlordId
    renterObj["Address"] = address
    renterObj["Unit"] = unit
    renterObj["Rent"] = rent
    renterObj["HasPaidRent"] = false
 
    document = Hash.new
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            session[:renters].insert(usrObj)
        end
        
        queryObj = Hash.new
        queryObj["RenterId"] = usrObj["RenterId"]
        
        #grab listing associated data
        mongoSession.with(safe: true) do |session|
            document = session[:renters].find(queryObj).select(_id: 1, RenterId: 1, Rent: 1, Address: 1, Unit: 1).one
        end
        
        #grab user associated data
        mongoSession.with(safe: true) do |session|
            userData = session[:renters].find({:RenterId => document["RenterId"]}).select(FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).one
        
            document["FirstName"] = userData["FirstName"]
            document["LastName"] = userData["LastName"]
            document["Email"] = userData["Email"]
            document["PhoneNumber"] = userData["PhoneNumber"]
            document.delete("UserId") #we don't need to expose this to the front end
        end
        
        
        
    rescue Moped::Errors::OperationFailure => e
        document["Error"] = e
    end
    
	mongoSession.disconnect
    return document.to_json
end

#since usernames are unique I can find the id by their username
def GetRenterId(user)
    
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

def GetListingData(listingId)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
        
        account = Array.new
        mongoSession.with(safe: true) do |session|
            account = session[:listings].find(queryObj).to_a
        end
        
        if account.count == 0
            return nil
        else
            return { :Rent => account[0]["Price"], 
                     :Address => account[0]["Address"], 
                     :Unit => account[0]["Unit"] }
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    
    renterId = GetRenterId(data["Renter"])
    throw Exception("No RenterId") if renterId.nil?
    landlordId = GetLandlordId(data["Landlord"])
    throw Exception("No LandlordId") if landlordId.nil?
    listingData = GetListingData(data["ListingId"])
    throw Exception("No Listing Data") if listingData.nil?
    
    puts InsertRenter(renterId, landlordId, listingData[:Address], listingData[:Unit], listingData[:Rent])
rescue Exception => e
    puts e.inspect
end
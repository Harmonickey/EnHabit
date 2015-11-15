#!/usr/local/bin/ruby^M


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'

def InsertPayment(userId, landlordId, rent, month)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    renterObj = Hash.new
    renterObj["RenterId"] = userId
    renterObj["LandlordId"] = landlordId
    renterObj["Rent"] = rent
    renterObj["Month"] = month
 
    retVal = ""
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            session[:payments].insert(renterObj)
        end       
        
        retVal = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retVal = e
    end
    
	mongoSession.disconnect
    return retVal
end

def GetLandlordIdFromEmail(landlordEmail)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["Email"] = landlordEmail #these are unique so it should be okay
        
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

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    
    renterId = data["RenterId"]
    raise "No RenterId" if renterId.nil?
    landlordId = GetLandlordIdFromEmail(data["LandlordEmail"])
    raise "No LandlordId" if landlordId.nil?
    rent = data["Rent"]
    raise "No Rent" if rent.nil?
    month = data["Month"]
    raise "No Month" if month.nil?
    
    puts InsertPayment(renterId, landlordId, rent, month)
rescue Exception => e
    puts e.inspect
end

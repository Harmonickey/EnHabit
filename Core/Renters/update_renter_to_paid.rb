#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'

Moped::BSON = BSON

def UpdateRenterToPaid(renterId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    renterObj = Hash.new
    renterObj["_id"] = Moped::BSON::ObjectId.from_string(renterId)
 
    retVal = nil
 
    begin
        mongoSession.with(safe: true) do |session|
            renterData = session[:renters].find(renterObj).select(RenterId: 1).one      
        
            session[:renters].find({:RenterId => renterData["RenterId"]}).update('$set' => {:HasPaidRent => true})
        end
        
        retVal = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retVal = e
    end
    
	mongoSession.disconnect
    return retVal
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    
    renterId = data["RenterId"] if not data["RenterId"].nil? and not data["RenterId"].empty?
    
    raise "No Renter Id" if renterId.nil?
    
    puts UpdateRenterToPaid(renterId)
rescue Exception => e
    puts e.inspect
end

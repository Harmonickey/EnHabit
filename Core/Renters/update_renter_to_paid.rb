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

def UpdateRenterToPaid(renterId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    renterObj = Hash.new
    renterObj["RenterId"] = renterId
 
    retVal = nil
 
    begin
        mongoSession.with(safe: true) do |session|
            session[:renters].find(renterObj).update('$set' => {:HasPaidRent => true})
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
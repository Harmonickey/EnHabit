#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'moped'
require 'bson'

Moped::BSON = BSON

begin
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    documents = Array.new
    
    mongo_session.with(safe: true) do |session|
        documents = session[:payments].find().select(RenterId: 1, LandlordId: 1, Rent: 1, Month: 1).to_a
        
        #loop through all payments and get associated information for the payment
        documents.each do |doc|
            renterData = session[:renters].find({"_id" => Moped::BSON::ObjectId.from_string(doc["RenterId"].to_s)}).select(RenterId: 1).one
            
            userData = session[:accounts].find({:UserId => renterData["RenterId"]}).select(FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).one
            
            doc["FirstName"] = userData["FirstName"]
            doc["LastName"] = userData["LastName"]
            doc["Email"] = userData["Email"]
            doc["PhoneNumber"] = userData["PhoneNumber"]
            
            landlordData = session[:accounts].find({:LandlordId => doc["LandlordId"]}).select(Username: 1, Email: 1).one
            
            doc["LandlordName"] = landlordData["Username"]
            doc["LandlordEmail"] = landlordData["Email"]
            
            #we don't need to expose these to the front end
            doc.delete("LandlordId") 
            doc.delete("RenterId")
        end 
    end
    
    mongo_session.disconnect

    if documents.count == 0
        puts "No Payments"
    else
        puts documents.to_json
    end
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
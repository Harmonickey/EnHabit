#!/usr/local/bin/ruby


require 'json'
require 'moped'
require 'bson'

Moped::BSON = BSON

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    @userId = ARGV[1].split(",")[0] if not ARGV[1].empty? and not data.nil? and not data["TenantPaymentHistory"].nil?

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    documents = Array.new
    
    renterQuery = Hash.new
    renterQuery["RenterId"] = @userId unless @userId.nil?
    
    mongo_session.with(safe: true) do |session|
        documents = session[:payments].find(renterQuery).select(RenterId: 1, LandlordId: 1, Rent: 1, Month: 1).to_a
        
        #loop through all payments and get associated information for the payment
        documents.each do |doc|
            renterData = session[:renters].find({"RenterId" => doc["RenterId"]}).select(RenterId: 1).one
            
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

#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'tools'

Moped::BSON = BSON

data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
landlordId = ARGV[1].split(",")[0] if not ARGV[0].nil?
key = ARGV[2] if not ARGV[2].nil?
isAdmin = ARGV[3].to_b

begin
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database

    documents = Array.new
    
    queryObj = Hash.new
    queryObj[:LandlordId] = landlordId if not isAdmin
    
    #grab listing associated data
    mongoSession.with(safe: true) do |session|
        #get all applicants associated to landlord
        documents = session[:applicants].find(queryObj).select(_id: 1, UserId: 1, ListingId: 1).to_a
        
        #loop through all renters and get associated information for the user and landlord
        documents.each do |doc|
            userData = session[:accounts].find({:UserId => doc["UserId"]}).select(FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).one
            
            doc["FirstName"] = userData["FirstName"]
            doc["LastName"] = userData["LastName"]
            doc["Email"] = userData["Email"]
            doc["PhoneNumber"] = userData["PhoneNumber"]
            
            listingData = session[:listings].find({"_id" => Moped::BSON::ObjectId.from_string(doc["ListingId"])}).select(Address: 1, Unit: 1).one
            
            doc["Address"] = listingData["Address"]
            doc["Unit"] = listingData["Unit"]
            
            #we don't need to expose these to the front end
            doc.delete("UserId") 
            doc.delete("ListingId")
        end 
    end
    
    mongoSession.disconnect
    if documents.count == 0
        puts "No Applicants Found"
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

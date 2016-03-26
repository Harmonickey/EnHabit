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
    
userId = ARGV[1].split(",")[0] if not ARGV[0].nil?
key = ARGV[2] if not ARGV[2].nil?
isAdmin = ARGV[3].to_b

begin
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database

    document = Hash.new
    
    queryObj = Hash.new
    queryObj[:RenterId] = userId
    
    #grab listing associated data
    mongoSession.with(safe: true) do |session|
        #get all renters
        document = session[:renters].find(queryObj).select(_id: 1, UniversityId: 1, RenterId: 1, LandlordId: 1, Rent: 1, Address: 1, Unit: 1).one

        landlordData = session[:accounts].find({:LandlordId => document["LandlordId"]}).select(Email: 1).one
        
        document["LandlordEmail"] = landlordData["Email"]
        
        pricing = mongoSession[:pricing].find({"UniversityId" => document["UniversityId"]}).one
            
<<<<<<< HEAD
<<<<<<< HEAD
        document["ListingMarkup"] = ((document["Rent"].to_f * (pricing["ListingMarkup"].to_f / 100)).to_f).round(2)
=======
        document["ListingMarkup"] = (document["Rent"] * (pricing["ListingMarkup"].to_f / 100)).to_i
>>>>>>> b62e4b4... 117 parallel payments
=======
        document["ListingMarkup"] = (document["Rent"].to_f * (pricing["ListingMarkup"].to_f / 100)).to_f
>>>>>>> 01472a0... 117 float
        
        #we don't need to expose these to the front end
        document.delete("LandlordId") 
        document.delete("RenterId")
    end
    
    mongoSession.disconnect
    if document.nil?
        puts "No Payment"
    else
        puts document.to_json
    end
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end

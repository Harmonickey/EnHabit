#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

Moped::BSON = BSON

def GetEmailDetails(listingId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        
        listingQueryObj = Hash.new
        listingQueryObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
        
        listing = Array.new
        mongoSession.with(safe: true) do |session|
            listing = session[:listings].find(listingQueryObj).to_a
        end
        
        if listing.count == 0 || listing[0]["LandlordId"].nil?
            return nil
        end
        
        landlordQueryObj = Hash.new
        landlordQueryObj["LandlordId"] = listing[0]["LandlordId"]
        
        landlordAccount = Array.new
        mongoSession.with(safe: true) do |session|
            landlordAccount = session[:accounts].find(landlordQueryObj).to_a
        end
        
        if landlordAccount.count == 0
            return nil
        end
        
<<<<<<< HEAD
<<<<<<< HEAD
        return {"To" => landlordAccount[0]["Email"], "Listing" => listing[0]["Address"] + " " + (listing[0]["Unit"].nil? ? "" : listing[0]["Unit"])}
=======
        return {"From" => account[0]["Email"], "To" => landlordAccount[0]["Email"], "Listing" => listing[0]["Address"] + " " + (listing[0]["Unit"].nil? ? "" : listing[0]["Unit"]), "Name" => account[0]["FirstName"] + " " + account[0]["LastName"], "PhoneNumber" => (account[0]["PhoneNumber"].nil? ? "" : account[0]["PhoneNumber"])}
>>>>>>> 013afa8... 107 emailing
=======
        return {"From" => account[0]["Email"], "To" => landlordAccount[0]["Email"], "Listing" => listing[0]["Address"] + " " + (listing[0]["Unit"].nil? ? "" : listing[0]["Unit"]), "Name" => account[0]["FirstName"] + " " + account[0]["LastName"], "PhoneNumber" => (account[0]["PhoneNumber"].nil? ? "" : account[0]["PhoneNumber"]), "Username" => account[0]["Username"]}
>>>>>>> 65a35be... 107 lease type and front page fixes
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

    userId = ARGV[1].split(",")[0] if not ARGV[0].nil?
    
    emailAddress = data["EmailAddress"] if not data["EmailAddress"].nil?
    phoneNumber = data["PhoneNumber"] if not data["PhoneNumber"].nil?
    listingId = data["ListingId"] if not data["ListingId"].nil?
    message = data["Message"] if not data["Message"].nil?
    
    raise "Could not Find Listing" if listingId.nil?
    raise "No Email Address" if emailAddress.nil?
    raise "No Message" if message.nil?
    
    @details = GetEmailDetails(listingId) unless listingId.nil?
    
    raise "Could not Get Details" if @details.nil?
    
    @to = @details["To"]
<<<<<<< HEAD
    @message = message
    @listing = @details["Listing"]
    @from = emailAddress
    
    if not @from.nil?
        `chmod 775 #{@deploymentBase}/Core/Accounts/mail.rb`
        `#{@deploymentBase}/Core/Accounts/mail.rb '#{@to}' '#{@message}' '#{@listing}' '#{@from}' '#{@phone}'`
        puts "#{@deploymentBase}/Core/Accounts/mail.rb '#{@to}' '#{@message}' '#{@listing}' '#{@from}' '#{@phone}'"

        puts "Okay"
    end
=======
    @message = data["Message"]
    @name = @details["Name"]
    @listing = @details["Listing"]
    @from = @details["From"]
    @username = @details["Username"]
    @phone = @details["PhoneNumber"] if not @details["PhoneNumber"].nil?
    
    puts "Could Not Find User" if @from.nil? 
    puts "Please Update Your Account" if @username.include? "Facebook"
    
    if not @from.nil?
        `chmod 775 #{@deploymentBase}/Core/Accounts/mail.rb`
        `#{@deploymentBase}/Core/Accounts/mail.rb '#{@to}' '#{@message}' '#{@name}' '#{@listing}' '#{@from}' '#{@phone}'`
        puts "#{@deploymentBase}/Core/Accounts/mail.rb '#{@to}' '#{@message}' '#{@name}' '#{@listing}' '#{@from}' '#{@phone}'"

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 013afa8... 107 emailing
=======
    puts "Okay"
>>>>>>> 4be0610... 107 mail
=======
        puts "Okay"
    end
>>>>>>> 65a35be... 107 lease type and front page fixes
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end

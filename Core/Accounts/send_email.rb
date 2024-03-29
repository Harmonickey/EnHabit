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
        
        return {"To" => landlordAccount[0]["Email"], "Listing" => listing[0]["Address"] + " " + (listing[0]["Unit"].nil? ? "" : listing[0]["Unit"])}
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
    @message = message
    @listing = @details["Listing"]
    @from = emailAddress
    
    if not @from.nil?
        `chmod 775 #{@deploymentBase}/Core/Accounts/mail.rb`
        `#{@deploymentBase}/Core/Accounts/mail.rb '#{@to}' '#{@message}' '#{@listing}' '#{@from}' '#{@phone}'`
        puts "#{@deploymentBase}/Core/Accounts/mail.rb '#{@to}' '#{@message}' '#{@listing}' '#{@from}' '#{@phone}'"

        puts "Okay"
    end
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end

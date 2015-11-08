#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'
require 'net/smtp'

Moped::BSON = BSON

def GetEmailDetails(userId, listingId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        accountQueryObj = Hash.new
        accountQueryObj["UserId"] = userId
        
        account = Array.new
        mongoSession.with(safe: true) do |session|
            account = session[:accounts].find(accountQueryObj).to_a
        end
        
        if account.count == 0
            return nil
        end 
        
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
        
        return {"From" => account[0]["Email"], "To" => landlordAccount[0]["Email"], "Listing" => listing[0]["Address"] + " " + (listing[0]["Unit"].nil? ? "" : listing[0]["Unit"])}
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

    userId = ARGV[1].split(",")[0] if not ARGV[0].nil?
    
    listingId = data["ListingId"] if not data["ListingId"].nil?
    
    raise "Could not Find Listing" if listingId.nil?
    
    @details = GetEmailDetails(userId, listingId) unless listingId.nil?
    
    raise "Could not Get Details" if @details.nil?
    
    @from = @details["From"]
    @to = @details["To"]
    @listing = @details["Listing"]
    
    raise "Could Not Find User" if @from.nil? 
    
    @message = data["Message"]
    
    message = "From: <#{@from}>
               To: <#{@from}>
               Subject: Request Info for #{@listing}

               #{@message}"

    puts message
               
    Net::SMTP.start('66.147.244.154') do |smtp|
      smtp.send_message message, @from, 
                                 @from
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
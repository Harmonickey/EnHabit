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
require 'PasswordHash'
require 'securerandom'
require 'tools'

def InsertUser(isAdmin, isActive, isVerified, isLandlord, user, pass, firstName, lastName, email, phoneNumber)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    usrObj = Hash.new
    usrObj["Username"] = user
    usrObj["UserId"] = SecureRandom.uuid
    usrObj["LandlordId"] = SecureRandom.uuid if not isLandlord.nil? and isLandlord
    usrObj["Password"] = PasswordHash.createHash(pass)
    usrObj["FirstName"] = firstName
    usrObj["LastName"] = lastName
    usrObj["Email"] = email
    usrObj["PhoneNumber"] = phoneNumber
    usrObj["IsAdmin"] = (isAdmin.nil? ? false : isAdmin)
    usrObj["IsActive"] = (isActive.nil? ? true : isActive)
    usrObj["IsVerified"] = (isVerified.nil? ? true : isVerified)
    usrObj["IsLandlord"] = (isLandlord.nil? ? false : isLandlord)
 
    document = Hash.new
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            session[:accounts].insert(usrObj)
        end
        
        queryObj = Hash.new
        queryObj["UserId"] = usr_obj["UserId"]
        
        mongoSession.with(safe: true) do |session|
            document = session[:accounts].find(queryObj).one
        end
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$Username_1"
            document["error"] = "That username already exists!"
        elsif e.message.include? "enhabit.accounts.$Email_1"
            document["error"] = "That email is already registered with another user!"
        elsif e.message.include? "enhabit.accounts.$PhoneNumber_1"
            document["error"] = "That phone number is already registered with another user!"
        end
    end
    
	mongoSession.disconnect
    return document
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    isLandlord = data["IsLandlord"].to_b unless data["IsLandlord"].nil?
    isVerified = data["IsVerified"].to_b unless data["IsVerified"].nil?
    isActive = data["IsActive"].to_b unless data["IsActive"].nil?
    isAdminData = data["IsAdmin"].to_b unless data["IsAdmin"].nil?
    
    result = insert_user(isAdminData, isActive, isVerified, isLandlord, data["Username"], data["Password"], data["FirstName"], data["LastName"], data["Email"], data["PhoneNumber"])
    
    puts result.to_json
rescue Exception => e
    puts e.inspect
end
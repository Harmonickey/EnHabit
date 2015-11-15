#!/usr/local/bin/ruby^M


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'
require 'tools'

def UpdateUser(isAdmin, key, userId, isLandlord, isVerified, isActive, isAdminData, username, firstName, lastName, email, phoneNumber, newPassword)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    usrObj = Hash.new
    usrObj["Username"] = username
    usrObj["FirstName"] = firstName
    usrObj["LastName"] = lastName
    usrObj["Email"] = email
    usrObj["PhoneNumber"] = phoneNumber
    usrObj["Password"] = PasswordHash.createHash(newPassword) unless newPassword.nil?
    usrObj["IsLandlord"] = isLandlord
    usrObj["IsVerified"] = isVerified
    usrObj["IsActive"] = isActive
    usrObj["IsAdmin"] = isAdminData
    
    queryObj = Hash.new
    queryObj["Username"] = username
    queryObj[key] = userId unless isAdmin
    
    retMsg = ""
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            account = session[:accounts].find(queryObj).to_a
        
            # this is a safe query because it is assumed UpdateListing.rb is called
            # on an existing account
            if (account[0]["LandlordId"].nil? and isLandlord)
                usrObj["LandlordId"] = SecureRandom.uuid
            end
            
            session[:accounts].find(queryObj).update('$set' => usrObj)
        end
    
        retMsg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$Email_1"
            retMsg = "That email is already registered with another user!"
        elsif e.message.include? "enhabit.accounts.$PhoneNumber_1"
            retMsg = "That phone number is already registered with another user!" 
        end
    end
    
	mongoSession.disconnect
    return retMsg
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    #we are checking this because it's an optional thing on the UI
    newPassword = data["Password"] if not data["Password"].nil? and not data["Password"].empty? 
    isLandlord = data["IsLandlord"].to_b if not data["IsLandlord"].nil? and not data["IsLandlord"].empty?
    isVerified = data["IsVerified"].to_b if not data["IsVerified"].nil? and not data["IsVerified"].empty?
    isActive = data["IsActive"].to_b if not data["IsActive"].nil? and not data["IsActive"].empty?
    isAdminData = data["IsAdmin"].to_b if not data["IsAdmin"].nil? and not data["IsAdmin"].empty?
    
    id = ARGV[1].split(",")[0] unless ARGV[1].empty?
    key = ARGV[2] unless ARGV[2].empty?
    isAdmin = ARGV[3].to_b unless ARGV[3].empty?
    
    puts UpdateUser(isAdmin, key, id, isLandlord, isVerified, isActive, isAdminData, data["Username"], data["FirstName"], data["LastName"], data["Email"], data["PhoneNumber"], newPassword)
rescue Exception => e
    puts e.inspect
end

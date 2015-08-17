#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'

def CreateUserFromFacebookCredentials(fbUserId, pass)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    usrObj = Hash.new
    # since usernames need to be unique and recognizable in the javascript later
    usrObj["Username"] = SecureRandom.hex.to_s + "Facebook"
    usrObj["UserId"] = SecureRandom.uuid
    usrObj["FacebookId"] = fbUserId
    usrObj["Password"] = pass
    usrObj["FirstName"] = nil
    usrObj["LastName"] = nil
    usrObj["PhoneNumber"] = SecureRandom.hex
    usrObj["Email"] = SecureRandom.hex
    usrObj["IsActive"] = true
    usrObj["IsAdmin"] = false
    usrObj["IsVerified"] = true
    usrObj["IsLandlord"] = false
 
    queryObj = Hash.new
    queryObj["FacebookId"] = fbUserId
 
    documents = Array.new
    retMsg = ""
 
    mongoSession.with(safe: true) do |session|
        documents = session[:accounts].find(queryObj).to_a
    end
    
    if documents.count == 0 # no users yet, create it automatically
        mongoSession.with(safe: true) do |session|
            session[:accounts].insert(usrObj)
        end
        retMsg = "Okay:Created:#{usrObj["UserId"]}"
    else
        retMsg = "Okay"
        retMsg += ":Landlord" if documents[0]["IsLandlord"]
        retMsg += ":Tenant" if not documents[0]["IsLandlord"]
        retMsg += ":Admin" if documents[0]["IsAdmin"]
        retMsg += ":" + (documents[0]["IsLandlord"] ? documents[0]["LandlordId"] : documents[0]["UserId"])
    end
    
    mongoSession.disconnect
    return retMsg
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
	
    #create a user from the facebook credentials if there isn't one already
    puts CreateUserFromFacebookCredentials(data["Username"], data["Password"])
rescue Exception => e
    puts e.message
end
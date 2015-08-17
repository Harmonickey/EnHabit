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

@isLandlord = false
@isAdmin = false

def UserExists(user, pass)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    accounts = mongoSession[:accounts]
	
    queryObj = Hash.new
    queryObj["Username"] = user
	
    documents = accounts.find(queryObj).to_a
    mongoSession.disconnect
    if documents.count == 0
        return false
    else
        # if you have a landlord ID then they're obviously a landlord
        @isLandlord = documents[0]["IsLandlord"]
        @isAdmin = documents[0]["IsAdmin"]
        id = (@isLandlord ? documents[0]["LandlordId"] : documents[0]["UserId"])
        return {"exists" => PasswordHash.validatePassword(pass, documents[0]["Password"]), "id" => id}
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
	
    result = UserExists(data["Username"], data["Password"])
    
    if result["exists"]
        retMsg = "Okay"
        retMsg += ":Landlord" if @isLandlord
        retMsg += ":Tenant" if not @isLandlord
        retMsg += ":Admin" if @isAdmin
        retMsg += ":" + result["id"]
        puts retMsg
    else
        puts "Incorrect Username/Password"
    end
rescue Exception => e
    puts e.message
end
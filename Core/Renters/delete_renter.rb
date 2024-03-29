#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'PasswordHash'
require 'tools'

Moped::BSON = BSON

def RenterExists(id)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    queryObj = Hash.new
    queryObj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    documents = Array.new
    
    retVal = false
    
    begin
        mongoSession.with(safe: true) do |session|
            documents = session[:renters].find(queryObj).to_a
        end
        
        retVal = true if documents.count > 0
        
        mongoSession.disconnect
    end
    
    return retVal
end

def DeleteRenter(id)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    queryObj = Hash.new
    queryObj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    retMsg = ""
    
    begin
        #delete the user
        mongoSession.with(safe: true) do |session|
            session[:renters].find(queryObj).remove
        end
       
        retMsg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retMsg = e.message
    end
    
    mongoSession.disconnect
    return retMsg
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    id = ARGV[1].split(",")[0] unless ARGV[1].empty?
    
    # we can only delete other users if we're an admin
    id = data["id"] if not data["id"].nil? and not data["id"].empty?
    
    if RenterExists(id)
        puts DeleteRenter(id)
    else
        puts "Incorrect Password"
    end
rescue Exception => e
    puts e.inspect
end

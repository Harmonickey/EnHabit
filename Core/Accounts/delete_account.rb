#!/usr/local/bin/ruby^M

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

def UserExists(id, key, pass)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    queryObj = Hash.new
    queryObj[key] = (key == "_id" ? Moped::BSON::ObjectId.from_string(id.to_s) : id)
    
    documents = Array.new
    
    retVal = false
    
    begin
        mongoSession.with(safe: true) do |session|
            documents = session[:accounts].find(queryObj).to_a
        end
        
        if documents.count > 0
            retVal = PasswordHash.validatePassword(pass, documents[0]["Password"])
        end
        
        mongoSession.disconnect
    end
    
    return retVal
end

def DeleteUser(id, key)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    queryObj = Hash.new
    queryObj[key] = (key == "_id" ? Moped::BSON::ObjectId.from_string(id.to_s) : id)
    
    retMsg = ""
    
    begin
        #delete the user
        mongoSession.with(safe: true) do |session|
            session[:accounts].find(queryObj).remove
        end
        
        #cascade delete the listings associated with the user
        mongoSession.with(safe: true) do |session|
            session[:listings].find(queryObj).remove_all
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
    key = ARGV[2] unless ARGV[2].empty?
    isAdmin = ARGV[3].to_b unless ARGV[3].empty?
    
    # we can only delete other users if we're an admin
    id = data["id"] if not data["id"].nil? and not data["id"].empty? and isAdmin
    key = "_id" if isAdmin
    
    if UserExists(id, key, data["Password"])
        puts DeleteUser(id, key)
    else
        puts "Incorrect Password"
    end
rescue Exception => e
    puts e.inspect
end

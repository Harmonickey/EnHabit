#!/usr/local/bin/ruby


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'tools'

Moped::BSON = BSON

def DeleteListing(isAdmin, listingId, userId, key)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) 
    mongoSession.use("enhabit")

    listingObj = Hash.new
    listingObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
    
    retMsg = ""
 
    begin
        mongoSession.with(safe: true) do |session|
            documents = session[:listings].find(listingObj).to_a
            
            #make sure we're not deleting someone else's listing
            if documents[0][key] == userId or isAdmin
                listing = session[:listings].find(listingObj).select(Pictures: 1).one
                listing["Pictures"].each do |pic|
                    filename = "#{@deploymentBase}/images/enhabit/images/" + pic
                    File.delete(filename) if File.exist? filename
                end
                session[:listings].find(listingObj).remove
                retMsg = "Okay"
            else
                retMsg = "Unable to delete other user's listing"
            end
        end
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
    
    puts DeleteListing(isAdmin, data["id"], id, key)
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    puts e.inspect
end

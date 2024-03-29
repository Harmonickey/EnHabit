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

def DeleteListings()
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) 
    mongoSession.use("enhabit")

    queryObj = Hash.new
    queryObj["Testing"] = true
    
    retMsg = ""
 
    begin
        mongoSession.with(safe: true) do |session|    
            session[:listings].find(queryObj).remove_all
            retMsg = "Okay"
        end
    rescue Moped::Errors::OperationFailure => e
        retMsg = e.message
    end
    
    mongoSession.disconnect
    return retMsg
end

begin
    puts DeleteListings()
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    puts e.inspect
end

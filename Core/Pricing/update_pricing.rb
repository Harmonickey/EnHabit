#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'
require 'tools'

Moped::BSON = BSON

def UpdatePricing(id, listingMarkup, featuredMarkup)

    #id is ObjectId in :universities
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    retMsg = ""
 
    begin
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
        pricingObj = Hash.new
        pricingObj["ListingMarkup"] = listingMarkup
        pricingObj["FeaturedMarkup"] = featuredMarkup
    
        mongoSession.with(safe: true) do |session|
            session[:pricing].find(queryObj).update('$set' => pricingObj)
        end
    
        retMsg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retMsg = e
    end
    
	mongoSession.disconnect
    return retMsg
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    
    puts UpdatePricing(data["id"], data["ListingMarkup"], data["FeaturedMarkup"])
rescue Exception => e
    puts e.inspect
end

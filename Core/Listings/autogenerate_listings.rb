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
require 'PasswordHash'
require 'securerandom'
require 'tools'

Moped::BSON = BSON

def CreateListings(amount)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    points = Array.new
    
    lineNum = 0
    
    filename = "#{@deploymentBase}/assets/testing/points.csv"

    text = IO.readlines(filename)
    text.each do |line|
        parts = line.split(",")
        lat = parts[1]
        lng = parts[3]
        
        points[lineNum] = {"lat" => lat.to_f, "lng" => lng.to_f}
        lineNum += 1
    end
    
    amount.times do |i|
    
        listingObj = Hash.new
        listingObj["Username"] = SecureRandom.uuid
        listingObj["UserId"] = SecureRandom.uuid
        listingObj["Landlord"] = SecureRandom.uuid
        listingObj["LandlordId"] = SecureRandom.uuid
        listingObj["Price"] = 0
        listingObj["Address"] = SecureRandom.uuid
        listingObj["Unit"] = "a"
        listingObj["Bedrooms"] = 1
        listingObj["Bathrooms"] = 1
        listingObj["HasAnimals"] = true
        listingObj["HasLaundry"] = true
        listingObj["HasParking"] = true
        listingObj["HasAirConditioning"] = true
        listingObj["Type"] = "apartment"
        listingObj["Start"] = Date.strptime("09/20/2018", "%m/%d/%Y").mongoize
        listingObj["WorldCoordinates"] = {"x" => points[i]["lat"], "y" => points[i]["lng"]}
        listingObj["University"] = "Northwestern"
        listingObj["Tags"] = ["a", "b"]
        listingObj["Testing"] = true
        listingObj["Pictures"] = []
        listingObj["Thumbnails"] = []
       
        begin
            mongoSession.with(safe: true) do |session|
                session[:listings].insert(listingObj)                   
            end
        rescue Moped::Errors::OperationFailure => e
            
        end
    end
    
	mongoSession.disconnect
    return "Okay"
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    puts CreateListings(data["amount"].to_i)
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end
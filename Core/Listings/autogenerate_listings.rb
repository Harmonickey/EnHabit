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
    text = File.open("#{@deploymentBase}/assets/testing/points.csv").read
    text.gsub!(/\r\n?/, "\n")
    text.each_line do |line|
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
        listingObj["Address"] = "a"
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
        listingObj["University"] = "b"
        listingObj["Tags"] = ["a", "b"]
        listingObj["Testing"] = true
       
        begin
            mongoSession.with(safe: true) do |session|
                session[:listings].insert(listingObj)                   
            end
        rescue Moped::Errors::OperationFailure => e
            document["error"] = e
        end
    end
    
	mongoSession.disconnect
    return document
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    result = CreateListing(data["amount"].to_i)

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    pictures = data["Pictures"] unless data["Pictures"].nil?
    RemoveUploadedPics pictures
    
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end
#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deployment_base}/Libraries"

require 'json'
require 'moped'
require 'mongoid'
require 'bson'
require 'tools'

def create_listing(user, price, address, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["Username"] = user
    listing_obj["price"] = price.to_i
    listing_obj["address"] = address
    listing_obj["bedrooms"] = bedrooms.to_i
    listing_obj["bathrooms"] = bathrooms.to_i
    listing_obj["animals"] = animals.to_b
    listing_obj["laundry"] = laundry.to_b
    listing_obj["parking"] = parking.to_b
    listing_obj["airConditioning"] = airConditioning.to_b
    listing_obj["type"] = type
    listing_obj["start"] = Date.strptime(start, "%m/%d/%Y").mongoize
    listing_obj["worldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listing_obj["university"] = university
    listing_obj["tags"] = tags
    
    ret_msg = ""
 
    begin
        mongo_session.with(safe: true) do |session|
            session[:listings].insert(listing_obj)
        end
        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e
    end
    
	mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    username = ARGV[1]
    
    result = create_listing(username, data["rent"], data["address"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["airConditioning"], data["type"], data["start"], data["latitude"], data["longitude"], data["university"], data["tags"])

    puts result
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    message = Hash.new
    message.error = e.inspect
    puts message
end
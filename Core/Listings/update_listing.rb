#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "./Libraries"

require 'json'
require 'bson'
require 'moped'
require 'tools'

Moped::BSON = BSON

def update_listing(user, id, price, address, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags)
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])
    mongo_session.use("enhabit")

    listing_obj = Hash.new
    listing_obj["price"] = price.to_i
    listing_obj["address"] = address
    listing_obj["bedrooms"] = bedrooms.to_i
    listing_obj["bathrooms"] = bathrooms.to_i
    listing_obj["animals"] = animals.to_b
    listing_obj["laundry"] = laundry.to_b
    listing_obj["parking"] = parking.to_b
    listing_obj["airConditioning"] = airConditioning.to_b
    listing_obj["type"] = type
    listing_obj["start"] = Date.strptime(st, "%m/%d/%Y").mongoize
    listing_obj["worldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listing_obj["university"] = university
    listing_obj["tags"] = tags
    
    query_obj = Hash.new
    query_obj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    ret_msg = ""
 
    begin
        mongo_session.with(safe: true) do |session|
            session[:listings].find(query_obj).update('$set' => listing_obj)
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
    
    result = update_listing(username, data["id"], data["rent"], data["address"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["airConditioning"], data["type"], data["start"], data["latitude"], data["longitude"], data["university"], data["tags"])

    puts result
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    puts e.inspect
end
#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'bson'
require 'moped'
require 'mongoid'

Moped::BSON = BSON

def update_listing(id, user, pr, ad, be, ba, an, la, pa, ac, ty, st, lat, lng, ta)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["price"] = pr.to_i
    listing_obj["address"] = ad
    listing_obj["bedrooms"] = be.to_i
    listing_obj["bathrooms"] = ba.to_i
    listing_obj["animals"] = (an == "true")
    listing_obj["laundry"] = (la == "true")
    listing_obj["parking"] = (pa == "true")
    listing_obj["ac"] = (ac == "true")
    listing_obj["type"] = ty
    listing_obj["start"] = Date.strptime(st, "%m/%d/%Y").mongoize
    listing_obj["worldCoordinates"] = {"x" => nil, "y" => nil}
    listing_obj["worldCoordinates"]["x"] = lat.to_f
    listing_obj["worldCoordinates"]["y"] = lng.to_f
    listing_obj["university"] = "Northwestern"
    listing_obj["tags"] = ta
 
    query_obj = Hash.new
    query_obj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
 
    document = Hash.new
 
    begin
        mongo_session.with(safe: true) do |session|
            session[:listings].find(query_obj).update('$set' => listing_obj)
        end
        mongo_session.with(safe: true) do |session|
            document = session[:listings].find(query_obj).select(_id: 0).first
        end
    rescue Moped::Errors::OperationFailure => e
        document["error"] = e.message
    end
    
	mongo_session.disconnect
    return document
end

begin

    data = JSON.parse(ARGV[0].delete('\\'))
    
    result = update_listing(data["id"], data["username"], data["rent"], data["address"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["ac"], data["type"], data["start_date"], data["latitude"], data["longitude"], data["tags"])

    puts result.to_json

rescue Exception => e
    puts e.inspect
end
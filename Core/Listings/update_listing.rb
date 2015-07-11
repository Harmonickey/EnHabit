#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

def to_boolean(str)
    str == 'true' or str == true
end

def update_listing(user, id, pr, ad, be, ba, an, la, pa, ac, ty, st, lat, lng, ta)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["price"] = pr.to_i
    listing_obj["address"] = ad
    listing_obj["bedrooms"] = be.to_i
    listing_obj["bathrooms"] = ba.to_i
    listing_obj["animals"] = to_boolean(an)
    listing_obj["laundry"] = to_boolean(la)
    listing_obj["parking"] = to_boolean(pa)
    listing_obj["ac"] = to_boolean(ac)
    listing_obj["type"] = ty
    listing_obj["start"] = Date.strptime(st, "%m/%d/%Y").mongoize
    listing_obj["worldCoordinates"] = {"x" => nil, "y" => nil}
    listing_obj["worldCoordinates"]["x"] = lat.to_f
    listing_obj["worldCoordinates"]["y"] = lng.to_f
    listing_obj["university"] = "Northwestern"
    listing_obj["tags"] = ta
    
    query_obj = Hash.new
    query_obj["id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
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
    
    result = update_listing(username, data["id"], data["rent"], data["address"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["ac"], data["type"], data["start_date"], data["latitude"], data["longitude"], data["tags"])

    puts result
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    puts e.inspect
end
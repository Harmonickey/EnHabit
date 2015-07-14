#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

def get_listing_info(id)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
    
    ret_msg = Hash.new
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            documents = session[:listings].find(listing_obj).to_a
            ret_msg = documents[0]
        end
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e
    end
    
	mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
 
    result = get_listing_info(data["id"])

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
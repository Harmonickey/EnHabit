#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

begin
    landlord = ARGV[0]

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    query_obj = Hash.new
    query_obj["Landlord"] = landlord
    
    documents = Array.new
    
    mongo_session.with(safe: true) do |session|
        documents = session[:listings].find(query_obj).select(_id: 1, Username: 1, Price: 1, Address: 1, Bedrooms: 1, Bathrooms: 1, Animals: 1, Laundry: 1, Parking: 1, AirConditioning: 1, Type: 1, Start: 1, WorldCoordinates: 1, Landlord: 1, Tags: 1).to_a
    end
    mongo_session.disconnect

    if documents.count == 0
        puts "No Listings"
    else
        puts documents.to_json
    end
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
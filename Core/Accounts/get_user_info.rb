#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'moped'
require 'bson'
require 'json'

begin

    data = JSON.parse(ARGV[0].delete('\\'))
    id = (data["landlordId"].nil? ? data["userId"] : data["landlordId"]);
    key = (data["landlordId"].nil? ? "UserId" : "LandlordId");
    
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    document = Hash.new
    
    query_obj = Hash.new
    query_obj[key] = id;
    
    mongo_session.with(safe: true) do |session|
        document = session[:accounts].find(query_obj).select(_id: 1, Username: 1, UserId: 1, LandlordId: 1, FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).first
    end
    mongo_session.disconnect

    if document.nil? or document == {}
        puts "Could Not Find User"
    else
        puts document.to_json
    end

rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
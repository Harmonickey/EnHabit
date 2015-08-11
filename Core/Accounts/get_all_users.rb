#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

begin
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    documents = Array.new
    
    mongo_session.with(safe: true) do |session|
        documents = session[:accounts].find().select(_id: 1, Username: 1, FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1, IsActive: 1, IsAdmin: 1, IsVerified: 1, IsLandlord: 1).to_a
    end
    mongo_session.disconnect

    if documents.count == 0
        puts "No Users"
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
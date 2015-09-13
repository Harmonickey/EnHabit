#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

begin
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database

    documents = Array.new
    
    #grab listing associated data
    mongoSession.with(safe: true) do |session|
        documents = session[:renters].find().select(_id: 1, RenterId: 1, Rent: 1, Address: 1, Unit: 1).to_a
    end
    
    #grab user associated data
    mongoSession.with(safe: true) do |session|
        documents.each do |doc|
            userData = session[:renters].find({:RenterId => doc["RenterId"]}).select(FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).one
        
            doc["FirstName"] = userData["FirstName"]
            doc["LastName"] = userData["LastName"]
            doc["Email"] = userData["Email"]
            doc["PhoneNumber"] = userData["PhoneNumber"]
            doc.delete("RenterId") #we don't need to expose this to the front end
        end
    end
    
    mongoSession.disconnect
    if documents.count == 0
        puts "No Renters Found"
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
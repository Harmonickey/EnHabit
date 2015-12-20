#!/usr/local/bin/ruby


require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?

    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database

    documents = Array.new
    
    mongoSession.with(safe: true) do |session|
        documents = session[:accounts].find().select(_id: 1, Username: 1, FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1, IsActive: 1, IsAdmin: 1, IsVerified: 1, IsLandlord: 1, FacebookId: 1).to_a
    end
    mongoSession.disconnect

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

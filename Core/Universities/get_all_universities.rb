#!/usr/local/bin/ruby

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

begin
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database

    documents = Array.new
    mongoSession.with(safe: true) do |session|
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        documents = session[:universities].find().select(_id: 1, UniversityName: 1, Address: 1, Threshold: 1, WorldCoordinates: 1).to_a
=======
        documents = session[:universities].find().select(_id: 1, UniversityName: 1).to_a
>>>>>>> f518129... 107 universities
=======
        documents = session[:universities].find().select(_id: 1, UniversityName: 1, Address: 1).to_a
>>>>>>> cdca1eb... 107 university stuff
=======
        documents = session[:universities].find().select(_id: 1, UniversityName: 1, Address: 1, Threshold: 1).to_a
>>>>>>> 33457ff... 119 getting distance calculations
    end
    mongoSession.disconnect

    if documents.count == 0
        puts "No Universities"
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

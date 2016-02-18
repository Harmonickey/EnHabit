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
        documents = session[:pricing].find().select(_id: 1, UniversityId: 1, ListingMarkup: 1, FeaturedMarkup: 1).to_a
    end
<<<<<<< HEAD
<<<<<<< HEAD

    universities = []

    mongoSession.with(safe: true) do |session|
        universities = session[:universities].find().to_a
    end

    universities.each do |university|
        docs = documents.select {|doc| doc["UniversityId"] == university["UniversityId"] }

        docs[0]["UniversityName"] = university["UniversityName"]
    end

=======
>>>>>>> 34c5dec... 115 backend functions
=======
    
    universities = []
    
    mongoSession.with(safe: true) do |session|
        universities = session[:universities].find().to_a
    end
    
    universities.each do |university|
        docs = documents.select {|doc| doc["UniversityId"] == university["UniversityId"] }
        document = docs[0]
        
        document["UniversityName"] = university["UniversityName"]
    end
    
>>>>>>> 2fdafcb... 115 frontend functions
    mongoSession.disconnect

    if documents.count == 0
        puts "No Pricing Markups"
    else
        puts documents.to_json
    end
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
<<<<<<< HEAD
end
=======
end
>>>>>>> 34c5dec... 115 backend functions

#!/usr/local/bin/ruby


require 'json'
require 'bson'
require 'moped'
require 'mongoid'

def GetPriceRange(university)
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])
    mongoSession.use("enhabit")

    document = {:MinRent => 0, :MaxRent => 0}
    
    mongoSession.with(safe: true) do |session|
        document[:MinRent] = session[:listings].find({IsActive: true, University: university}).sort({"Price" => 1}).limit(1).select("_id" => 0, "Price" => 1).one
        document[:MaxRent] = session[:listings].find({IsActive: true, University: university}).sort({"Price" => -1}).limit(1).select("_id" => 0, "Price" => 1).one
    
        universityObj = session[:universities].find({UniversityName: university}).one
    
        pricing = session[:pricing].find({UniversityId: universityObj["UniversityId"]}).one
        
        document[:MinRent]["Price"] = (document[:MinRent]["Price"]  * (pricing["ListingMarkup"].to_f / 100) + document[:MinRent]["Price"]).to_i
        document[:MaxRent]["Price"] = (document[:MaxRent]["Price"] * (pricing["ListingMarkup"].to_f / 100) + document[:MaxRent]["Price"]).to_i
    end
    
    return document.to_json
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?

    puts GetPriceRange("Northwestern")
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
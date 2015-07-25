#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deployment_base}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

def create_listing(user, landlord, is_landlord, price, address, bedrooms, bathrooms, animals, laundry, parking, airConditioning, type, start, latitude, longitude, university, tags)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    listing_obj = Hash.new
    listing_obj["Username"] = user if not user.nil?
    listing_obj["Landlord"] = landlord if not landlord.nil?
    listing_obj["Price"] = price.to_i
    listing_obj["Address"] = address
    listing_obj["Bedrooms"] = bedrooms.to_i
    listing_obj["Bathrooms"] = bathrooms.to_i
    listing_obj["Animals"] = animals.to_b
    listing_obj["Laundry"] = laundry.to_b
    listing_obj["Parking"] = parking.to_b
    listing_obj["AirConditioning"] = airConditioning.to_b
    listing_obj["Type"] = type
    listing_obj["Start"] = Date.strptime(start, "%m/%d/%Y").mongoize
    listing_obj["WorldCoordinates"] = {"x" => latitude.to_f, "y" => longitude.to_f}
    listing_obj["University"] = university
    listing_obj["Tags"] = tags
    
    query_obj = Hash.new
    query_obj["Username"] = user
    
    document = Hash.new
    
    begin
        mongo_session.with(safe: true) do |session|
            listing = session[:listings].find(query_obj).to_a
            if listing.count == 0 and not is_landlord
                session[:listings].insert(listing_obj)
                document = session[:listings].find().select(_id: 1, Username: 1, Price: 1, Address: 1, Bedrooms: 1, Bathrooms: 1, Animals: 1, Laundry: 1, Parking: 1, AirConditioning: 1, Type: 1, Start: 1, WorldCoordinates: 1, Landlord: 1, Tags: 1).one
            else
                document["error"] = "Tenants can only have one listing at a time."
            end
        end
    rescue Moped::Errors::OperationFailure => e
        document["error"] = e
    end
    
	mongo_session.disconnect
    return document
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    username = ARGV[1] if not ARGV[1].nil? and not ARGV[1].empty?
    is_landlord = ARGV[2].to_b if not ARGV[2].nil? and not ARGV[2].empty?
    landlord = data["landlord"] if not data["landlord"].nil? and not data["landlord"].empty?
    
    result = create_listing(username, landlord, is_landlord, data["rent"], data["address"], data["bedrooms"], data["bathrooms"], data["animals"], data["laundry"], data["parking"], data["airConditioning"], data["type"], data["start"], data["latitude"], data["longitude"], data["university"], data["tags"])

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    result = Hash.new
    result["error"] = e.inspect
    puts result.to_json
end
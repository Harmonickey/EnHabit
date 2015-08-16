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

MAX_BEDROOMS_FOR_FILTER = 3
MAX_BATHROOMS_FOR_FILTER = 3

MIN_BEDROOMS_FOR_FILTER = 0
MIN_BATHROOMS_FOR_FILTER = 0

def set_filters
    if @lower.nil? and @upper.nil? 
        @price_filter = nil
    else
        @price_filter[:Price] = {}
        @price_filter[:Price][:$gte] = @lower
        @price_filter[:Price][:$lte] = @upper
    end

    if @bedrooms.nil? 
        @bedroom_filter = nil
    else
        @bedroom_filter[:Bedrooms] = {}
        if @bedrooms == MAX_BEDROOMS_FOR_FILTER || @bedrooms == MIN_BEDROOMS_FOR_FILTER
            @bedroom_filter[:Bedrooms][:$gte] = @bedrooms
        else
            @bedroom_filter[:Bedrooms][:$eq] = @bedrooms
        end
    end

    if @bathrooms.nil? 
        @bathroom_filter = nil
    else
        @bathroom_filter[:Bathrooms] = {}
        if @bathrooms == MAX_BATHROOMS_FOR_FILTER || @bathrooms == MIN_BATHROOMS_FOR_FILTER
            @bathroom_filter[:Bathrooms][:$gte] = @bathrooms
        else
            @bathroom_filter[:Bathrooms][:$eq] = @bathrooms
        end
    end

    if @hasLaundry.nil? 
        @hasLaundry_filter = nil
    else
        @hasLaundry_filter[:HasLaundry] = {}
        @hasLaundry_filter[:HasLaundry][:$eq] = @hasLaundry
    end
    
    if @hasAnimals.nil? 
        @hasAnimals_filter = nil
    else
        @hasAnimals_filter[:HasAnimals] = {}
        @hasAnimals_filter[:HasAnimals][:$eq] = @hasAnimals
    end
    
    if @hasParking.nil? 
        @hasParking_filter = nil
    else
        @hasParking_filter[:HasParking] = {}
        @hasParking_filter[:HasParking][:$eq] = @hasParking
    end
    
    if @hasAirConditioning.nil? 
        @hasAirConditioning_filter = nil
    else
        @hasAirConditioning_filter[:HasAirConiditioning] = {}
        @hasAirConditioning_filter[:HasAirConiditioning][:$eq] = @hasAirConditioning
    end
    
    if @type.nil? 
        @type_filter = nil
    else
        @type_filter[:Type] = {}
        @type_filter[:Type][:$eq] = @type
    end
    
    if @start.nil? 
        @start_filter = nil
    else 
        @start_filter[:Start] = {}
        @start_filter[:Start][:$gte] = Date.strptime(@start, "%m/%d/%Y").mongoize
    end

    if @tags.nil? 
        @tag_filter = nil
    else 
        @tag_filter[:Tags] = {}
        @tag_filter[:Tags][:$in] = @tags # $in matches on either of the elements
    end
    
    if @university.nil?
        @university_filter = nil
    else
        @university_filter[:University] = @university
    end
    
    if @userId.nil?
        @userId_filter = nil
    else
        @userId_filter[:UserId] = @userId
    end
    
    if @landlordId.nil?
        @landlordId_filter = nil
    else
        @landlordId_filter[:LandlordId] = @landlordId
    end
end

def combine_filters_into_query 
    @main_filter["$and"] = Array.new
    if not @price_filter.nil? 
        @main_filter["$and"].push @price_filter
    end
    if not @bedroom_filter.nil? 
        @main_filter["$and"].push @bedroom_filter
    end
    if not @bathroom_filter.nil? 
        @main_filter["$and"].push @bathroom_filter
    end
    if not @hasLaundry_filter.nil? 
        @main_filter["$and"].push @hasLaundry_filter
    end
    if not @hasParking_filter.nil? 
        @main_filter["$and"].push @hasParking_filter
    end
    if not @hasAirConditioning_filter.nil? 
        @main_filter["$and"].push @hasAirConditioning_filter
    end
    if not @hasAnimals_filter.nil? 
        @main_filter["$and"].push @hasAnimals_filter
    end
    if not @type_filter.nil? 
        @main_filter["$and"].push @type_filter
    end
    if not @start_filter.nil? 
        @main_filter["$and"].push @start_filter
    end
    if not @tag_filter.nil? 
        @main_filter["$and"].push @tag_filter
    end
    if not @university_filter.nil?
        @main_filter["$and"].push @university_filter
    end
    if not @userId_filter.nil?
        @main_filter["$and"].push @userId_filter
    end
    if not @landlordId_filter.nil?
        @main_filter["$and"].push @landlordId_filter
    end
    
    if @main_filter["$and"].count == 0
        @main_filter = {}
    end
end

begin
   
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    unless data.nil?
        @lower = data["price"]["low"].to_i if not data["price"].nil?
        @upper = data["price"]["high"].to_i if not data["price"].nil?   
        @bedrooms = data["bedrooms"].to_i if not data["bedrooms"].nil? and not data["bedrooms"] == "0+" and not data["bedrooms"] == "studio"
        @bedrooms = data["bedrooms"] if data["bedrooms"] == "studio"
        @bathrooms = data["bathrooms"].to_i if not data["bathrooms"].nil? and not data["bathrooms"] == "0+"
        @hasLaundry = data["laundry"].to_b if not data["laundry"].nil? and not data["laundry"] == "both"
        @hasParking = data["parking"].to_b if not data["parking"].nil? and not data["parking"] == "both"
        @hasAnimals = data["animals"].to_b if not data["animals"].nil? and not data["animals"] == "both"
        @hasAirConditioning = data["airConditioning"].to_b if not data["airConditioning"].nil? and not data["airConditioning"] == "both"
        @type = data["type"] if not data["type"].nil? and not data["type"] == "both"
        @start = data["start"] if not data["start"].nil? and not data["start"].empty?
        @university = data["university"] if not data["university"].nil? and not data["university"].empty?
        @tags = data["tags"] if not data["tags"].nil? and not data["tags"].length == 0    
    end
    
    @is_admin = ARGV[3].to_b unless ARGV[3].empty?
    
    unless @is_admin
        @userId = ARGV[1] unless ARGV[1].empty?
        @landlordId = ARGV[1] unless ARGV[1].empty?
        @key = ARGV[2] unless ARGV[2].empty?

        if @key == "UserId"
            @landlordId = nil
        elsif @key == "LandlordId" 
            @userId = nil
        end   
    end

    @price_filter = {}
    @bedroom_filter = {}
    @bathroom_filter = {}
    @hasLaundry_filter = {}
    @hasParking_filter = {}
    @hasAnimals_filter = {}
    @hasAirConditioning_filter = {}
    @type_filter = {}
    @start_filter = {}
    @university_filter = {}
    @tag_filter = {}
    @main_filter = {}
    @userId_filter = {}
    @landlordId_filter = {}

    set_filters
    combine_filters_into_query
    
    File.open("output.log", "a") do |output|
        output.puts @main_filter.inspect
    end

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database
    
    documents = mongo_session[:listings].find(@main_filter).select(_id: 1, UserId: 1, LandlordId: 1, University: 1, Landlord: 1, WorldCoordinates: 1, Price: 1, Bedrooms: 1, Bathrooms: 1, Start: 1, Address: 1, Unit: 1, HasAnimals: 1, HasAirConditioning: 1, HasLaundry: 1, HasParking: 1, Type: 1, Tags: 1, Pictures: 1).to_a
    
    mongo_session.disconnect

    if documents.count == 0
        puts "No Matching Entries"
    else
        if not @is_admin and not @key.nil?
            documents.each do |doc|
                account = mongo_session[:accounts].find({@key => doc[@key]}).select(Username: 1).one
                
                doc["Username"] = account["Username"] unless account["Username"].nil?
                
                doc.delete("UserId")
                doc.delete("LandlordId")
            end
        else
            documents.each do |doc|
                account = mongo_session[:accounts].find({"UserId" => doc["UserId"]}).select(Username: 1).one
                doc["Username"] = account["Username"] unless account.nil?
                
                doc.delete("UserId")
                doc.delete("LandlordId")
            end
        end
        
        puts documents.to_json
    end
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end

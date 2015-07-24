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
        if @bedrooms == MAX_BEDROOMS_FOR_FILTER || MIN_BEDROOMS_FOR_FILTER
            @bedroom_filter[:Bedrooms][:$gte] = @bedrooms
        else
            @bedroom_filter[:Bedrooms][:$eq] = @bedrooms
        end
    end

    if @bathrooms.nil? 
        @bathroom_filter = nil
    else
        @bathroom_filter[:Bathrooms] = {}
        if @bathrooms == MAX_BATHROOMS_FOR_FILTER || MIN_BATHROOMS_FOR_FILTER
            @bathroom_filter[:Bathrooms][:$gte] = @bathrooms
        else
            @bathroom_filter[:Bathrooms][:$eq] = @bathrooms
        end
    end

    if @laundry.nil? 
        @laundry_filter = nil
    else
        @laundry_filter[:Laundry] = {}
        @laundry_filter[:Laundry][:$eq] = @laundry
    end
    
    if @animals.nil? 
        @animal_filter = nil
    else
        @animal_filter[:Animals] = {}
        @animal_filter[:Animals][:$eq] = @animals
    end
    
    if @parking.nil? 
        @parking_filter = nil
    else
        @parking_filter[:Parking] = {}
        @parking_filter[:Parking][:$eq] = @parking
    end
    
    if @airConditioning.nil? 
        @airConditioning_filter = nil
    else
        @airConditioning_filter[:AirConditioning] = {}
        @airConditioning_filter[:AirConditioning][:$eq] = @airConditioning
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
    
    if @user.nil? or @landlord.nil?
        @user = nil
    else
        @user_filter[(@landlord ? :Landlord : :Username)] = @user
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
    if not @laundry_filter.nil? 
        @main_filter["$and"].push @laundry_filter
    end
    if not @parking_filter.nil? 
        @main_filter["$and"].push @parking_filter
    end
    if not @airConditioning_filter.nil? 
        @main_filter["$and"].push @airConditioning_filter
    end
    if not @animal_filter.nil? 
        @main_filter["$and"].push @animal_filter
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
    if not @user_filter.nil?
        @main_filter["$and"].push @user_filter
    end
end

begin
   
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].empty?
    user = ARGV[1] if not ARGV[1].nil? and not ARGV[1].empty?
    landlord = ARGV[2] if not ARGV[2].nil? and not ARGV[2].empty?
 
    if not data.nil?
      @lower = data["price"]["low"].to_i unless data["price"].nil?
      @upper = data["price"]["high"].to_i unless data["price"].nil?   
      @bedrooms = data["bedrooms"].to_i unless data["bedrooms"] == "0+" or data["bedrooms"].nil? or data["bedrooms"] == "studio"
      @bedrooms = data["bedrooms"] if data["bedrooms"] == "studio"
      @bathrooms = data["bathrooms"].to_i unless data["bathrooms"] == "0+" or data["bathrooms"].nil?
      @laundry = data["laundry"].to_b unless data["laundry"] == "both" or data["laundry"].nil?
      @parking = data["parking"].to_b unless data["parking"] == "both" or data["parking"].nil?
      @animals = data["animals"].to_b unless data["animals"] == "both" or data["animals"].nil?
      @airConditioning = data["airConditioning"].to_b unless data["airConditioning"] == "both" or data["airConditioning"].nil?
      @type = data["type"] unless data["type"] == "both" or data["type"].nil?
      @start = data["start"] unless data["start"].nil? or data["start"].empty?
      @university = data["university"]
      @tags = data["tags"] unless data["tags"].nil? or data["tags"] == []
    end

    @user = user if not user.nil?
    @landlord = landlord.to_b if not landlord.nil?

    @price_filter = {}
    @bedroom_filter = {}
    @bathroom_filter = {}
    @laundry_filter = {}
    @parking_filter = {}
    @animal_filter = {}
    @airConditioning_filter = {}
    @type_filter = {}
    @start_filter = {}
    @university_filter = {}
    @tag_filter = {}
    @main_filter = {}
    @user_filter = {}

    set_filters
    combine_filters_into_query

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    listings = mongo_session[:listings]
    
    documents = listings.find(@main_filter).select(WorldCoordinates: 1, Price: 1, Bedrooms: 1, Bathrooms: 1, Start: 1, Address: 1, Animals: 1, AirConditioning: 1, Laundry: 1, Parking: 1, Type: 1, Tags: 1).to_a
    mongo_session.disconnect

    if documents.count == 0
        puts "No Matching Entries"
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

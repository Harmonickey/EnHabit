#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "./Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

MAX_BEDROOMS_FOR_FILTER = 3
MAX_BATHROOMS_FOR_FILTER = 3

def set_filters
    if @lower.nil? and @upper.nil? 
        @price_filter = nil
    else
        @price_filter[:price] = {}
        @price_filter[:price][:$gte] = @lower
        @price_filter[:price][:$lte] = @upper
    end

    if @bedrooms.nil? 
        @bedroom_filter = nil
    else
        @bedroom_filter[:bedrooms] = {}
        if (@bedrooms == MAX_BEDROOMS_FOR_FILTER)
            @bedroom_filter[:bedrooms][:$gte] = @bedrooms
        else
            @bedroom_filter[:bedrooms][:$eq] = @bedrooms
        end
    end

    if @bathrooms.nil? 
        @bathroom_filter = nil
    else
        @bathroom_filter[:bathrooms] = {}
        if (@bathrooms == MAX_BATHROOMS_FOR_FILTER)
            @bathroom_filter[:bathrooms][:$gte] = @bathrooms
        else
            @bathroom_filter[:bathrooms][:$eq] = @bathrooms
        end
    end

    if @laundry.nil? 
        @laundry_filter = nil
    else
        @laundry_filter[:laundry] = {}
        @laundry_filter[:laundry][:$eq] = @laundry
    end
    
    if @animals.nil? 
        @animal_filter = nil
    else
        @animal_filter[:animals] = {}
        @animal_filter[:animals][:$eq] = @animals
    end
    
    if @parking.nil? 
        @parking_filter = nil
    else
        @parking_filter[:parking] = {}
        @parking_filter[:parking][:$eq] = @parking
    end
    
    if @airConditioning.nil? 
        @airConditioning_filter = nil
    else
        @airConditioning_filter[:airConditioning] = {}
        @airConditioning_filter[:airConditioning][:$eq] = @airConditioning
    end
    
    if @type.nil? 
        @type_filter = nil
    else
        @type_filter[:type] = {}
        @type_filter[:type][:$eq] = @type
    end
    
    if @start.nil? 
        @start_filter = nil
    else 
        @start_filter[:start] = {}
        @start_filter[:start][:$gte] = Date.strptime(@start, "%m/%d/%Y").mongoize
    end

    if @tags.nil? 
        @tag_filter = nil
    else 
        @tag_filter[:tags][:$in] = @tags # $in matches on either of the elements
    end
    
    if @university.nil?
        @university = nil
    else
        @university_filter[:university] = @university
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
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    user = ARGV[1] if not ARGV[1].nil?

    @lower = data["price"]["low"].to_i unless data["price"].nil?
    @upper = data["price"]["high"].to_i unless data["price"].nil?   
    @bedrooms = data["bedrooms"].to_i unless data["bedrooms"] == "0+" or data["bedrooms"].nil?
    @bathrooms = data["bathrooms"].to_i unless data["bathrooms"] == "any" or data["bathrooms"].nil?
    @laundry = data["laundry"].to_b unless data["laundry"] == "both" or data["laundry"].nil?
    @parking = data["parking"].to_b unless data["parking"] == "both" or data["parking"].nil?
    @animals = data["animals"].to_b unless data["animals"] == "both" or data["animals"].nil?
    @airConditioning = data["airConditioning"].to_b unless data["airConditioning"] == "both" or data["airConditioning"].nil?
    @type = data["type"] unless data["type"] == "both" or data["type"].nil?
    @start = data["start"] unless data["start"].nil?
    @university = data["university"]
    @tags = data["tags"] unless data["tags"].nil? or data["tags"] == []

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

    set_filters()
    combine_filters_into_query()

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    listings = mongo_session[:listings]

    documents = listings.find(@main_filter).select(worldCoordinates: 1, price: 1, bedrooms: 1, bathrooms: 1, start: 1, address: 1, animals: 1, airConditioning: 1, laundry: 1, parking: 1, type: 1, tags: 1).to_a
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
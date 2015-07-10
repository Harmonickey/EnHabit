#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'

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
        @bedroom_filter[:bedrooms][:$eq] = @bedrooms
    end

    if @bathrooms.nil? 
        @bathroom_filter = nil
    else
        @bathroom_filter[:bathrooms] = {}
        @bathroom_filter[:bathrooms][:$eq] = @bathrooms
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
    
    if @ac.nil? 
        @ac_filter = nil
    else
        @ac_filter[:ac] = {}
        @ac_filter[:ac][:$eq] = @ac
    end
    
    if @type.nil? 
        @type_filter = nil
    else
        @type_filter[:type] = {}
        @type_filter[:type][:$eq] = @type
    end
    
    if @start_date.nil? 
        @start_filter = nil
    else 
        @start_filter[:start] = {}
        @start_filter[:start][:$gte] = Date.strptime(@start_date, "%m/%d/%Y").mongoize
    end

    if @tags.nil? 
        @tag_filter = nil
    else 
        @tag_filter["tags"] = @tags
    end
    
    if @university.nil?
        @university = nil
    else
        @university_filter["university"] = @university
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
    if not @ac_filter.nil? 
        @main_filter["$and"].push @ac_filter
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

    @lower = data["lower"]
    @upper = data["upper"]
    @bedrooms = data["bedrooms"].to_i unless data["bedrooms"].nil?
    @bathrooms = data["bathrooms"].to_i unless data["bathrooms"].nil?
    @laundry = data["laundry"]
    @parking = data["parking"]
    @animals = data["animals"]
    @ac = data["ac"]
    @type = data["type"]
    @university = data["university"]
    @start_date = data["start_date"]
    @tags = data["tags"]

    @price_filter = {}
    @bedroom_filter = {}
    @bathroom_filter = {}
    @laundry_filter = {}
    @parking_filter = {}
    @animal_filter = {}
    @ac_filter = {}
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

    documents = listings.find(@main_filter).select(worldCoordinates: 1, price: 1, bedrooms: 1, bathrooms: 1, start_date: 1, address: 1, animals: 1, ac: 1, laundry: 1, parking: 1, type: 1, tags: 1).to_a
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
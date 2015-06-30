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
        @bathrooms_filter = nil
    else
        @bathrooms_filter[:bedrooms] = {}
        @bathrooms_filter[:bedrooms][:$eq] = @bathrooms
    end

    if @start_date.nil? 
        @start_filter = nil
    else 
        @start_filter[:start] = {}
        @start_filter[:start][:$gte] = Date.strptime(@start_date, "%m/%d/%Y").mongoize
    end

    if @extensions.nil? 
        @extensions_filter = nil
    else
        @extensions.each do |key, value| 
        @extensions_filter["extensions." + key] = value
    end
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
    if not @bathrooms_filter.nil? 
        @main_filter["$and"].push @bathrooms_filter
    end
    if not @start_filter.nil? 
        @main_filter["$and"].push @start_filter
    end
    if not @extensions_filter.nil? 
        @main_filter["$and"].push @extensions_filter
    end
end


begin

    data = JSON.parse(ARGV[0].delete('\\'))
    user = ARGV[1] if not ARGV[1].nil?

    @lower = data["lower"]
    @upper = data["upper"]
    @bedrooms = data["bedrooms"]
    @bathrooms = data["bathrooms"]
    @start_date = data["start_date"]
    @extensions = data["extensions"]

    @price_filter = {}
    @bedroom_filter = {}
    @bathrooms_filter = {}
    @start_filter = {}
    @main_filter = {}
    @extensions_filter = {}

    set_filters()
    combine_filters_into_query()

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    listings = mongo_session[:listings]

    documents = listings.find(@main_filter).select(worldCoordinates: 1, price: 1, bedrooms: 1, bathrooms: 1, start_date: 1, address: 1).to_a
    mongo_session.disconnect

    if documents.count == 0
        puts "No Matching Entries"
    else
        result_data = Hash.new
        result_data["data"] = documents
        result_data["data"].map { |listing| listing["_id"] = listing["_id"].to_s }
        puts result_data.to_json
    end

rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
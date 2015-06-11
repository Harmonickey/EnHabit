#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'moped'
require 'bson'

data = ARGV[0]
json_data = JSON.parse(data)

@lower = json_data[:lower]
@upper = json_data[:upper]
@bedrooms = json_data[:bedrooms]
@bathrooms = json_data[:bathrooms]
@start_date = json_data[:start_date]
 
@price_filter = {}
@bedroom_filter = {}
@bathroom_filter = {}
@start_filter = {}
@main_filter = {}

def set_filters
  if @lower.nil? and @upper.nil?
        @price_filter = nil
  else
        @price_filter[:price] = {}
        @price_filter[:price][:$gte] = @lower
        @price_filter[:price][:$gte] = @upper
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
        @start_filter[:start][:$gte] = Date.strptime(@start_date,"%m/%d/%Y").mongoize
  end

end

def combine_filters_into_query
  @main_filter[:$and] = Array.new
  if not @price_filter.nil?
        @main_filter[:$and].push @price_filter
  end
  if not @bedroom_filter.nil?
  	    @main_filter[:$and].push @bedroom_filter
  end
  if not @bathroom_filter.nil?
        @main_filter[:$and].push @bathroom_filter
  end
  if not @start_filter.nil?
        @main_filter[:$and].push @start_filter
  end
end


begin

        set_filters()
        combine_filters_into_query()

        mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
        mongo_session.use("enhabit") # this is our current database

        listings = mongo_session[:listings]

        documents = listings.find(@main_filter).to_a
        mongo_session.disconnect

        if documents.count == 0
          puts "Error: No Matching Entries"
        else
          documents[0]["_id"] = "empty" #just clear out the _id since we don't need it
          documents[0]["start"] = "#{documents[0]["start"]}" #make the date object a string for javascript usage
          puts documents
        end

rescue Exception => e
        File.open("error.log", "a") do |output|
                output.puts e.message
                output.puts e.backtrace.inspect
        end

        puts "Error: #{e.message}"
end
#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'

MAX_BEDROOMS_FOR_FILTER = 3
MAX_BATHROOMS_FOR_FILTER = 3

MIN_BEDROOMS_FOR_FILTER = 0
MIN_BATHROOMS_FOR_FILTER = 0

def setFilters
    if @lower.nil? and @upper.nil? 
        @priceFilter = nil
    else
        @priceFilter[:Price] = {}
        @priceFilter[:Price][:$gte] = @lower
        @priceFilter[:Price][:$lte] = @upper
    end

    if @bedrooms.nil? 
        @bedroomFilter = nil
    else
        @bedroomFilter[:Bedrooms] = {}
        if @bedrooms == MAX_BEDROOMS_FOR_FILTER || @bedrooms == MIN_BEDROOMS_FOR_FILTER
            @bedroomFilter[:Bedrooms][:$gte] = @bedrooms
        else
            @bedroomFilter[:Bedrooms][:$eq] = @bedrooms
        end
    end

    if @bathrooms.nil? 
        @bathroomFilter = nil
    else
        @bathroomFilter[:Bathrooms] = {}
        if @bathrooms == MAX_BATHROOMS_FOR_FILTER || @bathrooms == MIN_BATHROOMS_FOR_FILTER
            @bathroomFilter[:Bathrooms][:$gte] = @bathrooms
        else
            @bathroomFilter[:Bathrooms][:$eq] = @bathrooms
        end
    end

    if @hasLaundry.nil? 
        @hasLaundryFilter = nil
    else
        @hasLaundryFilter[:HasLaundry] = {}
        @hasLaundryFilter[:HasLaundry][:$eq] = @hasLaundry
    end
    
    if @hasAnimals.nil? 
        @hasAnimalsFilter = nil
    else
        @hasAnimalsFilter[:HasAnimals] = {}
        @hasAnimalsFilter[:HasAnimals][:$eq] = @hasAnimals
    end
    
    if @hasParking.nil? 
        @hasParkingFilter = nil
    else
        @hasParkingFilter[:HasParking] = {}
        @hasParkingFilter[:HasParking][:$eq] = @hasParking
    end
    
    if @hasAirConditioning.nil? 
        @hasAirConditioningFilter = nil
    else
        @hasAirConditioningFilter[:HasAirConiditioning] = {}
        @hasAirConditioningFilter[:HasAirConiditioning][:$eq] = @hasAirConditioning
    end
    
    if @type.nil? 
        @typeFilter = nil
    else
        @typeFilter[:Type] = {}
        @typeFilter[:Type][:$eq] = @type
    end
    
    if @start.nil? 
        @startFilter = nil
    else 
        @startFilter[:Start] = {}
        @startFilter[:Start][:$gte] = Date.strptime(@start, "%m/%d/%Y").mongoize
    end

    if @tags.nil? 
        @tagFilter = nil
    else 
        @tagFilter[:Tags] = {}
        @tagFilter[:Tags][:$in] = @tags # $in matches on either of the elements
    end
    
    if @university.nil?
        @universityFilter = nil
    else
        @universityFilter[:University] = @university
    end
    
    if @userId.nil?
        @userIdFilter = nil
    else
        @userIdFilter[:UserId] = @userId
    end
    
    if @landlordId.nil?
        @landlordIdFilter = nil
    else
        @landlordIdFilter[:LandlordId] = @landlordId
    end
    
    if @landlord.nil?
        @landlordFilter = nil
    else
        @landlordFilter[:Landlord] = @landlord
    end
end

def combineFiltersIntoQuery 
    @mainFilter["$and"] = Array.new
    if not @priceFilter.nil? 
        @mainFilter["$and"].push @priceFilter
    end
    if not @bedroomFilter.nil? 
        @mainFilter["$and"].push @bedroomFilter
    end
    if not @bathroomFilter.nil? 
        @mainFilter["$and"].push @bathroomFilter
    end
    if not @hasLaundryFilter.nil? 
        @mainFilter["$and"].push @hasLaundryFilter
    end
    if not @hasParkingFilter.nil? 
        @mainFilter["$and"].push @hasParkingFilter
    end
    if not @hasAirConditioningFilter.nil? 
        @mainFilter["$and"].push @hasAirConditioningFilter
    end
    if not @hasAnimalsFilter.nil? 
        @mainFilter["$and"].push @hasAnimalsFilter
    end
    if not @typeFilter.nil? 
        @mainFilter["$and"].push @typeFilter
    end
    if not @startFilter.nil? 
        @mainFilter["$and"].push @startFilter
    end
    if not @tagFilter.nil? 
        @mainFilter["$and"].push @tagFilter
    end
    if not @universityFilter.nil?
        @mainFilter["$and"].push @universityFilter
    end
    if not @userIdFilter.nil?
        @mainFilter["$and"].push @userIdFilter
    end
    if not @landlordIdFilter.nil?
        @mainFilter["$and"].push @landlordIdFilter
    end
    if not @landlordFilter.nil?
        @mainFilter["$and"].push @landlordFilter
    end
    
    if @mainFilter["$and"].count == 0
        @mainFilter = {}
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
    
    unless data.nil?
        @lower = data["Price"]["Low"].to_i if not data["Price"].nil?
        @upper = data["Price"]["High"].to_i if not data["Price"].nil?   
        @bedrooms = data["Bedrooms"].to_i if not data["Bedrooms"].nil? and not data["Bedrooms"] == "0+" and not data["Bedrooms"] == "studio"
        @bedrooms = data["Bedrooms"] if data["Bedrooms"] == "studio"
        @bathrooms = data["Bathrooms"].to_i if not data["Bathrooms"].nil? and not data["Bathrooms"] == "0+"
        @hasLaundry = data["Laundry"].to_b if not data["Laundry"].nil? and not data["Laundry"] == "both"
        @hasParking = data["Parking"].to_b if not data["Parking"].nil? and not data["Parking"] == "both"
        @hasAnimals = data["Animals"].to_b if not data["Animals"].nil? and not data["Animals"] == "both"
        @hasAirConditioning = data["AirConditioning"].to_b if not data["AirConditioning"].nil? and not data["AirConditioning"] == "both"
        @type = data["Type"] if not data["Type"].nil? and not data["Type"] == "both"
        @start = data["Start"] if not data["Start"].nil? and not data["Start"].empty?
        @university = data["University"] if not data["University"].nil? and not data["University"].empty?
        @tags = data["Tags"] if not data["Tags"].nil? and not data["Tags"].length == 0    
        @landlord = data["Landlord"] if not data["Landlord"].nil? and not data["Landlord"].empty?
    end
    
    @isAdmin = ARGV[3].to_b unless ARGV[3].empty?
    
    unless @isAdmin
        @userId = ARGV[1] unless ARGV[1].empty?
        @landlordId = ARGV[1] unless ARGV[1].empty?
        @key = ARGV[2] unless ARGV[2].empty?

        if @key == "UserId"
            @landlordId = nil
        elsif @key == "LandlordId" 
            @userId = nil
        end   
    end

    @priceFilter = {}
    @bedroomFilter = {}
    @bathroomFilter = {}
    @hasLaundryFilter = {}
    @hasParkingFilter = {}
    @hasAnimalsFilter = {}
    @hasAirConditioningFilter = {}
    @typeFilter = {}
    @startFilter = {}
    @universityFilter = {}
    @tagFilter = {}
    @mainFilter = {}
    @userIdFilter = {}
    @landlordIdFilter = {}
    @landlordFilter = {}

    setFilters
    combineFiltersIntoQuery
    
    File.open("output.log", "a") do |output|
        output.puts @mainFilter.inspect
    end

    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database
    
    documents = mongoSession[:listings].find(@mainFilter).select(_id: 1, UserId: 1, LandlordId: 1, University: 1, Landlord: 1, WorldCoordinates: 1, Price: 1, Bedrooms: 1, Bathrooms: 1, Start: 1, Address: 1, Unit: 1, HasAnimals: 1, HasAirConditioning: 1, HasLaundry: 1, HasParking: 1, Type: 1, Tags: 1, Pictures: 1, Thumbnails: 1).to_a
    
    mongoSession.disconnect

    if documents.count == 0
        puts "No Matching Entries"
    else
        if not @isAdmin and not @key.nil?
            documents.each do |doc|
                account = mongoSession[:accounts].find({@key => doc[@key]}).select(Username: 1).one
                
                doc["Username"] = account["Username"] unless account["Username"].nil?
                
                
                doc.delete("UserId")
                doc.delete("LandlordId")
            end
        else
            documents.each do |doc|
                account = mongoSession[:accounts].find({"UserId" => doc["UserId"]}).select(Username: 1).one
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

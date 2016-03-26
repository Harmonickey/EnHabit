#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'tools'
<<<<<<< HEAD
require 'date'
=======

MAX_BEDROOMS_FOR_FILTER = 3
MIN_BEDROOMS_FOR_FILTER = 0
>>>>>>> d1eed6e... 118 move to if statement

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
        @bathroomFilter[:Bathrooms][:$gte] = @bathrooms
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
    
    if @leaseType.nil? 
        @leaseTypeFilter = nil
    else
        @leaseTypeFilter[:LeaseType] = {}
        @leaseTypeFilter[:LeaseType][:$eq] = @leaseType
    end
    
    if @buildingType.nil? 
        @buildingTypeFilter = nil
    else
        @buildingTypeFilter[:BuildingType] = {}
        @buildingTypeFilter[:BuildingType][:$eq] = @buildingType
    end
    
    if @start.nil? 
        @startFilter = nil
    else 
        @startFilter[:Start] = {}
        @startFilter[:Start][:$lte] = Date.strptime(@start, "%m/%d/%Y").mongoize
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
    
    if @isRented.nil?
        @isRentedFilter = nil
    else
        @isRentedFilter[:IsRented] = @isRented
    end
    
    if @isActive.nil?
        @isActiveFilter = nil
    else
        @isActiveFilter[:IsActive] = @isActive
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
    if not @leaseTypeFilter.nil? 
        @mainFilter["$and"].push @leaseTypeFilter
    end
    if not @buildingTypeFilter.nil? 
        @mainFilter["$and"].push @buildingTypeFilter
    end
    if not @startFilter.nil? 
        @mainFilter["$and"].push @startFilter
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
    if not @isRentedFilter.nil?
        @mainFilter["$and"].push @isRentedFilter
    end
    if not @isActiveFilter.nil? and @userId.nil? and @landlordId.nil?
        @mainFilter["$and"].push @isActiveFilter
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
        @leaseType = data["LeaseType"] if not data["LeaseType"].nil? and not data["LeaseType"] == "both"
        @buildingType = data["BuildingType"] if not data["BuildingType"].nil? and not data["BuildingType"] == "both"
        @start = data["Start"] if not data["Start"].nil? and not data["Start"].empty?
        @university = data["University"] if not data["University"].nil? and not data["University"].empty?
        @landlord = data["Landlord"] if not data["Landlord"].nil? and not data["Landlord"].empty?
        @isRented = data["IsRented"] if not data["IsRented"].nil? and not data["IsRented"].empty?
        @isActive = true
    end
    
    @isAdmin = ARGV[3].to_b unless ARGV[3].empty?
    
    unless @isAdmin
        @userId = ARGV[1].split(",")[0] unless ARGV[1].empty?
        @landlordId = ARGV[1].split(",")[0] unless ARGV[1].empty?
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
    @leaseTypeFilter = {}
    @buildingTypeFilter = {}
    @startFilter = {}
    @universityFilter = {}
    @mainFilter = {}
    @userIdFilter = {}
    @landlordIdFilter = {}
    @landlordFilter = {}
    @isRentedFilter = {}
    @isActiveFilter = {}

    setFilters
    combineFiltersIntoQuery
    
    File.open("output.log", "a") do |output|
        output.puts "[" + DateTime.now.to_s + "] " + @mainFilter.inspect
    end

    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database
    
<<<<<<< HEAD
    documents = mongoSession[:listings].find(@mainFilter).select(_id: 1, UserId: 1, LandlordId: 1, University: 1, Landlord: 1, WorldCoordinates: 1, Price: 1, Bedrooms: 1, Bathrooms: 1, Start: 1, Address: 1, Unit: 1, HasAnimals: 1, HasAirConditioning: 1, HasLaundry: 1, HasParking: 1, LeaseType: 1, BuildingType: 1, Notes: 1, Pictures: 1, Thumbnails: 1, IsRented: 1, IsActive: 1, Testing: 1, IsPastThreshold: 1).to_a
=======
    # get all the non featured ones first
    @mainFilter["$and"].push({"IsFeatured" => false})
    documents = mongoSession[:listings].find(@mainFilter).select(_id: 1, UserId: 1, LandlordId: 1, University: 1, Landlord: 1, WorldCoordinates: 1, Price: 1, Bedrooms: 1, Bathrooms: 1, Start: 1, Address: 1, Unit: 1, HasAnimals: 1, HasAirConditioning: 1, HasLaundry: 1, HasParking: 1, LeaseType: 1, BuildingType: 1, Notes: 1, Pictures: 1, Thumbnails: 1, IsRented: 1, IsActive: 1, Testing: 1).to_a
   
    # now get all the featured ones
    @mainFilter["$and"].pop
    @mainFilter["$and"].push({"IsFeatured" => true})
    featured_documents = mongoSession[:listings].find(@mainFilter).select(_id: 1, UserId: 1, LandlordId: 1, University: 1, Landlord: 1, WorldCoordinates: 1, Price: 1, Bedrooms: 1, Bathrooms: 1, Start: 1, Address: 1, Unit: 1, HasAnimals: 1, HasAirConditioning: 1, HasLaundry: 1, HasParking: 1, LeaseType: 1, BuildingType: 1, Notes: 1, Pictures: 1, Thumbnails: 1, IsRented: 1, IsActive: 1, Testing: 1).to_a
    
    # smoosh them all together now
    documents += featured_documents
>>>>>>> 81164a5... 116 featured markers
    
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
        
        documents.each do |doc|
            university = mongoSession[:universities].find({"UniversityName" => doc["University"]}).one
            
            doc["Threshold"] = university["Threshold"]
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

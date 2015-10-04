#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'
require 'moped'
require 'bson'

Moped::BSON = BSON

def InsertRenterFromApplicant(userId, landlordId, address, unit, rent, listingId)

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    renterObj = Hash.new
    renterObj["UserId"] = userId
    renterObj["LandlordId"] = landlordId
    renterObj["Address"] = address
    renterObj["Unit"] = unit
    renterObj["Rent"] = rent
    renterObj["HasPaidRent"] = false
 
    document = Hash.new
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongoSession.with(safe: true) do |session|
            session[:renters].insert(renterObj)
        end
        
        # set IsRented for the listing that was associated with this applicant
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
        
        session[:listings].find(queryObj).update('$set' => {:IsRented => true})       
    rescue Moped::Errors::OperationFailure => e
        document["Error"] = e
    end
    
	mongoSession.disconnect
    return document.to_json
end

def GetListingData(listingId)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    begin
        queryObj = Hash.new
        queryObj["_id"] = Moped::BSON::ObjectId.from_string(listingId.to_s)
        
        listing = Array.new
        mongoSession.with(safe: true) do |session|
            listing = session[:listings].find(queryObj).to_a
        end
        
        if listing.count == 0
            return nil
        else
            return { :Address => listing[0]["Address"],
                     :Unit => listing[0]["Unit"],
                     :Rent => listing[0]["Rent"]}
        end
    rescue Moped::Errors::OperationFailure => e
        return nil
    end
end

# renter needs userId, landlordId, address, and rent
# this requires ApplicantId (oid)
begin
    data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?
    
    userId = ARGV[1] if not ARGV[0].nil?
    key = ARGV[2]
    isAdmin = ARGV[3].to_b
    
    applicantId = data["ApplicantId"] # oid for applicant entry
    applicantData = GetApplicantData(data["ApplicantId"])
    listingData = GetListingData(applicantData[:ListingId])

    puts InsertRenterFromApplicant(applicantData[:UserId], applicantData[:LandlordId], listingData[:Address], listingData[:Unit], listingData[:Rent], applicantData[:ListingId])
rescue Exception => e
    puts e.inspect
end
#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deployment_base}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'
require 'securerandom'
require 'tools'

def insert_user(is_admin, is_active, is_verified, is_landlord, user, pass, firstName, lastName, email, phoneNumber)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["UserId"] = SecureRandom.uuid
    unless is_landlord.nil? and is_landlord
        usr_obj["LandlordId"] = SecureRandom.uuid
    end
    usr_obj["Password"] = PasswordHash.createHash(pass)
    usr_obj["FirstName"] = firstName
    usr_obj["LastName"] = lastName
    usr_obj["Email"] = email
    usr_obj["PhoneNumber"] = phoneNumber
    usr_obj["IsAdmin"] = (is_admin.nil? ? is_admin : false)
    usr_obj["IsActive"] = (is_active.nil? ? is_active : true)
    usr_obj["IsVerified"] = (is_verified.nil? ? is_verified : true)
    usr_obj["IsLandlord"] = (is_landlord.nil? ? is_landlord : false)
 
    document = Hash.new
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            session[:accounts].insert(usr_obj)
        end
        
        query_obj = Hash.new
        query_obj["UserId"] = usr_obj["UserId"]
        
        mongo_session.with(safe: true) do |session|
            document = session[:accounts].find(query_obj).one
        end
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$Username_1"
            document["error"] = "That username already exists!"
        elsif e.message.include? "enhabit.accounts.$Email_1"
            document["error"] = "That email is already registered with another user!"
        elsif e.message.include? "enhabit.accounts.$PhoneNumber_1"
            document["error"] = "That phone number is already registered with another user!"
        end
    end
    
	mongo_session.disconnect
    return document
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    is_landlord = data["islandlord"].to_b unless data["islandlord"].nil? and not data["islandlord"].empty?
    is_verified = data["isverified"].to_b unless data["isverified"].nil? and not data["isverified"].empty?
    is_active = data["isactive"].to_b unless data["isactive"].nil? and not data["isactive"].empty?
    is_admin_data = data["isadmin"].to_b unless data["isadmin"].nil? and not data["isadmin"].empty?
    
    result = insert_user(is_admin_data, is_active, is_verified, is_landlord, data["username"], data["password"], data["firstname"], data["lastname"], data["email"], data["phonenumber"])
    
    puts result.to_json
rescue Exception => e
    puts e.inspect
end
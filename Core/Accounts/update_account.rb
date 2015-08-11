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
require 'tools'

def update_user(is_admin, key, userId, is_landlord, is_verified, is_active, is_admin_data, username, firstName, lastName, email, phoneNumber, newPassword)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = username
    usr_obj["FirstName"] = firstName
    usr_obj["LastName"] = lastName
    usr_obj["Email"] = email
    usr_obj["PhoneNumber"] = phoneNumber
    usr_obj["Password"] = PasswordHash.createHash(newPassword) unless newPassword.nil?
    usr_obj["IsLandlord"] = is_landlord
    usr_obj["IsVerified"] = is_verified
    usr_obj["IsActive"] = is_active
    usr_obj["IsAdmin"] = is_admin_data
    
    query_obj = Hash.new
    query_obj["Username"] = username
    query_obj[key] = userId unless is_admin
    
    ret_msg = ""
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            account = session[:accounts].find(query_obj).to_a
        
            # this is a safe query because it is assumed update_listing.rb is called
            # on an existing account
            if (account[0]["LandlordId"].nil? and is_landlord)
                usr_obj["LandlordId"] = SecureRandom.uuid
            end
            
            session[:accounts].find(query_obj).update('$set' => usr_obj)
        end
    
        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$Email_1"
            ret_msg = "That email is already registered with another user!"
        elsif e.message.include? "enhabit.accounts.$PhoneNumber_1"
            ret_msg = "That phone number is already registered with another user!" 
        end
    end
    
	mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    #we are checking this because it's an optional thing on the UI
    newPassword = data["password"] unless data["password"].nil? and not data["password"].empty? 
    is_landlord = data["islandlord"].to_b unless data["islandlord"].nil? and not data["islandlord"].empty?
    is_verified = data["isverified"].to_b unless data["isverified"].nil? and not data["isverified"].empty?
    is_active = data["isactive"].to_b unless data["isactive"].nil? and not data["isactive"].empty?
    is_admin_data = data["isadmin"].to_b unless data["isadmin"].nil? and not data["isadmin"].empty?
    
    id = ARGV[1]
    key = ARGV[2]
    is_admin = ARGV[3].to_b
    
    puts update_user(is_admin, key, id, is_landlord, is_verified, is_active, is_admin_data, data["username"], data["firstname"], data["lastname"], data["email"], data["phonenumber"], newPassword)
rescue Exception => e
    puts e.inspect
end
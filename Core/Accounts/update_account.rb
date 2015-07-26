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

def update_user(key, uuid, username, firstName, lastName, email, phoneNumber, newPassword)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = username
    usr_obj["FirstName"] = firstName
    usr_obj["LastName"] = lastName
    usr_obj["Email"] = email
    usr_obj["PhoneNumber"] = phoneNumber
    usr_obj["Password"] = PasswordHash.createHash(newPassword) if not newPassword.nil?
 
    query_obj = Hash.new
    query_obj[key] = uuid
    
    ret_msg = ""
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
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
    newPassword = data["password"] if not data["password"].nil? and not data["password"].empty? 
    id = (data["landlordId"].nil? ? data["userId"] : data["landlordId"])
    key = (data["landlordId"].nil? ? "UserId" : "LandlordId")
    
    result = update_user(key, id, data["username"], data["firstname"], data["lastname"], data["email"], data["phonenumber"], newPassword)
    
    puts "#{result}:" + (data["landlordId"].nil? ? "Tenant" : "Landlord") + ":" + id
rescue Exception => e
    puts e.inspect
end
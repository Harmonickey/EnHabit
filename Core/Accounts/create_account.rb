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

def insert_user(user, pass, firstName, lastName, email, phoneNumber)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    #landlords (giving a landlord id) is assigned by admins, or through special portal
    
    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["UserId"] = SecureRandom.uuid
    usr_obj["Password"] = PasswordHash.createHash(pass)
    usr_obj["FirstName"] = firstName
    usr_obj["LastName"] = lastName
    usr_obj["Email"] = email
    usr_obj["PhoneNumber"] = phoneNumber
    usr_obj["IsAdmin"] = false
    usr_obj["IsActive"] = true
    usr_obj["IsVerified"] = true
 
    ret_msg = ""
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            session[:accounts].insert(usr_obj)
        end
        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        if e.message.include? "enhabit.accounts.$Username_1"
            ret_msg = "That username already exists!"
        elsif e.message.include? "enhabit.accounts.$Email_1"
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

    result = insert_user(data["username"], data["password"], data["firstname"], data["lastname"], data["email"], data["phonenumber"])

    puts result
rescue Exception => e
    puts e.inspect
end
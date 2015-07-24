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

def update_user(user, firstName, lastName, email, phoneNumber, newPassword)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["FirstName"] = firstName
    usr_obj["LastName"] = lastName
    usr_obj["Email"] = email
    usr_obj["PhoneNumber"] = phoneNumber
    usr_obj["Password"] = PasswordHash.createHash(newPassword) if not newPassword.nil?
 
    query_obj = Hash.new
    query_obj["Username"] = user
 
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
    username = ARGV[1] if not ARGV[1].nil? and not ARGV[1].empty?
    newPassword = data["password"] if not data["password"].nil? and not data["password"].empty? 
    
    result = update_user(username, data["firstname"], data["lastname"], data["email"], data["phonenumber"], newPassword)

    puts result

rescue Exception => e
    puts e.inspect
end
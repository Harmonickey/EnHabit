#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "../includes"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'

def insert_user(user, pass, fn, ln, em, pn, ac, la, ad)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["Password"] = PasswordHash.createHash(pass)
    usr_obj["FirstName"] = fn
    usr_obj["LastName"] = ln
    usr_obj["Email"] = em
    usr_obj["PhoneNumber"] = pn
    usr_obj["Active"] = (ac == "true")
    usr_obj["Landlord"] = (la == "true")
    usr_obj["IsFacebook"] = false
    usr_obj["IsAdmin"] = (ad == "true")
    #usr_obj["Verified"] = false
 
    document = Hash.new
    
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            session[:accounts].insert(usr_obj)
        end
        mongo_session.with(safe: true) do |session|
            document = session[:accounts].find(usr_obj).first
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

    result = insert_user(data["username"], data["password"], data["firstname"], data["lastname"], data["email"], data["phonenumber"], data["active"], data["landlord"], data["isadmin"])

    puts result.to_json

rescue Exception => e
    puts e.inspect
end
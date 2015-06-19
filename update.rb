#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'

def update_user(user, fn, mi, ln, em, pn)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["FirstName"] = fn
    usr_obj["MiddleInitial"] = mi
    usr_obj["LastName"] = ln
    usr_obj["Email"] = em
    usr_obj["PhoneNumber"] = pn
    #usr_obj["Verified"] = false
 
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
        if e.message.include? "enhabit.accounts.$email_1"
            ret_msg = "That email is already registered with another user!"
        end
    end
	
    return ret_msg
end

begin

    data = JSON.parse(ARGV[0].delete('\\'))

    #ret = get_username_from_session()
    
    raise Exception.new(ret.message) if ret.credentials.nil?
    
    result = update_user(ret.credentials.split(",")[0], data["firstname"], data["middleinitial"], data["lastname"], data["email"], data["phonenumber"])

    puts result

rescue Exception => e
    puts e.inspect
end
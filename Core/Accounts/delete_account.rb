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

def to_boolean(str)
    str == 'true' or str == true
end

def user_exists(user, pass)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    accounts = mongo_session[:accounts]
	
    query = Hash.new
    query["Username"] = user
	
    documents = accounts.find(query).to_a
	mongo_session.disconnect
    if documents.count == 0
        return false
    else
        #bypass password check if facebook account
        return true if to_boolean(documents[0]["IsFacebook"]) 
        
        return PasswordHash.validatePassword(pass, documents[0]["Password"])
    end
end

def delete_user(user)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = user
 
    ret_msg = ""
 
    begin
        mongo_session.with(safe: true) do |session|
            session[:accounts].find(usr_obj).remove
        end
        
        #TODO here we need to do a cascade delete in payments and listings
        
        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e.message
    end
    
    mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    username = ARGV[1]
    #is_landlord = ARGV[2].to_b if not ARGV[2].nil?
    
    if user_exists(username, data["password"])
        puts delete_user(username)
    else
        puts "Incorrect Password"
    end
rescue Exception => e
    puts e.inspect
end
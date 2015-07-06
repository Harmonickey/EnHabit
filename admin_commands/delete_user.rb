#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

def user_exists(id)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    accounts = mongo_session[:accounts]
	
    query_obj = Hash.new
    query_obj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
	
    documents = accounts.find(query_obj).to_a
	mongo_session.disconnect
    
    return (documents.count != 0)
end

def delete_user(id)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["_id"] = Moped::BSON::ObjectId.from_string(id.to_s)
 
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
    
    if user_exists(data["id"])
        puts delete_user(data["id"])
    else
        puts "User does not exist"
    end
rescue Exception => e
    puts e.inspect
end
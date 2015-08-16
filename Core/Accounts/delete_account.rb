#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deployment_base}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'PasswordHash'
require 'tools'

Moped::BSON = BSON

def user_exists(id, key, pass)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    query_obj = Hash.new
    query_obj[key] = (key == "_id" ? Moped::BSON::ObjectId.from_string(id.to_s) : id)
    
    documents = Array.new
    
    ret_val = false
    
    begin
        mongo_session.with(safe: true) do |session|
            documents = session[:accounts].find(query_obj).to_a
        end
        
        if documents.count > 0
            ret_val = PasswordHash.validatePassword(pass, documents[0]["Password"])
        end
        
        mongo_session.disconnect
    end
    
    return ret_val
end

def delete_user(id, key)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    query_obj = Hash.new
    query_obj[key] = (key == "_id" ? Moped::BSON::ObjectId.from_string(id.to_s) : id)
    
    ret_msg = ""
    
    begin
        #delete the user
        mongo_session.with(safe: true) do |session|
            session[:accounts].find(query_obj).remove
        end
        
        #cascade delete the listings associated with the user
        mongo_session.with(safe: true) do |session|
            session[:listings].find(query_obj).remove_all
        end
        
        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e.message
    end
    
    mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    id = ARGV[1]
    key = ARGV[2]
    is_admin = ARGV[3].to_b
    
    # we can only delete other users if we're an admin
    id = data["id"] if not data["id"].nil? and not data["id"].empty? and is_admin
    key = "_id" if is_admin
    
    if user_exists(id, key, data["password"])
        puts delete_user(id, key)
    else
        puts "Incorrect Password"
    end
rescue Exception => e
    puts e.inspect
end
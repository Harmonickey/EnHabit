#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "./Libraries"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'

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
        return PasswordHash.validatePassword(pass, documents[0]["Password"])
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
	
    if user_exists(data["username"], data["password"])
        puts "Okay"
    else
        puts "Incorrect Username/Password"
    end
rescue Exception => e
    puts e.message
end
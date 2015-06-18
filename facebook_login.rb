#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'
require 'securerandom'
require 'date'

def create_user_from_facebook_credentials(user, pass)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["Password"] = pass
    usr_obj["Landlord"] = false
    usr_obj["Email"] = SecureRandom.hex  #just so we can insert it...
    usr_obj["Active"] = true
    #usr_obj["Verified"] = false
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            session[:accounts].insert(usr_obj)
        end
    rescue Moped::Errors::OperationFailure
        #username and email will be guaranteed to be unique
        #if we're here that means we're inserting a user redundantly, no conflict actually
        #do nothing else
    end
end

begin

    data = JSON.parse(ARGV[0].delete('\\'))
	
    #create a user from the facebook credentials if there isn't one already
    create_user_from_facebook_credentials(data["username"], data["password"])
    
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])
    mongo_session.use("enhabit")
    
    randomValue = ""
    while (randomValue == "" or File.exists?(randomValue))
        randomValue = SecureRandom.hex
    end

    cookie_obj = Hash.new
    cookie_obj["cookie"] = randomValue
    cookie_obj["credentials"] = "#{data["username"]},#{data["password"]}"
    cookie_obj["expires"] = (Date.today + 7).to_s
    
    begin
        mongo_session.with(safe: true) do |session|
            session[:cookies].insert(cookie_obj)
        end
    rescue Moped::Errors::OperationFailure => e
        puts e.message
    end

    puts "Okay:#{randomValue}"

rescue Exception => e
    puts e.message
end
#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'

def create_user_from_facebook_credentials(user, pass)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    usr_obj["Username"] = user
    usr_obj["Password"] = pass
    usr_obj["Landlord"] = false
    usr_obj["Email"] = SecureRandom.hex  #just so we can insert it...
    usr_obj["Active"] = true
    usr_obj["IsFacebook"] = true
    #usr_obj["Verified"] = false
 
    ret_msg = ""
 
    #Username has a unique constraint attached, so we want to catch the raised error just in case
    begin
        mongo_session.with(safe: true) do |session|
            session[:accounts].insert(usr_obj)
        end
        ret_msg = "Needs Update"
    rescue Moped::Errors::OperationFailure
        #username and email will be guaranteed to be unique
        #if we're here that means we're inserting a user redundantly
        #do nothing else
        ret_msg = "Okay"
    end
    
    mongo_session.disconnect
    
    return ret_msg
end

begin

    data = JSON.parse(ARGV[0].delete('\\'))
	
    #create a user from the facebook credentials if there isn't one already
    message = create_user_from_facebook_credentials(data["username"], data["password"])

    puts message
rescue Exception => e
    puts e.message
end
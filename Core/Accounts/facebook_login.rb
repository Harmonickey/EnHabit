#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'

def create_user_from_facebook_credentials(fbUserId, pass)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    usr_obj = Hash.new
    # since usernames need to be unique and recognizable in the javascript later
    usr_obj["Username"] = SecureRandom.hex.to_s + "Facebook" 
    usr_obj["FacebookId"] = fbUserId
    usr_obj["Password"] = pass
    usr_obj["Landlord"] = false
    # since emails need to be unique
    usr_obj["Email"] = SecureRandom.hex
    usr_obj["Active"] = true
    usr_obj["IsAdmin"] = false
    usr_obj["IsFacebook"] = true
    usr_obj["Verified"] = true # TODO: email verification
 
    query_obj = Hash.new
    query_obj["FacebookId"] = fbUserId
 
    documents = Array.new
    ret_msg = ""
 
    mongo_session.with(safe: true) do |session|
        documents = session[:accounts].find(query_obj).to_a
    end
    
    if documents.count == 0 # no users yet, create it automatically
        mongo_session.with(safe: true) do |session|
            session[:accounts].insert(usr_obj)
        end
        ret_msg = "Okay:Created"
    else
        if documents[0]["Landlord"] == true
            ret_msg = "Okay:Landlord"
        else
            ret_msg = "Okay:Tenant"
        end
    end
    
    mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
	
    #create a user from the facebook credentials if there isn't one already
    puts create_user_from_facebook_credentials(data["username"], data["password"])
rescue Exception => e
    puts e.message
end
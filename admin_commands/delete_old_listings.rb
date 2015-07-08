#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'bson'
require 'moped'

def delete_old_listings()
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database
    
    # get the object hex that stands for one year ago in seconds
    yearAgoHex = (Time.now - 31556900).strftime('%s').to_i.to_s(16) + "0000000000000000"
    
    # create the mongo ObjectId from our hex string
    timestamp = Moped::BSON::ObjectId.from_string(yearAgoHex)
    
    ret_msg = ""
 
    begin
        # this will remove all documents in the collection that are older than one year
        mongo_session.with(safe: true) do |session|
            session[:listings].find("_id" => {"$lt" => timestamp}).remove_all
        end

        ret_msg = "Okay"
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e.message
    end
    
    mongo_session.disconnect
    return ret_msg
end

begin
    result = delete_old_listings
    
    puts result
rescue Exception => e
    puts e.inspect
end
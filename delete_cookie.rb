#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'

begin
    data = JSON.parse(ARGV[0].delete('\\'))

    entryname = data["entryname"]
	
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    cookie_obj = Hash.new
    cookie_obj["cookie"] = entryname
	
    ret_msg = ""
    begin
        mongo_session.with(safe: true) do |session|
            session[:cookies].find(cookie_obj).remove
        end
        ret_msg = 1
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e.message
    end
	
    puts ret_msg
	
rescue Exception => e
    puts e.message
end

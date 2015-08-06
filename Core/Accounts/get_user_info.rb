#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'moped'
require 'bson'
require 'json'

def get_user_info(id, key)
    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database
    
    ret_msg = Hash.new
    
    documents = Array.new
    
    query_obj = Hash.new
    query_obj[key] = id
    
    begin
        mongo_session.with(safe: true) do |session|
            documents = session[:accounts].find(query_obj).select(_id: 1, Username: 1, FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).to_a
            ret_msg = documents[0]
        end
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e
    end
    
	mongo_session.disconnect
    
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
    id = ARGV[1];
    key = ARGV[2];
    
    result = get_user_info(id, key)

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
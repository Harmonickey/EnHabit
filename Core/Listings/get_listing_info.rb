#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

def GetListingInfo(oid)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) 
    mongoSession.use("enhabit")

    listingObj = Hash.new
    listingObj["_id"] = Moped::BSON::ObjectId.from_string(oid.to_s)
    
    retMsg = Hash.new
 
    begin
        mongoSession.with(safe: true) do |session|
            documents = session[:listings].find(listingObj).to_a
            retMsg = documents[0]
        end
    rescue Moped::Errors::OperationFailure => e
        retMsg = e
    end
    
	mongoSession.disconnect
    return retMsg
end

begin
    data = JSON.parse(ARGV[0].delete('\\')) unless ARGV[0].empty?
 
    result = GetListingInfo(data["oid"])

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
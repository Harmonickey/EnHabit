#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'moped'
require 'bson'
require 'json'

def GetUserInfo(id, key)
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongoSession.use("enhabit")# this is our current database
    
    retMsg = Hash.new
    
    documents = Array.new
    
    queryObj = Hash.new
    queryObj[key] = id
    
    begin
        mongoSession.with(safe: true) do |session|
            documents = session[:accounts].find(queryObj).select(_id: 1, Username: 1, FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).to_a
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
    id = ARGV[1].split(",")[0] unless ARGV[1].empty?
    key = ARGV[2] unless ARGV[2].empty?
    
    result = GetUserInfo(id, key)

    puts result.to_json
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
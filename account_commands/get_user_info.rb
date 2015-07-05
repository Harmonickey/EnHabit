#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'moped'
require 'bson'
require 'json'

user = ARGV[0]

begin

    mongo_session = Moped::Session.new(['127.0.0.1:27017'])# our mongo database is local
    mongo_session.use("enhabit")# this is our current database

    document = Hash.new
    
    mongo_session.with(safe: true) do |session|
        document = session[:accounts].find({"Username" => user}).select(_id: 0, Username: 1, FirstName: 1, LastName: 1, Email: 1, PhoneNumber: 1).first
    end
    mongo_session.disconnect

    if document.nil? or document == {}
        puts "Could Not Find User."
    else
        result_data = Hash.new
        result_data["data"] = document
        puts result_data.to_json
    end

rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end

    puts "Error: #{e.message}"
end
#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'

data = JSON.parse(ARGV[0].delete('\\'))

def insert_user(user, pass, fn, mi, ln)

	mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

	usr_obj = Hash.new
	usr_obj["Username"] = user
	usr_obj["Password"] = PasswordHash.createHash(pass)
	usr_obj["FirstName"] = fn
	usr_obj["MiddleInitial"] = mi
	usr_obj["LastName"] = ln
 
    ret_msg = ""
 
	#Username has a unique constraint attached, so we want to catch the raised error just in case
	begin
		mongo_session.with(safe: true) do |session|
			session[:accounts].insert(usr_obj)
		end
		ret_msg = "Okay"
	rescue Moped::Errors::OperationFailure => e
		ret_msg = "That username already exists!"
	end
	
	return ret_msg
end

result = insert_user(data["username"], data["password"], data["firstname"], data["middleinitial"], data["lastname"])

puts result
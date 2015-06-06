#!/usr/bin/ruby

$:.push("/home2/lbkstud1/ruby/gems")

require 'sinatra'
require 'sinatra/json'
require 'moped'
require 'bson'

set :port, 8081 # test.lbkstudios.net:8081
set :environment, :production # set to production so that we can make calls to it from the outside

get '/' do

  begin
	
	mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
	mongo_session.use("enhabit") # this is our current database
	
# example section for getting data using the find() function section
#	accounts = mongo_session[:accounts] # accounts collection
#	documents = accounts.find(:address => address).to_a  # find all address that match
#	mongo_session.disconnect

	if documents.count == 0
	  json :error => "No account number for #{address}.  If this is in error, try another standard spelling of your address."
	else
	  #p documents[0]["accountNumber"] # I only want the first matching document (row)
	  #son :accountNumber => documents[0]["accountNumber"]  #this statement returns back to ajax callee
	end
	  
  rescue Exception => e
    File.open("error.log", "a") do |output|
	  output.puts e.message
	  output.puts e.backtrace.inspect
	end
	
	json :error => "An internal error has occured.  "
  end
end



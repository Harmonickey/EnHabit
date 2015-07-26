#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deployment_base}/Libraries"

require 'json'
require 'moped'
require 'bson'
require 'PasswordHash'

@is_landlord = false

def user_exists(user, pass)

    mongo_session = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongo_session.use("enhabit") # this is our current database

    accounts = mongo_session[:accounts]
	
    query = Hash.new
    query["Username"] = user
	
    documents = accounts.find(query).to_a
    mongo_session.disconnect
    if documents.count == 0
        return false
    else
        # if you have a landlord ID then they're obviously a landlord
        @is_landlord = true if not documents[0]["LandlordId"].nil?
        id = (@is_landlord ? documents[0]["LandlordId"] : documents[0]["UserId"])
        return {"exists" => PasswordHash.validatePassword(pass, documents[0]["Password"]), "id" => id}
    end
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))
	
    result = user_exists(data["username"], data["password"])
    
    if result["exists"]
        puts (@is_landlord ? "Okay:Landlord:" : "Okay:Tenant:") + result["id"]
    else
        puts "Incorrect Username/Password"
    end
rescue Exception => e
    puts e.message
end
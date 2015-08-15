#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
@deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deployment_base}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'tools'

Moped::BSON = BSON

def delete_listing(is_admin, oid, id, key)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) 
    mongo_session.use("enhabit")

    listing_obj = Hash.new
    listing_obj["_id"] = Moped::BSON::ObjectId.from_string(oid.to_s)
    
    ret_msg = ""
 
    begin
        mongo_session.with(safe: true) do |session|
            documents = session[:listings].find(listing_obj).to_a
            
            #make sure we're not deleting someone else's listing
            if documents[0][key] == id or is_admin
                listing = session[:listings].find(listing_obj).select(Pictures: 1).one
                listing["Pictures"].each do |pic|
                    filename = "#{@deployment_base}/../images/enhabit/images/" + pic
                    File.delete(filename) if File.exist? filename
                end
                session[:listings].find(listing_obj).remove
                ret_msg = "Okay"
            else
                ret_msg = "Unable to delete other user's listing"
            end
        end
    rescue Moped::Errors::OperationFailure => e
        ret_msg = e.message
    end
    
    mongo_session.disconnect
    return ret_msg
end

begin
    data = JSON.parse(ARGV[0].delete('\\'))  
    id = ARGV[1]
    key = ARGV[2]
    is_admin = ARGV[3].to_b
    
    puts delete_listing(is_admin, data["oid"], id, key)
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    puts e.inspect
end
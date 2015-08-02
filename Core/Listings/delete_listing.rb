#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

abs_path = Dir.pwd
base = abs_path.split("/").index("public_html")
@deployment_base = abs_path.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

require 'json'
require 'bson'
require 'moped'

Moped::BSON = BSON

def delete_listing(objectId, id, key)
    mongo_session = Moped::Session.new(['127.0.0.1:27017']) 
    mongo_session.use("enhabit")

    listing_obj = Hash.new
    listing_obj["_id"] = Moped::BSON::ObjectId.from_string(objectId.to_s)
    
    ret_msg = ""
 
    begin
        mongo_session.with(safe: true) do |session|
            documents = session[:listings].find(listing_obj).to_a
            
            #make sure we're not deleting someone else's listing
            if documents[0][key] == id
                listing = session[:listings].find(listing_obj).select(Pictures: 1).one
                listing["Pictures"].each do |pic|
                    filename = "#{@deployment_base}/assets/images/listing_images/" + pic
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
    
    id = (data["landlordId"].nil? ? data["userId"] : data["landlordId"])
    key = (data["landlordId"].nil? ? "UserId" : "LandlordId")
    
    result = delete_listing(data["id"], id, key)

    puts result
rescue Exception => e
    File.open("error.log", "a") do |output|
        output.puts e.message
        output.puts e.backtrace.inspect
    end
    puts e.inspect
end
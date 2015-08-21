#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'

def GetPriceRange()
    mongoSession = Moped::Session.new(['127.0.0.1:27017'])
    mongoSession.use("enhabit")

    document = {:MinRent => 0, :MaxRent => 0}
    
    mongoSession.with(safe: true) do |session|
        document[:MinRent] = session[:listings].find().sort({"Price" => 1}).limit(1).select("_id" => 0, "Price" => 1).one
        document[:MaxRent] = session[:listings].find().sort({"Price" => -1}).limit(1).select("_id" => 0, "Price" => 1).one
    end
    
    return document.to_json
end

puts GetPriceRange()
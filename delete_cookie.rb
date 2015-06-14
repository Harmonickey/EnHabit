#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"
$: << "."

require 'json'

begin
	data = JSON.parse(ARGV[0].delete('\\'))

	filename = data["filename"]

	if File.exists?(filename)

		File.open(filename, "r") do |file|
			line = file.readline
			if line.include? "cookie"  #only delete the file if the first line includes 'cookie'
				puts File.delete(filename)
			end
		end
	else
		puts 0
	end
rescue Exception => e
	puts e.message
end

#!/usr/local/bin/ruby

require 'net/http'

@to = ARGV[0]
@message = ARGV[1]
@name = ARGV[2]
@listing = ARGV[3]
@from = ARGV[4]
@phone = ARGV[5] if not ARGV[5].nil?

data = {'to' => @to, 'message' => @message, 'name' => @name, 'listing' => @listing, 'from' => @from, 'phone' => @phone}

postData = Net::HTTP.post_form(URI.parse('http://lbkstudios.net/sendmail_enhabit.php'), data)

puts postData.body


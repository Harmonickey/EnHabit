#!/usr/local/bin/ruby

require 'net/http'

@to = ARGV[0]
@message = ARGV[1]
@listing = ARGV[2]
@from = ARGV[3]
@phone = ARGV[4] if not ARGV[4].nil?

data = {'to' => @to, 'message' => @message, 'listing' => @listing, 'from' => @from, 'phone' => @phone}

postData = Net::HTTP.post_form(URI.parse('http://lbkstudios.net/sendmail_enhabit.php'), data)

puts postData.body


#!/usr/local/bin/ruby

require 'net/http'

@to = ARGV[0]
@message = ARGV[1]
<<<<<<< HEAD
<<<<<<< HEAD
@listing = ARGV[2]
@from = ARGV[3]
@phone = ARGV[4] if not ARGV[4].nil?

data = {'to' => @to, 'message' => @message, 'listing' => @listing, 'from' => @from, 'phone' => @phone}
=======
@name = ARGV[2]
@listing = ARGV[3]
@from = ARGV[4]
@phone = ARGV[5] if not ARGV[5].nil?

data = {'to' => @to, 'message' => @message, 'name' => @name, 'listing' => @listing, 'from' => @from, 'phone' => @phone}
>>>>>>> b4c5756... 107 emailing
=======
@listing = ARGV[2]
@from = ARGV[3]
@phone = ARGV[4] if not ARGV[4].nil?

data = {'to' => @to, 'message' => @message, 'listing' => @listing, 'from' => @from, 'phone' => @phone}
>>>>>>> d026abd... 132 border radiuses, contact, no apply

postData = Net::HTTP.post_form(URI.parse('http://lbkstudios.net/sendmail_enhabit.php'), data)

puts postData.body


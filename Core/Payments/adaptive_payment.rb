#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'net/http'
require 'json'

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@rent = @data["Rent"]
@landlord = @data["LandlordEmail"]
<<<<<<< HEAD
<<<<<<< HEAD
@memo = "Rent payment for: " + @data["Address"] + " Unit:" + @data["Unit"]
<<<<<<< HEAD
<<<<<<< HEAD
@enhabit = "alex@lbkstudios.net"
=======
@uid = @data["_id"]["$oid"]
=======
@uid = @data["_id"]["oid"]
>>>>>>> 56fbc5c... 127 small  oid fix
@enhabit = "marcel@lbkstudios.net"
>>>>>>> 7f6a3f3... 127 payments tracking
=======
@memo = @data["Memo"] + "\n\nRent payment for: " + @data["Address"] + " Unit:" + @data["Unit"]
=======
@memo = @data["Memo"] + " -- Rent payment for: " + @data["Address"] + " Unit:" + @data["Unit"]
>>>>>>> daa50ba... 130 fix
@enhabit = "alex@lbkstudios.net"
@uid = @data["_id"]["oid"]
>>>>>>> f438910... 130 memo

@isDev = `cat #{@deploymentBase}/enhabit.git/hooks/post-receive`.split("\n")[4].split(" ")[-2].include? 'dev'

@returnLocation = @isDev ? "dev." : ""

@uri = URI('https://svcs.paypal.com/AdaptivePayments/Pay')

@markup = @data["ListingMarkup"]

@receiverList = []
<<<<<<< HEAD
#enhabit gets the full rent amount and markup
@receiverList.push '{\"amount\":\"' + (@markup.to_f + @rent.to_f).to_s + '\", \"email\":\"' + @landlord.to_s + '\", \"primary\":\"true\"}'
#landlord gets the full rent amount
<<<<<<< HEAD
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @landlord.to_s + '\", \"primary\":\"false\"}'

<<<<<<< HEAD
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife.com/tenant/payments/success\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"PRIMARYRECEIVER\"}'
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/?uid=' + @uid + '&landlordEmail=' + @landlord + '&rent=' + @rent +'\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\"}'
>>>>>>> 7f6a3f3... 127 payments tracking
=======
#enhabit gets markup
@receiverList.push '{\"amount\":\"' + @markup.to_s + '\", \"email\":\"' + @enhabit.to_s + '\"}'
#landlord gets rent
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @landlord.to_s + '\"}'

params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/?uid=' + @uid + '&landlordEmail=' + @landlord + '&rent=' + @rent + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\"}'
>>>>>>> 56fbc5c... 127 small  oid fix
=======
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @enhabit.to_s + '\", \"primary\":\"false\"}'

<<<<<<< HEAD
<<<<<<< HEAD
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/?uid=' + @uid + '&landlordEmail=' + @landlord + '&rent=' + @rent + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"SECONDARYRECEIVER\"}'
>>>>>>> d9f205a... 121 better ux
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/?uid=' + @uid + '&landlordEmail=' + @landlord + '&rent=' + @rent + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"SECONDARYONLY\"}'
>>>>>>> a088d13... 121 fix for param
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/?uid=' + @uid + '&landlordEmail=' + @landlord + '&rent=' + @rent + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"PRIMARYRECEIVER\"}'
>>>>>>> daa50ba... 130 fix

req = Hash.new
req['X-PAYPAL-SECURITY-USERID'] = 'alex_api1.lbkstudios.net'
req['X-PAYPAL-SECURITY-PASSWORD'] = 'DVWC6FTKRG7WYWFY'
req['X-PAYPAL-SECURITY-SIGNATURE'] = 'AWjlrRdzrtV5-PSI427csM4fUlCsA3Y.solWILTwvYm8VyPRKVxsqXFZ'

# Global Sandbox Application ID
req['X-PAYPAL-APPLICATION-ID'] = 'APP-1NM10749ND821735L'

# Input and output formats
req['X-PAYPAL-REQUEST-DATA-FORMAT'] = 'JSON'
req['X-PAYPAL-RESPONSE-DATA-FORMAT'] =  'JSON'

headers = ""

req.each do |key, value|
  headers += "-H \"#{key.chomp}: #{value.chomp}\" "
end

res = `curl -s #{headers}#{@uri.to_s} -d \"#{params}\"`

puts JSON.parse(res).to_json

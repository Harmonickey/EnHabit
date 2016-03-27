#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'net/http'
<<<<<<< HEAD
<<<<<<< HEAD
require 'json'
require 'moped'
require 'bson'

def GetMarkup()

    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    pricing = Array.new
    
    begin    
        mongoSession.with(safe: true) do |session|
            university = session[:universities].find({"UniversityName" => "Northwestern"}).select(UniversityId: 1).to_a
        
            pricing = session[:pricing].find({"UniversityId" => university[0]["UniversityId"]}).select(ListingMarkup: 1).to_a
        end       
        
        retVal = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retVal = e
    end
    
	mongoSession.disconnect
    #return ((pricing[0]["ListingMarkup"]).to_f / 100) * rent.to_f
    return pricing[0]["ListingMarkup"].to_f
end

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

<<<<<<< HEAD
@rent = @data["Rent"]
@landlord = @data["LandlordEmail"]
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
>>>>>>> daa50ba... 130 fix
@enhabit = "alex@lbkstudios.net"
<<<<<<< HEAD
@uid = @data["_id"]["oid"]
>>>>>>> f438910... 130 memo
=======
=======
=======
@rent = @data["Rent"]
@landlord = @data["LandlordEmail"]
>>>>>>> ac2e3fc... 132 final changes for lease stuff and payment stuff
@enhabit = "enhabitlife@gmail.com"
>>>>>>> 7252721... 121 add actual enhabit user
@uid = @data["_id"]["oid"] if not @data["_id"].nil? and not @data["_id"]["oid"].nil?
>>>>>>> f1f855f... 121 adapt

@isDev = `cat #{@deploymentBase}/enhabit.git/hooks/post-receive`.split("\n")[4].split(" ")[-2].include? 'dev'

@returnLocation = @isDev ? "dev." : ""

@uri = URI('https://svcs.paypal.com/AdaptivePayments/Pay')

@markup = @data["ListingMarkup"]

if @markup.nil?
  @markup = GetMarkup()
end

@markupTotal = (@markup / 100) * @rent.to_f

@memo = @markup.to_s + "% Enhabit Convenience Charge. 2.9% PayPal Credit Card Processing Fee.\\r\\n" + @data["Memo"] + " -- \\r\\nRent payment for: " + @data["Address"] + " Unit: " + @data["Unit"]

@receiverList = []
<<<<<<< HEAD
<<<<<<< HEAD
#enhabit gets the full rent amount and markup
@receiverList.push '{\"amount\":\"' + (@markup.to_f).to_s + '\", \"email\":\"' + @landlord.to_s + '\", \"primary\":\"false\"}'
#landlord gets the full rent amount
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @enhabit.to_s + '\"}'
>>>>>>> 56c92b4... 121 omit the false
=======
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @enhabit.to_s + '\", \"primary\":\"true\"}'
>>>>>>> 9494f64... 121 updated more
=======
#enhabit gets the markup amount
@receiverList.push '{\"amount\":\"' + @markupTotal.to_s + '\", \"email\":\"' + @enhabit.to_s + '\", \"primary\":\"false\"}'
#landlord gets the rent plus markup amount
<<<<<<< HEAD
@receiverList.push '{\"amount\":\"' + (@rent.to_f + @markup).to_s + '\",\"email\":\"' + @landlord.to_s + '\", \"primary\":\"true\"}'
>>>>>>> 7f47e16... 121 minor changes
=======
@receiverList.push '{\"amount\":\"' + (@rent.to_f + @markupTotal ).to_s + '\",\"email\":\"' + @landlord.to_s + '\", \"primary\":\"true\"}'
>>>>>>> ac2e3fc... 132 final changes for lease stuff and payment stuff

@successUri = '?landlordEmail=' + @landlord + '&rent=' + @rent + (@uid.nil? ? '' : '&uid=' + @uid)

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"SECONDARYONLY\"}'
>>>>>>> f1f855f... 121 adapt
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife.com/tenant/payments/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"SECONDARYONLY\"}'
>>>>>>> d9faf3c... 121 needed .com

File.open("output.log", "a") do |output|
    output.puts "[" + DateTime.now.to_s + "] " + params.inspect
end

req = Hash.new
req['X-PAYPAL-SECURITY-USERID'] = 'enhabitlife_api1.gmail.com'
req['X-PAYPAL-SECURITY-PASSWORD'] = 'NJ3DJWL7B794Q8BJ'
req['X-PAYPAL-SECURITY-SIGNATURE'] = 'AMCv3slS9yBuKOniN2ij3Mh1fAG1A7koo8NHz0My20EiyPBHmfWBa.pT'

# Live App ID
req['X-PAYPAL-APPLICATION-ID'] = 'APP-47R179153P103222T'

# Input and output formats
req['X-PAYPAL-REQUEST-DATA-FORMAT'] = 'JSON'
req['X-PAYPAL-RESPONSE-DATA-FORMAT'] =  'JSON'

headers = ""

req.each do |key, value|
  headers += "-H \"#{key.chomp}: #{value.chomp}\" "
end

res = `curl -s #{headers}#{@uri.to_s} -d \"#{params}\"`

puts JSON.parse(res).to_json
=======
=======
require 'json'
>>>>>>> 1c14a45... 107 return payment object

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@rent = @data["Rent"]
<<<<<<< HEAD
@recipient = @data["Recipient"]

@uri = URI('https://svcs.sandbox.paypal.com/AdaptivePayments/Pay')

params =
{
    "actionType" => "PAY",    # Specify the payment action
    "currencyCode" => "USD",  # The currency of the payment
    "receiverList" => {
        "receiver" => [{
            "amount" => @rent,    # The payment amount
            "email" => @recipient # The payment Receiver's email address
        }]  
    },

    # Where the Sender is redirected to after approving a successful payment
    "returnUrl" => "http://dev.enhabitlife.com/paymentSuccess",

    # Where the Sender is redirected to upon a canceled payment
    "cancelUrl" => "http://dev.enhabitlife.com/paymentCancelled",
    "requestEnvelope" => {
        "errorLanguage" => "en_US",    # Language used to display errors
        "detailLevel" => "ReturnAll"   # Error detail level
    }
}

@uri.query = URI.encode_www_form(params)

res = Net::HTTP.start(@uri, @uri) {|http|

  req = Net::HTTP::Get.new(@uri.query)
  req['X-PAYPAL-SECURITY-USERID'] = 'alex_api1.lbkstudios.net'
  req['X-PAYPAL-SECURITY-PASSWORD'] =  'G83KPXZFF7WJ79RH'
  req['X-PAYPAL-SECURITY-SIGNATURE'] = 'AzoDVGfo-Olt0X8dTEvq7my6ZsJoAYm67DkUBc8AHYKxQnhq0pIfIsEt'

<<<<<<< HEAD
res = Net::HTTP.start(@uri.hostname, @uri.port) {|http|
  http.request(req)
<<<<<<< HEAD
}
>>>>>>> 1a55107... 107 adaptive payments
=======
}
=======
  # Global Sandbox Application ID
  req['X-PAYPAL-APPLICATION-ID'] = 'APP-80W284485P519543T'
>>>>>>> 447ded3... 107 new way to do it

  # Input and output formats
  req['X-PAYPAL-REQUEST-DATA-FORMAT'] = 'JSON'
  req['X-PAYPAL-RESPONSE-DATA-FORMAT'] =  'JSON'

<<<<<<< HEAD
puts app_result.to_json
>>>>>>> 1c14a45... 107 return payment object
=======
  response = http.request(req)
  
  puts response
}
>>>>>>> 447ded3... 107 new way to do it
=======
@recipient = @data["LandlordEmail"]
=======
@enhabit = "alex@lbkstudios.net"
>>>>>>> 2b66c1e... 117 modify payment center
=======
@memo = "Rent payment for: " + @data["Address"] + " Unit:" + @data["Unit"]
@enhabit = "marcel@lbkstudios.net"
>>>>>>> b385d93... 117 memo added!

@isDev = `cat #{@deploymentBase}/enhabit.git/hooks/post-receive`.split("\n")[4].split(" ")[-2].include? 'dev'

@returnLocation = @isDev ? "dev." : ""

@uri = URI('https://svcs.paypal.com/AdaptivePayments/Pay')

@markup = @data["ListingMarkup"]

@receiverList = []
#enhabit gets markup
@receiverList.push '{\"amount\":\"' + @markup.to_s + '\", \"email\":\"' + @enhabit.to_s + '\"}'
#landlord gets rent
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @landlord.to_s + '\"}'

params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\"}'

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

<<<<<<< HEAD
puts JSON.parse(res)
>>>>>>> 28b14d3... 107 finally got the request working
=======
puts JSON.parse(res).to_json
>>>>>>> a1b5329... 107 payment key

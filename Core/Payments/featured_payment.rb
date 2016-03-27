#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'net/http'
require 'json'
require 'moped'
require 'bson'

<<<<<<< HEAD
<<<<<<< HEAD
Moped::BSON = BSON

=======
>>>>>>> 1893860... 116 featured listings
=======
Moped::BSON = BSON

>>>>>>> 38e0b4c... 116 fixed searching
def GetLandlordEmail(oid)
    mongoSession = Moped::Session.new(['127.0.0.1:27017']) # our mongo database is local
    mongoSession.use("enhabit") # this is our current database

    landlord = Hash.new
    
    begin    
        mongoSession.with(safe: true) do |session|
        
            listingQueryObj = Hash.new
            listingQueryObj["_id"] = Moped::BSON::ObjectId.from_string(oid.to_s)
<<<<<<< HEAD
<<<<<<< HEAD
            
            listing = session[:listings].find(listingQueryObj).select(LandlordId: 1).one
            
            landlordQueryObj = Hash.new
            landlordQueryObj["LandlordId"] = listing["LandlordId"]
            
=======
        
=======
            
>>>>>>> 38e0b4c... 116 fixed searching
            listing = session[:listings].find(listingQueryObj).select(LandlordId: 1).one
            
            landlordQueryObj = Hash.new
<<<<<<< HEAD
            landlordQueryObj["UserId"] = listing["LandlordId"]
        
>>>>>>> 1893860... 116 featured listings
=======
            landlordQueryObj["LandlordId"] = listing["LandlordId"]
            
>>>>>>> 38e0b4c... 116 fixed searching
            landlord = session[:accounts].find(landlordQueryObj).select(Email: 1).one
        end       
        
        retVal = "Okay"
    rescue Moped::Errors::OperationFailure => e
        retVal = e
    end
    
	mongoSession.disconnect
    return landlord["Email"]
end

<<<<<<< HEAD
<<<<<<< HEAD
@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@enhabit = "enhabitlife@gmail.com"
@oid = @data["oid"] if not @data["oid"].nil?

@landlord = GetLandlordEmail(@oid)
=======
@enhabit = "enhabitlife@gmail.com"
@oid = @data["oid"] if not @data["oid"].nil?

@landlord = GetLandlordEmail(@oid)
>>>>>>> 1893860... 116 featured listings
=======
@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@enhabit = "enhabitlife@gmail.com"
@oid = @data["oid"] if not @data["oid"].nil?

@landlord = GetLandlordEmail(@oid)
>>>>>>> 38e0b4c... 116 fixed searching

@isDev = `cat #{@deploymentBase}/enhabit.git/hooks/post-receive`.split("\n")[4].split(" ")[-2].include? 'dev'

@returnLocation = @isDev ? "dev." : ""

@uri = URI('https://svcs.paypal.com/AdaptivePayments/Pay')

@memo = "Featured Listing Payment"

@receiverList = []
#enhabit gets the markup amount
@receiverList.push '{\"amount\":\"20\", \"email\":\"' + @enhabit.to_s + '\"}'
#landlord gets the rent plus markup amount

@successUri = '?landlordEmail=' + @landlord + '&amount=20&oid=' + @oid

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife.com/landlord/listings/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/landlord/listings/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\"}'
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife.com/landlord/listings/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/listings/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"SECONDARYONLY\"}'
>>>>>>> 1893860... 116 featured listings
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife.com/landlord/listings/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/listings/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\"}'
>>>>>>> cb8b4ef... 116 fixed pay key
=======
params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife.com/landlord/listings/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/landlord/listings/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\"}'
>>>>>>> da9c88b... 116 update to featured

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

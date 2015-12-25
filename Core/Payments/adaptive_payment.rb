#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'net/http'
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
    return pricing[0]["ListingMarkup"]
end

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@rent = @data["Rent"]
@landlord = @data["LandlordEmail"]
@memo = @data["Memo"] + " -- Rent payment for: " + @data["Address"] + " Unit:" + @data["Unit"]
@enhabit = "enhabitlife@gmail.com"
@uid = @data["_id"]["oid"] if not @data["_id"].nil? and not @data["_id"]["oid"].nil?

@isDev = `cat #{@deploymentBase}/enhabit.git/hooks/post-receive`.split("\n")[4].split(" ")[-2].include? 'dev'

@returnLocation = @isDev ? "dev." : ""

@uri = URI('https://svcs.paypal.com/AdaptivePayments/Pay')

@markup = @data["ListingMarkup"]

if @markup.nil?
  @markup = GetMarkup()
end

@receiverList = []
#enhabit gets the full rent amount and markup
@receiverList.push '{\"amount\":\"' + (@markup.to_f + @rent.to_f).to_s + '\", \"email\":\"' + @landlord.to_s + '\", \"primary\":\"true\"}'
#landlord gets the full rent amount
@receiverList.push '{\"amount\":\"' + @rent.to_s + '\",\"email\":\"' + @enhabit.to_s + '\"}'

@successUri = '?landlordEmail=' + @landlord + '&rent=' + @rent + (@uid.nil? ? '' : '&uid=' + @uid)

params = '{\"actionType\":\"PAY\", \"currencyCode\":\"USD\", \"receiverList\":{\"receiver\":[' + @receiverList.join(",") + ']}, \"returnUrl\":\"http://' + @returnLocation +'enhabitlife/tenant/payments/success/' + @successUri + '\", \"cancelUrl\":\"http://' + @returnLocation + 'enhabitlife.com/tenant/payments/failure/\", \"requestEnvelope\":{\"errorLanguage\":\"en_US\", \"detailLevel\":\"ReturnAll\"}, \"memo\":\"' + @memo + '\", \"feesPayer\":\"SECONDARYONLY\"}'

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

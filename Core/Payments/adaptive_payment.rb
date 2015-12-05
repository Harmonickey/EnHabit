#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'net/http'
require 'json'

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@rent = @data["Rent"]
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

req = Net::HTTP::Get.new(@uri)
req['X-PAYPAL-SECURITY-USERID'] = 'alex_api1.lbkstudios.net'
req['X-PAYPAL-SECURITY-PASSWORD'] =  'G83KPXZFF7WJ79RH'
req['X-PAYPAL-SECURITY-SIGNATURE'] = 'AzoDVGfo-Olt0X8dTEvq7my6ZsJoAYm67DkUBc8AHYKxQnhq0pIfIsEt'

# Global Sandbox Application ID
req['X-PAYPAL-APPLICATION-ID'] = 'APP-80W284485P519543T'

# Input and output formats
req['X-PAYPAL-REQUEST-DATA-FORMAT'] = 'JSON'
req['X-PAYPAL-RESPONSE-DATA-FORMAT'] =  'JSON'

res = Net::HTTP.start(@uri.hostname, @uri.port) {|http|
  http.request(req)
}

app_result = Hash.new
app_result["PayKey"] = res

puts app_result.to_json
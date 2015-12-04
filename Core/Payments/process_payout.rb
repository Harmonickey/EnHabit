#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'securerandom'
require 'paypal-sdk-rest'

include PayPal::SDK::REST

ctx = OpenSSL::SSL::SSLContext.new
ctx.ssl_version = :TLSv1

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@api = PayPal::SDK::REST.set_config(
    :ssl_options => { ssl_version: :TLSv1 }, # Set ssl options
    :mode => :live,  # Set :sandbox or :live
    :client_id     => "AejUVAu1yU3aCU9fRaNQk6D7HdKn-dQAUm5YZRxKW_TNENRwqAVan2EWGkhZXFTsSButt66LmJbNclc4",
    :client_secret => "ECpvxnmfDmTK4lk39s6em0TpGxtVqVtC8o5C0E6YHxAbf6jbgrjIJNlUiriXDatSq6enxTOzNBLCmoeH" )

@month = @data["Month"]
@rent = @data["Rent"]

@payout = Payout.new(
  {
    :sender_batch_header => {
      :sender_batch_id => SecureRandom.hex(8),
      :email_subject => @data["Description"],
    },
    :items => [
      {
        :recipient_type => 'EMAIL',
        :amount => {
          :value => @rent,
          :currency => 'USD'
        },
        :note => "Payment for #{@month}'s Rent",
        :receiver => @data["Email"],
        :sender_item_id => SecureRandom.hex(8),
      }
    ]
  }
)

begin
  @payout_batch = @payout.create
  puts "Created Payout with [#{@payout_batch.batch_header.payout_batch_id}]"
rescue ResourceNotFound => err
  puts @payout.error.inspect
end

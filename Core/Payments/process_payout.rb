#!/usr/bin/ruby

ENV["GEM_HOME"] = "/home2/lbkstud1/ruby/gems" if ENV["GEM_HOME"].nil?
ENV["GEM_PATH"] = "/home2/lbkstud1/ruby/gems:/lib/ruby/gems/1.9.3" if ENV["GEM_PATH"].nil?

$: << "/home2/lbkstud1/ruby/gems"

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'securerandom'
require 'paypal-sdk-rest'

include PayPal::SDK::REST

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@api = PayPal::SDK::REST.set_config(
    :ssl_options => {}, # Set ssl options
    :mode => :sandbox,  # Set :sandbox or :live
    :client_id     => "AWLNvp25Gv70ELGi8ssjeB6XCiikBPGT_-Y0Sxjk2RFY7Elc4lWidqPGDsRLJcrOTFWeLkxVqY5sb1dV",
    :client_secret => "EPwW3Clo9KQZgOeuWVgFY_q1jlKxpnAoFWMJDLxUUJ8nn3Z91XuQ6nN5AkBWy0JoGDxsLztc5AgdZoMI" )

@month = @data["Month"]
#@rent = @data["Rent"]
@rent = 0.01 #just for now
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
  logger.info "Created Payout with [#{@payout_batch.batch_header.payout_batch_id}]"
rescue ResourceNotFound => err
  logger.error @payout.error.inspect
end
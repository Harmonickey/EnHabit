#!/usr/local/bin/ruby^M


absPath = Dir.pwd
base = absPath.split("/").index("public_html")
@deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{@deploymentBase}/Libraries"

require 'json'
require 'bson'
require 'moped'
require 'mongoid'
require 'paypal-sdk-rest'

include PayPal::SDK::REST

@data = JSON.parse(ARGV[0].delete('\\')) if not ARGV[0].nil? and not ARGV[0].empty?

@api = PayPal::SDK::REST.set_config(
    :ssl_options => {}, # Set ssl options
    :mode => :sandbox,  # Set :sandbox or :live
    :client_id     => "AWLNvp25Gv70ELGi8ssjeB6XCiikBPGT_-Y0Sxjk2RFY7Elc4lWidqPGDsRLJcrOTFWeLkxVqY5sb1dV",
    :client_secret => "EPwW3Clo9KQZgOeuWVgFY_q1jlKxpnAoFWMJDLxUUJ8nn3Z91XuQ6nN5AkBWy0JoGDxsLztc5AgdZoMI" )
   
@payment = Payment.new({
  :intent => "sale",
  :payer => {
    :payment_method => @data["method"], #credit_card/debit_card
    :funding_instruments => [{
      :credit_card => {
        :type => @data["type"],
        :number => @data["card"].delete(' '),
        :expire_month => @data["month"], :expire_year => "20" + @data["year"],
        :cvv2 => @data["cvv"],
        :first_name => @data["firstName"], :last_name => @data["lastName"],
        :billing_address => {
          :line1 => @data["addressLine1"],
          :line2 => (@data["addressLine2"].nil? ? "" : @data["addressLine2"]),
          :city => @data["city"],
          :state => @data["state"],
          :postal_code => @data["postal"], :country_code => "US" }}}]},
  :transactions => [{
    :amount => {
      :total => 0.01,
      :currency => "USD"},
    :description => @data["description"] }]})
    

@result = @payment.create

File.open("results.log", "a") do |output|
    output.puts @result.inspect
end



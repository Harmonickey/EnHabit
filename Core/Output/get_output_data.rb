#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'

commands_contents = File.open("#{deploymentBase}/output.log").read

errors_contents = File.open("#{deploymentBase}/error.log").read

puts {"Commands" => commands_contents, "Errors" => errors_contents}.to_json

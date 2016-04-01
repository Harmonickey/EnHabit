#!/usr/local/bin/ruby

absPath = Dir.pwd
base = absPath.split("/").index("public_html")
deploymentBase = absPath.split("/")[0..(base + 1)].join("/") #this will reference whatever deployment we're in

$: << "#{deploymentBase}/Libraries"

require 'json'

commands_contents = File.open("#{deploymentBase}/output.log").read

errors_contents = File.open("#{deploymentBase}/error.log").read

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b1467c5... 120 error and debug string logging with times
ret_data = Hash.new
ret_data["Commands"] = commands_contents.split("\n").reverse
ret_data["Errors"] = errors_contents.split("\n").reverse

puts ret_data.to_json
<<<<<<< HEAD
=======
puts {"Commands" => commands_contents, "Errors" => errors_contents}.to_json
>>>>>>> 7226f8e... 120 add necessary files
=======
>>>>>>> b1467c5... 120 error and debug string logging with times

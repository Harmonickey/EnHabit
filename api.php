<?php

$data = $_POST["data"];

echo shell_exec("ruby web-service.rb '$data'");

?>
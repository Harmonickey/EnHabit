<?php

$postdata = var_dump($_POST);

$output = fopen("output.log", "a") or die("Unable to open file!");
fwrite($output, json_encode($postdata) . "\n");
fclose($output);

?>
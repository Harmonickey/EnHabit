<?php

$postdata = var_dump($_POST);
$getdata = var_dump($_GET);

$output = fopen("post_stuff.log", "a") or die("Unable to open file!");
fwrite($output, $postdata . "\n");
fwrite($output, $getdata . "\n");
fclose($output);

?>
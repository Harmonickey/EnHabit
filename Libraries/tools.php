<?php

$abs = __FILE__;
$parts = explode("/", $abs);
$index = array_search("public_html", $parts);

$base_path = implode("/", array_slice($parts, 0, $index + 2));

define("ROOTPATH", $base_path);

function remove_malicious_characters($data)
{
    $temp_data = json_encode($data);
    
    //blacklist all characters that could be used for shell injection
    $blacklist = ["|", "$", "&", ";", "<", ">", "`"];

    for ($i = 0; $i < count($blacklist); $i++)
    {
        $temp_data = str_replace($blacklist[$i], "", $temp_data);
    }

    //escape all other characters that PHP deems could be used for shell injection
    //these get unescaped in the ruby code once it gets passed safely
    $temp_data = escapeshellcmd($temp_data);
	
    return $temp_data;
}

function debug_data($data)
{
    $output = fopen("output.log", "w") or die("Unable to open file!");
    fwrite($output, json_encode($data));
    fclose($output);
}

?>
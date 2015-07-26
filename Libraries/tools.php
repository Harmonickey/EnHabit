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

function set_session($result, $data)
{
    if (strpos($result, "Okay") === 0)
    {
        if (strpos($result, "Tenant") === 5)
        {
            $_SESSION["tenant"] = json_decode(str_replace("\\", "", $data))->{"username"};
            $id = end(explode(":", $result));
            $_SESSION["userId"] = trim($id);
        }
        else if (strpos($result, "Landlord") === 5)
        {
            $_SESSION["landlord"] = json_decode(str_replace("\\", "", $data))->{"username"};
            $id = end(explode(":", $result));
            $_SESSION["landlordId"] = trim($id);
        }
        else if (strpos($result, "Created") === 5)
        {
            $_SESSION["tenant"] = json_decode(str_replace("\\", "", $data))->{"username"};
            $id = end(explode(":", $result));
            $_SESSION["userId"] = trim($id);
        }
        // I don't want $_SESSION["username"] outside of the if/else block
        //   because the username will only appear after login actions
    }
}

function debug_data($data)
{
    $output = fopen("output.log", "a") or die("Unable to open file!");
    fwrite($output, json_encode($data) . "\n");
    fclose($output);
}

function debug_string($data)
{
    $output = fopen("output.log", "a") or die("Unable to open file!");
    fwrite($output, $data . "\n");
    fclose($output);
}

?>
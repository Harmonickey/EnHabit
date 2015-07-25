<?php

include_once "Libraries/tools.php";

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])) && isset($_POST["command"]))
{
    #all other commands go through this branch
    
    $data = (isset($_POST["data"]) ? $data = remove_malicious_characters($_POST["data"]) : NULL);
    $landlord = (isset($_SESSION["landlord"]) ? 'true' : 'false');
    $user = (isset($_SESSION["tenant"]) ? $_SESSION["tenant"] : $_SESSION["landlord"]);
    
    // if we're running commands off of the front page, we don't want to filter
    // on user or landlord in the back end
    if ($_SERVER['HTTP_REFERER'] === "http://dev.lbkstudios.net/")
    {
        $landlord = NULL;
        $user = NULL;
    }
    
    debug_string("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' $user $landlord");
    echo shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' $user $landlord");
}
else if (isset($_POST["command"]) && isset($_POST["data"]))
{
    #login.rb, facebook_login.rb, and get_listings.rb all go through this branch
    
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $result = shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data'");
    
    if (strpos($result, "Okay") === 0)
    {
        if (strpos($result, "Tenant") === 5)
        {
            $_SESSION["tenant"] = json_decode(str_replace("\\", "", $data))->{"username"};
        }
        else if (strpos($result, "Landlord") === 5)
        {
            $_SESSION["landlord"] = json_decode(str_replace("\\", "", $data))->{"username"};
        }
        else if (strpos($result, "Created") === 5)
        {
            $_SESSION["tenant"] = json_decode(str_replace("\\", "", $data))->{"username"};
        }
        
        // I don't want $_SESSION["username"] outside of the if/else block
        //   because the username will only appear after login actions
    }
    echo $result;
}
?>
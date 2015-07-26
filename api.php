<?php

include_once "Libraries/tools.php";

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])) && isset($_POST["command"]))
{
    #all other commands go through this branch
    
    $data = (isset($_POST["data"]) ? remove_malicious_characters($_POST["data"]) : NULL);
    
    // if we're running commands off of the front page, we don't want to filter
    // on user or landlord in the back end
    if ($_SERVER['HTTP_REFERER'] === "http://dev.lbkstudios.net/")
    {
        $landlord = NULL;
        $user = NULL;
    }
    
    debug_string("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data'");
    
    $result = shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data'");
    
    set_session($result, $data);
    
    echo $result;
}
else if (isset($_POST["command"]))
{
    #login.rb, facebook_login.rb, and get_listings.rb all go through this branch
    
    $data = (isset($_POST["data"]) ? remove_malicious_characters($_POST["data"]) : NULL);
    
    if ($_POST["command"] === "login" || $_POST["command"] === "facebook_login" || $_POST["command"] === "get_listings" || $_POST["command"] === "create_account")
    {
        $result = shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data'");
    
        set_session($result, $data);
    
        echo $result;
    }
}
?>
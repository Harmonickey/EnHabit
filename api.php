<?php

include_once "Libraries/tools.php";

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])) && isset($_POST["command"]))
{
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
    
    echo shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' $user $landlord");
}
else if (isset($_POST["command"]) && isset($_POST["data"]))
{
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $result = shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data'");
    
    if (strpos($result, "Okay") === 0)
    {
        if (strpos($result, "Tenant") === 5)
        {
            $_SESSION["tenant"] = $user;
        }
        else if (strpos($result, "Landlord") === 5)
        {
            $_SESSION["landlord"] = $user;
        }
    }
    echo $result;
}
?>
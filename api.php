<?php

include_once "includes/tools.php";

session_start();


if (isset($_SESSION["user"]) && isset($_POST["command"]) && isset($_POST["data"])) 
{
    //must have session in order to use the main commands
    $user = $_SESSION["user"];
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    switch ($_POST["command"])
    {
        case "get_listings":
        case "update_listing":
        case "create_listing":
        case "delete_listing":
            echo shell_exec("ruby listing_commands/" . $_POST["command"] . ".rb '$data' $user");
            break;
        case "update_listting":
        case "update_account":
        case "delete_account":
            echo shell_exec("ruby account_commands/" . $_POST["command"] . ".rb '$data' $user");
            break;
        case "get_user_info":
            echo shell_exec("ruby account_commands/" . $_POST["command"] . ".rb $user");
            break;
    }
}
else if (isset($_POST["command"]) && isset($_POST["data"]))
{
    //these commands are available without a session
    $user = $_SESSION["user"];
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    switch ($_POST["command"])
    {
        case "create_account":
            echo shell_exec("ruby account_commands/" . $_POST["command"] . ".rb '$data'");
            break;
        case "get_listings":
        case "get_listing_info":
            echo shell_exec("ruby listing_commands/" . $_POST["command"] . ".rb '$data'");
            break;
    }

}
?>
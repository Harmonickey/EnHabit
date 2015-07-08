<?php

include_once "../includes/tools.php";

session_start();

if (isset($_SESSION['admin']) && isset($_POST["command"]))
{
    $data = "";
    
    if (isset($_POST["data"]))
    {
        $data = $_POST["data"];
        $data = remove_malicious_characters($data);
    }
    
    switch($_POST["command"])
    {
        case "get_all_listings":
        case "delete_old_listings":
        case "get_all_transactions":
        case "get_all_users":
            echo shell_exec("ruby ../admin_commands/" . $_POST["command"] . ".rb");
            break;
        case "update_user":
        case "delete_user":
        case "create_user":
        case "update_listing":
        case "delete_listing":
        case "create_listing":
            echo shell_exec("ruby ../admin_commands/" . $_POST["command"] . ".rb '$data'");
            break;
    }
}
else if (isset($_POST["command"]) && isset($_POST["user"]) && isset($_POST["data"]))
{
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $user = $_POST["user"];
    
    $result = shell_exec("ruby ../admin_commands/" . $_POST["command"] . ".rb '$data'");
    if (strpos($result, "Okay") === 0)
    {
        $_SESSION["admin"] = $user;
    }
    
    echo $result;
}

?>
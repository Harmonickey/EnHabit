<?php

include_once "../includes/tools.php";

session_start();

if (isset($_SESSION['listings']) && isset($_POST["command"]))
{
    $data = "";
    
    if (isset($_POST["data"]))
    {
        $data = $_POST["data"];
        $data = remove_malicious_characters($data);
    }
    
    switch($_POST["command"])
    {
        case "delete_old_listings":
            echo shell_exec("ruby ../listing_commands/" . $_POST["command"] . ".rb");
            break;
        case "get_all_listings":
            echo shell_exec("ruby ../listing_commands/" . $_POST["command"] . ".rb");
            break;
        case "update_listing":
        case "delete_listing":
        case "create_listing":
            echo shell_exec("ruby ../listing_commands/" . $_POST["command"] . ".rb '$data'");
            break;
    }
}
else if (isset($_POST["command"]) && isset($_POST["user"]) && isset($_POST["data"]))
{
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $user = $_POST["user"];
    
    $result = shell_exec("ruby ../listing_commands/" . $_POST["command"] . ".rb '$data'");
    if (strpos($result, "Okay") !== -1)
    {
        $_SESSION["listings"] = $user;
        
        if (strpos($result, "Landlord") !== -1)
        {
            $_SESSION["listings-portal"] = "landlord";
        }
        else
        {
            $_SESSION["listings-portal"] = "tenant";
        }
    }
    
    echo $result;
}

?>
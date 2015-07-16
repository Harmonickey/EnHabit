<?php

include_once "../Libraries/tools.php";

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
            echo shell_exec("ruby ../Core/Listings/" . $_POST["command"] . ".rb");
            break;
        case "get_all_listings":
            echo shell_exec("ruby ../Core/Listings/" . $_POST["command"] . ".rb");
            break;
        case "update_listing":
        case "delete_listing":
        case "create_listing":
            echo shell_exec("ruby ../Core/Listings/" . $_POST["command"] . ".rb '$data'");
            break;
    }
}
else if (isset($_POST["command"]) && isset($_POST["user"]) && isset($_POST["data"]))
{
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $user = $_POST["user"];

    $result = shell_exec("ruby ../Core/Accounts/" . $_POST["command"] . ".rb '$data'");

    // we want tenants to be able to login here, but not their landlords
    if (strpos($result, "Okay") === 0 && strpos($result, "Landlord") === FALSE)
    {
        $_SESSION["tenant"] = $user;
        echo "Okay";
    }
    else
    {
        echo $result;
    }
}

?>
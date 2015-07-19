<?php

include_once "../Libraries/tools.php";

session_start();

if (isset($_SESSION["landlord"]) && isset($_POST["command"]))
{
    $data = "";
    $user = $_SESSION["landlord"];
    
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
        case "get_listings_by_landlord":
            echo shell_exec("ruby ../Core/Listings/" . $_POST["command"] . ".rb $user");
            break;
        case "create_listing_by_landlord":
        case "update_listing_by_landlord":
        case "delete_listing":
            echo shell_exec("ruby ../Core/Listings/" . $_POST["command"] . ".rb '$data' $user");
            break;
    }
}
else if (isset($_POST["command"]) && isset($_POST["user"]) && isset($_POST["data"]))
{
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $user = $_POST["user"];

    $result = shell_exec("ruby ../Core/Accounts/" . $_POST["command"] . ".rb '$data'");

    // we want landlords to be able to login here, but not their landlords
    if (strpos($result, "Okay") === 0 && strpos($result, "Landlord") === 5)
    {
        $_SESSION["landlord"] = $user;
        echo "Okay";
    }
    else
    {
        echo $result;
    }
}

?>
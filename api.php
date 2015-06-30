<?php

include_once "includes/tools.php";

session_start();

if (isset($_SESSION["user"])) //must have session in order to use the api!
{
    $user = $_SESSION["user"];
    
    if (isset($_POST["data_get_listings"]))
    {
        $data = $_POST["data_get_listings"];

        $data = remove_malicious_characters($data);

        echo shell_exec("ruby listing_commands/get_listings.rb '$data' $user");
    }
    else if (isset($_POST["data_update_account"]))
    {
        $data = $_POST["data_update_account"];

        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby account_commands/update_account.rb '$data' $user");
    }
    else if (isset($_POST["data_update_listing"]))
    {
        $data = $_POST["data_update_listing"];

        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby listing_commands/update_listing.rb '$data' $user");
    }
    else if (isset($_POST["data_get_user_info"]) && $_POST["data_get_user_info"] == "load")
    {
        $data = $_POST["data_get_user_info"];
        
        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby account_commands/get_user_info.rb $user");
    }
    else if (isset($_POST["data_create_listing"]))
    {
        $data = $_POST["data_create_listing"];
        
        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby listing_commands/create_listing.rb '$data' $user");
    }
    else if (isset($_POST["data_delete_listing"]))
    {
        $data = $_POST["data_delete_listing"];
        
        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby listing_commands/delete_listing.rb '$data' $user");
    }
    else if (isset($_POST["data_delete_account"]))
    {
        $data = $_POST["data_delete_account"];
        
        $data = remove_malicious_characters($data);

        echo shell_exec("ruby account_commands/delete_account.rb '$data' $user");
    }
}
else if (isset($_POST["data_create_account"]))
{
    $data = $_POST["data_create_account"];
    
    $data = remove_malicious_characters($data);
    
    echo shell_exec("ruby account_commands/create_account.rb '$data'");
}
else if (isset($_POST["data_get_listings"]))
{
    $data = $_POST["data_get_listings"];

    $data = remove_malicious_characters($data);

    echo shell_exec("ruby listing_commands/get_listings.rb '$data'");
}
else if (isset($_POST["data_get_listing_info"]))
{
    $data = $_POST["data_get_listing_info"];

    $data = remove_malicious_characters($data);

    echo shell_exec("ruby listing_commands/get_listing_info.rb '$data'");
}

?>
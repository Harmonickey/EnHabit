<?php

include_once "Libraries/tools.php";

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])) && isset($_POST["command"]))
{
    #all other commands go through this branch
    
    $data = (isset($_POST["data"]) ? remove_malicious_characters($_POST["data"]) : NULL);
    $isAdmin = (isset($_SESSION["admin"]) ? "true" : "false");
    $id = (isset($_SESSION["userId"]) ? $_SESSION["userId"] : $_SESSION["landlordId"]);
    $key = (isset($_SESSION["userId"]) ? "UserId" : "LandlordId");

    if (!isset($_SESSION["userId"]) && !isset($_SESSION["landlordId"]))
    {
        header("Location: /", FALSE);
    }
    
    // if we're running commands off of the front page, we don't want to filter
    // on user or landlord in the back end
    $no_user_filter = no_user_filter();
    if ($no_user_filter && $_POST["command"] != "add_applicant" && $_POST["command"] != "send_email")
    {
        $id = NULL;
        $key = NULL;
    }
    
    // shoot out the command to output.log
    debug_string("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' '$id' '$key' '$isAdmin'");
    
    $result = shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' '$id' '$key' '$isAdmin'");

    set_session($result, $data);
    
    if (strpos($result, "Okay") === 0)
    {
        // we don't want to expose UserIds or LandlordIds, or UserIds that belong to Admins
        echo "Okay";
    }
    else
    {
        // we can print out the errors though, in full
        debug_error($result);
        echo $result;
    }
}
else if (isset($_POST["command"]))
{
    #login.rb, facebook_login.rb, and get_listings.rb all go through this branch
    
    $data = (isset($_POST["data"]) ? remove_malicious_characters($_POST["data"]) : NULL);
    
    if ($_POST["command"] === "login" || $_POST["command"] === "facebook_login" || $_POST["command"] === "get_listings" || $_POST["command"] === "create_account" || $_POST["command"] === "get_price_range")
    {
        debug_string("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' '' '' 'false'");
        
        $result = shell_exec("ruby " . ROOTPATH . "/Core/" . $_POST["endpoint"] . "/" . $_POST["command"] . ".rb '$data' '' '' 'false'");
    
        set_session($result, $data);
    
        // we don't want to expose UserIds or LandlordIds, or UserIds that belong to Admins
        if (strpos($result, "Landlord") === 5)
        {
            if (strpos($result, "Admin") === 14)
            {
                echo "Okay:Admin";
            }
            else
            {
                echo "Okay:Landlord";
            }
        }
        else if (strpos($result, "Tenant") === 5 || strpos($result, "Created") === 5 )
        {
            if (strpos($result, "Admin") === 12)
            {
                echo "Okay:Admin";
            }
            else
            {
                if (strpos($result, "true") !== false) // I don't wanna talk about it
                {
                    echo "Okay:Tenant:HasRental";
                }
                else
                {
                    echo "Okay:Tenant";
                }
                
            }
        }
        else 
        {
            echo $result;
        }
    }
}
?>

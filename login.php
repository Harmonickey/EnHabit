<?php  

include_once "Libraries/tools.php";

// session starts with the help of this function 
session_start(); 

if (!isset($_SESSION['user']) && isset($_POST["command"]) && isset($_POST["data"]) && isset($_POST["user"]))
{
    $user = $_POST["user"];
    $data = $_POST["data"];
    $data = remove_malicious_characters($data);
    
    $result = shell_exec("ruby Core/Accounts/" . $_POST["command"] . ".rb '$data'");
    
    if (strpos($result, "Okay") === 0 ||
        strpos($result, "Needs Update") === 0)
    {
        $_SESSION['user'] = $user;
        $portal = 'tenant';
        
        if ($_POST["command"] == "facebook_login")
        {
            $_SESSION['facebook'] = $user;
        }
        
        if (strpos($result, "Landlord") === 5)
        {
            $_SESSION['landlord'] = $user;
            $portal = 'landlord';
        }
        else
        {
            $_SESSION['tenant'] = $user;
        }
        
        echo $result . $portal;
    }
    else
    {
        echo "Invalid Username/Password";
    }  
}
?>
<?php  

include_once "includes/tools.php";

// session starts with the help of this function 
session_start(); 

if(isset($_POST['data_login']) && !isset($_SESSION['user']))
{
    //grab credentials from POST request
    $data = $_POST["data_login"];
    $data = remove_malicious_characters($data);
    
    $result = shell_exec("ruby login.rb '$data'");
    
    $user = $_POST["user"];
    
    if (strpos($result, "Okay") === 0)
    {
        $_SESSION['user']=$user;
        echo $result;
    }
    else
    {
        echo "Invalid Username/Password";
    }
}
else if(isset($_POST['data_facebook_login']) && !isset($_SESSION['user']))
{
    //grab credentials from POST request
    $data = $_POST["data_facebook_login"];
    $data = remove_malicious_characters($data);
    
    $result = shell_exec("ruby facebook_login.rb '$data'");
    
    $user = $_POST["user"];
    
    if (strpos($result, "Okay") === 0 ||
        strpos($result, "Needs Update") === 0)
    {
        $_SESSION['user']=$user;
        echo $result;
    }
    else
    {
        echo "Invalid Username/Password";
    }
}

?>
<?php  
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
        echo $user;
    }
    else
    {
        echo "Invalid Username/Password";
    }
}

function remove_malicious_characters($data)
{
    //blacklist all characters that could be used for shell injection
    $blacklist = ["|", "$", "&", ";", "<", ">", "`"];

    for ($i = 0; $i < count($blacklist); $i++)
    {
        $data = str_replace($blacklist[$i], "", $data);
    }

    //escape all other characters that PHP deems could be used for shell injection
    //these get unescaped in the ruby code once it gets passed safely
    $data = escapeshellcmd($data);
	
    return $data;
}
?>
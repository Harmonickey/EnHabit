<?php

include_once "includes/tools.php";

session_start();

if (isset($_SESSION["user"])) //must have session in order to use the api!
{
    $user = $_SESSION["user"];

    if (isset($_POST["data_query"]))
    {
        $data = $_POST["data_query"];

        $data = remove_malicious_characters($data);

        echo shell_exec("ruby web-service.rb '$data' $user");
    }
    else if (isset($_POST["data_update"]))
    {
        $data = $_POST["data_update"];
        
        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby update.rb '$data' $user");
    }
    else if (isset($_POST["data_update_load"]) && $_POST["data_update_load"] == "load")
    {
        $data = $_POST["data_update_load"];
        
        $data = remove_malicious_characters($data);
        
        echo shell_exec("ruby get_user_info.rb $user");
    }
}
else if (isset($_POST["data_register"]))
{
    $data = $_POST["data_register"];
    
    $data = remove_malicious_characters($data);
    
    echo shell_exec("ruby register.rb '$data'");
}
else if (isset($_POST["data_query"]))
{
    $data = $_POST["data_query"];

    $data = remove_malicious_characters($data);

    echo shell_exec("ruby web-service.rb '$data'");
}

?>
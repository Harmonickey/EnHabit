<?php

    include_once("analytics.php");

    session_start();
    
    if (!isset($_SESSION["landlord"]))
    {
        header("Location: /landlord/login.php", FALSE);
    }
    else
    {
        header("Location: /landlord/listings", FALSE);
    }
?>
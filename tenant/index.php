<?php

    session_start();
    
    if (!isset($_SESSION["tenant"]))
    {
        header("Location: /tenant/login.php", FALSE);
    }
    else if (isset($_SESSION["admin"]))
    {
        header("Location: /admin", FALSE);
    }
    else
    {
        header("Location: /tenant/listings", FALSE);
    }
?>
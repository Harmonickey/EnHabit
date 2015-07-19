<?php

    session_start();
    
    if (!isset($_SESSION["tenant"]))
    {
        header("Location: /tenant/login.php", FALSE);
    }
    else
    {
        header("Location: /tenant/listings", FALSE);
    }
?>
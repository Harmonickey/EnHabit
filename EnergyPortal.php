<?php

session_start();

if (isset($_SESSION["landlord"]))
{
    if (isset($_SESSION["landlord"]))
    {
        header("Location: /landlord/energy", FALSE);
    }
}

?>
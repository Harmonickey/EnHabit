<?php

session_start();

if ((isset($_SESSION["admin"]) || isset($_SESSION["landlord"])))
{
    if (isset($_SESSION["admin"]))
    {
        header("Location: /admin/renters", FALSE);
    }
    else
    {
        header("Location: /landlord/renters", FALSE);
    }
}

?>
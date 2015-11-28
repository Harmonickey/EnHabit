<?php

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])) || isset($_SESSION["admin"]))
{
    if (isset($_SESSION["tenant"]))
    {
        header("Location: /tenant/listings", FALSE);
    }
    else if (isset($_SESSION["landlord"]))
    {
        header("Location: /landlord/listings", FALSE);
    }
    else
    {
        header("Location: /admin/listings", FALSE);
    }
}

?>
<?php

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])) || isset($_SESSION["admin"]))
{
    if (isset($_SESSION["tenant"]))
    {
        if (isset($_SESSION["admin"]))
        {
            header("Location: /admin/listings", FALSE);
        }
        else
        {
            header("Location: /tenant/listings", FALSE);
        }
    }
    else if (isset($_SESSION["landlord"]))
    {
        if (isset($_SESSION["admin"]))
        {
            header("Location: /admin/listings", FALSE);
        }
        else
        {
            header("Location: /landlord/listings", FALSE);
        }
    }
}

?>
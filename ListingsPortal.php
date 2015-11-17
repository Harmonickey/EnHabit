<?php

session_start();

if ((isset($_SESSION["tenant"]) || isset($_SESSION["landlord"])))
{
    if (isset($_SESSION["tenant"]))
    {
        header("Location: /tenant/listings", FALSE);
    }
    else
    {
        header("Location: /landlord/listings", FALSE);
    }
}

?>
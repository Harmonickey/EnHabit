<?php

session_start();

if ((isset($_SESSION["admin"])) || isset($_SESSION["tenant"]))
{
    if (isset($_SESSION["admin"]))
    {
        header("Location: /admin/payments", FALSE);
    }
    else
    {
        header("Location: /tenant/payments", FALSE);
    }
}

?>
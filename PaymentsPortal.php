<?php

session_start();

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
if ((isset($_SESSION["admin"])))
{
    header("Location: /admin/payments", FALSE);
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
=======
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
>>>>>>> 65240df... 107 various payments fixes
}

?>
<?php

session_start();

if ((isset($_SESSION["admin"])))
{
    header("Location: /admin/pricing", FALSE);
}

?>
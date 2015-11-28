<?php

session_start();

if ((isset($_SESSION["landlord"])))
{
    header("Location: /landlord/applicants", FALSE);
}

?>
<?php
    include_once "tools.php";

    if (isset($_POST["id"]))
    {
        $base = "../assets/images/listing_images/";
        
        $id = (isset($_POST["id"]) ? remove_malicious_characters($_POST["id"]) : NULL);
        
        // we don't want people deleting our system files
        $bad_characters = array("../", "..\\", "\"");
        $filename = str_replace($bad_characters, "", $id);
        
        unlink($base . $filename);
    }
?>
<?php
    include_once "tools.php";
    
    $ds          = DIRECTORY_SEPARATOR;
    $storeFolder = '../assets/images/listing_images/';
    if (!empty($_FILES)) 
    { 
        $tempFile = $_FILES['file']['tmp_name']; 
        $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds;
        $targetFile =  $targetPath. $_FILES['file']['name'];
        
        debug_string($targetFile);
        
        move_uploaded_file($tempFile, $targetFile);
    }
?>
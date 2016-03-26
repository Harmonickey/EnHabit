<?php
 
    $landlordEmail = $_GET["landlordEmail"];
    $amount = $_GET["amount"];
    $oid = $_GET["oid"];

?>

<!DOCTYPE html>
<html lang="en"> 
    <head>
        <meta charset="utf-8">
        <script src="../../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
        <script src="../../../Javascript/paymentsandbox/functions.js"></script>
    </head>
    <script type="text/javascript">
    
        <?php echo "UpdateToFeatured('" . $oid . "', '" . $landlordEmail . "', '" . $amount . "')"; ?>

    </script>
</html>
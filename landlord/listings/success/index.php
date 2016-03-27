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
    
<<<<<<< HEAD
<<<<<<< HEAD
        <?php echo "UpdateToFeatured('" . $oid . "', '" . $landlordEmail . "', '" . $amount . "')"; ?>
=======
        <?php echo "InsertFeaturedPayment('" . $oid . "', '" . $landlordEmail . "', '" . $amount . "')"; ?>
>>>>>>> 1893860... 116 featured listings
=======
        <?php echo "UpdateToFeatured('" . $oid . "', '" . $landlordEmail . "', '" . $amount . "')"; ?>
>>>>>>> da9c88b... 116 update to featured

    </script>
</html>
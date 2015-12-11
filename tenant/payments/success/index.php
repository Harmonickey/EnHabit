<?php
 
    $uid = $_GET["uid"];
    $landlordEmail = $_GET["landlordEmail"];
    $rent = $_GET["rent"];
    
?>

<!DOCTYPE html>
<html lang="en"> 
    <head>
        <meta charset="utf-8">
        <script src="../../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
        <script src="../../../Javascript/paymentsandbox/functions.js"></script>
    </head>
    <script type="text/javascript">
    
        <?php echo "InsertPayment('" . $uid . "', '" . $landlordEmail . "', '" . rent . "')"; ?>
    
        window.top.location = "/tenant/payments?result=success"
    </script>
</html>
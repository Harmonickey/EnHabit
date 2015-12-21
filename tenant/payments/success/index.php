<?php
 
    $uid = "";
    $landlordEmail = $_GET["landlordEmail"];
    $rent = $_GET["rent"];
        
    if (isset($_GET["uid"]))
    {
        $uid = $_GET["uid"];
    }
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

    </script>
</html>
<<<<<<< HEAD
<<<<<<< HEAD
<?php
<<<<<<< HEAD
 
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
    
<<<<<<< HEAD
        <?php echo "InsertPayment('" . $uid . "', '" . $landlordEmail . "', '" . rent . "')"; ?>
<<<<<<< HEAD
=======
        <?php echo "InsertPayment('" . $uid . "', '" . $landlordEmail . "', '" . $rent . "')"; ?>
>>>>>>> 8564af8... 116 featured listings

=======
        
>>>>>>> ed916d6... 130 insert payment?
    </script>
</html>
=======

    session_start();
    
    if (!isset($_SESSION["tenant"]))
    {
        header("Location: /tenant/login.php", FALSE); // just redirect if the user isn't authorized to go here....
    }
    else if (isset($_SESSION["admin"]))
    {
        header("Location: /admin", FALSE);
    }
    else
    {
        $one_hour = 3600;

        if (!isset($_SESSION['CREATED'])) {
            $_SESSION['CREATED'] = time();
        } else if (time() - $_SESSION['CREATED'] > $one_hour) {
            // session started more than 1 hour ago
            session_regenerate_id(true);    // change session ID for the current session and invalidate old session ID
            $_SESSION['CREATED'] = time();  // update creation time
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
  
    <meta charset="utf-8">
    <title>Tenant | Payments</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../../favicon.png">
    
    <link href="../../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-switch.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-tagsinput.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/pikaday.css" rel="stylesheet">
    
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/jquery-ui.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dropzone.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dashboard.css" rel="stylesheet"> 

    <link href="../../Styles/tenant/custom.css" rel="stylesheet">
    <link href="../../Styles/payments/custom.css" rel="stylesheet">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <script type="text/javascript">
    if (window != top) {
        top.location.replace(document.location);
    }
    </script>
    
  </head>

<body>

<nav class="navbar navbar-inverse" role="navigation">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <i class="fa fa-bars"></i>
            </button>
            <a class="logo" href="/"><img src='/assets/images/theme_images/enhabit logo.png' height="57"/></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">                       
                <li class="account-nav dropdown" style="">      
                    <a href="javascript:void()" class="dropdown-toggle" data-toggle="dropdown"> 
                        Account
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li class="tenant-nav"><a style="cursor: pointer;" href="/AccountPortal.php"><i class="fa fa-user" style="margin-right: 5px;"></i>Edit Account</a></li>
                        <li class="tenant-nav"><a style="cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>My Listings</a></li>
                        <li class='tenant-nav'><a style='cursor: pointer;' href='/PaymentsPortal.php'><i class='fa fa-usd' style='margin-right: 5px;'></i>My Payments</a></li>
                        <li id="login-function" class="menu-item scroll" onclick="Logout()">
                            <a id="login" style="cursor: pointer;"><i class="fa fa-sign-out" style="margin-right: 5px;"></i>Log Out</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div> <!-- /.container -->
</nav>
    
<div class="subnavbar">
	<div class="subnavbar-inner">
		<div class="container">
			<a href="javascript:;" class="subnav-toggle" data-toggle="collapse" data-target=".subnav-collapse">
		      <span class="sr-only">Toggle navigation</span>
		      <i class="fa fa-bars"></i>
		    </a>
			<div class="collapse subnav-collapse">
				<ul class="mainnav">
                    <li>
                        <a href="../account">
                            <i class="fa fa-book"></i>
                            <span>Account</span>
                        </a>
                    </li>
                    <li>
						<a href="../listings">
							<i class="fa fa-th-list"></i>
							<span>Listing</span>
						</a>	    				
					</li>
                    <li class="active">
						<a href="./">
							<i class="fa fa-usd"></i>
							<span>Payments</span>
						</a>	    				
					</li>
				</ul>
			</div> <!-- /.subnav-collapse -->
		</div> <!-- /container -->
	</div> <!-- /subnavbar-inner -->
</div> <!-- /subnavbar -->
    
<div class="main">
    <div class="container">
      <div class="row">
      	<div class="col-md-12">
      		<div class="widget stacked">
      			<div class="widget-header">
					<h3>Payment Status</h3>
                </div> <!-- /widget-header -->
				<div class="widget-content">
                    <div class="row" id="payment" style="margin: 0;">
                        
                    </div>
				</div> <!-- /widget-content -->
			</div> <!-- /widget -->					
	    </div> <!-- /col-md-12 -->     	
      </div> <!-- /row -->
    </div> <!-- /container -->
</div> <!-- /main -->
   
<div class="footer">
	<div class="container">
		<div class="row">
			<div id="footer-copyright" class="col-md-6">
				&copy; Hyperion Group LLC & LbKStudios LLC. Designed &amp; Built by <a href="http://www.lbkstudios.net" target="_blank">LbKStudios LLC</a>
			</div>
		</div>
	</div>
</div>
    
<div id="createPaymentModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Create New Payment</h4>
            </div>
            <div class="modal-body">
                <!-- Put all the fields to create a payment here -->
                <div class="row payment-details">
                    <form novalidate autocomplete="on" method="POST">
                        <h4>Payment details</h4>
                        <ul>
                            <li>
                                <div class="form-group">
                                    <label for="cc-number" class="control-label">Card Number</label>
                                    <input id="cc-number" type="tel" class="form-control cc-number" autocomplete="cc-number" placeholder="•••• •••• •••• ••••" required>
                                    <small class="help">We support Visa, Visa Electron, Mastercard, American Express, Diners Club, Discover, Union Pay, JCB, Maestro, Forbrugs Foreningen, and Dankort</small>
                                </div>
                            </li>

                            <li class="vertical">
                                <div class="row">
                                    <div class="form-group col-lg-5 col-md-5 col-sm-5"> 
                                        <label for="cc-exp" class="control-label">Card Expiration</label>
                                        <input id="cc-exp" type="tel" class="form-control text-center cc-exp" autocomplete="cc-exp" placeholder="•• / ••" required>
                                    </div>
                                    <div class="form-group col-lg-5 col-md-5 col-sm-5" style="float: right; margin-right: 2px;"> 
                                        <label for="cc-cvc" class="control-label">Card CVC Code</label>
                                        <input id="cc-cvc" type="tel" class="form-control text-center cc-cvc" autocomplete="off" placeholder="•••" required>
                                    </div>
                                </div>
                            </li>
                            
                            <li class="vertical">
                                <div class="row">
                                    <div class="form-group col-lg-12 col-md-12 col-sm-12">
                                        <label for="address">Address</label>
                                        <input class="form-control text-center" type="text" name="address1" id="address1">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-lg-5 col-md-5 col-sm-5">       
                                        <label for="address">Apt/Suite #</label>
                                        <input class="form-control text-center" type="text" name="address2" id="address2">
                                    </div>
                                    <div class="form-group col-lg-5 col-md-5 col-sm-5" style="float: right; margin-right: 2px;"> 
                                        <label for="address">City</label>
                                        <input class="form-control text-center" type="text" name="city" id="city">
                                    </div>
                                </div>
                                <div class="row">                                           
                                    <div class="form-group col-lg-5 col-md-5 col-sm-5">   
                                        <label for="state">State</label>
                                        <input class="form-control text-center" type="text" name="state" id="state">
                                    </div>
                                    <div class="form-group col-lg-5 col-md-5 col-sm-5" style="float: right; margin-right: 2px;">   
                                        <label for="address">Zip Code</label>
                                        <input class="form-control text-center" type="text" name="postal" id="postal" maxlength="5" placeholder="#####">
                                    </div>
                                </div>
                            </li>
                            <li class="vertical">
                                <div class="form-group row">
                                    <div class="form-group col-lg-12 col-md-12 col-sm-12">
                                        <label for="name_on_card">Name on card</label>
                                        <input class="form-control text-center" type="text" name="name_on_card" id="name_on_card">
                                    </div>
                                </div>
                                <div class="row">                                           
                                    <div class="form-group col-lg-12 col-md-12 col-sm-12">   
                                        <label for="paymentMonth">Payment Month</label>
                                        <select class="form-control text-center" type="text" name="state" id="paymentMonth">
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </select>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </form>
                    <div class="text-center" style="width: 100%; margin-top: 10px;">
                        <button id="pay-now" class="btn btn-info" style="font-size: 25px;"><i class="fa fa-cc-paypal fa-2" style="margin-right: 10px;"></i>Pay Now</button>
                    </div>                      
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../../Libraries/Javascript/jquery-ui.min.js"></script>
<script src="//maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
<script src="../../Libraries/Javascript/bootstrap.min.js"></script>

<!-- helper for notifications -->
<script src="../../Libraries/Javascript/msgGrowl.js"></script>
<script src="../../Libraries/Javascript/jquery.msgbox.min.js"></script>

<script src="https://www.paypalobjects.com/js/external/dg.js" type="text/javascript"></script>

<script src="../../Javascript/tenant/functions.js"></script>

<script src="../../Libraries/Javascript/jquery.payment.js"></script>
<script src="../../Javascript/paymentsandbox/functions.js"></script>

<script>

$(function() 
{  
    GetRenter();
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-64824617-1', 'auto');
ga('send', 'pageview');

</script>
  </body>
</html>
>>>>>>> a155d99... 107 endpoints
=======
<!DOCTYPE html>
<html lang="en"> 
   <script type="text/javascript">
    window.top.location = "/tenant/payments?result=success"
   </script>
</html>
>>>>>>> 83f6113... 117 return for ruby
=======
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
<<<<<<< HEAD

=======
        
>>>>>>> ed916d6... 130 insert payment?
    </script>
</html>
>>>>>>> 2cda3a2... 127 payments tracking

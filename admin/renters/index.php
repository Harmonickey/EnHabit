<?php

    session_start();
    
    if (!isset($_SESSION["userId"]) && !isset($_SESSION["landlordId"]))
    {
        header("Location: /#sessiontimeout", FALSE);
        return;
    }
    
    if (!isset($_SESSION["admin"]))
    {
        header("Location: /admin/login.php", FALSE); // just redirect if the user isn't authorized to go here....
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
    <title>Admin | Renters</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../../favicon.png">
    
    <link href="../../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dashboard.css" rel="stylesheet"> 

    <link href="../../Styles/admin/custom.css" rel="stylesheet">
    <link href="../../Styles/payments/custom.css" rel="stylesheet">

    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

  </head>

<body>

<nav class="navbar navbar-inverse" role="navigation">
	<div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <i class="fa fa-cog"></i>
            </button>
            <a class="logo" href="/"><img src='/assets/images/theme_images/EnhabitLogo_Beta.png' height="56"/></a>
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
                        <li class="admin-nav"><a style="cursor: pointer;" href="/AnalyticsPortal.php"><i class="fa fa-bar-chart" style="margin-right: 5px;"></i>Analytics</a></li>
                        <li class="admin-nav"><a style="cursor: pointer;" href="/UsersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Users</a></li>
                        <li class="admin-nav"><a style="cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>Listings</a></li>
                        <li class="admin-nav"><a style="cursor: pointer;" href="/PaymentsPortal.php"><i class="fa fa-usd" style="margin-right: 5px;"></i>Payments</a></li>
                        <li class="admin-nav"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Renters</a></li>  
                        <li class="admin-nav"><a style="cursor: pointer;" href="/UniversitiesPortal.php"><i class="fa fa-bank" style="margin-right: 5px;"></i>Universities</a></li>  
                        <li class="admin-nav"><a style="cursor: pointer;" href="/PricingPortal.php"><i class="fa fa-money" style="margin-right: 5px;"></i>Pricing</a></li>
                        <li class="admin-nav"><a style="cursor: pointer;" href="/LogsPortal.php"><i class="fa fa-file-text" style="margin-right: 5px;"></i>Logs</a></li>
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
						<a href="../">
							<i class="fa fa-home"></i>
							<span>Home</span>
						</a>	    				
					</li>                   
                    <li>
						<a href="../users">
							<i class="fa fa-user"></i>
							<span>Users</span>
						</a>	    				
					</li>                    
                    <li>
						<a href="../listings">
							<i class="fa fa-copy"></i>
							<span>Listings</span>
						</a>	    				
					</li>                   
                    <li>
						<a href="../payments">
							<i class="fa fa-usd"></i>
							<span>Payments</span>
						</a>	    				
					</li>
                    <li class="active">
						<a href="./">
							<i class="fa fa-users"></i>
							<span>Renters</span>
						</a>	    				
					</li>
                    <li>
						<a href="../universities">
							<i class="fa fa-bank"></i>
							<span>Universities</span>
						</a>	    				
					</li>
                    <li>
						<a href="../pricing">
							<i class="fa fa-money"></i>
							<span>Pricing</span>
						</a>	    				
					</li>
                    <li>
						<a href="../logs">
							<i class="fa fa-file-text"></i>
							<span>Logs</span>
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
					<h3>Add New Renters</h3>
				</div> <!-- /widget-header -->
				<div class="widget-content row">
                    <div class="col-lg-3 col-md-3 col-sm-3">
                        <i class='fa fa-spinner fa-pulse'></i>
                        <label for="users" style="display: none;">Users</label>
                        <select id="users" class="form-control" style="display: none;"></select>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3">
                        <i class='fa fa-spinner fa-pulse' /></i>
                        <label for="landlords" style="display: none;">Landlords</label>
                        <select id="landlords" class="form-control" onChange="GetListingsByLandlord(this);"style="display: none;"></select>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3">
                        <p style="display: none;">No listings</p>
                        <i class='fa fa-spinner fa-pulse' style="display: none;"></i>
                        <label for="listings" style="display: none;">Listings</label>
                        <select id="listings" class="form-control" style="display: none;"></select>
                    </div>    
                    <div class="col-lg-3 col-md-3 col-sm-3">
                        <button id="addRenter" class="btn btn-primary btn-success" style="display: none;" onclick="AddRenter();">Add Renter</button>
                    </div>
				</div> <!-- /widget-content -->
                
                <div class="widget-header">
					<h3>Renters</h3>
				</div> <!-- /widget-header -->
                <div class="widget-content row renters">
                    <!-- all the renters go here -->
                    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        
                    </div>
                </div>
			</div> <!-- /widget -->					
	    </div> <!-- /col-md-12 -->     	
      </div> <!-- /row -->
    </div> <!-- /container -->
</div> <!-- /main -->
   
<div class="footer">
	<div class="container">
		<div class="row">
			<div id="footer-copyright" class="col-md-6">
				&copy; Enhabit LLC. Designed &amp; Built by <a href="http://www.lbkstudios.net" target="_blank">LbKStudios LLC</a>
			</div> <!-- /span6 -->
			<div id="footer-terms" class="col-md-6">
				Theme by <a href="http://jumpstartui.com" target="_blank">Jumpstart UI</a>
			</div> <!-- /.span6 -->
		</div> <!-- /row -->
	</div> <!-- /container -->
</div> <!-- /footer -->
    
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
                                        <input class="form-control text-center" type="text" name="name_on_card" id="name_on_card" style="width: ">
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
                    <div class="text-center" style="width: 100%">
                        <button id="pay-now" class="btn btn-info" style="font-size: 25px;"><i class="fa fa-cc-paypal fa-2" style="margin-right: 10px;"></i>Pay Now</button>
                    </div>                      
                </div>
            </div>
        </div>
    </div>
</div>
    
<script src="../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap.min.js"></script>

<script src="../../Libraries/Javascript/msgGrowl.js"></script>
<script src="../../Libraries/Javascript/jquery.msgbox.min.js"></script>

<script src="../../Javascript/admin/functions.js"></script>

<script src="../../Libraries/Javascript/jquery.payment.js"></script>
<script src="../../Javascript/paymentsandbox/functions.js"></script>

<script type="text/javascript">

var userList = [];
var landlordList = [];

$(function() 
{
    GetAllUsersAndLandlords(true);
    
    GetAllRenters();
});

</script>

  </body>
</html>

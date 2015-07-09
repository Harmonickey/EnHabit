<?php

    session_start();
    
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
    <title>Admin | Listings</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../css/bootstrap-switch.min.css" rel="stylesheet">
    
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../css/font-awesome.min.css" rel="stylesheet">
    
    <link href="../css/ui-lightness/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../js/plugins/msgGrowl/css/msgGrowl.css" rel="stylesheet">
    <link href="../js/plugins/msgbox/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../css/base-admin-3.css" rel="stylesheet">
    <link href="../css/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../css/pages/dashboard.css" rel="stylesheet"> 

    <link href="../css/custom.css" rel="stylesheet">

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
      <i class="icon-cog"></i>
    </button>
    <a class="navbar-brand" href="./">Enhabit Admin</a>
  </div>

  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse navbar-ex1-collapse">
    <ul class="nav navbar-nav navbar-right">
		<li class="dropdown">
						
			<a href="javscript:;" class="dropdown-toggle" data-toggle="dropdown">
				<i class="icon-user"></i> 
				<?php echo $_SESSION["admin"]; ?>
				<b class="caret"></b>
			</a>
			
			<ul class="dropdown-menu">
				<li><a style="cursor: pointer;" onclick="logout_admin()">Logout</a></li>
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
		      <i class="icon-reorder"></i>
		    </a>
			<div class="collapse subnav-collapse">
				<ul class="mainnav">
					<li>
						<a href="../">
							<i class="icon-home"></i>
							<span>Home</span>
						</a>	    				
					</li>
                    <li>
						<a href="../users">
							<i class="icon-user"></i>
							<span>Users</span>
						</a>	    				
					</li>
                    <li class="active">
						<a href="./">
							<i class="icon-copy"></i>
							<span>Listings</span>
						</a>	    				
					</li>
                    <li>
						<a href="../payments">
							<i class="icon-usd"></i>
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
					<i class="icon-ok"></i>
					<h3>Registered Listings</h3>
                    <button id="purge-btn" style="margin-bottom: 5px;" class='btn btn-info' onclick='delete_old_listings()'><i style="margin-left: 0; margin-right: 4px;" class="icon-bolt"></i>Purge Old Listings</button>
				</div> <!-- /widget-header -->
				<div class="widget-content">
                    <table class="table">
                        <tr>
                            <th>Username</th>
                            <th>Rent/Month</th>
                            <th>Address</th>
                            <th>Bedrooms</th>
                            <th>Bathrooms</th>
                            <th>Start Date</th>
                            <th>Animals</th>
                            <th>In-Unit Laundry</th>
                            <th><!-- Create --></th>
                        </tr>
                        <tr id="create-listing"> 
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control' autocomplete="false"></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control '></td>
                            <td><input type="checkbox" data-size="mini"></td>
                            <td><input type="checkbox" data-size="mini"></td>
                            <td><button class='btn btn-success' onclick='create_listing()'><i style="margin-right: 4px;" class="icon-plus"></i>Create New Listing</button></td>
                            <input type='hidden' /> <input type='hidden' /> <input type='hidden' />
                        </tr> 
                    </table>
					<table class="table" id="listing-list">
                        <tr>
                            <th>Username</th>
                            <th>Rent</th>
                            <th>Address</th>
                            <th>Bedrooms</th>
                            <th>Bathrooms</th>
                            <th>Start Date</th>
                            <th>Animals</th>
                            <th>In-Unit Laundry</th>
                            <th><!-- Update --></th>
                            <th><!-- Delete --></th>
                        </tr>
                    </table>
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
				&copy; 2012-13 Jumpstart UI.
			</div> <!-- /span6 -->
			<div id="footer-terms" class="col-md-6">
				Theme by <a href="http://jumpstartui.com" target="_blank">Jumpstart UI</a>
			</div> <!-- /.span6 -->
		</div> <!-- /row -->
	</div> <!-- /container -->
</div> <!-- /footer -->
    

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../js/libs/jquery-1.9.1.min.js"></script>
<script src="../js/libs/jquery-ui-1.10.0.custom.min.js"></script>
<script src="http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
<script src="../js/libs/bootstrap.min.js"></script>
<script src="../js/libs/bootstrap-switch.min.js"></script>

<!-- jquery geocomplete api -->
<script src="../../assets/js/jquery.geocomplete.min.js"></script>
<!-- helper for numeric text boxes -->
<script src="../../assets/js/jquery.autoNumeric.js"></script>

<script src="../js/plugins/msgGrowl/js/msgGrowl.js"></script>
<script src="../js/plugins/msgbox/jquery.msgbox.min.js"></script>

<script src="../js/functions.js"></script>

<script>

$(function() 
{
    init_checkboxes();
    
    var create_listing = $("#create-listing td input");
    
    $(create_listing[2]).geocomplete()
        .bind("geocode:result", function(event, result){
            $($("#create-listing input[type='hidden']")[0]).val(result.geometry.location.A);
            $($("#create-listing input[type='hidden']")[1]).val(result.geometry.location.F);
            $($("#create-listing input[type='hidden']")[2]).val($(create_listing[2]).val());
        });
        
    $(create_listing[1]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(create_listing[3]).autoNumeric('init', 
    {
        vMax: '10', 
        wEmpty: 'empty',
        aPad: false
    });
    
    $(create_listing[4]).autoNumeric('init', 
    {
        vMax: '10', 
        wEmpty: 'empty',
        aPad: false
    });
    
    $(create_listing[5]).datepicker();
    
    get_all_listings();
});

</script>

  </body>
</html>

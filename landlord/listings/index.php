<?php

    session_start();
    
    if (!isset($_SESSION["landlord"]))
    {
        header("Location: /landlord/login.php", FALSE); // just redirect if the user isn't authorized to go here....
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
    <title>Landlord | Listings</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../css/bootstrap-switch.min.css" rel="stylesheet">
    <link href="../../assets/bootstrap/css/bootstrap-tagsinput.css" rel="stylesheet">
    
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
    <a class="navbar-brand" href="./">Enhabit | Landlord</a>
  </div>

  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse navbar-ex1-collapse">
    <ul class="nav navbar-nav navbar-right">
		<li class="dropdown">
						
			<a href="javscript:;" class="dropdown-toggle" data-toggle="dropdown">
				<i class="icon-user"></i> 
				<?php echo $_SESSION["landlord"]; ?>
				<b class="caret"></b>
			</a>
			
			<ul class="dropdown-menu">
				<li><a style="cursor: pointer;" onclick="logout_landlord()">Logout</a></li>
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
                    <li class="active">
						<a href="./">
							<i class="icon-copy"></i>
							<span>Listings</span>
						</a>	    				
					</li>
                    <li>
                        <a href="../renters">
							<i class="icon-usd"></i>
							<span>Manage Renters</span>
						</a>
                    </li>
                    <li>
						<a href="../applicants">
							<i class="icon-usd"></i>
							<span>Manage Applicants</span>
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
      			<div class="widget-header actions">
					<i class="icon-ok"></i>
					<h3>Registered Listings</h3>
                    <button id="purge-btn" style="margin-bottom: 5px;" class='btn btn-info' onclick='delete_old_listings()'><i style="margin-left: 0; margin-right: 4px;" class="icon-bolt"></i>Purge Old Listings</button>
                    <a class="btn btn-success" data-toggle="modal" href="#createListingModal" style="margin-bottom: 5px;"><i style="margin-left: 0; margin-right: 5px;" class="icon-plus"></i>Create New Listing</a>
				</div> <!-- /widget-header -->
				<div class="widget-content listings">
					<!-- all the listings go here -->
                    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        
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
				&copy; 2012-13 Jumpstart UI.
			</div> <!-- /span6 -->
			<div id="footer-terms" class="col-md-6">
				Theme by <a href="http://jumpstartui.com" target="_blank">Jumpstart UI</a>
			</div> <!-- /.span6 -->
		</div> <!-- /row -->
	</div> <!-- /container -->
</div> <!-- /footer -->

<div id="createListingModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Create New Listing</h4>
            </div>
            <div class="modal-body">
                <!-- Put all the fields to create a listing here -->
                <label>Username</label><input type='text' class='form-control' />
                <label>Address</label><input type='text' class='form-control' />
                <label>Price</label><input type='text' class='form-control' />
                <label>Start Date</label><input type='text' class='form-control' />
                <label>Bedrooms</label><input type='text' class='form-control' />
                <label>Bathrooms</label><input type='text' class='form-control' />
                <div class="modal-switch">
                    <label>Animals</label><input type='checkbox' data-size='mini' />
                </div>
                <div class="modal-switch">
                    <label>Laundry</label><input type='checkbox' data-size='mini' />
                </div>
                <div class="modal-switch">
                    <label>Parking</label><input type='checkbox' data-size='mini' />
                </div>
                <div class="modal-switch">
                    <label>AC</label><input type='checkbox' data-size='mini' />
                </div>
                <label>Type</label><select class='form-control'><option value="both">Apt &amp; Sublet</option value="apartment"><option>Apartment</option><option value="sublet">Sublet</option></select>
                <label>Tags</label><label><input type='text' data-role='tagsinput' />
                <input type='hidden' /><input type='hidden' /><input type='hidden' />
                <button type="button" class="btn btn-success" onclick="create_listing()">Create Listing</button>
            </div>
        </div>
    </div>
</div>
    

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../js/libs/jquery-1.9.1.min.js"></script>
<script src="../js/libs/jquery-ui-1.10.0.custom.min.js"></script>
<script src="http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
<script src="../js/libs/bootstrap.min.js"></script>
<script src="../js/libs/bootstrap-switch.min.js"></script>
<script src="../../assets/bootstrap/js/bootstrap-tagsinput.min.js"></script>

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
    initCheckboxes();
    
    initCreateListing();
    
    getAllListings();
});

</script>
  </body>
</html>

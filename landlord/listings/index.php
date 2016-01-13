<?php

    session_start();
    
    if (!isset($_SESSION["landlordId"]))
    {
        header("Location: /#sessiontimeout", FALSE);
        return;
    }
    
    if (!isset($_SESSION["landlord"]))
    {
        header("Location: /landlord/login.php", FALSE); // just redirect if the user isn't authorized to go here....
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
    <title>Landlord | Listings</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../../favicon.png">
    
    <link href="../../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-switch.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/pikaday.css" rel="stylesheet">
    
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dropzone.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dashboard.css" rel="stylesheet"> 

    <link href="../../Styles/landlord/custom.css" rel="stylesheet">

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
                <i class="fa fa-bars"></i>
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
                        <li class="landlord-nav"><a style="cursor: pointer;" href="/AccountPortal.php"><i class="fa fa-user" style="margin-right: 5px;"></i>My Account</a></li>
                        <li class="landlord-nav"><a style="cursor: pointer;" href="/ApplicantsPortal.php"><i class="fa fa-copy" style="margin-right: 5px;"></i>My Applicants</a></li>                               
                        <li class="landlord-nav"><a style="cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>My Listings</a></li>
                        <li class="landlord-nav"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>My Renters</a></li>                    
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
                    <li class="active">
						<a href="./">
							<i class="fa fa-th-list"></i>
							<span>Listings</span>
						</a>	    				
					</li>
                    <li>
                        <a href="../renters">
							<i class="fa fa-users"></i>
							<span>Manage Renters</span>
						</a>
                    </li>
                    <li>
						<a href="../applicants">
							<i class="fa fa-files-o"></i>
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
					<h3>Registered Listings</h3>
                    <a class="btn btn-success" data-toggle="modal" href="#createListingModal" style="margin-bottom: 5px;"><i style="margin-left: 0; margin-right: 5px;" class="fa fa-plus"></i>Create New Listing</a>
				</div> <!-- /widget-header -->
				<div class="widget-content listings">
                    <label class="listings-message" style="display: none;">Click the listing(s) below to update and see more details</label>
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
				&copy; Hyperion Group LLC & LbKStudios LLC. Designed &amp; Built by <a href="http://www.lbkstudios.net" target="_blank">LbKStudios LLC</a>
			</div>
		</div>
	</div>
</div>

<div id="createListingModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Create New Listing</h4>
            </div>
            <div class="modal-body">
                <!-- Put all the fields to create a listing here -->
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <div style="font-weight: 700;">Address</div><input type='text' class='form-control' autocomplete="false" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div style="font-weight: 700;">Unit Number</div><input type='text' class='form-control' />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Rent/Month</label><input type='text' class='form-control' />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Start Date</label><input type='text' class='form-control' />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Bedrooms</label>
                        <select id="bedrooms-filter" class="form-control">
                            <option value="studio">Studio</option>
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10+</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Bathrooms</label>
                        <select id="bathrooms-filter" class="form-control">
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10+</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="modal-switch animals-content">
                            <label>Animals</label><input type='checkbox' data-size='mini' />
                        </div>
                        <div class="modal-switch laundry-content">
                            <label>In-Unit Laundry</label><input type='checkbox' data-size='mini' />
                        </div>
                        <div class="modal-switch parking-content">
                            <label>Parking</label><input type='checkbox' data-size='mini' />
                        </div>
                        <div class="modal-switch airConditioning-content">
                            <label>Air Conditioning</label><input type='checkbox' data-size='mini' />
                        </div>
                        <div class="modal-switch type-content">
                            <label>Lease Type</label><input type='checkbox' data-size='mini' />
                        </div>
                        <div class="modal-switch type-content">
                            <label>Building Type</label><input type='checkbox' data-size='mini' />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-6 ui-widget">
                        <label>Universities</label>
                        <select id="universities-filter" class="form-control">
                        
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Info</label><textarea rows='4' cols='50' class='form-control'></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Images (Will Upload Upon Submit)</label>
                        <form action="/images/enhabit/upload_file.php" data-pic-id="create" class="form-control dropzone"></form>
                    </div>
                </div>
                <!-- Lat, Long, Address Hidden fields -->
                <input type='hidden' class="latitude" /><input type='hidden' class="longitude" /><input type='hidden' class="selected_address" />
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <button id="create-listing-button" type="button" class="btn btn-success" onclick="CreateListing()">Create Listing</button>
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
<script src="../../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="//maps.googleapis.com/maps/api/js?libraries=places"></script>
<script src="../../Libraries/Javascript/bootstrap.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap-switch.min.js"></script>

<!-- jquery geocomplete api -->
<script src="../../Libraries/Javascript/jquery.geocomplete.min.js"></script>
<!-- helper for numeric text boxes -->
<script src="../../Libraries/Javascript/jquery.autoNumeric.js"></script>
<!-- helper for notifications -->
<script src="../../Libraries/Javascript/msgGrowl.js"></script>
<script src="../../Libraries/Javascript/jquery.msgbox.min.js"></script>
<!-- helper for datepicker -->
<script src="../../Libraries/Javascript/pikaday.js"></script>
<script src="../../Libraries/Javascript/pikaday.jquery.js"></script>
<!-- helper for file upload -->
<script src="../../Libraries/Javascript/dropzone.js"></script>

<script src="../../Javascript/landlord/functions.js"></script>

<script>
Dropzone.autoDiscover = false;

var pictures = {}; // object of arrays for update-listing
var dropzones = {};
var addedFiles = {};
var universitiesList = [];

$(function() 
{
    CreateDropzone("create", "#createListingModal form");

    GetAllUniversities();
    GetAccount(true);

    InitSpecialFields();
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

<?php
    session_start();
    
    if (!isset($_SESSION["userId"]) && !isset($_SESSION["landlordId"]))
    {
<<<<<<< HEAD
        header("Location: /#sessiontimeout", FALSE);
        return;
=======
        header("Location: /", FALSE);
<<<<<<< HEAD
>>>>>>> 12b3320... 115 added pricing location
=======
        return;
>>>>>>> 5c2c6d3... 115 returns
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
    <title>Admin | Users</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../../favicon.png">
    
    <link href="../../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-switch.min.css" rel="stylesheet">
    
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dashboard.css" rel="stylesheet"> 

    <link href="../../Styles/admin/custom.css" rel="stylesheet">

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
<<<<<<< HEAD
<<<<<<< HEAD
                        <li class="admin-nav"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Renters</a></li> 
                        <li class="admin-nav"><a style="cursor: pointer;" href="/UniversitiesPortal.php"><i class="fa fa-bank" style="margin-right: 5px;"></i>Universities</a></li>
                        <li class="admin-nav"><a style="cursor: pointer;" href="/PricingPortal.php"><i class="fa fa-money" style="margin-right: 5px;"></i>Pricing</a></li> 
                        <li class="admin-nav"><a style="cursor: pointer;" href="/LogsPortal.php"><i class="fa fa-file-text" style="margin-right: 5px;"></i>Logs</a></li>                        
=======
                        <li class="admin-nav"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Renters</a></li>                 
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 18e6d5a... 107 Full Ticket in this commit
                        <li id="login-function" class="menu-item scroll" onclick="Logout()">
=======
                        <li id="login-function" class="menu-item scroll" href="/logout.php">
>>>>>>> 7e845cc... 107 logout stuff
=======
=======
                        <li class="admin-nav"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Renters</a></li> 
<<<<<<< HEAD
                        <li class="admin-nav"><a style="cursor: pointer;" href="/UniversitiesPortal.php"><i class="fa fa-bank" style="margin-right: 5px;"></i>Universities</a></li>                        
>>>>>>> f518129... 107 universities
=======
                        <li class="admin-nav"><a style="cursor: pointer;" href="/UniversitiesPortal.php"><i class="fa fa-bank" style="margin-right: 5px;"></i>Universities</a></li>
<<<<<<< HEAD
                        <li class="admin-nav"><a style="cursor: pointer;" href="/PricingPortal.php"><i class="fa fa-percent" style="margin-right: 5px;"></i>Pricing</a></li>                        
>>>>>>> 12b3320... 115 added pricing location
=======
                        <li class="admin-nav"><a style="cursor: pointer;" href="/PricingPortal.php"><i class="fa fa-money" style="margin-right: 5px;"></i>Pricing</a></li>                        
>>>>>>> 64522a7... 115 percent to money
                        <li id="login-function" class="menu-item scroll" onclick="Logout()">
>>>>>>> 6d15b60... 107 revert to old logout
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
                    <li class="active">
						<a href="./">
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
                    <li>
						<a href="../renters">
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
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
>>>>>>> f518129... 107 universities
=======
                    <li>
						<a href="../pricing">
							<i class="fa fa-money"></i>
							<span>Pricing</span>
						</a>	    				
					</li>
>>>>>>> 12b3320... 115 added pricing location
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
                    <h3>Registered Users</h3>
					<a class="btn btn-success" data-toggle="modal" href="#createUserModal" style="margin-bottom: 5px;"><i style="margin-left: 0; margin-right: 5px;" class="fa fa-plus"></i>Create New User</a>
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

<div id="createUserModal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Create New User</h4>
            </div>
            <div class="modal-body">
                <!-- Put all the fields to create a listing here --> 
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Username: </label><input type="text" class="form-control" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Password: </label><input type="password" class="form-control" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Confirm Password: </label><input type="password" class="form-control" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>First Name: </label><input type="text" class="form-control" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Last Name: </label><input type="text" class="form-control" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 required">
                        <label>Email: </label><input type="text" class="form-control" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Phone Number: </label><input type="text" class="form-control" placeholder="xxx-xxx-xxxx" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="modal-switch landlord-content">
                            <label>Landlord</label><input type='checkbox' data-size='mini' />
                        </div>
                        <div class="modal-switch active-content">
                            <label>Active</label><input type='checkbox' data-size='mini' />
                        </div>   
                        <div class="modal-switch verified-content">
                            <label>Verified</label><input type='checkbox' data-size='mini' />
                        </div> 
                        <div class="modal-switch admin-content">
                            <label>Admin</label><input type='checkbox' data-size='mini' />
                        </div>  
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <button id="create-user-button" type="button" class="btn btn-success" onclick="CreateAccount()">Create User</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
   
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
    
<script src="../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap-switch.min.js"></script>

<script src="../../Libraries/Javascript/msgGrowl.js"></script>
<script src="../../Libraries/Javascript/jquery.msgbox.min.js"></script>

<script src="../../Javascript/admin/functions.js"></script>

<script>

$(function() 
{   
    InitSpecialFieldsUser();

    GetAllUsers();
});

</script>

  </body>
</html>

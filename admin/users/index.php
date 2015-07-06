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
    <title>Admin | Users</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../css/bootstrap-switch.min.css" rel="stylesheet">
    
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../css/font-awesome.min.css" rel="stylesheet">
    
    <link href="../css/ui-lightness/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
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
                    <li class="active">
						<a href="./">
							<i class="icon-user"></i>
							<span>Users</span>
						</a>	    				
					</li>
                    <li>
						<a href="../listings">
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
					<h3>Registered Users</h3>
				</div> <!-- /widget-header -->
				<div class="widget-content">
                    <p class="user-error alert alert-danger" style="display: none;" role="alert"></p>
                    <p class="user-success alert alert-success" style="display: none;" role="alert"></p>
                    <table class="table">
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Landlord</th>
                            <th>Active</th>
                            <th>IsAdmin</th>
                            <th><!-- Update --></th>
                            <th><!-- Delete --></th>
                        </tr>
                        <tr id="create-user"> 
                            <td><input type="text" class='form-control'></td>
                            <td><input type="password" class='form-control'></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="text" class='form-control'></td>
                            <td><input type="checkbox" data-size="mini"></td>
                            <td><input type="checkbox" checked data-size="mini"></td>
                            <td><input type="checkbox" data-size="mini"></td>
                            <td><button class='btn btn-success' onclick='create_user()'><i style="margin-right: 4px;" class="icon-plus"></i>Create New User</button></td>
                        </tr> 
                    </table>
					<table class="table" id="user-list">
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Landlord</th>
                            <th>Active</th>
                            <th>IsAdmin</th>
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
<script src="../js/libs/bootstrap.min.js"></script>
<script src="../js/libs/bootstrap-switch.min.js"></script>

<script src="../js/functions.js"></script>

<script>

$(function() 
{
    get_all_users();
    
    init_checkboxes();
});

</script>

  </body>
</html>

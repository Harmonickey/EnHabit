<?php

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
    <title>Tenant | Account</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../../favicon.png">
    
    <link href="../../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-switch.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-tagsinput.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/pikaday.css" rel="stylesheet">
    
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/dashboard.css" rel="stylesheet"> 

    <link href="../../Styles/tenant/custom.css" rel="stylesheet">

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
            <a class="logo" href="/"><img src='../../assets/images/theme_images/logo_white.png' height="50"/></a>
            <a class="navbar-brand" href="./"> Tenant Portal</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">                           
                    <a id="title_username" href="javscript:;" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="fa fa-user"></i> 
                        <?php if (isset($_SESSION["tenant"])) { echo $_SESSION["tenant"]; } ?>
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a style="cursor: pointer;" href="./">Account</a></li>
                        <li><a style="cursor: pointer;" onclick="Logout()">Logout</a></li>
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
                    <li class="active">
                        <a href="./">
                            <i class="fa fa-book"></i>
                            <span>Account</span>
                        </a>
                    </li>
                    <li>
						<a href="../listings">
							<i class="fa fa-th-list"></i>
							<span>Listings</span>
						</a>	    				
					</li>
                    <li>
						<a href="../payments">
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
      	<div class="col-md-8">
      		<div class="widget stacked">
      			<div class="widget-header actions">
                    <i class="fa fa-user"></i>
					<h3>Your Account Info</h3>
				</div> <!-- /widget-header -->
				<div class="widget-content account">
                    <!-- Account info goes here -->
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 required">
                            <label>Username: </label><input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 required">
                            <label>Email: </label><input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 required">
                            <label>First Name: </label><input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 required">
                            <label>Last Name: </label><input type="text" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6 required">
                            <label>Phone Number: </label><input type="text" class="form-control" placeholder="xxx-xxx-xxxx" />
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label>New Password: </label><input type="password" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <label>Confirm: </label><input type="password" class="form-control" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-sm-6">
                            <button class='btn btn-primary' onclick='UpdateAccount();'>Update Account</button> 
                            <button class='btn btn-danger' onclick='DeleteAccount();'>Delete Account</button>
                        </div> 
                    </div>
				</div> <!-- /widget-content -->
			</div> <!-- /widget -->					
	    </div> <!-- /col-md-8 -->     	
        <div class="col-md-4">
      		<div class="well">
      			<h4>Did You Know?</h4>
				<p>You use your account to access everything with Enhabit, including your transactions!</p>										
				<p>You are <b>not</b> required to change your password every time you make a change to other pieces of your account here.</p>
            </div>  <!-- /well --> 								
	    </div>  <!-- /col-md-4 -->
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

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
<script src="../../Libraries/Javascript/bootstrap.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap-switch.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap-tagsinput.min.js"></script>

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

<script src="../../Javascript/tenant/functions.js"></script>

<script>

$(function() 
{   
    getAccount();
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

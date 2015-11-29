<?php

    include_once("analytics.php");

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
    <title>Admin | Home</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">   

    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../favicon.png">    
    
    <link href="../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../Libraries/Styles/font-awesome.min.css" rel="stylesheet">        
    
    <link href="../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
    <link href="../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
    
    <link href="../Libraries/Styles/dashboard.css" rel="stylesheet">   

    <link href="../Styles/admin/custom.css" rel="stylesheet">

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
                        <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/AnalyticsPortal.php"><i class="fa fa-bar-chart" style="margin-right: 5px;"></i>Analytics</a></li>
                        <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/UsersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Users</a></li>
                        <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>Listings</a></li>
                        <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/PaymentsPortal.php"><i class="fa fa-usd" style="margin-right: 5px;"></i>Payments</a></li>
                        <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>Renters</a></li>                 
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
					<li class="active">
						<a href="./">
							<i class="fa fa-home"></i>
							<span>Home</span>
						</a>	    				
					</li>                   
                    <li>
						<a href="./users">
							<i class="fa fa-user"></i>
							<span>Users</span>
						</a>	    				
					</li>                   
                    <li>
						<a href="./listings">
							<i class="fa fa-copy"></i>
							<span>Listings</span>
						</a>	    				
					</li>
                    <li>
						<a href="./payments">
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
				</ul>
			</div> <!-- /.subnav-collapse -->
		</div> <!-- /container -->
	</div> <!-- /subnavbar-inner -->
</div> <!-- /subnavbar -->
    
<div class="main">
    <div class="container">
        <div class="row">
            <div class="col-md-12 col-xs-12">
                <div class="widget stacked">
                    <div class="widget-header">
                        <i class="fa fa-star"></i>
                        <h3>Site Analytics</h3>
                    </div> <!-- /widget-header -->
                    <div class="widget-content">
                        <div class="stats">
                            <div class="stat">
                                <span id="site-visits" class="stat-value"></span>									
                                Site Visits
                            </div> <!-- /stat -->
                            <div class="stat">
                                <span id="unique-visits" class="stat-value"></span>									
                                Unique Visits
                            </div> <!-- /stat -->
                            <div class="stat">
                                <span id="new-visits" class="stat-value"></span>									
                                New Visits
                            </div> <!-- /stat -->
                        </div> <!-- /stats -->
                        <div class="stats">
                            <div class="stat stat-time">									
                                <span id="page-download-time" class="stat-value"></span>
                                Average Page Download Time
                            </div> <!-- /substat -->					
                            <div class="stat stat-time">									
                                <span id="average-time-on-site" class="stat-value"></span>
                                Average Time on Site
                            </div> <!-- /substat -->
                        </div> <!-- /substats -->
                    </div> <!-- /widget-content -->
                </div> <!-- /widget -->	
            </div>
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

<script src="../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="../Libraries/Javascript/bootstrap.min.js"></script>

<script src="../Libraries/Javascript/jquery.flot.js"></script>
<script src="../Libraries/Javascript/jquery.flot.pie.js"></script>
<script src="../Libraries/Javascript/jquery.flot.resize.js"></script>

<script src="../../Libraries/Javascript/msgGrowl.js"></script>
<script src="../../Libraries/Javascript/jquery.msgbox.min.js"></script>

<script src="../Javascript/admin/functions.js"></script>

<!--<script src="./js/charts/area.js"></script>
<script src="./js/charts/donut.js"></script>-->

<script>

$(function() 
{
    <?php
        $analytics = getService();
        $profile = getFirstProfileId($analytics);;
        $results = getSiteStats($analytics, $profile);
        echo "var analytics = JSON.parse('";
        echo printResults($results);
        echo "');";
    ?>
    
    DisplayAnalytics(analytics);
});

</script>

  </body>
</html>

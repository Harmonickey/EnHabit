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
    <title>Landlord | Energy</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">    
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../../favicon.png">
    
    <link href="../../Libraries/Styles/bootstrap.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-switch.min.css" rel="stylesheet">
    <link href="../../Libraries/Styles/bootstrap-tagsinput.css" rel="stylesheet">
    
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    <link href="../../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">
    
    <link href="../../Libraries/Styles/msgGrowl.css" rel="stylesheet">
    <link href="../../Libraries/Styles/jquery.msgbox.css" rel="stylesheet">
    
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
                <li class="landlord-nav"><a style="cursor: pointer;" href="/EnergyPortal.php"><i class="fa fa-bolt" style="margin-right: 5px;"></i>Save on Energy</a></li>
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
                    <li>
						<a href="../listings">
							<i class="fa fa-th-list"></i>
							<span>Listings</span>
						</a>	    				
					</li>
                    <li class="active">
						<a href="./">
							<i class="fa fa-bolt"></i>
							<span>Save on Energy</span>
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
                <div class="widget-header text-center" style="height: 55px;">
                    <img style="height: 50px; display: inline-block; margin-top: -15px;" src="../../assets/images/theme_images/PKLogo.png" />
                    <h1 style="margin-top: 5px; display: inline-block;">Direct Access To Top Energy Suppliers</h1> 
                </div>
                <div class="widget-content text-center">
                    <div class="inner cover">
                                  
                        <div class="row row-centered">
                            <div id="serviceTypesContainer" class="col-md-6 col-sm-6 col-lg-6 col-centered">
                                <img id="loader1" src="../../Libraries/Styles/images/AjaxLoader.gif" style="display: none;">  
                                <ul id="serviceTypes" class="nav nav-pills nav-justified">
                  
                                </ul>
                            </div>
                        </div>      
                        <p class="lead">Start By Entering Your Zip Code!</p>            
                        <div class="row row-centered">              
                            <div id="zipContainer" class="col-md-4 col-centered" style="float: none; margin: 0 auto;">        
                                <input id="zipCode" class="form-control input-lg text-center" type="text" placeholder="#####" />
                            </div>
                        </div>
                        <div class="row row-centered">
                            <div id="utilityAlert" class="alert alert-danger" style="display: none;"></div>
                            <div id="utilitiesContainer" class="col-md-4 col-centered dropdown" style="display: none; float: none; margin: 10px auto;">
                                <label for="utilitiesDropdown">Select Your Utility</label>
                                 <button id="utilitiesDropdown" type="button" class="btn btn-default dropdown-toggle text-capitalize" data-toggle="dropdown">
                                    <span class="caret"></span>
                                </button>
                                <ul id="utilities" role="menu" aria-labelledby="utilitiesDropdown" class="dropdown-menu text-capitalize">                     
                                </ul>
                            </div>
                        </div>
                        <div class="row row-centered">
                            <div id="zoneAlert" class="alert alert-danger" style="display: none;"></div>
                            <div id="zonesContainer" class="col-md-4 col-centered dropdown" style="display: none; float: none; margin: 10px auto;">
                                <label for="zonesDropdown">Select Your Zone</label>
                                <button id="zonesDropdown" type="button" class="btn btn-default dropdown-toggle text-capitalize" data-toggle="dropdown">
                                    <span class="caret"></span>
                                </button>
                                <ul id="zones" role="menu" aria-labelledby="zonesDropdown" class="dropdown-menu text-capitalize">
                                </ul>
                            </div>
                        </div>
                        <div class="row row-centered">
                            <div id="submitContainer" class="col-md-4 col-centered" style="display: none; float: none; margin: 0 auto;">
                                <button id="submit" type="button" class="btn btn-primary" onclick="SubmitQuery();"><i class="fa fa-usd"></i> Save Money Now!</button>
                            </div>
                        </div>
                        <form id="data-submit" class="hidden" action="http://energy.enhabitlife.com/direct:home/remoteBegin" method="post" >

                            <input type="hidden" name="directAgentID" id="directAgentId" value="energetic">
                            <input type="hidden" name="stateID" id="stateID" value="">
                            <input type="hidden" name="serviceTypeID" id="serviceTypeID" value="">
                            <input type="hidden" name="zipCode" id="zipCodeID" value="">
                            <input type="hidden" name="utilityID" id="utilityID" value="">
                            <input type="hidden" name="zone" id="zoneID" value="">
                            <input type="submit" name="rfq" id="getRates">

                        </form>

                    </form>
                  </div>
              </div>		
            </div>
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

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="//maps.googleapis.com/maps/api/js?libraries=places"></script>
<script src="../../Libraries/Javascript/bootstrap.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap-switch.min.js"></script>
<script src="../../Libraries/Javascript/bootstrap-tagsinput.min.js"></script>

<!-- jquery geocomplete api -->
<script src="../../Libraries/Javascript/jquery.geocomplete.min.js"></script>
<!-- helper for numeric text boxes -->
<script src="../../Libraries/Javascript/jquery.autoNumeric.js"></script>

<script src="../../Libraries/Javascript/msgGrowl.js"></script>
<script src="../../Libraries/Javascript/jquery.msgbox.min.js"></script>

<script src="../../Libraries/Javascript/powerkiosk.js"></script>

<script>

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-64824617-1', 'auto');
ga('send', 'pageview');

</script>
  </body>
</html>

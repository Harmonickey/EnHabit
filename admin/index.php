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
    
    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
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
            <a class="navbar-brand" href="./">Enhabit Admin</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">						
                    <a href="javscript:;" class="dropdown-toggle" data-toggle="dropdown">
                        <i class="fa fa-user"></i> 
                        <?php if(isset($_SESSION["admin"])) { echo $_SESSION["admin"]; } ?>
                        <b class="caret"></b>
                    </a>			
                    <ul class="dropdown-menu">
                        <li><a style="cursor: pointer;" onclick="logout()">Logout</a></li>
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
        <div class="row">
            <div class="col-md-6 col-xs-12">
                <div class="widget widget-nopad stacked">	
                    <div class="widget-header">
                        <i class="fa fa-list-alt"></i>
                        <h3>Transactions Summary</h3>
                    </div> <!-- /widget-header -->
                    <div class="widget-content">
                        <ul class="news-items">
                            <li>
                                <div class="news-item-detail">										
                                    <a href="javascript:;" class="news-item-title">Duis aute irure dolor in reprehenderit</a>
                                    <p class="news-item-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
                                </div>
                                <div class="news-item-date">
                                    <span class="news-item-day">08</span>
                                    <span class="news-item-month">Mar</span>
                                </div>
                            </li>
                            <li>
                                <div class="news-item-detail">										
                                    <a href="javascript:;" class="news-item-title">Duis aute irure dolor in reprehenderit</a>
                                    <p class="news-item-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
                                </div>
                                <div class="news-item-date">
                                    <span class="news-item-day">08</span>
                                    <span class="news-item-month">Mar</span>
                                </div>
                            </li>
                            <li>
                                <div class="news-item-detail">										
                                    <a href="javascript:;" class="news-item-title">Duis aute irure dolor in reprehenderit</a>
                                    <p class="news-item-preview">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
                                </div>
                                <div class="news-item-date">
                                    <span class="news-item-day">08</span>
                                    <span class="news-item-month">Mar</span>
                                </div>
                            </li>
                        </ul>
                    </div> <!-- /widget-content -->
                </div> <!-- /widget -->						
                <div class="widget stacked">
                    <div class="widget-header">
                        <i class="fa fa-file"></i>
                        <h3>Users Summary</h3>
                    </div> <!-- /widget-header -->
                    <div class="widget-content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div> <!-- /widget-content -->
                </div> <!-- /widget -->
            </div> <!-- /span6 -->
            <div class="col-md-6">	
                <div class="widget stacked">
                    <div class="widget-header">
                        <i class="fa fa-bookmark"></i>
                        <h3>Quick Shortcuts</h3>
                    </div> <!-- /widget-header -->
                    <div class="widget-content">
                        <div class="shortcuts">
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-list-alt"></i>
                                <span class="shortcut-label">Apps</span>
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-bookmark"></i>
                                <span class="shortcut-label">Bookmarks</span>								
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-signal"></i>
                                <span class="shortcut-label">Reports</span>	
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-comment"></i>
                                <span class="shortcut-label">Comments</span>								
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-user"></i>
                                <span class="shortcut-label">Users</span>
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-file"></i>
                                <span class="shortcut-label">Notes</span>	
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-picture"></i>
                                <span class="shortcut-label">Photos</span>	
                            </a>						
                            <a href="javascript:;" class="shortcut">
                                <i class="shortcut-icon fa fa-tag"></i>
                                <span class="shortcut-label">Tags</span>
                            </a>				
                        </div> <!-- /shortcuts -->					
                    </div> <!-- /widget-content -->				
                </div> <!-- /widget -->		
                <div class="widget stacked">					
                    <div class="widget-header">
                        <i class="fa fa-signal"></i>
                        <h3>Chart</h3>
                    </div> <!-- /widget-header -->			
                    <div class="widget-content">					
                        <div id="area-chart" class="chart-holder"></div>					
                    </div> <!-- /widget-content -->			
                </div> <!-- /widget -->				
                <div class="widget stacked widget-table action-table">					
                    <div class="widget-header">
                        <i class="fa fa-th-list"></i>
                        <h3>Table</h3>
                    </div> <!-- /widget-header -->				
                    <div class="widget-content">					
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Engine</th>
                                    <th>Browser</th>
                                    <th class="td-actions"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Trident</td>
                                    <td>Internet
                                         Explorer 4.0</td>
                                    <td class="td-actions">
                                        <a href="javascript:;" class="btn btn-xs btn-primary">
                                            <i class="btn-icon-only fa fa-ok"></i>										
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Trident</td>
                                    <td>Internet
                                         Explorer 5.0</td>
                                    <td class="td-actions">
                                        <a href="javascript:;" class="btn btn-xs btn-primary">
                                            <i class="btn-icon-only fa fa-ok"></i>										
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Trident</td>
                                    <td>Internet
                                         Explorer 5.5</td>
                                    <td class="td-actions">
                                        <a href="javascript:;" class="btn btn-xs btn-primary">
                                            <i class="btn-icon-only fa fa-ok"></i>										
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Trident</td>
                                    <td>Internet
                                         Explorer 5.5</td>
                                    <td class="td-actions">
                                        <a href="javascript:;" class="btn btn-xs btn-primary">
                                            <i class="btn-icon-only fa fa-ok"></i>										
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Trident</td>
                                    <td>Internet
                                         Explorer 5.5</td>
                                    <td class="td-actions">
                                        <a href="javascript:;" class="btn btn-xs btn-primary">
                                            <i class="btn-icon-only fa fa-ok"></i>
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Trident</td>
                                    <td>Internet
                                         Explorer 5.5</td>
                                    <td class="td-actions">
                                        <a href="javascript:;" class="btn btn-xs btn-primary">
                                            <i class="btn-icon-only fa fa-ok"></i>										
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>					
                    </div> <!-- /widget-content -->			
                </div> <!-- /widget -->								
            </div> <!-- /span6 -->	
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
    
    displayAnalytics(analytics);
});

</script>

  </body>
</html>

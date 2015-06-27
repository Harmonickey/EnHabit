<!DOCTYPE html>
<?php 

session_start(); 

$one_hour = 3600;

if (!isset($_SESSION['CREATED'])) {
    $_SESSION['CREATED'] = time();
} else if (time() - $_SESSION['CREATED'] > $one_hour) {
    // session started more than 1 hour ago
    session_regenerate_id(true);    // change session ID for the current session and invalidate old session ID
    $_SESSION['CREATED'] = time();  // update creation time
}

?> 
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>Enhabit</title>
        <!-- favicon -->
        <link rel="icon" type="image/png" href="assets/images/other_images/favicon.png">
        <!-- Bootstrap core CSS -->
        <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <!-- Bootstrap theme -->
        <link href="assets/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet">
        <!-- Jquery UI theme -->
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
        <!-- vegas bg -->
        <link href="assets/js/vegas/jquery.vegas.min.css" rel="stylesheet">
        <!-- leaflet styles -->
        <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
        <!-- font awesome -->
        <link href="assets/css/font-awesome/css/font-awesome.min.css" rel="stylesheet">
        <!-- map box styles -->
        <link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.css' rel='stylesheet' />
        <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.css' rel='stylesheet' />
        <!-- styles for this template -->
        <link href="assets/css/styles.css" rel="stylesheet">
        <!-- place your extra custom styles in this file -->
        <link href="assets/css/custom.css" rel="stylesheet">
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
	    <script>
       
        window.fbAsyncInit = function() 
        {
            FB.init(
            {
                appId      : '884055151683178',
                xfbml      : true,
                version    : 'v2.3'
            });
           
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        
        function checkLoginState() 
        {
            FB.getLoginStatus(function(response) 
            {
                statusChangeCallback(response);
            });
        }
        
        function login_facebook()
        {
            FB.login(function(response) 
            {
                if (response.status === 'connected') 
                {
                    //we are good to login!
                    var userID = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                    
                    login_facebook_user(userID, accessToken);
                } 
                else if (response.status === 'not_authorized') 
                {
                    // The person is logged into Facebook, but they are
                    //  not authorized to use our website login feature
                } 
                else 
                {
                    // The person is not logged into Facebook, so we cannot
                    // log them into our website
                }
            });
        }
		
	    </script>
        <div id="map">
            <!-- Outer Container -->
            <div id="outer-container">
                <!-- Left Sidebar -->
                <section id="left-sidebar">
                    <div class="logo">
                        <a href="#intro" class="link-scroll"><img src="assets/images/other_images/logo.png" alt="Enhabit"></a>
                    </div>
                    <!-- .logo -->
                    <!-- Menu Icon for smaller viewports -->
                    <div id="mobile-menu-icon" class="visible-xs" onClick="toggle_main_menu();"><span class="glyphicon glyphicon-th"></span></div>
                    <ul id="main-menu">
                        <li id="login-create-function" class="menu-item scroll" onclick="load_modal(event, 'modal-content-1', 'login');"><a id="login-create" class="btn btn-outline-inverse btn-sm">Log In</a></li>
                        <li id="update-function" class="menu-item scroll" style="display: none;" onclick="load_update_modal(event);"><a id="update-create" class="btn btn-outline-inverse btn-sm">Update Account</a></li>
                        <li id="create-function" class="menu-item scroll" style="display: none;" onclick="load_modal(event, 'modal-content-6', 'listing'); initBoxes();"><a id="listing-create" class="btn btn-outline-inverse btn-sm">Create New Listing</a></li>
                        <li id="manage-function" class="menu-item scroll" style="display: none;" onclick="load_modal(event, 'modal-content-8', 'manage');"><a id="listing-manage" class="btn btn-outline-inverse btn-sm">Manage Your Listings</a></li>
                    </ul>
                    <!-- #main-menu -->
                </section>
                <!-- #left-sidebar -->
                <!-- Login -->
                <div class="content-to-populate-in-modal" id="modal-content-1">
                    <h1>Log In</h1>
                    <label>Username: </label><input type="textbox" class="form-control username" />
                    <label>Password: </label><input type="password" class="form-control password" />
                    <input type="button" class="btn btn-outline-inverse btn-lg login-btn" value="Log In" onclick="login_user();" style="margin-top: 15px;"/>
                    <p style="text-align: center;">Or</p>
                    <button type="button" class="btn btn-outline-inverse btn-lg login-btn-facebook" onclick="login_facebook();" style="margin-top: 15px"/><span class="facebook-icon-for-button"></span><span class="facebook-login-text">Log In using Facebook</span></button>
                    <p class="login-error alert alert-danger" style="display: none;"></p>
                    <div></div>
                    <label for="create" style="margin: 15px 15px 0 0;">Not a Member Yet?   </label><a href="" onclick="populate_and_open_modal(event, 'modal-content-2'); modal_backdrop_height($('#common-modal.modal')); resetModals(); set_default_button_on_enter('login');">Create an Account</a>
                </div>
                <!-- #modal-content-1 -->
                <!-- Register -->
                <div class="content-to-populate-in-modal" id="modal-content-2">
                    <h1>Create New Account</h1>
                    <label for="new_username">Username: </label><input type="text" class="form-control username" />
                    <label for="new_password">Password: </label><input type="password" class="form-control password" />
                    <label for="firstname">First Name: </label><input type="text" class="form-control firstname" />
                    <label for="lastname">Last Name: </label><input type="text" class="form-control lastname" />
                    <label for="email">Email: </label><input type="text" class="form-control email" />
                    <label for="phonenumber">Phone Number: </label><input type="text" class="form-control phonenumber" placeholder="xxx-xxx-xxxx" />
                    <input type="button" class="btn btn-outline-inverse btn-lg register-btn" onclick="create_account()" value="Create Account" style="margin-top: 15px;" />
                    <p class="register-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-2 -->
                <!-- Register -->
                <div class="content-to-populate-in-modal" id="modal-content-3">
                    <h1>Account Creation Success!</h1>
                    <p> You now have an account with Enhabit!  You can create listings and even set up our service with your bank to pay your monthly bills.</p>
                </div>
                <!-- #modal-content-3 -->
                <!-- Update -->
                <div class="content-to-populate-in-modal" id="modal-content-4">
                    <h1>Update Account Info</h1>
                    <label for="firstname">First Name: </label><input type="text" class="form-control firstname" />
                    <label for="lastname">Last Name: </label><input type="text" class="form-control lastname" />
                    <label for="email">Email: </label><input type="text" class="form-control email" />
                    <label for="phonenumber">Phone Number: </label><input type="text" class="form-control phonenumber" placeholder="xxx-xxx-xxxx" />
                    <input type="button" class="btn btn-outline-inverse btn-lg update-btn" onclick="update_account()" value="Update Account" style="margin-top: 15px;" />
                    <p class="update-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-4 -->
                <!-- Update -->
                <div class="content-to-populate-in-modal" id="modal-content-5">
                    <h1>Account Update Success!</h1>
                </div>
                <!-- #modal-content-5 -->
                <!-- Create New Listing -->
                <div class="content-to-populate-in-modal" id="modal-content-6">
                    <h1>Create New Listing</h1>
                    <label for="address">Address: </label><input type="text" class="form-control address" autocomplete="false"/>
                    <input type="hidden" class="latitude" />
                    <input type="hidden" class="longitude" />
                    <input type="hidden" class="selected_address" />
                    <label for="bedrooms">Bedrooms: </label><input type="text" class="form-control bedrooms" />
                    <label for="bathrooms">Bathrooms: </label><input type="text" class="form-control bathrooms"  />
                    <div style="width: 220px; margin: 0 auto;">
                        <div style="float: left;">
                            <label for="animals">Animals: </label>
                            <div style="width: 75px; margin: 0 auto;">
                                <label style="float: left; width: 30px;">Yes</label><input type="radio" class="form-control animals" name="animals" value="Yes">
                                <label style="float: left; width: 30px; margin-top: 5px;">No</label><input type="radio" class="form-control animals" name="animals" value="No" checked="checked">
                            </div>
                        </div>
                        <div style="float: left; margin-left: 15px;">
                            <label for="laundry">In-Unit Laundry: </label>
                            <div style="width: 75px; margin: 0 auto;">
                                <label style="float: left; width: 30px;">Yes</label><input type="radio" class="form-control laundry" name="laundry" value="Yes">
                                <label style="float: left; width: 30px; margin-top: 5px;">No</label><input type="radio" class="form-control laundry" name="laundry" value="No" checked="checked">
                            </div>
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                    <label for="rent">Monthly Rent: </label><input type="text" class="form-control rent" />
                    <label for="startdate">Earliest Available: </label><input type="text" class="form-control starting_date" />
                    <input type="button" class="btn btn-outline-inverse btn-lg listing-btn" onclick="create_listing()" value="Create Listing" style="margin-top: 15px;" />
                    <p class="listing-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-6 -->
                <!-- Create New Listing -->
                <div class="content-to-populate-in-modal" id="modal-content-7">
                    <h1>Listing Creation Success!</h1>
                </div>
                <!-- #modal-content-7 -->
                
                <!-- end: Left Sidebar -->
                <!-- Footer -->
                <section id="footer">
                    <!-- Go to Top -->
                    <div id="go-to-top" onclick="scroll_to_top();"><span class="icon glyphicon glyphicon-chevron-up"></span></div>
                    <!-- copyright text -->
                    <div class="footer-text-line">Copyright &copy; Enhabit LLC. <br>Designed &amp; Built by LbKStudios LLC</div>
                </section>
                <!-- end: Footer -->      
            </div>
            <!-- #outer-container -->
            <!-- end: Outer Container -->
        </div>
        <!-- map box -->
        <!-- Modal -->
        <!-- DO NOT MOVE, EDIT OR REMOVE - this is needed in order for popup content to be populated in it -->
        <div class="modal fade" id="common-modal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <div class="modal-body clearfix">
                    </div>
                    <!-- .modal-body -->
                </div>
                <!-- .modal-content -->
            </div>
            <!-- .modal-dialog -->
        </div>
        <!-- .modal --> 
         <div id="fb-root" class="fb-reset"></div>
        <!-- Javascripts
            ================================================== -->
        <!-- Jquery, Jquery UI, and Bootstrap JS -->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
        <script src="http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
        <script>window.jQuery || document.write('<script src="assets/js/jquery-1.11.2.min.js"><\/script>')</script>
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
        <!-- Javascript Leaflet Library -->
        <script src="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
        <!-- Easing - for transitions and effects -->
        <script src="assets/js/jquery.easing.1.3.js"></script>
        <!-- MapBox API from CDN -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js'></script>
        <!-- MapBox Plugin - Leaflet PIP: Polygon Points Interpretation - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/point-in-polygon/ -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-pip/v0.1.0/leaflet-pip.min.js'></script>
        <!-- MapBox Plugin - Leaflet Draw: Polygon Selection - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-draw -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js'></script>
        <!-- geocomplete api -->
        <script src="assets/js/jquery.geocomplete.min.js"></script>
        <script>
            L.mapbox.accessToken = 'pk.eyJ1IjoiaGFybW9uaWNrZXkiLCJhIjoiZmM4MGM0Mjk0NmJmMDFjMmY3YWY1NmUxMzllMzc5NGYifQ.hdx-TOA4rtQibXkpdLQK4g'; //may want to secure this somehow...
            var map = L.mapbox.map('map', 'mapbox.streets').setView([42.059, -87.682], 15);
            
            //map.on('draw:created', getPointsWithinPolygon);
            
            $(function() 
            {
            	//upon load, get all the entries that are at Northwestern
            	$.ajax(
            	{
            		type: "POST",
            		url: "api.php",
            		data: {data_query: "{\"extensions\": {\"university\": \"Northwestern\"}}"},
            		success: function(res) 
            		{
            			if (contains(res, "No Matching Entries"))
            			{
            				if (res == "")
            				{
            					console.log("No Matching Entries");
            				}
            				else
            				{
            					console.log(res);
            				}
            			}
            			else
            			{
                            insertMarkers(res);
            			}
            		},
            		error: function(res, err) 
            		{
            			console.log(res);
            			console.log(err);
            		}			
            	});
                
                <?php 
                    if (isset($_SESSION['user']))
                    {
                        echo "showLoginFeatures();\n";
                    }
                ?>
            });
            
            function loadDataWithFilter()
            {
            
            	var query = createQuery();
            
            	/*
            	$.ajax(
            	{
            		type: "POST",
            		url: "api.php",
            		data: {data: query},
            		success: function(res) 
            		{
            			insertMarkers(res);
            		},
            		error: function(res, err) 
            		{
            			console.log(res);
            			console.log(err);
            		}
            	});
            	*/
            }
            
            function createQuery()
            {
            	var query = "{}";
            	
            	if ($("#lower").val())
            	{
            		query += "\"lower\": " + $("#lower").val();
            	}
            	if ($("#upper").val())
            	{
            		query += "\"upper\": " + $("#upper").val();
            	}
            	if ($("#bedrooms").val())
            	{
            		query += "\"bedrooms\": " + $("#bedrooms").val();
            	}
            	if ($("#bathrooms").val())
            	{
            		query += "\"bathrooms\": " + $("#bathrooms").val();
            	}
            	if ($("#start_date").val())
            	{
            		query += "\"start_date\": " + $("#start_date").val();
            	}
            	
            	return query;
            }
            
            
            function insertMarkers(res)
            {
            	if (res != "")
            	{
                    var data = JSON.parse(res).data;
            		data.forEach(function(d)
            		{
            			L.marker([d.worldCoordinates.x, d.worldCoordinates.y]).addTo(map);
            		});
            	}
            }
            /*
            function getPointsWithinPolygon(e) 
            {
            	var currentPolyLayer = e.layers[0];
            	for each lat and long in db.listings that are at this school
            	{
            		var latlng = L.latLng(lat, long);
            		var layer = leafletPip.pointInLayer(latlng, currentPolyLayer, true);
            		if (layer.length) 
            		{
            		  // we have found a point in the polygon, now add the marker to the map
            		  L.marker([lat, long]).addTo(map);
            		} 
            	}
            }
            */
            
            
        </script>
        <!-- detect mobile browsers -->
        <script src="assets/js/detectmobilebrowser.js"></script>
        <script src="assets/js/vegas/jquery.vegas.min.js"></script>
        <script src="assets/js/jquery.autoNumeric.js"></script>
        <!-- Custom functions for this theme -->
        <script src="assets/js/functions.js"></script>
        <script src="assets/js/initialise-functions.js"></script>
        <!-- IE9 form fields placeholder fix -->
        <!--[if lt IE 9]>
        <script>contact_form_IE9_placeholder_fix();</script>
        <![endif]-->  
    </body>
</html>

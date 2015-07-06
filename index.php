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
        <title>Enhabit | Find Your Perfect Home</title>
        <!-- favicon -->
        <link rel="icon" type="image/png" href="assets/images/other_images/favicon.png">
        <!-- Bootstrap core CSS -->
        <link href="assets/bootstrap/css/bootstrap.min.css" rel="stylesheet">
        <!-- Bootstrap theme -->
        <link href="assets/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet">
        <!-- Jquery UI theme -->
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
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
                        <li id="login_create-function" class="menu-item scroll" style="display: none;" onclick="load_modal(event, 'modal-content-1', 'login', 'Log In');"><a id="login_create" class="btn btn-outline-inverse btn-sm">Log In</a></li>
                        <li id="manage_account-function" class="menu-item scroll" style="display: none;" onclick="load_modal(event, 'modal-content-8', 'manage_account');"><a class="btn btn-outline-inverse btn-sm">Manage Account</a></li>
                        <li id="manage_listings-function" class="menu-item scroll" style="display: none;" onclick="load_modal(event, 'modal-content-11', 'manage_listing');"><a class="btn btn-outline-inverse btn-sm">Manage Listings</a></li>
                        <li id="view_listings_list-function" class="menu-item scroll" onclick="load_modal(event, 'modal-content-12', 'view_listings_list');"><a class="btn btn-outline-inverse btn-sm">View Listings as List</a></li>
                    </ul>
                    <div id="Filters">
                        <h1>Filter listings:</h1>
                        <div class="item-content">
                            <span>Price Range</span>
                            <span id="amount" style="border:0; color:#f6931f; font-weight:bold;"></span>
                            <div id="PriceRangeSlider" class="slider-secondary" style="margin-top: 1em;"></div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-default dropdown-toggle" type="button" id="Bedrooms" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Select Number of Bedrooms
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="Bedrooms">
                                <li><a href="#" onclick="SetBedrooms(1)">1</a></li>
                                <li><a href="#" onclick="SetBedrooms(2)">2</a></li>
                                <li><a href="#" onclick="SetBedrooms(3)">3</a></li>
                                <li><a href="#" onclick="SetBedrooms(4)">4</a></li>
                            </ul>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-default dropdown-toggle" type="button" id="Bathrooms" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Select Number of Bathrooms
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="Bathrooms">
                                <li><a href="#" onclick="SetBathrooms(1)">1</a></li>
                                <li><a href="#" onclick="SetBathrooms(1.5)">1.5</a></li>
                                <li><a href="#" onclick="SetBathrooms(2)">2</a></li>
                                <li><a href="#" onclick="SetBathrooms(2.5)">2.5</a></li>
                                <li><a href="#" onclick="SetBathrooms(3)">3</a></li>
                                <li><a href="#" onclick="SetBathrooms(4)">4</a></li>
                            </ul>
                        </div>
                        <h3>Animals Allowed:</h3>
                        <form action="">
                            <input type="radio" name="AnimalsAllowed" value="1">Yes
                            <input type="radio" name="AnimalsAllowed" value="0">No
                        </form>
                        <h3>Laundry in Unit:</h3>
                        <form action="">
                            <input type="radio" name="LaundryInUnit" value="1">Yes
                            <input type="radio" name="LaundryInUnit" value="0">No
                        </form>
                        <h3>Parking:</h3>
                        <form action="">
                            <input type="radio" name="Parking" value="1">Yes
                            <input type="radio" name="Parking" value="0">No
                        </form>
                        <h3>Available starting on:</h3>
                        <div id="datepicker-inline"></div>
                        <h3>SubLease:</h3>
                        <form action="">
                            <input type="radio" name="SubLease" value="1">Yes
                            <input type="radio" name="SubLease" value="0">No
                        </form>
                        <h3>Tags: Text Box</h3>
                        <button class="btn btn-default" type="button" id="RefreshListings">
                            Refresh Listings
                        </button>
                    </div>
                    <!-- #main-menu -->
                </section>
                <!-- #left-sidebar -->
                <!-- Login -->
                <div class="content-to-populate-in-modal" id="modal-content-1">
                    <h1>Log In</h1>
                    <label>Username: </label><input type="textbox" class="form-control username" />
                    <label>Password: </label><input type="password" class="form-control password" />
                    <input type="button" class="btn btn-outline-inverse btn-lg login-btn" value="Log In" onclick="login_user(true);" style="margin-top: 15px;"/>
                    <p style="text-align: center;">Or</p>
                    <button type="button" class="btn btn-outline-inverse btn-lg login-btn-facebook" onclick="login_facebook();" style="margin-top: 15px"/><span class="facebook-icon-for-button"></span><span class="facebook-login-text">Log In using Facebook</span></button>
                    <p class="login-error alert alert-danger" style="display: none;"></p>
                    <div></div>
                    <label style="margin: 15px 15px 0 0;">Not a Member Yet?   </label><a href="" onclick="load_modal(event, 'modal-content-2', 'create_account', 'Create an Account');">Create an Account</a>
                </div>
                <!-- #modal-content-1 -->
                <!-- Register -->
                <div class="content-to-populate-in-modal" id="modal-content-2">
                    <h1>Create New Account</h1>
                    <label>Username: </label><input type="text" class="form-control username" />
                    <label>Password: </label><input type="password" class="form-control password" />
                    <label>First Name: </label><input type="text" class="form-control firstname" />
                    <label>Last Name: </label><input type="text" class="form-control lastname" />
                    <label>Email: </label><input type="text" class="form-control email" />
                    <label>Phone Number: </label><input type="text" class="form-control phonenumber" placeholder="xxx-xxx-xxxx" />
                    <input type="button" class="btn btn-outline-inverse btn-lg create_account-btn" onclick="create_account()" value="Create Account" style="margin-top: 15px;" />
                    <p class="create_account-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-2 -->
                <!-- Register -->
                <div class="content-to-populate-in-modal" id="modal-content-3">
                    <h1>Account Creation Success!</h1>
                    <p> You now have an account with Enhabit! You can set up our service with your bank to pay your monthly bills, and even list your apartment!</p>
                </div>
                <!-- #modal-content-3 -->
                <!-- Update -->
                <div class="content-to-populate-in-modal" id="modal-content-4">
                    <h1>Update Account Info</h1>
                    <label>First Name: </label><input type="text" class="form-control firstname" />
                    <label>Last Name: </label><input type="text" class="form-control lastname" />
                    <label>Email: </label><input type="text" class="form-control email" />
                    <label>Phone Number: </label><input type="text" class="form-control phonenumber" placeholder="xxx-xxx-xxxx" />
                    <input type="button" class="btn btn-outline-inverse btn-lg update_account-btn" onclick="update_account()" value="Update Account" style="margin-top: 15px;" />
                    <p class="update_account-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-4 -->
                <!-- Update -->
                <div class="content-to-populate-in-modal" id="modal-content-5">
                    <h1>Account Update Success!</h1>
                </div>
<!--TODO: REMOVE CREATE NEW LISTING -->
                <!-- #modal-content-5 -->
                <!-- Create New Listing -->
                <div class="content-to-populate-in-modal" id="modal-content-6">
                    <h1>Create New Listing</h1>
                    <label>Address: </label><input type="text" class="form-control address" autocomplete="false"/>
                    <input type="hidden" class="latitude" />
                    <input type="hidden" class="longitude" />
                    <input type="hidden" class="selected_address" />
                    <label>Bedrooms: </label><input type="text" class="form-control bedrooms" />
                    <label>Bathrooms: </label><input type="text" class="form-control bathrooms"  />
                    <div style="width: 220px; margin: 0 auto;">
                        <div style="float: left;">
                            <label>Animals: </label>
                            <div style="width: 75px; margin: 0 auto;">
                                <label style="float: left; width: 30px;">Yes</label><input type="radio" class="form-control animals" name="animals" value="Yes">
                                <label style="float: left; width: 30px; margin-top: 5px;">No</label><input type="radio" class="form-control animals" name="animals" value="No" checked="checked">
                            </div>
                        </div>
                        <div style="float: left; margin-left: 15px;">
                            <label>In-Unit Laundry: </label>
                            <div style="width: 75px; margin: 0 auto;">
                                <label style="float: left; width: 30px;">Yes</label><input type="radio" class="form-control laundry" name="laundry" value="Yes">
                                <label style="float: left; width: 30px; margin-top: 5px;">No</label><input type="radio" class="form-control laundry" name="laundry" value="No" checked="checked">
                            </div>
                        </div>
                    </div>
                    <div style="clear: both;"></div>
                    <label>Monthly Rent: </label><input type="text" class="form-control rent" />
                    <label>Earliest Available: </label><input type="text" class="form-control start_date" />
                    <input type="button" class="btn btn-outline-inverse btn-lg create_listing-btn" onclick="create_listing()" value="Create Listing" style="margin-top: 15px;" />
                    <p class="create_listing-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-6 -->
                <!-- Create New Listing -->
                <div class="content-to-populate-in-modal" id="modal-content-7">
                    <h1>Listing Creation Success!</h1>
                </div>
                <!-- #modal-content-7 -->
                <!-- Manage Account -->
                <div class="content-to-populate-in-modal" id="modal-content-8">
                    <h1>Manage Account</h1>
                    <input type="button" class="btn btn-outline-inverse btn-lg update_account-btn" onclick="load_update_account_modal(event);" value="Update Account" style="margin-top: 15px;" />
                    <input type="button" class="btn btn-outline-inverse btn-lg" onclick="load_modal(event, 'modal-content-9', 'delete_account', 'Delete Account');" value="Delete Account" style="margin-top: 15px;" />
                </div>
                <!-- #modal-content 8 -->
                <!-- Delete Account -->
                <div class="content-to-populate-in-modal" id="modal-content-9">
                    <h1 id="delete_account_header">Are you sure?  Please Confirm.</h1>
                    <input type="button" class="btn btn-outline-inverse btn-lg delete_account-btn" onclick="delete_account()" value="Delete Account" style="margin-top: 15px;" />
                    <p class="delete_account-error alert alert-danger" style="display: none;"></p>
                </div>
                <!-- #modal-content-9 -->
                <!-- View My Listings -->
                <div class="content-to-populate-in-modal" id="modal-content-10">
                    <h1>My Listings</h1>
                </div>
<!--TODO: REMOVE MANAGE LISTINGS-->
                <!-- #modal-content-10 -->
                <!-- Manage Listings -->
                <div class="content-to-populate-in-modal" id="modal-content-11">
                    <h1>Manage Your Listings</h1>
                    <input type="button" class="btn btn-outline-inverse btn-lg" onclick="load_modal(event, 'modal-content-10', 'view_listings');" value="View My Listings" style="margin-top: 15px;" />
                    <input type="button" class="btn btn-outline-inverse btn-lg" onclick="load_modal(event, 'modal-content-6', 'create_listing', 'Create Listing'); initBoxes();" value="Create New Listing" style="margin-top: 15px;" />
                </div>
                <!-- #modal-content-11 -->
                
                <!-- end: Left Sidebar -->
                <!-- Footer -->
                <section id="footer">
                    <!-- Go to Top -->
                    <div id="go-to-top" onclick="scroll_to_top();"><span class="icon glyphicon glyphicon-chevron-up"></span></div>
                    <!-- copyright text -->
                    <div class="footer-text-line">Copyright &copy; Enhabit LLC. <br>Designed &amp; Built by <a href="http://www.lbkstudio.net" target="_blank">LbKStudios LLC</a></div>
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
        
        <!-- placeholder for facebook objects -->
        <div id="fb-root" class="fb-reset"></div>
         
        <!-- Javascripts  =============================== -->
        
        <!-- Jquery, Jquery UI, and Bootstrap JS -->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
        <script src="http://maps.googleapis.com/maps/api/js?sensor=false&amp;libraries=places"></script>
        <script>window.jQuery || document.write("<script src='assets/js/jquery-1.11.2.min.js'><\/script>")</script>
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
        
        <!-- Javascript Leaflet Library -->
        <script src="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
        <!-- Easing - for transitions and effects (with modals) -->
        <script src="assets/js/jquery.easing.1.3.js"></script>
        <!-- MapBox API from CDN -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js'></script>
        <!-- MapBox Plugin - Leaflet PIP: Polygon Points Interpretation - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/point-in-polygon/ -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-pip/v0.1.0/leaflet-pip.min.js'></script>
        <!-- MapBox Plugin - Leaflet Draw: Polygon Selection - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-draw -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js'></script>
        <!-- jquery geocomplete api -->
        <script src="assets/js/jquery.geocomplete.min.js"></script>
        <!-- detect mobile browsers (helps with menu side-bar) -->
        <script src="assets/js/detectmobilebrowser.js"></script>
        <!-- helper for numeric text boxes -->
        <script src="assets/js/jquery.autoNumeric.js"></script>
        <!-- Custom functions for this theme -->
        <script src="assets/js/functions.js"></script>
        <script src="assets/js/sliders.js"></script>
        <script src="assets/js/initialise-functions.js"></script>
        <?php 
            if (isset($_SESSION['user']))
            {
                echo "<script type='text/javascript'>showLoginFeatures(); </script>\n";
            }
            else
            {
                echo "<script type='text/javascript'>$('#login_create-function').show();</script>\n";
            }
        ?>
    </body>
</html>
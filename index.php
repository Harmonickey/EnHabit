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
        <link rel="icon" type="image/jpg" href="favicon.png">
        <!-- Bootstrap core CSS -->
        <link href="Libraries/Styles/bootstrap.min.css" rel="stylesheet">
        <!-- Bootstrap theme -->
        <link href="Libraries/Styles/bootstrap-theme.min.css" rel="stylesheet">
        <!-- Tags -->
        <link href="Libraries/Styles/bootstrap-tagsinput.css" rel="stylesheet">
        <!-- Jquery UI theme -->
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
        <!-- Pickaday -->
        <link href="Libraries/Styles/pikaday.css" rel="stylesheet">
        <!-- MsgBoxes -->
        <link href="Libraries/Styles/msgGrowl.css" rel="stylesheet">
        <!-- leaflet styles -->
        <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
        <!-- map box styles -->
        <link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.css' rel='stylesheet' />
        <link href='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.css' rel='stylesheet' />
        <!-- styles for this template -->
        <link href="Styles/main.css" rel="stylesheet">
        <!-- place your extra custom styles in this file -->
        <link href="Styles/themecustom.css" rel="stylesheet">
        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>
    <body>
        <div id="map"></div>
        <!-- Outer Container -->
        <div id="outer-container">
            <!-- Left Sidebar -->
            <section id="left-sidebar">
                <div class="logo">
                    <a href="#intro" class="link-scroll"><img src="assets/images/theme_images/logo_white.png" alt="Enhabit" style="width: 100%;"></a>
                </div>
                <!-- .logo -->
                <!-- Menu Icon for smaller viewports -->
                <div id="mobile-menu-icon" class="visible-xs" onClick="toggle_main_menu();"><span class="glyphicon glyphicon-th"></span></div>
                <ul id="main-menu">
                    <li id="login-function" class="menu-item scroll" onclick="load_modal(event, 'modal-content-1', 'login', 'Log In');"><a id="login" class="btn btn-outline-inverse btn-sm">Log In/Create Account</a></li>
                    <li id="portal-function" class="menu-item scroll" style="display: none;"><a class="btn btn-outline-inverse btn-sm" href="/<?php echo (isset($_SESSION["landlord"]) ? "landlord" : "tenant"); ?>/listings" >Account/Listings</a></li>
                    <li id="view_listings_list-function" class="menu-item scroll" onclick="open_listings_list();"><a class="btn btn-outline-inverse btn-sm">View Listings as List</a></li>
                </ul>
                <div id="Filters">
                    <h1 class="text-center">Filter listings</h1>
                    <div class="item-content">
                        <div class="price-content"">
                            <span>Price Range</span>
                            <span id="amount" style="border:0; color:#b55783; font-weight:bold;">$800 - $1500</span>
                        </div>
                        <div id="PriceRangeSlider" class="slider-secondary" style="margin-top: 1em;"></div>
                    </div>
                    <div class="item-content date-content">
                            <label>Available Starting</label>
                            <input id="datepicker-inline" type="text" class="form-control" value="mm/dd/yyyy"/>
                    </div>
                    <div class="double-item-content">
                        <div class="item-content">
                            <label>Bedrooms?</label>
                            <select id="bedrooms-filter" class="form-control">
                                <option value="studio">Studio</option>
                                <option value="0" selected>0+</option> <!-- just don't include in ruby filter -->
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3+</option>
                            </select>
                        </div>
                        <div class="item-content">
                            <label>Bathrooms?</label>
                            <select id="bathrooms-filter" class="form-control">
                                <option value="0" selected>0+</option> <!-- just don't include in ruby filter -->
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3+</option>
                            </select>
                        </div>
                    </div>
                    <div class="double-item-content">
                        <div class="item-content parking-content">
                            <label>Parking?</label>
                            <select id="parking-filter" class="form-control">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                                <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                            </select>
                        </div>
                        <div class="item-content animals-content">
                            <label>Animals?</label>
                            <select id="animals-filter" class="form-control">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                                <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                            </select>
                        </div>
                    </div>
                    <div class="item-content search-content">
                        <input type="button" class="btn btn-primary" onclick="searchForListings()" value="Search" />
                        <input type="button" class="btn btn-info" value="Show Extra Filters" onclick="open_extras_view();" />
                    </div>
                </div>
                <!-- #main-menu -->
                <!-- Footer -->
                <section id="footer">
                    <!-- copyright text -->
                    <div class="footer-text-line">&copy; Enhabit LLC. <br>Designed &amp; Built by <a href="http://www.lbkstudios.net" target="_blank">LbKStudios LLC</a></div>
                </section>
                <!-- end: Footer -->
            </section>
            <div id="listings_list">
                <div id="listings">
                
                </div>
            </div>
            <div id="extras_view">
                <div id="extras">
                    <div class="double-item-content">
                        <div class="item-content laundry-content">
                            <label>In-Unit Laundry?</label>
                            <select id="laundry-filter" class="form-control">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                                <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                            </select>
                        </div>
                        <div class="item-content airConditioning-content">
                            <label>AC Unit?</label>
                            <select id="airConditioning-filter" class="form-control">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                                <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                            </select>
                        </div>
                    </div>
                    <div class="item-content type-content">
                        <label>Apartment or Sublet?</label>
                        <select id="type-filter" class="form-control">
                            <option value="both">Both</option>
                            <option value="apartment">Apartment</option>
                            <option value="sublet">Sublet</option>
                        </select>
                    </div>
                    <div class="item-content tags-content">
                        <label>Tags (i.e. north campus)</label>
                        <input id="tags-filter" type="text" value="" data-role="tagsinput" />
                    </div>
                </div>
            </div>
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
                <label style="margin: 15px 15px 0 0;">Not a Member Yet?   </label><a style="cursor: pointer;" onclick="load_modal(event, 'modal-content-2', 'create_account', 'Create an Account');">Create an Account</a>
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
            <!-- Log out confirmation -->
            <div class="content-to-populate-in-modal" id="modal-content-12">
                <h1>Logged out successfully!</h1>
            </div>
            <!-- #modal-content-12 -->
            <!-- Pop Up Listing Modal -->
            <div class="content-to-populate-in-modal" id="modal-content-15">
                <div class="item-content listing"> 
                    <div class="popup">
                        <h3></h3> <!-- Address -->
                        <div class="slideshow">
                            <!-- Slideshow content -->
                        </div>
                        <div class="cycle">
                            <a href="#" class=prev>&laquo Previous</a>
                            <a href="#" class=next>Next &raquo</a>
                        </div>
                    </div>
                    <div class='information'> 
                        <input type="button"class="btn btn-info" onclick="" value="Contact Landlord" />
                        <p class='popup-bedrooms'></p>  
                        <p class='popup-bathrooms'></p> 
                        <p class='popup-price'></p> 
                        <p class='popup-type'></p>
                        <p class='popup-animals'></p>
                        <p class='popup-laundry'></p>
                        <p class='popup-parking'></p>
                        <p class='popup-ac'></p>
                        <p class='popup-tags'></p>
                    </div> 
                </div>
            </div>
            <!-- #modal-content-15 -->
            <!-- Multi-Listing -->
            <div class="content-to-populate-in-modal" id="modal-content-16">
                
            </div>
            <!-- #modal-content-16 -->
            <!-- end: Left Sidebar -->    
        </div>
        <!-- #outer-container -->
        <!-- end: Outer Container -->
        
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
        <script>window.jQuery || document.write("<script src='Libraries/Javascript/jquery-1.11.2.min.js'><\/script>")</script>
        <script src="Libraries/Javascript/bootstrap.min.js"></script>
        <script src="Libraries/Javascript/bootstrap-tagsinput.min.js"></script>
        
        <!-- Javascript Leaflet Library -->
        <script src="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
        <!-- Easing - for transitions and effects (with modals) -->
        <script src="Libraries/Javascript/jquery.easing.1.3.js"></script>
        <!-- MapBox API from CDN -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js'></script>
        <!-- MapBox Plugin - Leaflet PIP: Polygon Points Interpretation - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/point-in-polygon/ -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-pip/v0.1.0/leaflet-pip.min.js'></script>
        <!-- MapBox Plugin - Leaflet Draw: Polygon Selection - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-draw -->
        <script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js'></script>
        <!-- jquery geocomplete api -->
        <script src="Libraries/Javascript/jquery.geocomplete.min.js"></script>
        <!-- detect mobile browsers (helps with menu side-bar) -->
        <script src="Libraries/Javascript/detectmobilebrowser.js"></script>
        <!-- helper for numeric text boxes -->
        <script src="Libraries/Javascript/jquery.autoNumeric.js"></script>
        <!-- helper for notifications -->
        <script src="Libraries/Javascript/msgGrowl.js"></script>
        <!-- helper for datepicker -->
        <script src="Libraries/Javascript/pikaday.js"></script>
        <script src="Libraries/Javascript/pikaday.jquery.js"></script>
        <!-- fancy scrollbars -->
        <script src="Libraries/Javascript/jquery.slimscroll.min.js"></script>       
        <!-- Custom functions for this theme -->
        <script src="Javascript/functions.js"></script>
        <script src="Libraries/Javascript/initialise-functions.js"></script>
        <?php 
            if (isset($_SESSION['tenant']) || isset($_SESSION['landlord']))
            {
                echo "<script type='text/javascript'>showLoginFeatures(); </script>\n";
            }
            else
            {
                echo "<script type='text/javascript'>$('#login_create-function').show();</script>\n";
            }
        ?>
        
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

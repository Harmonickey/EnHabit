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
        <script>if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || screen.width <= 800){
window.location ="https://enhabitlife.com/mobile.html";}</script>
    
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
        <!-- Jquery UI theme -->
        <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
        <!-- Owl Carousel Styles -->
        <link rel="stylesheet" href="Libraries/Styles/owl.carousel.css">
        <link rel="stylesheet" href="Libraries/Styles/owl.theme.css">
        <link rel="stylesheet" href="Libraries/Styles/owl.transitions.css">
        <link rel="stylesheet" href="Libraries/Styles/bootstrap-switch.min.css" >
        <link rel="stylesheet" href="Libraries/Styles/dropzone.css" >
        <!-- Pickaday -->
        <link href="Libraries/Styles/pikaday.css" rel="stylesheet">
        <!-- MsgBoxes -->
        <link href="Libraries/Styles/msgGrowl.css" rel="stylesheet">
        <!-- leaflet styles -->
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css" />
        <!-- map box styles -->
        <link href='//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.css' rel='stylesheet' />
        <link href='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.css' rel='stylesheet' />
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
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
        <nav class="navbar navbar-inverse" role="navigation">
            <div class="container">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <a class="logo" href="/"><img src='/assets/images/theme_images/EnhabitLogo_Beta.png' height="56"/></a>
                </div>
                <!--
                <div class="nav navbar-nav navbar-left" style="margin-left: 200px; margin-top: 6px;" >
                    <a id="payment-btn" style="border-radius: 10px; font-weight: bold; font-size: medium; display: none;" class="btn btn-outline-inverse btn-sm" onclick="LoadModal(event, 'modal-content-payment', 'payment', 'Make Payment');">
                        <i class="fa fa-usd" style="margin-right: 5px;"></i>Pay Rent Now
                    </a>
                </div>
                -->
                <div class="nav navbar-nav navbar-left" style="margin-left: 200px; margin-top: 6px;" >
                    <a id="create-listing-btn" style="border-radius: 10px; font-weight: bold; font-size: medium;" class="btn btn-outline-inverse btn-sm" onclick="PostListingModal(event);">
                        Post Listing Now!
                    </a>
                </div>
                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse navbar-ex1-collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <a class="navbar-login-btn" style="display: block;" onclick="LoadModal(event, 'modal-content-login', 'login', 'Log In');">
                            <i class="fa fa-sign-in" style="margin-right: 5px;"></i>Log In
                        </a>
                        <!--I'm commenting this section out because it goes nowhere right now
                        
                        <li class="account-nav">
                            <a href="javascript:void()">
                                Contact Us
                            </a>
                        </li>
                        <li class="account-nav">
                            <a href="javascript:void()">
                                About
                            </a>
                        </li>
                        -->
                        <li class="account-nav dropdown" style="display: none;">      
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
                                <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/UniversitiesPortal.php"><i class="fa fa-bank" style="margin-right: 5px;"></i>Universities</a></li> 
                                <li class="admin-nav" style="display: none;"><a style="cursor: pointer;" href="/PricingPortal.php"><i class="fa fa-money" style="margin-right: 5px;"></i>Pricing</a></li>
                                <li class="admin-nav"><a style="cursor: pointer;" href="/LogsPortal.php"><i class="fa fa-file-text" style="margin-right: 5px;"></i>Logs</a></li>
                                <li class="tenant-nav" style="display: none;"><a style="cursor: pointer;" href="/AccountPortal.php"><i class="fa fa-user" style="margin-right: 5px;"></i>Edit Account</a></li>
                                <li class="tenant-nav" style="display: none;"><a style="cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>My Listing</a></li>
                                <li class='rental-nav' style='display: none;'><a style='cursor: pointer;' href='/PaymentsPortal.php'><i class='fa fa-usd' style='margin-right: 5px;'></i>My Payments</a></li>
                                <li class="landlord-nav" style="display: none;"><a style="cursor: pointer;" href="/AccountPortal.php"><i class="fa fa-user" style="margin-right: 5px;"></i>My Account</a></li>
                                <li class="landlord-nav" style="display: none;"><a style="cursor: pointer;" href="/ApplicantsPortal.php"><i class="fa fa-copy" style="margin-right: 5px;"></i>My Applicants</a></li>                               
                                <li class="landlord-nav" style="display: none;"><a style="cursor: pointer;" href="/ListingsPortal.php"><i class="fa fa-home" style="margin-right: 5px;"></i>My Listings</a></li>
                                <li class="landlord-nav" style="display: none;"><a style="cursor: pointer;" href="/EnergyPortal.php"><i class="fa fa-bolt" style="margin-right: 5px;"></i>Save on Energy</a></li>
                                <li class="landlord-nav" style="display: none;"><a style="cursor: pointer;" href="/RentersPortal.php"><i class="fa fa-users" style="margin-right: 5px;"></i>My Renters</a></li>
                                <li id="login-function" class="menu-item scroll" onclick="LogoutUser()">
                                    <a id="login" style="cursor: pointer;"><i class="fa fa-sign-out" style="margin-right: 5px;"></i>Log Out</a>
                                </li>
                            </ul>
                        </li>
                        
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div> <!-- /.container -->
        </nav>
    
        <div id="map"></div>
        <!-- Outer Container -->
        <div id="outer-container">
            <!-- Left Sidebar -->
            <section id="blurred"></section>
            <section id="left-sidebar"></section>
            <!-- Menu Icon for smaller viewports -->
            <div id="mobile-menu-icon" class="visible-xs" onClick="toggle_main_menu();"><span class="glyphicon glyphicon-th"></span></div>
            <div id="Filters">
                <div id="price-label" class="row">
                    <span>Price Range</span>
                    <span id="amount"></span>
                </div>
                <div id="price-slider" class="row">
                    <div id="PriceRangeSlider" class="slider-secondary" style="margin-top: 1em;"></div>
                </div>
                <div id="datepicker-row" class="row">
                    <div class="col-lg-8 col-md-8 col-sm-8" style="float: none; margin: 0 auto;">
                        <label>Available From</label>
                        <input id="datepicker-inline" type="button" class="form-control" value="MM/DD/YYYY"/>
                    </div>
                </div>
                <div class="double-item-content">
                    <div class="item-content">
                        <label>Bedrooms</label>
                        <div class="styled-select">
                            <select id="Bedrooms-filter" class="form-control">
                                <option value="studio">Studio</option>
                                <option value="0" selected>0+</option> <!-- just don't include in ruby filter -->
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3+</option>
                            </select>
                        </div>
                    </div>
                    <div class="item-content">                        
                        <label>Bathrooms</label>
                        <div class="styled-select"> 
                            <select id="Bathrooms-filter" class="form-control">
                                <option value="0" selected>0+</option> <!-- just don't include in ruby filter -->
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="double-item-content">
                    <div class="item-content parking-content">
                        <label>Parking</label>
                        <div class="styled-select">
                            <select id="Parking-filter" class="form-control">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                                <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                            </select>
                        </div>
                    </div>
                    <div class="item-content animals-content">
                        <label>Animals</label>
                        <div class="styled-select">
                            <select id="Animals-filter" class="form-control">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                                <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <!--<div class="item-content list-view-button">
                        <input type="button" class="form-control" onclick="OpenListingsList();" value="List View" />
                    </div>-->
                </div>
                <ul id="action-menu">
                    <li class="menu-item scroll" onclick="OpenExtrasView();">
                        <a id="extra-filters-btn" type="button">Extra Filters</a>
                    </li>
                    <li id="search-function" class="menu-item scroll" onclick="SearchForListings();">
                        <a id="search" class="btn btn-outline-inverse btn-sm">Search</a>
                    </li>
                </ul>
            </div>
            <!-- #main-menu -->
            <!-- Footer -->
            <section id="footer">
                <!-- copyright text -->
                <div class="footer-text-line">&copy; Enhabit LLC. <br>Designed &amp; Built by <a href="http://www.lbkstudios.net" target="_blank">LbKStudios LLC</a></div>
            </section>
            <!-- end: Footer -->
            <div id="listings_list">
                <div id="listings">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="CloseListingsList();">×</button>
                </div>
            </div>
            <div id="extras_view">
                <div id="extras">
                    <div class="double-item-content">
                        <div class="item-content laundry-content">
                            <label>In-Unit Laundry</label>
                            <div class="styled-select">
                                <select id="Laundry-filter" class="form-control">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                    <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                                </select>
                            </div>
                        </div>
                        <div class="item-content AirConditioning-content">
                            <label>AC Unit</label>
                            <div class="styled-select">
                                <select id="AirConditioning-filter" class="form-control">
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                    <option value="both" selected>Yes &amp; No</option> <!-- just don't include in ruby filter -->
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="item-content type-content">
                        <label>Rental or Sublet</label>
                        <div class="styled-select">
                            <select id="LeaseType-filter" class="form-control">
                                <option value="both">Both</option>
                                <option value="rental">Rental</option>
                                <option value="sublet">Sublet</option>
                            </select>
                        </div>
                    </div>
                    <div class="item-content type-content">
                        <label>Apartment or House</label>
                        <div class="styled-select">
                            <select id="BuildingType-filter" class="form-control">
                                <option value="both">Both</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <!-- #left-sidebar -->
            <!-- Login -->
            <div class="content-to-populate-in-modal" id="modal-content-login">
                <h1 style="margin-top: 0;">Log In</h1>
                <label>Username: </label><input type="textbox" class="form-control Username" />
                <label>Password: </label><input type="password" class="form-control Password" />
                <input type="button" class="btn btn-outline-inverse btn-lg login-btn" value="Log In" onclick="LoginUser(true);" style="margin-top: 15px;"/>
                <p style="text-align: center;">Or</p>
                <button type="button" class="btn btn-outline-inverse btn-lg login-btn-facebook" onclick="LoginFacebook();" style="margin-top: 15px"/><span class="facebook-icon-for-button"></span><span class="facebook-login-text">Log In using Facebook</span></button>
                <p class="login-error alert alert-danger" style="display: none;"></p>
                <div></div>
                <label style="margin: 15px 15px 0 0;">Not a Member Yet?   </label><a style="cursor: pointer;" onclick="LoadModal(event, 'modal-content-register', 'CreateAccount', 'Create an Account');">Create an Account</a>
            </div>
            <!-- #modal-content-login -->
            <!-- Register -->
            <div class="content-to-populate-in-modal" id="modal-content-register">
                <h1>Create New Account</h1>
                <label>Username: </label><input type="text" class="form-control Username" />
                <label>Password: </label><input type="password" class="form-control Password" />
                <label>Confirm Password: </label><input type="password" class="form-control Confirm" />
                <label>First Name: </label><input type="text" class="form-control FirstName" />
                <label>Last Name: </label><input type="text" class="form-control LastName" />
                <label>Email: </label><input type="text" class="form-control Email" />
                <label>Phone Number: </label><input type="text" class="form-control PhoneNumber" placeholder="xxx-xxx-xxxx" />
                <input type="button" class="btn btn-outline-inverse btn-lg CreateAccount-btn" onclick="CreateAccount()" value="Create Account" style="margin-top: 15px;" />
                <p class="CreateAccount-error alert alert-danger" style="display: none;"></p>
            </div>
            <!-- #modal-content-register -->
            <!-- Register -->
            <div class="content-to-populate-in-modal" id="modal-content-register-success">
                <h3>Account Created!</h3>
                <p>Welcome to Enhabit! You can set up our service with your credit or debit card to pay your monthly bills, and even list your apartment when you plan on moving out!</p>
            </div>
            <!-- #modal-content-register-success -->
            <!-- Speedy Payment -->
            <div class="content-to-populate-in-modal" id="modal-content-payment">
                <h1>Pay Rent Now</h1>
                <label class="required">First Name: </label><input type="text" class="form-control Payment FirstName" />
                <label class="required">Last Name: </label><input type="text" class="form-control Payment LastName" />
                <label class="required">Address: </label><input type="text" class="form-control Payment Address" autocomplete="false" />
                <label>Unit: </label><input type="text" class="form-control Payment Unit" placeholder="Ex: 2E"/>
                <label class="required">Rent Amount: </label>
                    <div class="input-group AmountWrapper">
                        <span class="input-group-addon">$</span>
                        <input type="text" class="form-control Payment Rent" placeholder="Ex: 500" />
                    </div>
                <label>Payment Memo: </label><input type="text" class="form-control Memo" />
                <label>Landlord: </label><select class="form-control LandlordEmail" ></select>
                <p class="small">If your landlord is not available, please contact Enhabit.</p>
                <p class="small">Friendly Reminder: Use your Bank Account to avoid PayPal processing fees!</p>
                <input id="GetPaymentKey" type="button" class="btn btn-outline-inverse btn-lg MakePayment-btn" onclick="GetPayKey()" value="Make Payment" style="margin-top: 15px;" />
                <form action='https://www.paypal.com/webapps/adaptivepayment/flow/pay' target='PPDGFrame' class='standard'>
                    <button class='hidden' id='submitBtn'></button>
                    <input id='type' type='hidden' name='expType' value='light'><input id='paykey' type='hidden' name='paykey' value=''>
                </form>
                <p class="MakePayment-error alert alert-danger" style="display: none;"></p>
            </div>
            <!-- #modal-content-payment -->
            <!-- Email -->
            <div class="content-to-populate-in-modal" id="modal-content-email">
                <!-- placeholder for details view -->
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <div class="row row-centered" style="margin-top: 10px;">
                    <div class="col-sm-5 col-md-5 col-lg-5" style="margin: 0 auto; float: none;">
                        <label>Message</label>
                        <textarea rows='10' class="form-control email-message">I would like to meet up with you to view this listing!</textarea>
                    </div>
                </div>
                <div class="row row-centered" style="margin-top: 10px;">
                    <div class="col-sm-5 col-md-5 col-lg-5" style="margin: 0 auto; float: none;">
                        <label>Your Email Address</label>
                        <input type="text" class="form-control email-address" />
                    </div>
                </div>
                <div class="row row-centered" style="margin-top: 10px;">
                    <div class="col-sm-5 col-md-5 col-lg-5" style="margin: 0 auto; float: none;">
                        <label>Phone Number (optional)</label>
                        <input type="text" class="form-control email-phone-number" />
                    </div>
                </div>
                <div class="row row-centered" style="margin-top: 10px;">
                    <div class="col-sm-5 col-md-5 col-lg-5" style="margin: 0 auto; float: none;">
                        <input type="button" class="btn btn-outline-inverse btn-sm email-btn" value="Send Email" style="width: 100px; margin-top: 10px;"/>
                    </div>
                </div>
                <p class="SendEmail-error alert alert-danger" style="display: none;"></p>
                <!-- end application view-->
            </div>
            <!-- End Email -->
            <!-- Pop Up Listing Modal -->
            <div class="content-to-populate-in-modal" id="modal-content-popup-listing">
                <div class="item-content listing"> 
                    <div class="popup">
                        <h3></h3> <!-- Address -->
                        <div class="slideshow-lander">
                            <!-- Slideshow content -->
                        </div>
                    </div>
                    <div class='information'> 
                        <p class='popup-bedrooms'></p>  
                        <p class='popup-bathrooms'></p> 
                        <p class='popup-price'></p> 
                        <p class='popup-leaseType'></p>
                        <p class='popup-buildingType'></p>
                        <p class='popup-animals'></p>
                        <p class='popup-laundry'></p>
                        <p class='popup-parking'></p>
                        <p class='popup-ac'></p>
                        <input type="button"class="btn btn-info" onclick="" value="Contact Landlord" />
                    </div> 
                    <input class="owl-carousel-button btn btn-primary" type="button" class="btn btn-primary" value="View Larger"/>
                </div>
            </div>
            <!-- #modal-content-popup-listing -->
            <!-- Multi-Listing -->
            <div class="content-to-populate-in-modal" id="modal-content-popup-multilisting">
                
            </div>
            <!-- #modal-content-popup-multilisting -->
            <!-- Owl Carousel Popup -->
            <div class="content-to-populate-in-modal" id="modal-content-owl-carousel">
            
            </div>
            <!-- #modal-content-owl-carousel -->
            <!-- end: Left Sidebar -->    
        </div>
        <!-- end: Outer Container -->
        
        <!-- placeholder for details view -->
        <div id="details-view" style="display: none;">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="CloseDetailsView();">×</button>
            <!-- top section -->
            <div id="details-view-slideshow-section" class="row">
                
            </div>
            <div id="details-items" class="row">
                <!-- left section -->
                <div id="details-view-listing-details" class="col-lg-8 col-md-8 col-sm-8">
                
                </div>
                <div id="details-view-actions" class="col-lg-4 col-md-4 col-sm-4">
                
                </div>
                <!-- right section -->
                <!--
                <div class="col-lg-6 col-md-6 col-sm-6">
                    
                    bottom section
                    <div id="details-view-map-section" class="row">
                    
                    </div>
                </div>-->
            </div>
        </div>
        <!-- end details view -->
        <!-- Create Listing Modal -->
        <div class="content-to-populate-in-modal" id="modal-content-listing">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                <h4 class="modal-title">Create New Listing</h4>
            </div>
            <div class="modal-body">
                <!-- Put all the fields to create a listing here -->
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div style="font-weight: 700;">Address</div><input type='text' class='form-control Address' autocomplete="false" />
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div style="font-weight: 700;">Unit Number</div><input type='text' class='form-control Unit' />
                    </div>
                    
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div style="font-weight: 700;">Rent/Month</div><input type='text' class='form-control Rent' />
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <div style="font-weight: 700;">Start Date</div><input type='text' class='form-control Start' />
                    </div> 
                    
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <div style="font-weight: 700;">Bedrooms</div>
                        <select id="bedrooms-filter" class="form-control Bedrooms">
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
                    <div class="col-lg-4 col-md-4 col-sm-4">
                        <div style="font-weight: 700;">Bathrooms</div>
                        <select id="bathrooms-filter" class="form-control Bathrooms">
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
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="modal-switch animals-content">
                            <div style="font-weight: 700;">Animals</div><input class="Animals" type='checkbox' data-size='mini' />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="modal-switch laundry-content">
                            <div style="font-weight: 700;">In-Unit Laundry</div><input class="Laundry" type='checkbox' data-size='mini' />
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="modal-switch parking-content">
                            <div style="font-weight: 700;">Parking</div><input class="Parking" type='checkbox' data-size='mini' />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="modal-switch airConditioning-content">
                            <div style="font-weight: 700;">Air Conditioning</div><input class="AirConditioning" type='checkbox' data-size='mini' />
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="modal-switch type-content">
                            <div style="font-weight: 700;">Lease Type</div><input class="LeaseType" type='checkbox' data-size='mini' />
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-6">
                        <div class="modal-switch type-content">
                            <div style="font-weight: 700;">Building Type</div><input class="BuildingType" type='checkbox' data-size='mini' />
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-12 col-md-12 col-sm-12 ui-widget">
                        <div style="font-weight: 700;">Landlord</div>
                        <select id="landlords-filter" class="form-control Landlord" style="font-size: 14px;">
                        
                        </select>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-12 col-md-12 col-sm-12 ui-widget">
                        <div style="font-weight: 700;">University</div>
                        <select id="universities-filter" class="form-control University" style="font-size: 14px;">
                        
                        </select>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Info</label><textarea rows='4' cols='50' class='form-control Notes'></textarea>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px;">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <label>Images (Will Upload Upon Submit)</label>
                        <form action="/images/enhabit/upload_file.php" data-pic-id="create" class="form-control dropzone"></form>
                    </div>
                </div>
                <!-- Lat, Long, Address Hidden fields -->
                <input type='hidden' class="Latitude" /><input type='hidden' class="Longitude" /><input type='hidden' class="SelectedAddress" />
                <div class="row" style="margin-top: 15px;">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <button id="create-listing-button" type="button" style="border-radius: 10px; font-weight: bold; font-size: medium;" class="btn btn-outline-inverse btn-sm" onclick="PendingListingCreation()">Create Listing</button>
                    </div>
                </div>
                <p class="create-listing-error alert alert-danger" style="display: none;"></p>
            </div>
        </div>
        <!-- Modal -->
        <!-- DO NOT MOVE, EDIT OR REMOVE - this is needed in order for popup content to be populated in it -->
        <div class="modal fade" id="common-modal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content" style="margin-top: 100px; border-radius: 10px;">
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
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
        <script src="//maps.googleapis.com/maps/api/js?libraries=places"></script>
        <script>window.jQuery || document.write("<script src='Libraries/Javascript/jquery-1.11.2.min.js'><\/script>")</script>
        <script src="Libraries/Javascript/bootstrap.min.js"></script>
        
        <!-- Owl Carousel Library -->
        <script src="Libraries/Javascript/owl.carousel.min.js"></script>
        <!-- Javascript Leaflet Library -->
        <script src="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js"></script>
        <!-- Easing - for transitions and effects (with modals) -->
        <script src="Libraries/Javascript/jquery.easing.1.3.js"></script>
        <!-- MapBox API from CDN -->
        <script src='//api.tiles.mapbox.com/mapbox.js/v2.1.9/mapbox.js'></script>
        <!-- MapBox Plugin - Leaflet PIP: Polygon Points Interpretation - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/point-in-polygon/ -->
        <script src='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-pip/v0.1.0/leaflet-pip.min.js'></script>
        <!-- MapBox Plugin - Leaflet Draw: Polygon Selection - Example: https://www.mapbox.com/mapbox.js/example/v1.0.0/leaflet-draw -->
        <script src='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.2.2/leaflet.draw.js'></script>
        <!-- jquery geocomplete api -->
        <script src="Libraries/Javascript/jquery.geocomplete.min.js"></script>
        <!-- detect mobile browsers (helps with menu side-bar) -->
        <script src="Libraries/Javascript/detectmobilebrowser.js"></script>
        <!-- helper for numeric text boxes -->
        <script src="Libraries/Javascript/jquery.autoNumeric.js"></script>
        <!-- helper for switches -->
        <script src="Libraries/Javascript/bootstrap-switch.min.js"></script>
        <!-- helper for notifications -->
        <script src="Libraries/Javascript/msgGrowl.js"></script>
        <!-- helper for file upload -->
        <script src="Libraries/Javascript/dropzone.js"></script>
        <!-- helper for datepicker -->
        <script src="Libraries/Javascript/pikaday.js"></script>
        <script src="Libraries/Javascript/pikaday.jquery.js"></script>
        <!-- fancy scrollbars -->
        <script src="Libraries/Javascript/jquery.slimscroll.min.js"></script>  
        <!-- PayPal -->
        <script src="//www.paypalobjects.com/js/external/dg.js" type="text/javascript"></script>        
        <!-- Custom functions for this theme -->
        <script src="Javascript/functions.js"></script>
        <script src="Libraries/Javascript/initialise-functions.js"></script>
        <?php 
            if (isset($_SESSION['tenant']) || isset($_SESSION['landlord']) || isset($_SESSION['admin']))
            {
                
                $res = "";
                if (isset($_SESSION['tenant']))
                {
                    if (isset($_SESSION['admin']))
                    {
                        $res = "Admin";
                    }
                    else
                    {
                        $res = "Tenant" . (isset($_SESSION["hasRental"]) ? ":HasRental" : "");
                    }
                }
                else if (isset($_SESSION['landlord']))
                {
                    if (isset($_SESSION['admin']))
                    {
                        $res = "Admin";
                    }
                    else
                    {
                        $res = "Landlord";
                    }
                }
                
                echo "<script type='text/javascript'>ShowLoginFeatures(false,'" . $res . "'); </script>\n";
            }
            else
            {
                echo "<script type='text/javascript'>$('#login_create-function').show();</script>\n";
            }
        ?>
        
        <script>
            Dropzone.autoDiscover = false;
        
        
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-64824617-1', 'auto');
          ga('send', 'pageview');

        </script>
        
    </body>
</html>

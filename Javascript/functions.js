/* 
 * GLOBAL VARIABLES
 */
// these should match with the bootrstrap defined widths
window.xs_screen_max = 767;
window.sm_screen_max = 991;

var intervalVal;

var whichModal = "";

var defaultPicture = "404ImageNotFound.png";

var entries = {};
var multiPopup = {};
var listingSlideshows = {};

var listingWaiting = false;
var listingData = {};

var pendingData = null;
var numUploaded = 0;
var numAdded = 0;

var landlordList = [];
var universitiesList = [];

var pictures = {};
var dropzones = {};
var addedFiles = {};

// page background default settings - to change, override them at the top of initialise-functions.js
var background_settings = {
    change_on_mobile: false, // if true, bg changes on mobile devices
    change_on_nonmobile: true, // if true, bg changes on tablet and desktop devices
    use_script: true // set to false if you want to set a custom background (css, video, etc)
}

var markers = new L.FeatureGroup();

L.mapbox.accessToken = 'pk.eyJ1IjoiaGFybW9uaWNrZXkiLCJhIjoiZmM4MGM0Mjk0NmJmMDFjMmY3YWY1NmUxMzllMzc5NGYifQ.hdx-TOA4rtQibXkpdLQK4g';
var map = L.mapbox.map('map', 'mapbox.streets', { zoomControl: false }).setView([42.057, -87.680], 15);
new L.Control.Zoom({ position: 'topright' }).addTo(map);

//map.on('draw:created', getPointsWithinPolygon);

/******** EVENT HANDLERS ***********/

// Disable map mouse features while we're in the sidebar
$("#left-sidebar, #extras_view, #listings_list").bind('mouseover',
    function ()
    {
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
    }
);

// Reenable map mouse features when the mouse is outside of the sidebar
$("#left-sidebar, #extras_view, #listings_list").bind('mouseout',
    function () 
    {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
    }
);

SubscribeSlideshowArrows();

function SubscribeSlideshowArrows()
{
    $('#map, #common-modal, #details-view').on('click', '.slider-arrow img', function() 
    {
        var $slideshow = $(this).closest('.slideshow');
        var $newSlide;
        
        if ($(this).hasClass('slider-arrow-left')) 
        {
            $newSlide = $slideshow.find('.image.active').prev();     
            if ($newSlide.index() < 2) 
            {
                $newSlide = $slideshow.find('.image').last();
            }
        } 
        else if ($(this).hasClass('slider-arrow-right')) 
        {
            $newSlide = $slideshow.find('.image.active').next();
            if ($newSlide.index() < 0) 
            {
                $newSlide = $slideshow.find('.image').first();
            }
        }
        
        $slideshow.find('.active').removeClass('active').hide();
        $newSlide.addClass('active').show();
        return false;
    });
}

/************* THEME HELPER FUNCTIONS **************/
/* 
 * ================================================================
 * VIEWPORT
 *
 * get actual window width/height (to match with css media queries)
 */
function viewport()
{
    var e = window;
    var a = 'inner';
    
    if (!('innerWidth' in window))
    {
        a = 'client';
        e = document.documentElement || document.body;
    }
    
    return {
        width: e[a + 'Width'],
        height: e[a + 'Height']
    };
}

/*
 * ================================================================
 * Mobile Menu Icon
 *
 * Icon which toggles (opens/closes) main menu on smaller resolutions
 */
function toggle_main_menu()
{
    // only applies for mobile window widths
    if (viewport().width <= window.xs_screen_max)
    {
        var mobile_menu_icon = $("#left-sidebar #mobile-menu-icon");
        var main_menu = $("#left-sidebar #main-menu");

        // if menu is already visible, hide it and remove active class for menu icon
        if (main_menu.is(':visible'))
        {
            main_menu.addClass("menu_closed_on_xs").removeClass("menu_opened_on_xs").slideUp("fast", function()
            {
                mobile_menu_icon.removeClass("active");
            });

            return "closed";
        }

        // if menu is hidden, show it and add active class to menu icon
        else
        {
            main_menu.addClass("menu_opened_on_xs").removeClass("menu_closed_on_xs").slideDown("fast", function()
            {
                mobile_menu_icon.addClass("active");
            });

            return "opened";
        }
    }
    // end: only applies for mobile window widths
}

/*
 * ================================================================
 * Main Menu Visiblity on Window Resize
 *
 * Since main menu is hidden on smaller window widths, this function makes sure that it is visible when window is maximised
 */
function main_menu_visiblity_on_resize()
{
    var main_menu = $("#left-sidebar #main-menu");

    // for larger window viewports
    if (viewport().width > window.xs_screen_max)
    {
        // if menu was closed on small (mobile/xs) viewport, show it
        if (main_menu.hasClass("menu_closed_on_xs"))
        {
            main_menu.show();
        }
    }
    // end: for larger window viewports

    // for smaller window viewports (mobile/xs)
    else
    {
        // if menu was closed on small (mobile/xs) viewport, ensure it remains closed
        if (main_menu.hasClass("menu_closed_on_xs"))
        {
            main_menu.hide();
        }
        // if menu was open on small (mobile/xs) viewport, ensure it remains open
        if (main_menu.hasClass("menu_opened_on_xs"))
        {
            main_menu.show();
        }
    }
}

/*
 * ================================================================
 * Sections Content Vertical Position
 *
 * By default, main content for each section is positioned at the bottom of the page. 
 * This function checks the content-wrapper height, and if it is bigger than 80% of the window height, content-wrapper is positioned statically so that a user can scroll down the page, and content is not hidden.
 *
 * This function only applies for non-mobile viewports (when window width is larger than 768px), since on smaller screens, the layout is different
 */
function sections_content_vertical_position()
{
    // only applies for non-mobile window widths (see comment above)
    if (viewport().width > window.xs_screen_max)
    {
        var window_height = $(window).height();
        var content_available_height = 0.8 * window_height; // the available height for the .content-wrapper when it is absolute positioned

        // for each section
        $("#main-content .section-wrapper").each(function()
        {
            var content_wrapper = $(this).find(".content-wrapper");
            var content_wrapper_height = content_wrapper.height();
            var active_section = ($(this).hasClass("active")) ? true : false; // check if this section is active (visible)

            // if content-wrapper height is larger than the height available in page (without content being hidden), set position to static (not absolute)
            if (content_wrapper_height > content_available_height)
            {
                content_wrapper.css(
                {
                    "position": "static"
                });
            }
            // end: if content-wrapper height is larger than the height available

            // if content-wrapper height is smaller than (within) height available, set position to absolute (with bottom and right position set in the CSS)
            else
            {
                content_wrapper.css(
                {
                    "position": "absolute"
                });
            }

        });
        // end: for each section
    }
    // end: only applies for non-mobile

    // for mobile viewport
    else
    {
        // remove absolute positionining for all section's content
        $("#main-content .section-wrapper .content-wrapper").css(
        {
            "position": "static"
        });
    }
    // end: for mobile viewport
}

/*
 * ================================================================
 * Initialise General Links Click Events
 *
 * ** Has to be called BEFORE initialise_main_menu_click_events() **
 *
 * This function handles the onclick events for all the links inside the page with class ".link-scroll"
 * When a link targets an id within the same page, scroll to that id and update active section
 */
function initialise_general_links_click_events()
{
    // in any link inside the page is clicked
    $("a.link-scroll").click(function(event)
    {
        // get target link
        var clicked_link_href = $(this).attr("href");

        // if link is not empty
        if (clicked_link_href !== undefined && clicked_link_href != "" && clicked_link_href != "#")
        {
            var first_character_of_link = clicked_link_href.substr(0, 1); // will be used below

            // if link is to an ID of an element (anchor link)
            if (first_character_of_link == "#")
            {
                // if element with that ID exists inside the page
                if ($(clicked_link_href).length > 0)
                {
                    // add class to identify that scroll is "in action", so that no other scroll functions conflict
                    $("#main-content").addClass("same_page_link_in_action");

                    // scroll to section
                    var target_vertical_offset = $(clicked_link_href).offset().top;
                    $('html, body').stop().animate(
                    {
                        scrollTop: target_vertical_offset
                    }, 1500, 'easeInOutCubic', function()
                    {

                        // remove class used to identify that scroll is "in action", so that no other scroll functions conflict
                        $("#main-content").removeClass("same_page_link_in_action");

                        // set visible section to active
                        update_active_sections_on_scroll();
                    });

                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }

                // if element with that ID doesn't exist
                else
                {
                    return false;
                }
            }
            // end: if link is to an ID of an element (anchor link)

            // normal link
            else
            {
                // acts as a normal link
            }
            // end: normal link

        }
        // end: if link is not empty 

        // empty link
        else
        {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            return false;
        }
    });
    // end: if any link inside the page is clicked
}

/*
 * ================================================================
 * Scroll Up/Down to section wrapper
 *
 * This function scrolls up/down to a section, and calls function which updates section to active
 *
 * @param target_section - section id - the id of the section wrapper to which to scroll to
 * @param clicked_menu_item_id - menu item id - the id of the clicked menu item (if function called after clicking on a menu item)
 * @param change_background - true or false - (default true) if false, do not change background on scroll 
 */
function scroll_to_section(target_section_id, clicked_menu_item_id, change_background)
{
    // only works if the target_section is provided
    if (target_section_id !== undefined && target_section_id != "")
    {
        var target_section_wrapper = $("#main-content " + target_section_id + ".section-wrapper");

        // if target section exists and is not already active
        if (target_section_wrapper.length != 0 && !target_section_wrapper.hasClass("active"))
        {
            var section_vertical_offset = target_section_wrapper.offset().top;

            // close main menu on mobile viewport
            var menu_height = $("#main-menu").height();
            if (toggle_main_menu() == "closed")
            {
                section_vertical_offset = section_vertical_offset - menu_height;
            }

            // scroll to section
            $('html, body').stop().animate(
            {
                scrollTop: section_vertical_offset
            }, 1500, 'easeInOutCubic', function()
            {

                // remove class used to identify that section is "in action", so that no other scroll functions conflict
                $("#main-content").removeClass("same_page_link_in_action");

                // set section to active
                set_section_to_active(target_section_id, clicked_menu_item_id, '', change_background);
            });
        }
        // end: if target section exists

        else
        {
            return false;
        }
    }
    // end: only works if the target_section is provided

    else
    {
        return false;
    }
}

/*
 * ================================================================
 * Set height of parent content wrappers
 *
 * This function looks for any elements (in main content) with .max-height set as class, looks for the parent .content-wrapper and sets its percentage height to fill the page
 * - if a data-height-percent attribute is set to the element with .max-height class, that defined percantage height is used
 */
function set_height_of_parent_content_wrappers()
{
    var elements_with_max_height_class = $("#main-content .max-height");

    // for each element
    elements_with_max_height_class.each(function()
    {
        var parent_content_wrapper = $(this).parents(".content-wrapper");

        // if parent .content-wrapper is found
        if (parent_content_wrapper.length > 0)
        {
            parent_content_wrapper.parents(".section-wrapper").addClass("modified-height");

            // if data-height-percent attribute is set for the element with class ".max-height", then use that defined percentage height
            var defined_height_percentage = $(this).attr("data-height-percent");
            if (defined_height_percentage !== undefined && defined_height_percentage != "" && !isNaN(defined_height_percentage))
            {
                parent_content_wrapper.css(
                {
                    "height": defined_height_percentage + "%"
                });
            }

            // else, if no defined percentage height is set, set a default 80% height to the content-wrapper
            else
            {
                parent_content_wrapper.css(
                {
                    "height": "80%"
                });
            }
        }
        // end: if parent .content-wrapper is found
    });
    // end: for each element
}

/*
 * ================================================================
 * Populate and Open Modal (Popup)
 *
 * @param event - NEEDED to stop default link actions (since link will be used to open popup)
 * @param modal_content_id - the id of the container with the content which will be populated in the modal body
 * @param section_in_modal - selector - optional - if set, when modal is shown, the popup will scroll to this section
 * @param add_class_to_modal - optional - add a class to the modal container (#common-modal)
 * @param keepSidebar - optional - keeps the sidebar in view
 */
function PopulateAndOpenModal(event, modal_content_id, section_in_modal, add_class_to_modal)
{
    var modal = $("#common-modal.modal");
    var modal_body = modal.find(".modal-body");
    var modal_content_container_to_populate = $("#" + modal_content_id);

    var add_class = "";
    if (add_class_to_modal !== undefined && add_class_to_modal != "")
    {
        add_class = add_class_to_modal;
    }

    // if modal and content container exists
    if (modal_body.length > 0 && modal_content_container_to_populate.length > 0)
    {
        // fade out main content of page (so modal content is readable)
        $("#outer-container").fadeTo("fast", 0.2);

        // get initial vertical offset so that when modal is opened/closed, it ensures that page doesn't scroll to top (bugfix)
        var initial_vertical_scroll_offset = $(document).scrollTop();

        var modal_content = modal_content_container_to_populate.html(); // get content to populate in modal
        modal_body.empty().html(modal_content); // first empty the modal body and then populate it with new content

        // open modal (popup)
        modal.modal();

        // lightbox fix - temporary change attribute, to avoid duplicate entries (since same content is printed inside the popup container)
        modal_content_container_to_populate.find("a[data-lightbox]").each(function()
        {
            var attr_value = $(this).attr("data-lightbox");
            $(this).removeAttr("data-lightbox");
            $(this).attr("data-mod-lightbox", attr_value);
        });

        // add class to modal
        if (add_class != "") modal.addClass(add_class);

        // when modal is shown, position it in the middle of the page 
        modal.on('shown.bs.modal', function(e)
        {
            //position_modal_at_centre();
            // if set, scroll to a given section inside the popup
            if (section_in_modal !== undefined && section_in_modal != "" && $("#common-modal.modal").find(section_in_modal).length > 0)
            {
                var section_vertical_offset = $("#common-modal.modal").find(section_in_modal).offset().top;
                $('#common-modal.modal').stop().animate(
                {
                    scrollTop: section_vertical_offset
                }, 800, 'easeInOutCubic');
            }

            // since bootstrap 3.3.1 - fix backdrop height after all elements inside the popup are loaded
            ModalBackdropHeight(modal);
        });

        // when modal starts to close, fade in main content 
        modal.on('hide.bs.modal', function(e)
        {
            $("#outer-container").fadeTo("fast", 1);

            // lightbox fix - reset attribute to original
            $("#" + modal_content_id).find("a[data-mod-lightbox]").each(function()
            {
                var attr_value = $(this).attr("data-mod-lightbox");
                $(this).removeAttr("data-mod-lightbox");
                $(this).attr("data-lightbox", attr_value);
            });
        });

        // when modal is hidden, empty modal body 
        modal.on('hidden.bs.modal', function(e)
        {
            modal_body.empty(); // empty modal body

            if (add_class != "") modal.removeClass(add_class); // remove class
        });

    }
    // end: if modal and content container exists
    if (event != null && event.returnValue != null)
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
    
    $("#common-modal.modal input:first").focus();
   
    return false;
}

/*
 * ================================================================
 * Update modal backdrop height
 * - since bootstrap 3.3.1 - fix backdrop height after all elements inside the popup are loaded
 *
 * @param modal - the modal as an object
 */
function ModalBackdropHeight(modal)
{
    modal.find(".modal-backdrop").css(
    {
        'min-height': modal.find(".modal-dialog").outerHeight(true) + 'px'
    });
}

/*
 * ================================================================
 * Position modal at the centre/middle of the page (if visible)
 *
 */
function position_modal_at_centre()
{
    var modal_outer_container = $(".modal");

    // if modal exists and is visible
    if (modal_outer_container.length > 0 && modal_outer_container.is(":visible"))
    {
        var modal_content_container = modal_outer_container.find(".modal-dialog");
        var modal_width = modal_content_container.width();
        var modal_height = modal_content_container.height();
        var check_if_modal_content_fits_inside_the_page = ((modal_height + 70) < viewport().height) ? true : false;

        // for large viewports only, centre/middle align
        // align in the middle ONLY if the modal content height is less than the window height
        if (viewport().width > window.sm_screen_max && check_if_modal_content_fits_inside_the_page == true)
        {
            var top_margin_to_align_modal_at_middle_of_page = (viewport().height - modal_height) / 2;
            modal_content_container.animate({
                marginTop: top_margin_to_align_modal_at_middle_of_page + "px",
                marginBottom: "20px"
            }, 800, 'easeInOutCubic');
        }
        // end: for large viewports

        // for smaller viewports
        else
        {
            modal_content_container.removeAttr("style");
        }
        // end: for small viewports
    }
}

/*
 * ================================================================
 * Get All Section Wrappers in Page
 *
 * This function returns an array of all the section wrappers in the page
 *
 */
function get_all_section_wrappers_in_page()
{
    var section_wrappers = $("#main-content").find(".section-wrapper");
    return section_wrappers;
}

/*********** CUSTOM FUNCTIONS **************/
 
// Init the facebook stuff
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

function ResetSidebar()
{
    InitMainSidebar();
}

function InitMainSidebar()
{
    InitSlider();
    InitDatePicker();
}

function GetNextMonth(today)
{
    today.setMonth(today.getMonth() + 1);
    
    var monthNum = today.getMonth() + 1;
    
    switch(monthNum)
    {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7: 
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
    }
}

function GetAllLandlords()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data: 
        {
            command: "get_all_users",
            endpoint: "Accounts"
        },
        success: function(res) 
        {
            try
            {
                if (res && !Contains(res, "No Users"))
                {             
                    var data = JSON.parse(res);
                    
                    for (var i = 0; i < data.length; i++)
                    {
                        if (data[i].IsLandlord && data[i].Username != "BJBEvanston" && data[i].Username != "EvanstonRentals")
                        {
                            // create listing dropdown
                            $("#landlords-filter").append("<option value='" + data[i].Username + "'>" + data[i].Username + "</option>");
                            
                            // payment modal dropdown
                            $(".LandlordEmail").append("<option value='" + data[i].Email + "'>" + data[i].Username + "</option>")
                        }
                    }
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}

function InitSlider()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data:
        {
            command: "get_price_range",
            endpoint: "Listings"
        },
        success: function(res) 
        {
            $("#amount").html("");
            try
            {
                var data = JSON.parse(res);
                
                if (data == null || 
                    data.MinRent == null || data.MinRent.Price == null ||
                    data.MaxRent == null || data.MaxRent.Price == null)
                {
                    InitNormalPriceRangeSlider();    
                }
                else
                { 
                    var step = 5;
                    $("#amount").text("$" + data.MinRent.Price + " - $" + data.MaxRent.Price);
                    $("#PriceRangeSlider").slider(
                    {
                        range: true,
                        min: data.MinRent.Price,
                        max: data.MaxRent.Price,
                        step: step,
                        values: [ data.MinRent.Price, data.MaxRent.Price ],
                        slide: function( event, ui )
                        {
                            $("#amount").text ("$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ]);
                        }
                   }); 
                }
            }
            catch(e)
            {
                InitNormalPriceRangeSlider();
            }
        },
        error: function(res, err)
        {
            InitNormalPriceRangeSlider();
        }
    });
}

function InitNormalPriceRangeSlider()
{
    $("#PriceRangeSlider").slider(
    {
        range: true,
        min: 400,
        max: 3000,
        step: 100,
        values: [ 800, 1500 ],
        slide: function( event, ui )
        {
            $("#amount").text ("$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ]);
        }
   }); 
}

function InitDatePicker()
{
    $("#datepicker-inline").pikaday(
    {
        minDate: new Date(), 
        setDefaultDate: new Date()
    });
}

function LoadAllDefaultListings()
{
    var data = {"University": "Northwestern"};
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data: 
        {
            command: "get_listings",
            data: data,
            endpoint: "Listings"
        },
        success: function(res) 
        {
            try
            {
                if (!Contains(res, "No Matching Entries"))
                {
                    InsertMarkers(res);
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err) 
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'});
        }			
    });
}

function SetHiddenSidebars()
{
    var listingsListWidth = parseFloat($("#left-sidebar").css("left")) + parseFloat($("#left-sidebar").css("width"));
    
    $("#listings_list").css("left", listingsListWidth);
    $("#extras_view").css("left", listingsListWidth);
}

function CheckLoginState() 
{
    FB.getLoginStatus(function(response) 
    {
        statusChangeCallback(response);
    });
}

function LoginFacebook()
{
    try
    {
        FB.login(function(response) 
        {
            if (response.status === 'connected') 
            {
                //we are good to login!
                var userID = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                
                LoginFacebookUser(userID, accessToken);
            }
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem with Logging In", position: 'top-center'});
    }
}
 
function SearchForListings()
{
    ResetListings();
    
    var query = CreateQuery();
    var testDate = new Date(query.Start);
    if (testDate == "Invalid Date")
    {
        query.Start = "";
    }
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        beforeSend: function()
        {
            $("#search-function").prop("disabled", true);
            $("#search").text("Searching...");
        },
        data: 
        {
            command: "get_listings",
            data: query,
            endpoint: "Listings"
        },
        success: function(res) 
        {
            try
            {
                if (Contains(res, "No Matching Entries"))
                {
                    throw new Error("No Matching Entries");
                }
                else
                {
                    InsertMarkers(res);
                }
            }
            catch (e)
            {
                $.msgGrowl ({ type: 'warning', title: 'Result', text: "No Matching Entries", position: 'top-center'}); 
            }
        },
        error: function(res, err) 
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'}); 
        },
        complete: function()
        {
            $("#search-function").prop("disabled", false);
            $("#search").text("Search");
        }
    });
}

function CreateQuery()
{
    var query = {};
    query.Price = {Low: 0, High: 0};
    
    query.Price.Low = $("#PriceRangeSlider").slider("values", 0);
    query.Price.High = $("#PriceRangeSlider").slider("values", 1);
    query.Bedrooms = SelectToQueryField($("#Bedrooms-filter").val());
    query.Bathrooms = SelectToQueryField($("#Bathrooms-filter").val());
    query.Start = $.datepicker.formatDate('mm/dd/yy', new Date($("#datepicker-inline").val()));
    query.LeaseType = $("#LeaseType-filter").val();
    query.BuildingType = $("#BuildingType-filter").val();
    query.Laundry = SelectToQueryField($("#Laundry-filter").val());
    query.Parking = SelectToQueryField($("#Parking-filter").val());
    query.AirConditioning = SelectToQueryField($("#AirConditioning-filter").val());
    query.Animals = SelectToQueryField($("#Animals-filter").val());
    query.University = "Northwestern"; // will be set by text box later
    
    return query;
}

function InitSpecialFields()
{
    var listingModal = $("#common-modal input");
    
    $(listingModal[0]).geocomplete()
        .bind("geocode:result", function(event, result){
            var hiddenFields = $("#common-modal input[type='hidden']");
            var keys = Object.keys(result.geometry.location);
            $(hiddenFields[0]).val(result.geometry.location[keys[0]]);
            $(hiddenFields[1]).val(result.geometry.location[keys[1]]);
            $(hiddenFields[2]).val($(listingModal[0]).val());
        });
        
    $("#common-modal input[type='checkbox']").not(".type-content input").bootstrapSwitch({onText: "Yes", offText: "No"});
    $($("#common-modal .type-content input")[0]).bootstrapSwitch({onText: "Rental", offText: "Sublet", 'state': true, 'setState': true});
    $($("#common-modal .type-content input")[0]).prop("checked", true);
    $($("#common-modal .type-content input")[1]).bootstrapSwitch({onText: "Apartment", offText: "House", 'state': true, 'setState': true});
    $($("#common-modal .type-content input")[1]).prop("checked", true);
    
    $(listingModal[2]).autoNumeric('init', 
    {
        aSign: '$ ', 
        vMax: '999999.99', 
        wEmpty: 'sign',
        lZero: 'deny'
    });
    
    $(listingModal[3]).pikaday(
    {
        minDate: new Date(), 
        setDefaultDate: new Date()
    });
}

function ResetListings()
{
    $.each(markers._layers, function(id, marker) 
    {
        map.removeLayer(marker);
    });
    
    $("#listings").html("<button type='button' class='close' data-dismiss='modal' aria-hidden='true' onclick='CloseListingsList();'>×</button>")
    
    markers = new L.FeatureGroup();
    entries = {};
    multiPopup = {};
}

function InsertMarkers(res)
{
    if (res !== "")
    {
        var data = JSON.parse(res);
        
        // organize the data, we might have multiple pins
        // in the same place
        $.each(data, function(index, d) 
        {
            if (entries[d.Address] === undefined)
            {
                entries[d.Address] = [d];
            }
            else
            {
                entries[d.Address].push(d);
            }
        });
        
        $.each(entries, function(address, entry) 
        {
            if (entry.length == 1) // single listing
            {
                var marker = L.marker([entry[0].WorldCoordinates.x, entry[0].WorldCoordinates.y]).addTo(map);
                marker.setIcon(L.mapbox.marker.icon({
                    'marker-color': (entry[0].IsFeatured ? '#4078c0' : '#000'),
                    'marker-size': (entry[0].IsFeatured ? 'large' : 'medium'),
                    'marker-symbol': 'building'
                }));
                
                var slideshowContent = "";
                var base = (entry[0].Testing ? "" : "/images/enhabit/images/");
                var images = entry[0].Thumbnails;
                if (!images || images.length === 0)
                {
                    images = [];
                    images.push(defaultPicture);
                }
                for(var i = 0; i < images.length; i++) 
                {
                    var source = base + images[i];
                    
                    slideshowContent += 
                                        '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                                          '<img src="' + source + '" height="200" width="300"/>' +
                                        '</div>';
                }
                
                var popupContent =  
                            '<a onclick="CloseLeafletPopup()" class="enhabit-popup-close-button">x</a>' +
                            '<div id="' + entry[0]._id.$oid + '" class="popup">' +
                                '<div style="position: absolute; top: 5%; left: 5%; z-index: 1; width: 83%;">' +
                                    '<h2>' + entry[0].Address + ' ' + (entry[0].Unit ? "<br>Unit " + entry[0].Unit : "") + '</h2>' +
                                    '<h3>$' + entry[0].Price + '</h3>' +
                                '</div>' +
                                '<div class="slideshow">';
                                
                if (images.length > 1)
                {
                    popupContent += '<div class="slider-arrow slider-left"><img src="assets/images/theme_images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
                                    '<div class="slider-arrow slider-right"><img src="assets/images/theme_images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
                }
                
                entry[0].Thumbnails = ToStringFromList(entry[0].Thumbnails);
                
                popupContent += slideshowContent +
                                '</div>' +
                            '</div>' +
                            "<input type='button' class='btn btn-outline-inverse btn-sm popup-details-btn' value='More Details' onclick=\"OpenListing('" + entry[0]._id.$oid + "', '" + entry[0].Address + "', '" + entry[0].Unit + "', '" + entry[0].Start + "', '" + entry[0].Bedrooms + "', '" + entry[0].Bathrooms + "', '" + entry[0].Price + "', '" + entry[0].LeaseType + "', '" + entry[0].BuildingType + "', '" + entry[0].Notes + "', '" + entry[0].HasAnimals + "', '" + entry[0].HasLaundry + "', '" + entry[0].HasParking + "', '" + entry[0].HasAirConditioning + "', [" + entry[0].Thumbnails + "], '" + entry[0].WorldCoordinates.x + "', '" + entry[0].WorldCoordinates.y + "', '" + entry[0].Testing + "')\" />";
                
                popupContent += '<div class="popup-background-shadow"></div>';
                
                marker.bindPopup(popupContent, 
                {
                    closeButton: true,
                    minWidth: 320
                });
                
                markers.addLayer(marker);
                
                InsertIntoListView(entry[0]);
                
                InsertIntoListingSlideshowObject(entry[0]);
            }
            else if (entry.length > 1) // multi listings
            {   
                var marker = L.marker([entry[0].WorldCoordinates.x, entry[0].WorldCoordinates.y]).addTo(map);
                marker.setIcon(L.mapbox.marker.icon({
                    'marker-color': (entry[0].IsFeatured ? '#4078c0' : '#000'),
                    'marker-size': (entry[0].IsFeatured ? 'large' : 'medium'),
                    'marker-symbol': 'building'
                }));
                
                var popupContent =  
                            '<a onclick="CloseLeafletPopup()" class="enhabit-popup-close-button">x</a>' +
                            '<div class="popup">' +
                                '<h2 class="multi-h2">' + entry[0].Address + '</h2>' +
                                '<p class="multi-p">Multiple listings available.</p>' +
                                '<input type="button" class="btn btn-outline-inverse btn-sm multi-showall" value="Show All" onclick="LoadMultipleListings(\'' + entry[0].Address + '\')">' +
                            '</div>';
                
                marker.bindPopup(popupContent, 
                {
                    closeButton: true,
                    minWidth: 320
                });
                
                markers.addLayer(marker);
                 
                // now that we have a pin, we need to fill in our section of the hash
                $.each(entry, function(index, listing)
                {
                    listing.Thumbnails = ToStringFromList(listing.Thumbnails);
                    
                    var listingPic = (listing.Thumbnails.length !== 0 ? listing.Thumbnails.split(",")[0].replace(/'/, "") : defaultPicture);

                    var base = (listing.Testing ? "" : "/images/enhabit/images/");
                    
                    var listingHtml = "<div class='item-content listing'>" +
                                "<img src='" + base + listingPic + "' height='100' width='100' />" +
                                "<div class='information text-left'>" +
                                    "<p class='listing-address'>" + listing.Address + " " + (listing.Unit ? listing.Unit : "") + "</p><br>" +
                                    "<p class='listing-price'>$" + listing.Price + "/month</p><br>" +
                                    "<p class='listing-bedrooms'>" + listing.Bedrooms + " Bedroom" + (listing.Bedrooms == 1 ? "" : "s") + "</p>" + 
                                    "<p class='listing-bathrooms'>" + listing.Bathrooms + " Bathroom" + (listing.Bathrooms == 1 ? "" : "s") + "</p><br>" +
                                    "<p class='listing-buildingType'>" + listing.BuildingType.CapitalizeFirstLetter() + " - " + listing.LeaseType.CapitalizeFirstLetter() + "</p><br>" +
                                    "<input type='button' class='btn btn-outline-inverse btn-sm multi-more-details' value='More Details' onclick=\"OpenListing('" + listing._id.$oid + "', '" + listing.Address + "', '" + listing.Unit + "', '" + listing.Start + "', '" + listing.Bedrooms + "', '" + listing.Bathrooms + "', '" + listing.Price + "', '" + listing.LeaseType + "', '" + listing.BuildingType+ "', '" + listing.Notes + "', '" + listing.HasAnimals + "', '" + listing.HasLaundry + "', '" + listing.HasParking + "', '" + listing.HasAirConditioning + "', [" + listing.Thumbnails + "], '" + listing.WorldCoordinates.x + "', '" + listing.WorldCoordinates.y + "', '" + listing.Testing + "')\" />" + 
                                "</div>" +
                            "</div>";
                    
                    if (multiPopup[listing.Address] === undefined)
                    {
                        multiPopup[listing.Address] = [listingHtml];
                    }
                    else
                    {
                        multiPopup[listing.Address].push(listingHtml);
                    }
                    
                    InsertIntoListView(listing);
                    
                    InsertIntoListingSlideshowObject(listing);
                });
            }
        });
    }
    
    //map.fitBounds(markers.getBounds());
    map.fitBounds(markers.getBounds(), { paddingTopLeft: [250, 75] });
    //map.setZoom(map.getZoom() - 1); 
    clearInterval(intervalVal);
}

function CloseLeafletPopup()
{
    map.closePopup();
}

function InsertIntoListingSlideshowObject(entry)
{
    var slideShowHTML = 
    "" +
    "<div id='owl-slider-" + entry._id.$oid + "' class='owl-carousel popup-image-gallery'>";
    var base = (entry.Testing ? "" : "/images/enhabit/images/");
    for (var i = 0; i < entry.Pictures.length; i++)
    {
        slideShowHTML += 
        "<div>" +
            "<img class='lazyOwl' data-src='" + base + entry.Pictures[i] + "'>" +
        "</div>";
    }
    slideShowHTML += "</div>";
    
    listingSlideshows[entry._id.$oid + ""] = slideShowHTML;
}

function LoadMultipleListings(address)
{
    $("#modal-content-popup-multilisting").html("");
    
    $.each(multiPopup[address], function(index, entry)
    {
        $("#modal-content-popup-multilisting").append(entry);
    });
    
    PopulateAndOpenModal(null, 'modal-content-popup-multilisting');
    
    position_modal_at_centre();
}

function InsertIntoListView(data)
{
    if (typeof data.Thumbnails === "object")
    {
        data.Thumbnails = ToStringFromList(data.Thumbnails);
    }
    
    $("#listings").append(
        "<div class='item-content listing'>" +
            "<p class='listing-leaseType'>" + data.LeaseType.CapitalizeFirstLetter() + "</p><br>" +
            "<p class='listing-buildingType'>" + data.BuildingType.CapitalizeFirstLetter() + "</p><br>" +
            "<img src='assets/images/theme_images/loader.gif' height='100' width='100' />" +
            "<div class='information'>" +
                "<div class='col-lg-3 col-md-3 col-sm-3'>" +
                    "<div class='row'>" +
                        "<p class='listing-address'>" + data.Address + " " + (data.Unit ? data.Unit : "") + "</p>" +
                    "</div>" +
                    "<div class='row'>" +
                        "<p class='listing-price'>$" + data.Price + "/month</p>" +
                    "</div>" +
                "</div>" +
                "<div class='col-lg-4 col-md-4 col-sm-4'>" +
                    "<div class='row'>" +
                        "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                            "<p class='listing-bedrooms'>" + data.Bedrooms + " Bedroom" + (data.Bedrooms == 1 ? "" : "s") + "</p>" +                
                        "</div>" + 
                        "<div class='col-lg-6 col-md-6 col-sm-6'>" +
                            "<p class='listing-bathrooms'>" + data.Bathrooms + " Bathroom" + (data.Bathrooms == 1 ? "" : "s") + "</p><br>" + 
                        "</div>" +
                    "</div>" +
                "</div>" +
                "<div class='col-lg-2 col-md-2 col-sm-2'>" +
                    "<input type='button' class='btn btn-outline-inverse btn-sm' value='More Details' onclick=\"OpenListing('" + data._id.$oid + "', '" + data.Address + "', '" + data.Unit + "', '" + data.Start + "', '" + data.Bedrooms + "', '" + data.Bathrooms + "', '" + data.Price + "', '" + data.LeaseType + "', '" + data.BuildingType + "', '" + data.Notes + "', '" + data.HasAnimals + "', '" + data.HasLaundry + "', '" + data.HasParking + "', '" + data.HasAirConditioning + "', [" + data.Thumbnails + "], '" + data.WorldCoordinates.x + "', '" + data.WorldCoordinates.y + "', '" + data.Testing + "')\" />" +
                "</div>" +
            "</div>" +
        "</div>");
    
    var image = $("#listings .item-content img").last()[0];
    var downloadingImage = new Image();
    var base = (data.Testing ? "" : '/images/enhabit/images/');
    downloadingImage.onload = function()
    {
        image.src = this.src;   
    };
    if (typeof data.Thumbnails === "object" && data.Thumbnails.length > 0)
    {
        downloadingImage.src = base + data.Thumbnails[0];
    }
    else if (typeof data.Thumbnails === "string" && data.Thumbnails !== "" || data.Thumbnails.length == 0)
    {
        downloadingImage.src = base + data.Thumbnails.split(",")[0].replace(/'/g, "");
    }
    else
    {
        downloadingImage.src = base + defaultPicture;
    }
}

function OpenListing(Id, Address, Unit, Start, Bedrooms, Bathrooms, Price, LeaseType, BuildingType, Notes, Animals, Laundry, Parking, AirConditioning, Images, x, y, Testing)
{
    $("#common-modal").modal('hide');
    
    $("#details-view").fadeIn();
    
    //location.hash = Id;
    
    //load up the images into the modal...
    var slideshowContent = "";
    var base = (Testing == 'true' ? "" : "/images/enhabit/images/");
    if (!Images || Images.length === 0)
    {
        Images = [];
        Images.push(defaultPicture);
    }
    for(var i = 0; i < Images.length; i++)
    {
        var source = base + Images[i];

        slideshowContent += 
                            '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                              '<img src="' + source + '" height="200" width="300" />' +
                            '</div>';
    }
    
    var slideshowModalContent = '<div class="slideshow" style="position: relative;">';
    if (Images.length > 1)
    {
        slideshowModalContent += '<div class="slider-arrow slider-left"><img src="assets/images/theme_images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
        '<div class="slider-arrow slider-right"><img src="assets/images/theme_images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
    }
    
    slideshowModalContent += slideshowContent +
    '</div>';
    
    var notes = Notes.replace("#39", "'").replace("#34", "\"");
    
    var detailsContent = 
    "<div class='container-fluid' style='padding-left: 40px;'>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                "<h2>" + Address + " " + (Unit ? Unit : "") + "</h2>" +
            "</div>" + 
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                "<h2>$" + Price + "/Month</h2>" +
            "</div>" + 
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-12 col-md-12 col-sm-12'>" +
                "<h2>Available " + DateToHumanReadable(Start) + "</h2>" +
            "</div>" + 
        "</div>" +
        "<div class='row' style='margin-top: 25px;'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground' style='border-top-left-radius: 10px;'>" +
                "<p>Bedrooms: " + Bedrooms + "</p>" + 
            "</div>" +
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground' style='border-top-right-radius: 10px;'>" +
                "<p>Lease Type: " + LeaseType.CapitalizeFirstLetter() + "</p>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground'>" +
                "<p>Bathrooms: " + Bathrooms + "</p>" +
            "</div>" + 
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground'>" +
                "<p>Building Type: " + BuildingType.CapitalizeFirstLetter() + "</p>" +
            "</div>" +
        "</div>" +
        "<div class='row'>" + 
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground'>" +
                "<p>Animals: " + BooleanToHumanReadable(Animals) + "</p>" + 
            "</div>" +
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground'>" +
                "<p>Air Conditioning: " + BooleanToHumanReadable(AirConditioning) + "</p>" + 
            "</div>" +
        "</div>" +
        "<div class='row'>" +
            "<div class='col-lg-3 col-md-3 col-sm-3 lightbackground' style='border-bottom-left-radius: 10px;'>" +
                "<p>Parking: " + BooleanToHumanReadable(Parking) + "</p>" + 
            "</div>" + 
            "<div class='col-lg-5 col-md-5 col-sm-5 lightbackground' style='border-bottom-right-radius: 10px;'>" +
                "<p>In-Unit Laundry: " + BooleanToHumanReadable(Laundry) + "</p>" + 
            "</div>" +
        "</div>" +
        (notes == null || notes == "" ? "" : 
        "<div class='row' style='margin-top: 50px;'>" +
            "<div class='col-lg-8 col-md-8 col-sm-8 darkbackground'>" +
                "<p>" + (notes != "undefined" ? notes : "") + "</p>" + 
            "</div>" +
        "</div>") +
    "</div>";
    
    var actionsContent =
    "<div class='col-lg-12 col-md-12 col-sm-12'>" +
        //"<div class='row'>" +
            //"<input type='button' class='btn btn-outline-inverse btn-sm details-listing-action-btn' value='Apply' onclick='Apply(\"" + Id + "\");' />" +
        //"</div>" +
        //"<div class='row'>" +
        //    "<input type='button' class='btn btn-outline-inverse btn-sm details-listing-action-btn' value='Share' //onclick='ShareListing(\"" + Id + "\");' />" +
        //"</div>" +
        "<div class='row'>" +
            "<input type='button' class='btn btn-outline-inverse btn-sm details-listing-action-btn' value='Contact' onclick='CreateEmailMessage(\"" + Id + "\");' />" +
        "</div>" +
    "</div>";
    
    $("#details-view-slideshow-section").html(slideshowModalContent); 
    
    $("#details-view-listing-details").html(detailsContent);
    
    $("#details-view-actions").html(actionsContent);
    /*
    $('#details-view-listing-details .container-fluid').slimScroll({
        height: '100%',
        railVisible: true,
        alwaysVisible: true,
        size: '10px'
    });
    */
    var width = $("#details-view").width();
    $("#details-items").width(width);
    var height = $("#details-view-slideshow-section .slideshow").height();
    $("#details-view-slideshow-section .slider-arrow").css("top", (height / 2) - 22);

    //var detailsMap = L.mapbox.map('details-view-map-section', 'mapbox.streets').setView([parseFloat(x), parseFloat(y)], 17);
    //L.marker([parseFloat(x), parseFloat(y)], {icon: enhabitIcon}).addTo(detailsMap);
    
    SubscribeSlideshowArrows();
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
function LoginUser(hideMainModal)
{
    ResetModal("login", "Log In", false);
    
    var data = BuildData(["Username", "Password"]);

    data.Confirm = data.Password; // just to get around the password thing...
    
    var error = BuildError(data);
    
    if (error != "Please Include<br>")
    {
        SetError("login", error);
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data:
            {
                command: "login",
                data: data,
                user: data["Username"], //to be used as session variable later
                endpoint: "Accounts"
            },
            beforeSend: function()
            {
                DisableModalSubmit('login');
            },
            success: function(res)
            {
                try
                {
                    if (Contains(res, "Okay"))
                    {
                        ShowLoginFeatures(hideMainModal, res);
                        
                        if (listingWaiting)
                        {
                            CreateListing();
                        }
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch(e)
                {
                    SetError('login', "Incorrect User/Password Combination.");
                }
            },
            error: function(res, err)
            {
                SetError('login', res);
            },
            complete: function()
            {
                ResetModal("login", "Log In", false);
            }
        });
    }
}

function GetAllUniversities()
{
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data: 
        {
            command: "get_all_universities",
            endpoint: "Universities"
        },
        success: function(res) 
        {
            try
            {
                if (res && !Contains(res, "No Universities"))
                {             
                    var data = JSON.parse(res);
                    
                    for (var i = 0; i < data.length; i++)
                    {
                        $("#universities-filter").append("<option value='" + data[i].UniversityName + "'>" + data[i].UniversityName + "</option>");
                    }
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });     
}

function PostListingModal(event)
{
    // loading the listing modal
    LoadModal(event, 'modal-content-listing', 'listing', 'Post Listing');
    
    // make sure the picture dropzone is created
    CreateDropzone("create", "#common-modal form");
    
    // initialize all the fields in the form
    InitSpecialFields();
}

/* Just a proxy method for handling the special listing creation mechanism... */
function PendingListingCreation()
{
    // wait for registering
    listingWaiting = true;
    
    var input = $(".modal-dialog input, .modal-dialog select, .modal-dialog textarea");
    
    var data = BuildCreateListingData(input, ["Address", "Unit", "Rent", "Start", "Bedrooms", "Bathrooms", "Animals", "Laundry", "Parking", "AirConditioning", "LeaseType", "BuildingType", "Landlord", "University", "Notes", "Latitude", "Longitude", "SelectedAddress"]);
    
    var error = BuildCreateListingError(data);
    
    data.LeaseType = (data.LeaseType == true ? "rental" : "sublet");
    data.BuildingType = (data.BuildingType == true ? "apartment" : "house");
    data.Address = data.Address.split(",")[0];
    data.Start = $.datepicker.formatDate('mm/dd/yy', new Date(data.Start));
    data.Pictures = pictures["create"]; // global variable modified by dropzone.js, by my custom functions
    
    if (error != "Please Include ")
    {
        SetError('create-listing', error);
    }
    else
    {
        listingData = data;
        
        // load the register modal
        LoadModal(event, 'modal-content-register', 'CreateAccount', 'Create an Account');
    }
}

function LoginFacebookUser(userID, accessToken)
{
    var data = {"Username": userID, "Password": accessToken};
    
    //facebook already does the validation of username and password
    // in addition, we don't need to check for null values because it's
    // already handled on the facebook side, the code would not reach
    // here if that was the case...
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data:
        {
            command: "facebook_login",
            data: data,
            user: userID,
            endpoint: "Accounts"
        },
        success: function(res)
        {
            try
            {
                if (Contains(res, "Okay"))
                {
                    ShowLoginFeatures(true, res);
                }
                else
                {
                    throw new Error("Problem Logging In");
                }
            }
            catch(e)
            {
                SetError('login', "Problem Logging In");
            }
        },
        error: function(res, err)
        {
            SetError('login', res);
        },
        complete: function()
        {
            ResetModal("login", "Log In", false);
            
            $("#DeleteAccount_header").siblings("label").remove();
            $("#DeleteAccount_header").siblings("input.password").remove();
        }
    });
}

function Apply(listingId)
{
    if ($(".navbar-login-btn").css("display") == "block")
    {
        LoadModal(null, 'modal-content-login', 'login', 'Log In');
    }
    else
    {
    
        var data = 
        {
            ListingId: listingId
        };
        
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data:
            {
                command: "add_applicant",
                data: data,
                endpoint: "Applicants"
            },
            success: function(res)
            {
                try
                {
                    if (Contains(res, "Okay"))
                    {
                        $.msgGrowl ({ type: 'success', title: 'Success', text: "Application Sent!", position: 'top-center'});
                    }
                    else if (Contains(res, "Update"))
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: "Please Update Your Account", position: 'top-center'});
                    }
                    else if (Contains(res, "Apply"))
                    {
                        $.msgGrowl ({ type: 'error', title: 'Error', text: "Cannot Apply To Your Own Listing!", position: 'top-center'});
                    }
                    else
                    {
                        throw new Error("Problem Sending Application");
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Sending Application", position: 'top-center'});
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            }
        });
    }
}

function LogoutUser()
{
	RemoveLoginFeatures();
    
    $.ajax(
    {
        type: "POST",
        url: "logout.php",
        success: function(res)
        {
            try
            {
                if (Contains(res, "Successfully"))
                {
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Logout Success", position: 'top-center'});
                }
                else
                {
                    throw new Error("Problem Logging Out");
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem Logging Out", position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        }
    });
}

function RemoveLoginFeatures()
{
    $(".navbar-login-btn").show();
    $(".account-nav").hide();
    $("#payment-btn").show(); // just in case an admin logged out
    $("#payment-btn").attr("onclick", "LoadModal(event, 'modal-content-payment', 'payment', 'Make Payment')");
    $("#create-listing-btn").attr("onclick", "PostListingModal(event);");
}

function ShowLoginFeatures(hideMainModal, userType)
{   
    $(".navbar-login-btn").hide();
    $(".account-nav .dropdown-menu li").not("#login-function").hide(); // reset menu
    $(".account-nav").show();
    
    if (Contains(userType, "Admin"))
    {
        $(".admin-nav").show();
        $("#payment-btn").hide(); // admins don't pay rent!!
        $("#create-listing-btn").attr("onclick", "window.location='/admin/listings/';");
    }
    if (Contains(userType, "Landlord"))
    {
        $(".landlord-nav").show();
        $("#payment-btn").hide(); // landlords don't pay rent!!
        $("#create-listing-btn").attr("onclick", "window.location='/landlord/listings/';");
    }
    if (Contains(userType, "Tenant"))
    {
        $(".tenant-nav").show();
        $("#payment-btn").show(); // in case we're going from landlord to user
        if (Contains(userType, "HasRental"))
        {
            $(".rental-nav").show();
            $("#payment-btn").attr("onclick", "window.location='/tenant/payments/';"); // go to the special payment page
        }
        
        $("#create-listing-btn").attr("onclick", "window.location='/tenant/listings/';");
    }

    if (hideMainModal === true)
    {
        HideMainModal();
    }
}

function HideMainModal()
{
    $("#common-modal").modal('hide');
}

function ResetModal(modal, btnText, hide)
{  
    $("." + modal + "-btn").val(btnText);
    $("." + modal + "-btn").attr('disabled', false);
    if (hide)
    {
        $("." + modal + "-error").hide();
    }
}

function DisableModalSubmit(modal)
{
    $("." + modal + "-btn").val("Processing...").attr("disabled", true);
}

function CreateAccount()
{
    var data = BuildData(["Username", "Password", "Confirm", "FirstName", "LastName", "Email", "PhoneNumber"]);
                                    
    var error = BuildError(data);
    
    if (error != "Please Include<br>")
    {
        SetError("CreateAccount", error);
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            data:
            {
                command: "create_account",
                data: data,
                endpoint: "Accounts"
            },
            beforeSend: function()
            {
                DisableModalSubmit("CreateAccount");
            },
            success: function(res)
            {
                try
                {
                    if (Contains(res, "_id"))
                    {
                        LoginUser(false);
                        
                        PopulateAndOpenModal(null, 'modal-content-register-success');
                        
                        $('#common-modal.modal').animate({ scrollTop: 0 }, "slow");
                        
                        if (listingWaiting)
                        {
                            CreateListing();
                        }
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch(e)
                {
                    SetError("CreateAccount", e.message);
                }
            },
            error: function(res, err)
            {
                SetError("CreateAccount", res);
            },
            complete: function()
            {
                ResetModal("CreateAccount", "Create Account", false);
                
                SetDefaultButtonOnEnter("");
            }
        });
    }
}

function DateToHumanReadable(date)
{
    var date = new Date(date);
    
    return (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + "/" + date.getUTCFullYear();
}

function LoadModal(event, which, enterDefault, btnText)
{ 
    PopulateAndOpenModal(event, which); 
    ResetModal(enterDefault, btnText, true); 
    SetDefaultButtonOnEnter(enterDefault); 
    //also try to reset the modal backdrop height 
    //      because it's different for each modal
    
    ModalBackdropHeight($('#common-modal.modal')); 
    
    if (which == "modal-content-payment")
    {
        $(".Address").geocomplete();
    
        var today = new Date();
        var nextMonth = "Ex: " + GetNextMonth(today) + "'s Rent";
        
        $(".Memo").attr("placeholder", nextMonth);
    }
} 

function OpenListingsList()
{
    //do not want to open 100% of page width because our 'left' offset needs to be accounted for
    var openWidth = parseFloat($("html").css("width")) - parseFloat($("#listings_list").css("left"));
    $("#listings_list").animate(
    {
        width: openWidth
    }, 500, 'easeInOutCubic', LoadListingsList);
}

function LoadListingsList()
{
    $("#listings").fadeIn();
    
    //then change the view listings list to "Hide Listings"
    $(".list-view-button input").attr("onclick", "CloseListingsList()");
}

function CloseListingsList()
{
    $("#listings").fadeOut(200, function() 
    {
        $("#listings_list").animate(
        {
            width: "0px"
        }, 500, 'easeInOutCubic', function() 
        {
            $(".list-view-button input").attr("onclick", "OpenListingsList()");
        });
    });
}

function CloseDetailsView()
{
    $("#details-view").html(
        "<button type='button' class='close' data-dismiss='modal' aria-hidden='true' onclick='CloseDetailsView();'>×</button>" +
        "<div id='details-view-slideshow-section' class='row'></div>" + 
        "<div id='details-items' class='row'>" +
            "<div id='details-view-listing-details' class='col-lg-8 col-md-8 col-sm-8'></div>" +
            "<div id='details-view-actions' class='col-lg-4 col-md-4 col-sm-4'></div>" +
        "</div>");
        
    $("#details-view").fadeOut();
    
    //location.hash = "";
    
    SubscribeSlideshowArrows();
}

function OpenExtrasView()
{
    $("#extras_view").animate(
    {
        width: parseFloat($("#left-sidebar").css("width")),
        paddingLeft: "5px",
        paddingRight: "5px"
    },
    {
        duration: 300,
        easing: 'easeInOutCubic',
        done: function ()
        {
			$("#extras").fadeIn(200);
            $(".extra-filter-button input").attr("onclick", "CloseExtrasView()");
        }
    });
}

function CloseExtrasView()
{
    $("#extras").fadeOut(200, function() 
    {
        $("#extras_view").animate(
        {
            width: "0px",
            paddingLeft: "0px",
            paddingRight: "0px"
        }, 300, function() 
        {
            $(".extra-filter-button input").attr("onclick", "OpenExtrasView()");
        });
    });
}

function CreateListing()
{   
    console.log("here");

    var data = listingData;
    
    try
    {
        // need to put data into a saved state because uploading fileSize
        // is asynchronous
        pendingData = data;
        
        $("#create-listing-button").text("Creating...");
        $("#create-listing-button").prop("disabled", true);
        
        // async call, caught in dropzone.success event handler below
        if (numAdded == 0)
        {
            ProcessListing();
        }
        else
        {
            dropzones["create"].processQueue();
        }
    }
    catch(e)
    {
        $("#create-listing-button").prop("disabled", false);
        $("#create-listing-button").text("Create Listing");
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
    }
}

function ProcessListing()
{
    if (pendingData == null)
    {
        return;
    }
    
    // create listing
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data:
        {
            command: "create_listing",
            data: pendingData,
            endpoint: "Listings"
        },
        success: function(res)
        {    
            try
            {
                if (!res)
                {
                    throw new Error("Unable to Create Listing");
                }
                else
                {
                    var listing = JSON.parse(res);
                        
                    if (listing["error"])
                    {
                        throw new Error(listing["error"]);
                    }
                    else
                    {
                        ResetListings();
                        
                        LoadAllDefaultListings();
                        
                        numUploaded = 0;
                        
                        pendingData = null;
                        
                        listingWaiting = false;
                        
                        listingData = {};
                    }
                }
            }
            catch(e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
            }
        },
        error: function(res, err)
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
        },
        complete: function()
        {
            $("#create-listing-button").prop("disabled", false);
            $("#create-listing-button").text("Create Listing");
            
            dropzones["create"].destroy();
            
            CreateDropzone("create", "#modal-content-listing form");
        }
    });
}

function CreateDropzone(key, element, existingPics)
{
    dropzones[key] = new Dropzone(element,
    {
        addRemoveLinks: true,
        autoProcessQueue: false
    });
    
    var myDropzone = dropzones[key];
    
    myDropzone.on("success", function(file)
    {   
        if (numUploaded == numAdded - 1)
        {
            numUploaded = 0;
            numAdded = 0;
            $(".dz-progress").remove();
            ProcessListing(); 
        }
        else
        {
            numUploaded++;
            $(".dz-progress").remove();
        }
    });
    
    myDropzone.on("addedfile", function(file) 
    {
        var oid = $(this.element).data("pic-id");
        if (pictures[oid] == null)
        {
            pictures[oid] = [];
        }
        var filename = (file.alreadyUploaded 
                        ? file.name
                        : (file.name.split(".").length > 1 ? file.name.split(".")[0] + "_" + Math.random().toString(36).slice(2) + "." + file.name.split(".")[file.name.split(".").length - 1]
                                                           : Math.random().toString(36).slice(2) + "_" + file.name));
        pictures[oid].push(filename);
        
        if (!file.alreadyUploaded)
        {
            this.files[this.files.length - 1].serverFileName = filename;
        }
        
        addedFiles[oid] = true;
        
        numAdded++;
    });
    
    myDropzone.on("removedfile", function(file) 
    {
        var index = this.files.indexOf(file);
        
        var oid = $(this.element).data("pic-id");
        if (pictures[oid] == null)
        {
            pictures[oid] = [];
        }

        pictures[oid].splice(index, 1); 
        
        numAdded--;
        
        if (numAdded < 0)
        {
            addedFiles[oid] = false;
            numAdded = 0;
        }
    });
    
    if (existingPics != null)
    {
        for (var i = 0; i < existingPics.length; i++)
        {
            var mockFile = { name: existingPics[i], alreadyUploaded: true};

            myDropzone.emit("addedfile", mockFile);
            numAdded--;
            myDropzone.emit("thumbnail", mockFile, "/images/enhabit/images/" + mockFile.name);
            myDropzone.emit("complete", mockFile);
        }
    }
}

function SetDefaultButtonOnEnter(modal)
{
    if (modal !== "")
    {
        //reset for next set
        $(document).unbind("keypress");
        which_modal = "." + modal + "-btn";
    }
    else
    {
        which_modal = "";
    }
    
    $(document).on("keypress", function(e)
    {
        var code = e.keyCode || e.which;
        if (code == 13)
        {
            $(".modal-body ." + modal + "-btn").click();
        }
    });
}

function CreateEmailMessage(listingId)
{
    PopulateAndOpenModal(null, 'modal-content-email');
    $("#common-modal .email-btn").attr("onclick", "SendEmail('" + listingId + "');");
}

function GetPayKey()
{
    var data = BuildData(["FirstName", "LastName", "Address", "Unit", "Rent", "Memo", "LandlordEmail"]);
                                    
    var error = BuildError(data);
    
    data.Memo = data.Memo.replace("'", "");
    
    if (error != "Please Include<br>")
    {
        SetError("MakePayment", error);
    }
    else
    {
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            beforeSend: function()
            {
                $("#GetPaymentKey").prop("disabled", true);
                $("#GetPaymentKey").val("Submitting...");
            },
            data:
            {
                command: "adaptive_payment",
                data: data,
                endpoint: "Payments"
            },
            success: function(res)
            {
                try
                {
                    var payResponse = JSON.parse(res);
                    
                    if (payResponse["error"])
                    {
                       throw Error("Unable to Make Payment"); 
                    }
                    else
                    {
                        // get pay key
                        var paykey = payResponse["payKey"];
                        
                        // set it in the DOM
                        $("#paykey").val(paykey);
                        
                        // init the PayPal popup object
                        var embeddedPPFlow = new PAYPAL.apps.DGFlow({trigger: 'submitBtn'});
                        
                        // programmatically submit
                        $("#submitBtn").click();
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'});
                }
            },
            error: function(res, err)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: res, position: 'top-center'});
            },
            complete: function()
            {
                $("#GetPaymentKey").prop("disabled", false);
                $("#GetPaymentKey").val("Make Payment");
            }
        });
    }
}

function SendEmail(listingId)
{   
    var data =
    {
        Message: $("#common-modal .email-message").val(),
        EmailAddress: $("#common-modal .email-address").val(),
        PhoneNumber: $("#common-modal .email-phone-number").val(),
        ListingId: listingId
    };

    if (data.Message == null || data.Message == "")
    {
        SetError("SendEmail", "Please Include Message");
        return;
    }
    if (data.EmailAddress == null || data.EmailAddress == "" || !IsValidEmail(data.EmailAddress))
    {
        SetError("SendEmail", "Please Include a Valid Email Address");
        return;
    }
    
    $.ajax(
    {
        type: "POST",
        url: "/api.php",
        data:
        {
            command: "send_email",
            data: data,
            endpoint: "Accounts"
        },
        beforeSend: function()
        {
            $("#common-modal .email-btn").prop("disabled", true);
            $("#common-modal .email-btn").val("Sending...");
        },
        success: function(res)
        {
            try
            {
                if (Contains(res, "Okay"))
                {
                    $("#common-modal").modal('hide');
                    $.msgGrowl ({ type: 'success', title: 'Success', text: "Successfully Sent Email!", position: 'top-center'});
                }
                else if (Contains(res, "Update"))
                {
                    $("#common-modal").modal('hide');
                    $.msgGrowl ({ type: 'error', title: 'Error', text: "Please Update Your Account!", position: 'top-center'});
                }
                else
                {
                    throw new Error("Problem Sending Email");
                }
            }
            catch(e)
            {
                SetError("SendEmail", "Problem Sending Email");
            }
        },
        error: function(res, err)
        {
            SetError("SendEmail", res);
        },
        complete: function()
        {
            $("#common-modal .email-btn").prop("disabled", false);
            $("#common-modal .email-btn").val("Send Email");
            
            SetDefaultButtonOnEnter("");
        }
    });
}

function IsValidEmail(em)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(em);
}

function IsValidPhoneNumber(pn)
{
    /*
	Valid Formats are...
	(123) 456-7890
	123-456-7890
	123.456.7890
	1234567890
	+31636363634
	075-63546725
	*/

    return (pn.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) !== null);
}

function ToStringFromList(input)
{
    var dataList = input;
    
    if (typeof dataList !== "string" && dataList.length > 0)
    {
        dataList = $.map(dataList, function(d)
        {
            return "'" + d + "'";
        }).join(",");
    }
   
    return dataList;
}

function BuildCreateListingData(inputs, elements)
{   
    var data = {};
    
    for (var i = 0; i < elements.length; i++)
    {
        if (elements[i] == "Animals" || elements[i] == "Laundry" || elements[i] == "Parking" 
         || elements[i] == "AirConditioning" || elements[i] == "IsRented" || elements[i] == "LeaseType" || elements[i] == "BuildingType" || elements[i] == "IsActive")
        {
            data[elements[i]] = $(inputs[i]).prop("checked");
        }
        else if (elements[i] == "Latitude" || elements[i] == "Longitude" || elements[i] == "SelectedAddress" || elements[i] == "Notes" || elements[i] == "Landlord" || elements[i] == "University")
        {
            data[elements[i]] = $(inputs[i]).val().replace("'", "&#39;").replace("\"", "&#34;");
        }
        else if (elements[i] == "Rent")
        {
            data[elements[i]] = $(inputs[i]).autoNumeric('get');
        }
        else
        {
            if ($(inputs[i]).attr("placeholder") !== "")
            {
                data[elements[i]] = $(inputs[i]).val().trim();
            }
        }
    }
    
    return data;
}

function BuildCreateListingError(fields)
{
    var errorArr = [];
    
    var beginning = "Please Include ";
    
    if (fields.Username === "")
    {
        errorArr.push("Valid Username");
    }
    if (fields.Address === "" || fields.Latitude === "" || fields.Longitude === "")
    {
        errorArr.push("Valid Address - Must Select Google's Result");
    }
    if (fields.Address !== "" && fields.Address !== fields.SelectedAddress)
	{
		errorArr.push("Valid Address - Do Not Modify Google's Result After Selecting");
	}
    if (fields.Rent === "")
    {
        errorArr.push("Valid Monthly Rent Amount");
    }
    if (fields.FirstName === "")
    {
        errorArr.push("Valid First Name");
    }
    if (fields.LastName === "")
    {
        errorArr.push("Valid Last Name");
    }
    if (fields.Email === "" || (fields.Email !== undefined && !IsValidEmail(fields.Email)))
    {
        errorArr.push("Valid Email");
    }
    if (fields.PhoneNumber !== "" && fields.PhoneNumber !== undefined)
    {
        if (!IsValidPhoneNumber(fields.PhoneNumber))
        {
            errorArr.push("Valid Phone Number");
        }
    }
    if (fields.Start === "")
    {
        errorArr.push("Valid Lease Start Date");
    }
    if (fields.Password !== "" || fields.Confirm !== "")
    {
        if (fields.Password != fields.Confirm)
        {
            errorArr.push("Matching Password and Confirmation");
        }
    }
    if (errorArr.length > 0)
    {
        if (errorArr.length == 1)
        {
            return beginning + errorArr[0];
        }
        else
        {
            var last = " and " + errorArr[errorArr.length - 1];
            errorArr.splice(errorArr.length - 1, 1);
            
            return beginning + errorArr.join(", ") + last;
        }
    }
    
    return beginning;
}

function BuildData(elements)
{
    var modalAttr = ".modal-body .";
    
    var arr = $.map(elements, function(element) 
    {
        return $(modalAttr + element).val().trim();
    });
    
    var data = {};
    
    for (var i = 0; i < arr.length; i++)
    {
        data[elements[i]] = arr[i];
    }
    
    return data;
}

function BuildError(fields)
{
    var error = "Please Include<br>";
    
    if (fields.Username === "")
    {
        error += "Username<br>";
    }
    if (fields.Password !== "" || fields.Confirm !== "")
    {
        if (fields.Password !== fields.Confirm)
        {
            error += "Matching Password and Confirmation<br>";
        }
    }
    if (fields.FirstName === "")
    {
        error += "First Name<br>";
    }
    if (fields.LastName === "")
    {
        error += "Last Name<br>";
    }
    if (fields.Email === "" || (fields.Email !== undefined && !IsValidEmail(fields.Email)))
    {
        error += "Valid Email<br>";
    }
    if (fields.PhoneNumber !== "" && fields.PhoneNumber !== undefined)
    {
        if (!IsValidPhoneNumber(fields.PhoneNumber))
        {
            error += "Valid Phone Number<br>";
        }
    }
    if (fields.Address === "")
    {
        error += "Valid Address<br>";
    }
    if (fields.Rent === "")
    {
        error += "Valid Rent Amount<br>";
    }
    
    return error;
}

function SetError(el, msg)
{
    if (msg === "")
	{
		msg = "Internal Error: Please Try Again Later";
	}
	
    var modal = ".modal-body ."
    $(modal + el + "-error").html(msg);
    $(modal + el + "-error").show();

    //reset the height because the error bar increases it...
    ModalBackdropHeight($('#common-modal.modal'));
}

function Contains(haystack, needle)
{
    if (typeof haystack != "string") 
    {
        return false;
    }
    
    return (haystack.indexOf(needle) != -1)
}

function BooleanToHumanReadable(data)
{
    return (data === true ? "Yes" : "No");
}

function SelectToQueryField(field)
{
    if (field == "true" || field == "false")
    {
        return (field == "true")
    }
    
    return field;
}

String.prototype.CapitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/********** STARTUP SCRIPTS *************/
$(function ()
{   
    InitMainSidebar();
 
    LoadAllDefaultListings();
 
    SetHiddenSidebars();

    GetAllUniversities();
    GetAllLandlords();
   
    $('#listings').slimScroll({
        height: '100%',
        railVisible: true,
        alwaysVisible: true,
        size: '10px'
    });
    
    $("#listings_list").height($("#listings_list").height() - $(".navbar").outerHeight());
    
    $(".mapbox-logo").parent().removeClass("leaflet-left").addClass("leaflet-right").addClass("mblogo"); 
    
    if (location.hash == "#loggedout")
    {
        $.msgGrowl ({ type: 'warning', title: 'Notice', text: "Logout Success", position: 'top-center'});
        location.hash = "";
    }
    else if (location.hash == "#sessiontimeout")
    {
        $.msgGrowl ({ type: 'warning', title: 'Notice', text: "Session Timed Out", position: 'top-center'});
        location.hash = "";
    }
    else if (location.hash == "#successpayment")
    {
       $.msgGrowl ({ type: 'success', title: 'Success', text: "Payment Successfully Sent!", position: 'top-center'});
       location.hash = "";
    }      
    else if (location.hash == "#cancelledpayment")
    {
       $.msgGrowl ({ type: 'warning', title: 'Notice', text: "Payment Cancelled!", position: 'top-center'});
       location.hash = "";
    }
    
    RemoveLoginFeatures();
});

$(window).on('resize', function() {
    //otherwise they get out of place
    SetHiddenSidebars();
   
    if ($("#listings_list").width() > 0)
    {
        $("#listings_list").stop();
        OpenListingsList();
    }
    
    var height = $("#details-view-slideshow-section .slideshow").height();
    $("#details-view-slideshow-section .slider-arrow").css("top", (height / 2) - 22);
});

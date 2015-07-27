/* 
 * GLOBAL VARIABLES
 */
// these should match with the bootrstrap defined widths
window.xs_screen_max = 767;
window.sm_screen_max = 991;

var which_modal = "";

var page_is_scrolling = false; // identify when page is being scrolled

var defaultPicture = "404ImageNotFound.png";

// page background default settings - to change, override them at the top of initialise-functions.js
var background_settings = {
    change_on_mobile: false, // if true, bg changes on mobile devices
    change_on_nonmobile: true, // if true, bg changes on tablet and desktop devices
    use_script: true, // set to false if you want to set a custom background (css, video, etc)
}

L.mapbox.accessToken = 'pk.eyJ1IjoiaGFybW9uaWNrZXkiLCJhIjoiZmM4MGM0Mjk0NmJmMDFjMmY3YWY1NmUxMzllMzc5NGYifQ.hdx-TOA4rtQibXkpdLQK4g'; //may want to secure this somehow...
var map = L.mapbox.map('map', 'mapbox.streets').setView([42.057, -87.680], 15);
var markers = new L.FeatureGroup();
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

$('#map, #common-modal').on('click', '.popup .slider-arrow img', function() 
{
    var $slideshow = $('.slideshow');
    var $newSlide;
    
    if ($(this).hasClass('slider-arrow-left')) 
    {
        $newSlide = $slideshow.find('.active').prev();
        if ($newSlide.index() < 0) 
        {
            $newSlide = $('.image').last();
        }
    } 
    else 
    {
        $newSlide = $slideshow.find('.active').next();
        if ($newSlide.index() < 0) 
        {
            $newSlide = $('.image').first();
        }
    }

    $slideshow.find('.active').removeClass('active').hide();
    $newSlide.addClass('active').show();
    return false;
});

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
function populate_and_open_modal(event, modal_content_id, section_in_modal, add_class_to_modal)
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
            modal_backdrop_height(modal);
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
    return false;
}

/*
 * ================================================================
 * Update modal backdrop height
 * - since bootstrap 3.3.1 - fix backdrop height after all elements inside the popup are loaded
 *
 * @param modal - the modal as an object
 */
function modal_backdrop_height(modal)
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

function resetSidebar()
{
    initMainSidebar();
}

function initMainSidebar()
{
    initSlider();
    initDatePicker();
}

function initSlider()
{
    $( "#PriceRangeSlider" ).slider(
    {
        range: true,
        min: 400,
        max: 3000,
        step: 100,
        values: [ 800, 1500 ],
        slide: function( event, ui )
        {
            $( "#amount" ).text ( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
}

function initDatePicker()
{
    $("#datepicker-inline").pikaday(
    {
        minDate: new Date(), 
        setDefaultDate: new Date()
    });
}

function loadAllDefaultListings()
{
    var data = {"university": "Northwestern"};
    
    try
    {
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
                    if (!contains(res, "No Matching Entries"))
                    {
                        insertMarkers(res);
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                }
            },
            error: function(res, err) 
            {
                try
                {
                    throw new Error(res + " " + err);
                }
                catch (e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                }
            }			
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
}

function setHiddenSidebars()
{
    var listingsListWidth = parseFloat($("#left-sidebar").css("left")) + parseFloat($("#left-sidebar").css("width"));
    
    $("#listings_list").css("left", listingsListWidth);
    $("#extras_view").css("left", listingsListWidth);
}

function checkLoginState() 
{
    FB.getLoginStatus(function(response) 
    {
        statusChangeCallback(response);
    });
}

function login_facebook()
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
                
                login_facebook_user(userID, accessToken);
            }
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: "Problem with Logging In", position: 'top-left'});
    }
}
 
function searchForListings()
{
    resetMarkers();
    
    var query = createQuery();

    try
    {    
        $.ajax(
        {
            type: "POST",
            url: "/api.php",
            beforeSend: function()
            {
                $(".search-content input").prop("disabled", true);
                $(".search-content input").val("Searching...");
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
                    if (contains(res, "No Matching Entries"))
                    {
                        throw new Error(res);
                    }
                    else
                    {
                        insertMarkers(res);
                    }
                }
                catch (e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'}); 
                }
            },
            error: function(res, err) 
            {
                try
                {
                    throw new Error(res + " " + err);
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'}); 
                }
            },
            complete: function()
            {
                $(".search-content input").prop("disabled", false);
                $(".search-content input").val("Search");
            }
        });
    }
    catch (e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'}); 
    }
}

function createQuery()
{
    var query = {};
    query.price = {low: 0, high: 0};
    
    query.price.low = $("#PriceRangeSlider").slider("values", 0);
    query.price.high = $("#PriceRangeSlider").slider("values", 1);
    query.bedrooms = selectToQueryField($("#bedrooms-filter").val());
    query.bathrooms = selectToQueryField($("#bathrooms-filter").val());
    query.start = $.datepicker.formatDate('mm/dd/yy', new Date($("#datepicker-inline").val()));
    query.type = $("#type-filter").val();
    query.laundry = selectToQueryField($("#laundry-filter").val());
    query.parking = selectToQueryField($("#parking-filter").val());
    query.airConditioning = selectToQueryField($("#airConditioning-filter").val());
    query.animals = selectToQueryField($("#animals-filter").val());
    query.tags = $("#tags-filter").tagsinput('items');
    query.university = "Northwestern"; // will be set by text box later
    
    return query;
}

function resetMarkers()
{
    $.each(markers._layers, function(id, marker) 
    {
        map.removeLayer(marker);
    });
    markers = new L.FeatureGroup();
}

function insertMarkers(res)
{
    if (res != "")
    {
        var data = JSON.parse(res);
        data.forEach(function(d)
        {
            var marker = L.marker([d.WorldCoordinates.x, d.WorldCoordinates.y]).addTo(map);
            
            var slideshowContent = "";
            var base = "assets/images/listing_images/";
            var images = d.Pictures;
            if (images.length == 0)
            {
                images = [];
                images[0] = defaultPicture;
            }
            for(var i = 0; i < images.length; i++) 
            {
                var source = base + images[i];

                slideshowContent += 
                                    '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                                      '<img src="' + source + '" height="200" width="300"/>' +
                                    '</div>';
                                    //'<div class="caption">' + img["caption"] + '</div>' +
            }
            
            var popupContent =  
                        '<div id="' + d._id.$oid + '" class="popup">' +
                            '<h2>' + d.Address + '</h2>' +
                            '<h3>$' + d.Price + '/month</h2>' +
                            '<div class="slideshow">' +
                                '<div class="slider-arrow slider-left"><img src="assets/images/theme_images/carousel_arrow_left.png" class="slider-left-arrow" /></div>' +
                                '<div class="slider-arrow slider-right"><img src="assets/images/theme_images/carousel_arrow_right.png" class="slider-right-arrow" /></div>' +
                                slideshowContent +
                            '</div>' +
                        '</div>';
            
            marker.bindPopup(popupContent, {
                closeButton: false,
                minWidth: 320
            });
            
            markers.addLayer(marker);
            
            insertIntoListView(d);
        });
    }
}

function insertIntoListView(data)
{
    var listingPic = (data.Pictures.length > 0 ? data.Pictures[0] : defaultPicture);
    
    $("#listings").append(
        "<div class='item-content listing'>" +
            "<img src='assets/images/listing_images/'" + listingPic + " height='100' width='100' />" +
            "<div class='information'>" +
                "<p class='listing-address'>" + data.Address + "</p>" +
                "<p class='listing-bedrooms'>" + data.Bedrooms + " Bedroom" + (data.Bedrooms == 1 ? "" : "s") + "</p>" + 
                "<p class='listing-bathrooms'>" + data.Bathrooms + " Bathroom" + (data.Bathrooms == 1 ? "" : "s") + "</p><br>" +
                "<p class='listing-price'>$" + data.Price + "/month</p>" +
                "<p class='listing-type'>" + data.Type.capitalizeFirstLetter() + "</p><br>" +
                "<input type='button' class='btn btn-info' value='View' onclick='openListing(\"" + data._id.$oid + "\", \"" + data.Address + "\", \"" + data.Bedrooms + "\", \"" + data.Bathrooms + "\", \"" + data.Price + "\", \"" + data.Type + "\", \"" + data.HasAnimals + "\", \"" + data.HasLaundry + "\", \"" + data.HasParking + "\", \"" + data.HasAirConditioning + "\", \"" + data.Tags + "\", \"" + data.Pictures + "\")' />" +
            "</div>" +
        "</div>"
    );
}

function openListing(id, address, bedrooms, bathrooms, price, type, animals, laundry, parking, airConditioning, tags, images)
{
    //load up the images into the modal...
    var slideshowContent = "";
    var base = "assets/images/listing_images/";
    if (images.length == 0)
    {
        images = [];
        images[0] = defaultPicture;
    }
    for(var i = 0; i < images.length; i++) 
    {
        var source = base + images[i];

        slideshowContent += 
                            '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                              '<img src="' + source + '" />' +
                            '</div>';
                            //'<div class="caption">' + img["caption"] + '</div>' +
    }
    
    $("#modal-content-15 h3").text(address);
    $("#modal-content-15 .slideshow").html(slideshowContent);

    $("#modal-content-15 .popup-bedrooms").text("Bedrooms: " + bedrooms);
    $("#modal-content-15 .popup-bathrooms").text("Bathrooms: " + bathrooms);
    $("#modal-content-15 .popup-price").text("Rent: $" + price + "/month");
    $("#modal-content-15 .popup-type").text("Type: " + type.capitalizeFirstLetter());
    $("#modal-content-15 .popup-animals").text("Animals? "+ booleanToHumanReadable(animals));
    $("#modal-content-15 .popup-laundry").text("In-Unit Laundry? " + booleanToHumanReadable(laundry));
    $("#modal-content-15 .popup-parking").text("Parking? " + booleanToHumanReadable(parking));
    $("#modal-content-15 .popup-ac").text("AC? " + booleanToHumanReadable(airConditioning));
    $("#modal-content-15 .popup-tags").text("Tags: " + (tags == "" ? tags : tags.join(", ")));
    
    populate_and_open_modal(null, 'modal-content-15');
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
function login_user(hide_main_modal)
{
    resetModal("login", "Log In", false);
    
    var data = buildData(["username", "password"]);

    var error = buildError(data);
    
    if (error != "Please Include<br>")
    {
        setError("login", error);
    }
    else
    {
        try
        {
            $.ajax(
            {
                type: "POST",
                url: "/api.php",
                data:
                {
                    command: "login",
                    data: data,
                    user: data["username"], //to be used as session variable later
                    endpoint: "Accounts"
                },
                beforeSend: function()
                {
                    disableModalSubmit('login');
                },
                success: function(res)
                {
                    try
                    {
                        if (contains(res, "Okay"))
                        {
                            showLoginFeatures(hide_main_modal);
                            if (hide_main_modal === false)
                            {
                                populate_and_open_modal(null, 'modal-content-3');
                            }
                            
                            if (contains(res, "Landlord"))
                            {
                                $("#portal-function a").attr("href", "/landlord/listings");
                            }
                            else if (!contains(res, "Tenant"))
                            {
                                throw new Error("Problem Logging In");
                            }
                        }
                        else
                        {
                            throw new Error(res);
                        }
                    }
                    catch(e)
                    {
                        setError('login', e.message);
                    }
                },
                error: function(res, err)
                {
                    try
                    {
                        throw new Error(res + " " + err);
                    }
                    catch(e)
                    {
                        setError('login', e.message);
                    }
                },
                complete: function()
                {
                    resetModal("login", "Log In", false);
                }
            });
        }
        catch(e)
        {
            setError('login', e.message);
        }
    }
}

function login_facebook_user(userID, accessToken)
{
    var data = {"username": userID, "password": accessToken};
    
    //facebook already does the validation of username and password
    // in addition, we don't need to check for null values because it's
    // already handled on the facebook side, the code would not reach
    // here if that was the case...
    
    try
    {
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
                    if (contains(res, "Okay"))
                    {
                        showLoginFeatures(true);
                    }
                    else if (!res)
                    {
                        throw new Error("Error Logging In"); 
                    }
                    else
                    {
                        throw new Error(res);
                    }
                }
                catch(e)
                {
                    setError('login', e.message);
                }
            },
            error: function(res, err)
            {
                try
                {
                    throw new Error(res + " " + err);
                }
                catch(e)
                {
                    setError('login', e.message);
                }
            },
            complete: function()
            {
                resetModal("login", "Log In", false);
                
                $("#delete_account_header").siblings("label").remove();
                $("#delete_account_header").siblings("input.password").remove();
            }
        });
    }
    catch(e)
    {
        setError('login', e.message);
    }
}

function logout_user(isDeleting)
{
	removeLoginFeatures();
    try
    {
        $.ajax(
        {
            type: "POST",
            url: "logout.php",
            success: function(res)
            {
                try
                {
                    if (contains(res, "Successfully"))
                    {
                        if (isDeleting)
                        {
                            populate_and_open_modal(null, "modal-content-13");
                        }
                        else
                        {
                            populate_and_open_modal(null, "modal-content-12");
                        }
                    }
                    else
                    {
                        throw new Error("Problem Logging Out");
                    }
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                }
            },
            error: function(res, err)
            {
                try
                {
                    throw new Error(res + " " + err);
                }
                catch(e)
                {
                    $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
                }
            }
        });
    }
    catch(e)
    {
        $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-left'});
    }
    
    $("#login").text("Log In/Create Account");
    $("#login-function").attr("onclick", "load_modal(event, 'modal-content-1', 'login', 'Log In');");
}

function removeLoginFeatures()
{
    $("#portal-function").hide();
}

function showLoginFeatures(hide_main_modal)
{
    $("#login").text("Log Out");
    $("#login-function").attr("onclick", "logout_user(false)");
    $("#login-function").show();
    
    if (hide_main_modal === true)
    {
        hideMainModal();
    }
    
    $("#portal-function").show();
}

function hideMainModal()
{
    $("#common-modal").modal('hide');
}

function resetModal(modal, btnText, hide)
{  
    $("." + modal + "-btn").val(btnText);
    $("." + modal + "-btn").attr('disabled', false);
    if (hide)
    {
        $("." + modal + "-error").hide();
    }
}

function disableModalSubmit(modal)
{
    $("." + modal + "-btn")
        .val("Processing...")
        .attr("disabled", true);
}

function create_account()
{
    var data = buildData(["username", "password", "firstname", "lastname",
                                    "email", "phonenumber"]);
                                    
    var error = buildError(data);
    
    if (error != "Please Include<br>")
    {
        setError("create_account", error);
    }
    else
    {
        try
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
                    disableModalSubmit("create_account");
                },
                success: function(res)
                {
                    try
                    {
                        if (contains(res, "Okay"))
                        {
                            login_user(false);
                        }
                        else
                        {
                            throw new Error(res);
                        }
                    }
                    catch(e)
                    {
                        setError("create_account", e.message);
                    }
                },
                error: function(res, err)
                {
                    try
                    {
                        throw new Error(res + " " + err);
                    }
                    catch(e)
                    {
                        setError("create_account", e.message);
                    }
                },
                complete: function()
                {
                    resetModal("create_account", "Create Account", false);
                    
                    set_default_button_on_enter("");
                }
            });
        }
        catch(e)
        {
            setError("create_account", e.message);
        }
    }
}

function load_modal(event, which, enter_default, btnText)
{
    populate_and_open_modal(event, which); 
    resetModal(enter_default, btnText, true); 
    set_default_button_on_enter(enter_default);
    //also try to reset the modal backdrop height 
    //      because it's different for each modal
    
    modal_backdrop_height($('#common-modal.modal'));
}

function open_listings_list()
{
    //do not want to open 100% of page width because our 'left' offset needs to be accounted for
    var openWidth = parseFloat($("html").css("width")) - parseFloat($("#listings_list").css("left"));
    $("#listings_list").animate(
    {
        width: openWidth
    }, 1000, 'easeInOutCubic', load_listings_list);
}

function open_extras_view()
{
    $("#extras_view").animate(
    {
        width: parseFloat($("#left-sidebar").css("width")),
        paddingLeft: "5px",
        paddingRight: "5px"
    },
    {
        duration: 500,
        easing: 'easeInOutCubic',
        start: function ()
        {
            setTimeout(function()
            {
                $("#extras").fadeIn(200);
            }, 300)
        },
        done: function ()
        {
            $($(".search-content input")[1]).val("Hide Extra Filters");
            $($(".search-content input")[1]).attr("onclick", "close_extras_view()");
        }
    });
}

function close_listings_list()
{
    $("#listings").fadeOut(400, function() {
        $("#listings_list").animate(
        {
            width: "0px"
        }, 1000, 'easeInOutCubic', function() {
            $("#view_listings_list-function a").text("View Listings");
            $("#view_listings_list-function").attr("onclick", "open_listings_list()");
        });
    });
}

function close_extras_view()
{
    $("#extras").fadeOut(200);
    $("#extras_view").animate(
    {
        width: "0px",
        paddingLeft: "0px",
        paddingRight: "0px"
    }, 500, 'easeInOutCubic', function() {
        $($(".search-content input")[1]).val("Show Extra Filters");
        $($(".search-content input")[1]).attr("onclick", "open_extras_view()");
    });
}

function load_listings_list()
{
    $("#listings").fadeIn();
    
    //then change the view listings list to "Hide Listings"
    $("#view_listings_list-function a").text("Hide Listings");
    $("#view_listings_list-function").attr("onclick", "close_listings_list()");
}

function set_default_button_on_enter(modal)
{
    if (modal != "")
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

function isValidEmail(em)
{
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(em);
}

function isValidPhoneNumber(pn)
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

function buildData(elements)
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

function buildError(fields)
{
    var error = "Please Include<br>";
    
    if (fields.username === "")
    {
        error += "Username<br>";
    }
    if (fields.password === "")
    {
        error += "Password<br>";
    }
    if (fields.firstname === "")
    {
        error += "First Name<br>";
    }
    if (fields.lastname === "")
    {
        error += "Last Name<br>";
    }
    if (fields.email === "" || (fields.email != null && !isValidEmail(fields.email)))
    {
        error += "Valid Email<br>";
    }
    if (fields.phonenumber === "" || (fields.phonenumber != null && !isValidPhoneNumber(fields.phonenumber)))
    {
        error += "Valid Phone Number<br>";
    }
    
    return error;
}

function setError(el, msg)
{
    if (msg == "")
	{
		msg = "Internal Error: Please Try Again Later";
	}
	
    var modal = ".modal-body ."
    $(modal + el + "-error").html(msg);
    $(modal + el + "-error").show();

    //reset the height because the error bar increases it...
    modal_backdrop_height($('#common-modal.modal'));
}

function contains(haystack, needle)
{
    if (typeof haystack != "string") 
    {
        return false;
    }
    
    return (haystack.indexOf(needle) != -1)
}

function booleanToHumanReadable(data)
{
    return (data == true ? "Yes" : "No");
}

function selectToQueryField(field)
{
    if (field == "true" || field == "false")
    {
        return (field == "true")
    }
    
    return field;
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

/********** STARTUP SCRIPTS *************/
$(function ()
{
    initMainSidebar();
    
    loadAllDefaultListings();
    
    setHiddenSidebars();
});

$(window).on('resize', function() {
   //otherwise they get out of place
   setHiddenSidebars(); 
});
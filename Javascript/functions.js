/* 
 * GLOBAL VARIABLES
 */
// these should match with the bootrstrap defined widths
window.xs_screen_max = 767;
window.sm_screen_max = 991;

var whichModal = "";

var defaultPicture = "404ImageNotFound.png";

var entries = {};
var multiPopup = {};
var listingSlideshows = {};
var pageTags = {};

// page background default settings - to change, override them at the top of initialise-functions.js
var background_settings = {
    change_on_mobile: false, // if true, bg changes on mobile devices
    change_on_nonmobile: true, // if true, bg changes on tablet and desktop devices
    use_script: true // set to false if you want to set a custom background (css, video, etc)
}

L.mapbox.accessToken = 'pk.eyJ1IjoiaGFybW9uaWNrZXkiLCJhIjoiZmM4MGM0Mjk0NmJmMDFjMmY3YWY1NmUxMzllMzc5NGYifQ.hdx-TOA4rtQibXkpdLQK4g';
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
                    var valueMinStart = data.MaxRent.Price / 2;
                    var valueMaxStart = Math.max(data.MaxRent.Price / 2, data.MaxRent.Price / 2 + 300)
                    $("#amount").text("$" + valueMinStart + " - $" + valueMaxStart);
                    $("#PriceRangeSlider").slider(
                    {
                        range: true,
                        min: data.MinRent.Price,
                        max: data.MaxRent.Price,
                        step: 100,
                        values: [ valueMinStart, valueMaxStart ],
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
            $($("#search-section a")[0]).prop("disabled", true);
            $($("#search-section a")[0]).val("Searching...");
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
                    throw new Error(res);
                }
                else
                {
                    InsertMarkers(res);
                    
                    map.fitBounds(markers.getBounds());
                }
            }
            catch (e)
            {
                $.msgGrowl ({ type: 'error', title: 'Error', text: e.message, position: 'top-center'}); 
            }
        },
        error: function(res, err) 
        {
            $.msgGrowl ({ type: 'error', title: 'Error', text: res + " " + err, position: 'top-center'}); 
        },
        complete: function()
        {
            $($("#search-section a")[0]).prop("disabled", false);
            $($("#search-section a")[0]).val("Search");
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
    query.Type = $("#Type-filter").val();
    query.Laundry = SelectToQueryField($("#Laundry-filter").val());
    query.Parking = SelectToQueryField($("#Parking-filter").val());
    query.AirConditioning = SelectToQueryField($("#AirConditioning-filter").val());
    query.Animals = SelectToQueryField($("#Animals-filter").val());
    query.Tags = $("#Tags-filter").tagsinput('items');
    query.University = "Northwestern"; // will be set by text box later
    
    return query;
}

function ResetListings()
{
    $.each(markers._layers, function(id, marker) 
    {
        map.removeLayer(marker);
    });
    
    // close the tags-used popup
    $(".msgGrowl-close").click();
    $("#listings").html("<button type='button' class='close' data-dismiss='modal' aria-hidden='true' onclick='CloseListingsList();'>×</button>")
    
    markers = new L.FeatureGroup();
    entries = {};
    multiPopup = {};
    pageTags = {};
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
            
            // get the tags while we're at it...
            $.each(d.Tags, function(index, tag)
            {
                if (pageTags[tag] == null)
                {
                    pageTags[tag] = 1;
                }
                else
                {
                    pageTags[tag] += 1;
                }
            });
        });
        
        $.each(entries, function(address, entry) 
        {
            if (entry.length == 1)
            {
                var marker = L.marker([entry[0].WorldCoordinates.x, entry[0].WorldCoordinates.y]).addTo(map);
                
                var slideshowContent = "";
                var base = "http://images.lbkstudios.net/enhabit/images/";
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
                            '<div id="' + entry[0]._id.$oid + '" class="popup">' +
                                '<h2>' + entry[0].Address + ' ' + (entry[0].Unit ? entry[0].Unit : "") + '</h2>' +
                                '<h3>$' + entry[0].Price + '/month</h2>' +
                                '<div class="slideshow">';
                                
                if (images.length > 1)
                {
                    popupContent += '<div class="slider-arrow slider-left"><img src="assets/images/theme_images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
                                    '<div class="slider-arrow slider-right"><img src="assets/images/theme_images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
                }
                
                popupContent += slideshowContent +
                                '</div>' +
                            '</div>';
                
                marker.bindPopup(popupContent, 
                {
                    closeButton: false,
                    minWidth: 320
                });
                
                markers.addLayer(marker);
                
                InsertIntoListView(entry[0]);
                
                InsertIntoListingSlideshowObject(entry[0]);
            }
            else if (entry.length > 1)
            {   
                var marker = L.marker([entry[0].WorldCoordinates.x, entry[0].WorldCoordinates.y]).addTo(map);
                
                var popupContent =  
                            '<div class="popup">' +
                                '<h2>' + entry[0].Address + '</h2>' +
                                '<p>Multiple listings available.</p>' +
                                '<input type="button" class="btn btn-outline-inverse btn-sm" value="Show All" onclick="LoadMultipleListings(\'' + entry[0].Address + '\')">' +
                            '</div>';
                
                marker.bindPopup(popupContent, 
                {
                    closeButton: false,
                    minWidth: 320
                });
                
                markers.addLayer(marker);
                 
                // now that we have a pin, we need to fill in our section of the hash
                $.each(entry, function(index, listing)
                {
                    listing.Tags = ToStringFromList(listing.Tags);
                    listing.Thumbnails = ToStringFromList(listing.Thumbnails);
                    
                    var listingPic = (listing.Thumbnails !== "" ? listing.Thumbnails.split(",")[0].replace(/'/, "") : defaultPicture);

                    if (multiPopup[listing.Address] === undefined)
                    {
                        multiPopup[listing.Address] = [
                            "<div class='item-content listing'>" +
                                "<img src='http://images.lbkstudios.net/enhabit/images/" + listingPic + "' height='100' width='100' />" +
                                "<div class='information'>" +
                                    "<p class='listing-address'>" + listing.Address + " " + (listing.Unit ? listing.Unit : "") + "</p>" +
                                    "<p class='listing-bedrooms'>" + listing.Bedrooms + " Bedroom" + (listing.Bedrooms == 1 ? "" : "s") + "</p>" + 
                                    "<p class='listing-bathrooms'>" + listing.Bathrooms + " Bathroom" + (listing.Bathrooms == 1 ? "" : "s") + "</p><br>" +
                                    "<p class='listing-price'>$" + listing.Price + "/month</p>" +
                                    "<p class='listing-type'>" + listing.Type.CapitalizeFirstLetter() + "</p><br>" +
                                    "<input type='button' class='btn btn-info' value='More Details' onclick=\"OpenListing('" + listing._id.$oid + "', '" + listing.Address + "', '" + listing.Unit + "', '" + listing.Bedrooms + "', '" + listing.Bathrooms + "', '" + listing.Price + "', '" + listing.Type + "', '" + listing.HasAnimals + "', '" + listing.HasLaundry + "', '" + listing.HasParking + "', '" + listing.HasAirConditioning + "', [" + listing.Tags + "], [" + listing.Thumbnails + "])\" />" + 
                                "</div>" +
                            "</div>"];
                    }
                    else
                    {
                        multiPopup[listing.Address].push(
                            "<div class='item-content listing'>" +
                                "<img src='http://images.lbkstudios.net/enhabit/images/" + listingPic + "' height='100' width='100' />" +
                                "<div class='information'>" +
                                    "<p class='listing-address'>" + listing.Address + " " + (listing.Unit ? listing.Unit : "") + "</p>" +
                                    "<p class='listing-bedrooms'>" + listing.Bedrooms + " Bedroom" + (listing.Bedrooms == 1 ? "" : "s") + "</p>" + 
                                    "<p class='listing-bathrooms'>" + listing.Bathrooms + " Bathroom" + (listing.Bathrooms == 1 ? "" : "s") + "</p><br>" +
                                    "<p class='listing-price'>$" + listing.Price + "/month</p>" +
                                    "<p class='listing-type'>" + listing.Type.CapitalizeFirstLetter() + "</p><br>" +
                                    "<input type='button' class='btn btn-info' value='More Details' onclick=\"OpenListing('" + listing._id.$oid + "', '" + listing.Address + "', '" + listing.Unit + "', '" + listing.Bedrooms + "', '" + listing.Bathrooms + "', '" + listing.Price + "', '" + listing.Type + "', '" + listing.HasAnimals + "', '" + listing.HasLaundry + "', '" + listing.HasParking + "', '" + listing.HasAirConditioning + "', [" + listing.Tags + "], [" + listing.Thumbnails + "])\" />" +
                                "</div>" +
                            "</div>");
                    }
                    
                    InsertIntoListView(listing);
                    
                    InsertIntoListingSlideshowObject(listing);
                });
            }
        });
        
        ShowTagsPopup(pageTags, data[0].University);
    }
    
    map.fitBounds(markers.getBounds());
}

function InsertIntoListingSlideshowObject(entry)
{
    var slideShowHTML = 
    "<h1>Sed scelerisque</h1>" +
    "<p>Nullam ac rhoncus. Aliquam adipiscing eros non elit imperdiet congue. Etiam at ligula sit amet arcu laoreet consequat.<br></p>" +
    "<div id='owl-slider-'" + entry._id.$oid + " class='owl-carousel popup-image-gallery'>";
    for (var i = 0; i < entry.Pictures.length; i++)
    {
        slideShowHTML += 
        "<div>" +
            "<img class='lazyOwl' data-src='" + entry.Pictures[i] + "'>" +
        "</div>";
    }
    slideShowHTML += "</div>";
    
    listingSlideshows[entry._id.$oid + ""] = slideShowHTML;

}

function ShowTagsPopup(pageTags, university)
{
    $.msgGrowl (
    {
        title: 'Top Tags at ' + university,
        type: 'info',
        position: 'top-right',
        sticky: true
    });
    
    // sort the keys by largest to smallest
    var keysSorted = Object.keys(pageTags).sort(function(a,b) 
    { 
        return pageTags[b] - pageTags[a]
    });
    
    for (var i = 0; i < keysSorted.length; i++)
    {
       $('.top-right .msgGrowl-content span').append("<br><b>" + keysSorted[i] + "<b>"); 
    }
}

function LoadMultipleListings(address)
{
    $("#modal-content-popup-multilisting").html("");
    
    $.each(multiPopup[address], function(index, entry)
    {
        $("#modal-content-popup-multilisting").append(entry);
    });
    
    PopulateAndOpenModal(null, 'modal-content-popup-multilisting');
}

function InsertIntoListView(data)
{
    if (typeof data.Tags === "object")
    {
        data.Tags = ToStringFromList(data.Tags);
    }
    if (typeof data.Thumbnails === "object")
    {
        data.Thumbnails = ToStringFromList(data.Thumbnails);
    }
    
    $("#listings").append(
        "<div class='item-content listing'>" +
            "<img src='assets/images/theme_images/loader.gif' height='100' width='100' />" +
            "<div class='information'>" +
                "<p class='listing-address'>" + data.Address + " " + (data.Unit ? data.Unit : "") + "</p>" +
                "<p class='listing-bedrooms'>" + data.Bedrooms + " Bedroom" + (data.Bedrooms == 1 ? "" : "s") + "</p>" + 
                "<p class='listing-bathrooms'>" + data.Bathrooms + " Bathroom" + (data.Bathrooms == 1 ? "" : "s") + "</p><br>" +
                "<p class='listing-price'>$" + data.Price + "/month</p>" +
                "<p class='listing-type'>" + data.Type.CapitalizeFirstLetter() + "</p><br>" +
                "<input type='button' class='btn btn-info' value='More Details' onclick=\"OpenListing('" + data._id.$oid + "', '" + data.Address + "', '" + data.Unit + "', '" + data.Bedrooms + "', '" + data.Bathrooms + "', '" + data.Price + "', '" + data.Type + "', '" + data.HasAnimals + "', '" + data.HasLaundry + "', '" + data.HasParking + "', '" + data.HasAirConditioning + "', [" + data.Tags + "], [" + data.Thumbnails + "])\" />" +
            "</div>" +
        "</div>");
    
    var image = $("#listings .item-content img").last()[0];
    var downloadingImage = new Image();
    downloadingImage.onload = function()
    {
        image.src = this.src;   
    };
    if (typeof data.Thumbnails === "object" && data.Thumbnails.length > 0)
    {
        downloadingImage.src = 'http://images.lbkstudios.net/enhabit/images/' + data.Thumbnails[0];
    }
    else if (typeof data.Thumbnails === "string" && data.Thumbnails !== "")
    {
        downloadingImage.src = 'http://images.lbkstudios.net/enhabit/images/' + data.Thumbnails.split(",")[0].replace(/'/g, "");
    }
    else
    {
        downloadingImage.src = 'http://images.lbkstudios.net/enhabit/images/' + defaultPicture;
    }
}

function OpenListing(id, address, unit, bedrooms, bathrooms, price, type, animals, Laundry, parking, AirConditioning, tags, images)
{
    //load up the images into the modal...
    var slideshowContent = "";
    var base = "http://images.lbkstudios.net/enhabit/images/";
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
                              '<img src="' + source + '" height="200" width="300" />' +
                            '</div>';
    }
    
    var slideshowModalContent = '<div class="slideshow" style="position: relative;">';
    if (images.length > 1)
    {
        slideshowModalContent += '<div class="slider-arrow slider-left"><img src="assets/images/theme_images/carousel_arrow_left.png" class="slider-arrow-left" /></div>' +
        '<div class="slider-arrow slider-right"><img src="assets/images/theme_images/carousel_arrow_right.png" class="slider-arrow-right" /></div>';
    }
    
    slideshowModalContent += slideshowContent +
    '</div>';
    
    $("#modal-content-popup-listing h3").text(address + " " + (unit ? unit : ""));
    $("#modal-content-popup-listing .slideshow-lander").html(slideshowModalContent);
    $("#modal-content-popup-listing .popup-bedrooms").text("Bedrooms: " + bedrooms);
    $("#modal-content-popup-listing .popup-bathrooms").text("Bathrooms: " + bathrooms);
    $("#modal-content-popup-listing .popup-price").text("Rent: $" + price + "/month");
    $("#modal-content-popup-listing .popup-type").text("Type: " + type.CapitalizeFirstLetter());
    $("#modal-content-popup-listing .popup-animals").text("Animals? "+ BooleanToHumanReadable(animals));
    $("#modal-content-popup-listing .popup-Laundry").text("In-Unit Laundry? " + BooleanToHumanReadable(Laundry));
    $("#modal-content-popup-listing .popup-parking").text("Parking? " + BooleanToHumanReadable(parking));
    $("#modal-content-popup-listing .popup-ac").text("AC? " + BooleanToHumanReadable(AirConditioning));
    $("#modal-content-popup-listing .popup-tags").text("Tags: " + (!tags ? tags : tags.join(", ")));
    
    $("#modal-content-popup-listing .owl-carousel-button").attr("onclick", "LoadOwlCarousel('" + id + "');");
    
    PopulateAndOpenModal(null, 'modal-content-popup-listing');
}

function LoadOwlCarousel(id)
{
    $("#modal-content-owl-carousel").html(listingSlideshows[id]);
    
    PopulateAndOpenModal(event, 'modal-content-owl-carousel');
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
                        ShowLoginFeatures(hideMainModal);
                        
                        if (Contains(res, "Landlord"))
                        {
                            $("#portal-function a").attr("href", "/landlord/listings");
                        }
                        else if (!Contains(res, "Tenant"))
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
                    SetError('login', e.message);
                }
            },
            error: function(res, err)
            {
                SetError('login', res + " " + err);
            },
            complete: function()
            {
                ResetModal("login", "Log In", false);
            }
        });
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
                    ShowLoginFeatures(true);
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
                SetError('login', e.message);
            }
        },
        error: function(res, err)
        {
            SetError('login', res + " " + err);
        },
        complete: function()
        {
            ResetModal("login", "Log In", false);
            
            $("#DeleteAccount_header").siblings("label").remove();
            $("#DeleteAccount_header").siblings("input.password").remove();
        }
    });
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
                    PopulateAndOpenModal(null, "modal-content-logout");
                }
                else
                {
                    throw new Error("Problem Logging Out");
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
    
    $("#login").text("Log In");
    $("#login-function").attr("onclick", "LoadModal(event, 'modal-content-login', 'login', 'Log In');");
}

function RemoveLoginFeatures()
{
    $("#portal-function").hide();
}

function ShowLoginFeatures(hideMainModal)
{
    $("#login").text("Log Out");
    $("#login-function").attr("onclick", "LogoutUser()");
    $("#login-function").show();
    
    if (hideMainModal === true)
    {
        HideMainModal();
    }
    
    $("#portal-function").show();
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
    var data = BuildData(["Username", "Password", "FirstName", "LastName",
                                    "Email", "PhoneNumber"]);
                                    
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
                SetError("CreateAccount", res + " " + err);
            },
            complete: function()
            {
                ResetModal("CreateAccount", "Create Account", false);
                
                SetDefaultButtonOnEnter("");
            }
        });
    }
}

function LoadModal(event, which, enterDefault, btnText)
{
    PopulateAndOpenModal(event, which); 
    ResetModal(enterDefault, btnText, true); 
    SetDefaultButtonOnEnter(enterDefault);
    //also try to reset the modal backdrop height 
    //      because it's different for each modal
    
    ModalBackdropHeight($('#common-modal.modal'));
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
    if (fields.Password === "")
    {
        error += "Password<br>";
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
    if (fields.PhoneNumber === "" || (fields.PhoneNumber !== undefined && !IsValidPhoneNumber(fields.PhoneNumber)))
    {
        error += "Valid Phone Number<br>";
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

    $('#listings').slimScroll({
        height: '100%',
        railVisible: true,
        alwaysVisible: true,
        size: '10px'
    });
});

$(window).on('resize', function() {
    //otherwise they get out of place
    SetHiddenSidebars();
   
    if ($("#listings_list").width() > 0)
    {
        $("#listings_list").stop();
        OpenListingsList();
    }
});
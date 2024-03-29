/************* THEME HELPER FUNCTIONS **************/
/* 
 * ================================================================
 * VIEWPORT
 *
 * get actual window width/height (to match with css media queries)
 */
function viewport() {
    var e = window;
    var a = 'inner';

    if (!('innerWidth' in window)) {
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
function toggle_main_menu() {
    // only applies for mobile window widths
    if (viewport().width <= window.xs_screen_max) {
        var mobile_menu_icon = $("#left-sidebar #mobile-menu-icon");
        var main_menu = $("#left-sidebar #main-menu");

        // if menu is already visible, hide it and remove active class for menu icon
        if (main_menu.is(':visible')) {
            main_menu.addClass("menu_closed_on_xs").removeClass("menu_opened_on_xs").slideUp("fast", function () {
                mobile_menu_icon.removeClass("active");
            });

            return "closed";
        }

            // if menu is hidden, show it and add active class to menu icon
        else {
            main_menu.addClass("menu_opened_on_xs").removeClass("menu_closed_on_xs").slideDown("fast", function () {
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
function main_menu_visiblity_on_resize() {
    var main_menu = $("#left-sidebar #main-menu");

    // for larger window viewports
    if (viewport().width > window.xs_screen_max) {
        // if menu was closed on small (mobile/xs) viewport, show it
        if (main_menu.hasClass("menu_closed_on_xs")) {
            main_menu.show();
        }
    }
        // end: for larger window viewports

        // for smaller window viewports (mobile/xs)
    else {
        // if menu was closed on small (mobile/xs) viewport, ensure it remains closed
        if (main_menu.hasClass("menu_closed_on_xs")) {
            main_menu.hide();
        }
        // if menu was open on small (mobile/xs) viewport, ensure it remains open
        if (main_menu.hasClass("menu_opened_on_xs")) {
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
function sections_content_vertical_position() {
    // only applies for non-mobile window widths (see comment above)
    if (viewport().width > window.xs_screen_max) {
        var window_height = $(window).height();
        var content_available_height = 0.8 * window_height; // the available height for the .content-wrapper when it is absolute positioned

        // for each section
        $("#main-content .section-wrapper").each(function () {
            var content_wrapper = $(this).find(".content-wrapper");
            var content_wrapper_height = content_wrapper.height();
            var active_section = ($(this).hasClass("active")) ? true : false; // check if this section is active (visible)

            // if content-wrapper height is larger than the height available in page (without content being hidden), set position to static (not absolute)
            if (content_wrapper_height > content_available_height) {
                content_wrapper.css(
                {
                    "position": "static"
                });
            }
                // end: if content-wrapper height is larger than the height available

                // if content-wrapper height is smaller than (within) height available, set position to absolute (with bottom and right position set in the CSS)
            else {
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
    else {
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
function initialise_general_links_click_events() {
    // in any link inside the page is clicked
    $("a.link-scroll").click(function (event) {
        // get target link
        var clicked_link_href = $(this).attr("href");

        // if link is not empty
        if (clicked_link_href !== undefined && clicked_link_href != "" && clicked_link_href != "#") {
            var first_character_of_link = clicked_link_href.substr(0, 1); // will be used below

            // if link is to an ID of an element (anchor link)
            if (first_character_of_link == "#") {
                // if element with that ID exists inside the page
                if ($(clicked_link_href).length > 0) {
                    // add class to identify that scroll is "in action", so that no other scroll functions conflict
                    $("#main-content").addClass("same_page_link_in_action");

                    // scroll to section
                    var target_vertical_offset = $(clicked_link_href).offset().top;
                    $('html, body').stop().animate(
                    {
                        scrollTop: target_vertical_offset
                    }, 1500, 'easeInOutCubic', function () {

                        // remove class used to identify that scroll is "in action", so that no other scroll functions conflict
                        $("#main-content").removeClass("same_page_link_in_action");

                        // set visible section to active
                        update_active_sections_on_scroll();
                    });

                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                }

                    // if element with that ID doesn't exist
                else {
                    return false;
                }
            }
                // end: if link is to an ID of an element (anchor link)

                // normal link
            else {
                // acts as a normal link
            }
            // end: normal link

        }
            // end: if link is not empty 

            // empty link
        else {
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
function scroll_to_section(target_section_id, clicked_menu_item_id, change_background) {
    // only works if the target_section is provided
    if (target_section_id !== undefined && target_section_id != "") {
        var target_section_wrapper = $("#main-content " + target_section_id + ".section-wrapper");

        // if target section exists and is not already active
        if (target_section_wrapper.length != 0 && !target_section_wrapper.hasClass("active")) {
            var section_vertical_offset = target_section_wrapper.offset().top;

            // close main menu on mobile viewport
            var menu_height = $("#main-menu").height();
            if (toggle_main_menu() == "closed") {
                section_vertical_offset = section_vertical_offset - menu_height;
            }

            // scroll to section
            $('html, body').stop().animate(
            {
                scrollTop: section_vertical_offset
            }, 1500, 'easeInOutCubic', function () {

                // remove class used to identify that section is "in action", so that no other scroll functions conflict
                $("#main-content").removeClass("same_page_link_in_action");

                // set section to active
                set_section_to_active(target_section_id, clicked_menu_item_id, '', change_background);
            });
        }
            // end: if target section exists

        else {
            return false;
        }
    }
        // end: only works if the target_section is provided

    else {
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
function set_height_of_parent_content_wrappers() {
    var elements_with_max_height_class = $("#main-content .max-height");

    // for each element
    elements_with_max_height_class.each(function () {
        var parent_content_wrapper = $(this).parents(".content-wrapper");

        // if parent .content-wrapper is found
        if (parent_content_wrapper.length > 0) {
            parent_content_wrapper.parents(".section-wrapper").addClass("modified-height");

            // if data-height-percent attribute is set for the element with class ".max-height", then use that defined percentage height
            var defined_height_percentage = $(this).attr("data-height-percent");
            if (defined_height_percentage !== undefined && defined_height_percentage != "" && !isNaN(defined_height_percentage)) {
                parent_content_wrapper.css(
                {
                    "height": defined_height_percentage + "%"
                });
            }

                // else, if no defined percentage height is set, set a default 80% height to the content-wrapper
            else {
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
function PopulateAndOpenModal(event, modal_content_id, section_in_modal, add_class_to_modal) {
    var modal = $("#common-modal.modal");
    var modal_body = modal.find(".modal-body");
    var modal_content_container_to_populate = $("#" + modal_content_id);

    var add_class = "";
    if (add_class_to_modal !== undefined && add_class_to_modal != "") {
        add_class = add_class_to_modal;
    }

    // if modal and content container exists
    if (modal_body.length > 0 && modal_content_container_to_populate.length > 0) {
        // fade out main content of page (so modal content is readable)
        $("#outer-container").fadeTo("fast", 0.2);

        // get initial vertical offset so that when modal is opened/closed, it ensures that page doesn't scroll to top (bugfix)
        var initial_vertical_scroll_offset = $(document).scrollTop();

        var modal_content = modal_content_container_to_populate.html(); // get content to populate in modal
        modal_body.empty().html(modal_content); // first empty the modal body and then populate it with new content

        // open modal (popup)
        modal.modal();

        // lightbox fix - temporary change attribute, to avoid duplicate entries (since same content is printed inside the popup container)
        modal_content_container_to_populate.find("a[data-lightbox]").each(function () {
            var attr_value = $(this).attr("data-lightbox");
            $(this).removeAttr("data-lightbox");
            $(this).attr("data-mod-lightbox", attr_value);
        });

        // add class to modal
        if (add_class != "") modal.addClass(add_class);

        // when modal is shown, position it in the middle of the page 
        modal.on('shown.bs.modal', function (e) {
            //position_modal_at_centre();
            // if set, scroll to a given section inside the popup
            if (section_in_modal !== undefined && section_in_modal != "" && $("#common-modal.modal").find(section_in_modal).length > 0) {
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
        modal.on('hide.bs.modal', function (e) {
            $("#outer-container").fadeTo("fast", 1);

            // lightbox fix - reset attribute to original
            $("#" + modal_content_id).find("a[data-mod-lightbox]").each(function () {
                var attr_value = $(this).attr("data-mod-lightbox");
                $(this).removeAttr("data-mod-lightbox");
                $(this).attr("data-lightbox", attr_value);
            });
        });

        // when modal is hidden, empty modal body 
        modal.on('hidden.bs.modal', function (e) {
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
function ModalBackdropHeight(modal) {
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
function position_modal_at_centre() {
    var modal_outer_container = $(".modal");

    // if modal exists and is visible
    if (modal_outer_container.length > 0 && modal_outer_container.is(":visible")) {
        var modal_content_container = modal_outer_container.find(".modal-dialog");
        var modal_width = modal_content_container.width();
        var modal_height = modal_content_container.height();
        var check_if_modal_content_fits_inside_the_page = ((modal_height + 70) < viewport().height) ? true : false;

        // for large viewports only, centre/middle align
        // align in the middle ONLY if the modal content height is less than the window height
        if (viewport().width > window.sm_screen_max && check_if_modal_content_fits_inside_the_page == true) {
            var top_margin_to_align_modal_at_middle_of_page = (viewport().height - modal_height) / 2;
            modal_content_container.animate({
                marginTop: top_margin_to_align_modal_at_middle_of_page + "px",
                marginBottom: "20px"
            }, 800, 'easeInOutCubic');
        }
            // end: for large viewports

            // for smaller viewports
        else {
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
function get_all_section_wrappers_in_page() {
    var section_wrappers = $("#main-content").find(".section-wrapper");
    return section_wrappers;
}

/* 
 * ===============================================================
 * ON DOCUMENT READY
 * ===============================================================
 */
function initialise_document_ready_functions()
{
    // background_settings.change_on_mobile = true; // uncomment to enable background change on mobile

    // useful variables (used in other functions)
    var section_wrappers = get_all_section_wrappers_in_page(); // get all the section wrappers in the page
    var amount_of_pixels_as_buffer_between_sections = 0.25 * ($(window).height()); // used in update_active_sections_on_scroll();

    // Sections Content Vertical Position
    sections_content_vertical_position();

    // Initialise General Links Click Events
    initialise_general_links_click_events();
    
    // modify heights of .content-wrapper parents of elements with .max-height class set
    set_height_of_parent_content_wrappers();   
    
    // ------ On Closing Popups ------
    $("#common-modal").on('hide.bs.modal', function()
    {
        // Destroy Owl Carousel image gallery when modal/popup is closed (it will be re-initialised again when popup is re-opened)
        if ($('#common-modal .popup-image-gallery').length > 0)
        {
          var carousel_initialised_data = $('#common-modal .popup-image-gallery, #common-modal .popup-alt-image-gallery').data('owlCarousel');
          if (carousel_initialised_data !== undefined)
          {
            carousel_initialised_data.destroy();
          }
        }      
    });
    // ------ END: Owl Carousel ------ 

    /* 
     * ----------------------------------------------------------
     * ON WINDOW RESIZE
     * ----------------------------------------------------------
     */
    $(window).resize(function()
    { 

        // update variables already set in document.ready above
        amount_of_pixels_as_buffer_between_sections = 0.25 * ($(window).height()); // used in update_active_sections_on_scroll();

        // Sections Content Vertical Position
        if (!jQuery.browser.mobile) sections_content_vertical_position();

        // Main Menu Visiblity on Window Resize
        main_menu_visiblity_on_resize();

        // Position modal at the centre/middle of the page (if visible)
        position_modal_at_centre();

    });
    // end: on window resize
}
// end: initialise_document_ready_functions()

$(document).ready(function()
{
    initialise_document_ready_functions();
});

 /* 
 * ===============================================================
 * ON WINDOW LOAD (after all elements were loaded)
 * ===============================================================
 */

function initialise_window_load_functions()
{
    // update variables already set in document.ready above
    amount_of_pixels_as_buffer_between_sections = 0.25 * ($(window).height()); // used in update_active_sections_on_scroll();
}
// end: initialise_window_load_functions()

$(window).load(function()
{
    initialise_window_load_functions();
});
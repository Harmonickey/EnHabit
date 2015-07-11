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
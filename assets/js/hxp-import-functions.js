/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: X-Porter
 * Date: 29.08.17
 * Copyright: Philipp Dippel
 */

jQuery(document).ready(() => {

    let hxp_file_input    = jQuery('#zip_file');
    let hxp_submit_button = jQuery('#submitButton');

    //Check if an file is selected or not and toggle submit Button disabled property
    hxp_file_input.change(() => {
        if (hxp_file_input.val() !== '')
        {
            hxp_submit_button.prop('disabled', false);
            hxp_submit_button.addClass('hover');
        }
        else
        {
            hxp_submit_button.prop('disabled', true);
            hxp_submit_button.removeClass('hover');
        }
    });

});
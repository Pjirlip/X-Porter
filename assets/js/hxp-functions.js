/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 14.08.17
 * Copyright: Philipp Dippel
 */

jQuery(document).ready(() => {

    let hxp_all_Elements                     = [];
    let hxp_all_for_export_selected_Elements = [];
    let hxp_colors                           = null;
    let hxp_export_colors                    = [];

    jQuery('#loadButton').click(() => {

        jQuery('#exportButton').prop("disabled", true);

        hxp_colors                           = null;
        hxp_all_Elements                     = [];
        hxp_export_colors                    = [];
        hxp_all_for_export_selected_Elements = [];
        jQuery('#unorderedList').empty();

        let data = {
            'action':   'hxp_collectData',
            'whatever': hxp_ajax_object.we_value
        };

        jQuery.post(hxp_ajax_object.ajax_url, data, (hxp_database_result) => {

            let hxp_all_imported_Elements = jQuery.parseJSON(hxp_database_result);

            if (hxp_all_imported_Elements === undefined || hxp_all_imported_Elements.length === 0)
            {
                jQuery('#unorderedList').append('<li class="listItem"><p></p> <p>No Elements found</p> <p>No Elements found</p> <p>No Elements found</p></li>')
            }
            else
            {
                hxp_all_imported_Elements.forEach((element, index, arr) => {

                    if (element.option_name)
                    {
                        hxp_colors              = element.option_name === 'cornerstone_color_items' ? element : null;
                        hxp_colors.option_value = jQuery.parseJSON(hxp_colors.option_value.replace(/\\/g, ''));
                    }
                    else
                    {
                        let type = element.post_type === 'cs_header' ? "Header" : "Footer";
                        jQuery('#unorderedList').append('<li class="listItem"><input id="Element' + element.ID + '" name="' + element.post_name + '" type="checkbox"><p>' + element.ID + '</p><p>' + element.post_name + '</p><p>' + type + '</p></li>');
                        hxp_all_Elements.push(element);
                    }
                });

                jQuery('#unorderedList input').change(() => {

                        hxp_clearExports();
                        get_selected_Elements();

                        if (jQuery('#unorderedList input:checked').length)
                        {
                            hxp_get_all_used_colors();
                            jQuery('#exportButton').prop("disabled", false);
                        }
                        else
                        {
                            hxp_all_for_export_selected_Elements = [];
                            jQuery('#exportButton').prop("disabled", true);
                        }

                    });

            }

            console.log(hxp_all_imported_Elements);
            console.log(hxp_all_Elements);

        });
    });

    function hxp_get_all_used_colors()
    {
        hxp_clearExports();

        if (hxp_colors)
        {
            hxp_colors.option_value.forEach((color, index, arr) => {

                if (hxp_all_for_export_selected_Elements.some((element, ind, array) => {

                        return ( element.post_content.indexOf('global-color:' + color._id) !== -1);
                    }))
                {
                    hxp_export_colors.push(color);
                }

            });
        }

        hxp_export_colors.forEach((color, index, arr) => {
            jQuery('#neededColorsList').append('<li><p>' + color.title + '</p><p>' + color.value + '</p><div class="colorExample" style="background:' + color.value + '; width: 100%; height: 100%"> </div></li>');
        });
    }

    function hxp_clearExports()
    {
        hxp_export_colors = [];
        jQuery('#neededColorsList').empty();
    }

    function get_selected_Elements()
    {
        hxp_all_for_export_selected_Elements = [];

        let arr = jQuery('#unorderedList input:checked').get();
        arr.forEach((element) =>
        {
            let id = element.id.replace('Element', '');
            let index = hxp_all_Elements.findIndex((item) => {return item.ID === id});
            hxp_all_for_export_selected_Elements.push(hxp_all_Elements[index]);
        });

        console.log(hxp_all_for_export_selected_Elements);



    }

});
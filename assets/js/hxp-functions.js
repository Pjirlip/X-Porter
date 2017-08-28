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
    let hxp_fonts                            = null;
    let hxp_exports_fonts                    = [];
    let hostname                             = window.location.host;
    let hxp_export_images                    = [];
    let plugin_path                          = hxp_ajax_object.plugin_url;
    let exportButton                         = jQuery('#exportButton');

    exportButton.click(() => {
        create_export_bundel();
    });

    jQuery('#loadButton').click(() => {

        jQuery('#exportButton').prop("disabled", true);

        hxp_colors                           = null;
        hxp_all_Elements                     = [];
        hxp_export_colors                    = [];
        hxp_all_for_export_selected_Elements = [];
        hxp_fonts                            = null;
        hxp_exports_fonts                    = [];

        jQuery('#unorderedList').empty();

        let data = {
            'action': 'hxp_collectData',
        };

        jQuery.post(hxp_ajax_object.ajax_url, data, (hxp_database_result) => {

            let hxp_all_imported_Elements = jQuery.parseJSON(hxp_database_result);

            if (hxp_all_imported_Elements === undefined || hxp_all_imported_Elements.length === 0)
            {
                alert('Es konnten keine Elemente zum exportieren gefunden werden.')
            }
            else
            {
                hxp_all_imported_Elements.forEach((element, index, arr) => {

                    if (element.option_name)
                    {
                        if (element.option_name === 'cornerstone_color_items')
                        {
                            hxp_colors                = element;
                            hxp_colors.readable_value = jQuery.parseJSON(hxp_colors.option_value.replace(/\\/g, ''));

                        }
                        else if (element.option_name === 'cornerstone_font_items')
                        {
                            let regEx                = new RegExp('(?:"stack":")(".*?")(?=, )', 'g');
                            hxp_fonts                = element;
                            hxp_fonts.readable_value = (hxp_fonts.option_value.replace(/\\/g, '')).replace(regEx, (match, value) => {
                                return '"stack":"' + value.replace(/"/g, '');
                            });
                            hxp_fonts.readable_value = jQuery.parseJSON(hxp_fonts.readable_value);
                        }
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
                        hxp_get_all_used_fonts();
                        exportButton.prop("disabled", false);
                    }
                    else
                    {
                        hxp_all_for_export_selected_Elements = [];
                        exportButton.prop("disabled", true);
                    }

                });

            }
        });
    });

    function hxp_get_all_used_colors()
    {

        if (hxp_colors)
        {
            hxp_colors.readable_value.forEach((color, index, arr) => {

                if (hxp_all_for_export_selected_Elements.some((element, ind, array) => {

                        return (element.post_content.indexOf('global-color:' + color._id) !== -1);
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

    function hxp_get_all_used_fonts()
    {
        if (hxp_fonts)
        {
            hxp_fonts.readable_value.forEach((font, index, arr) => {

                if (hxp_all_for_export_selected_Elements.some((element, ind, array) => {
                        console.log(font);
                        return (element.post_content.indexOf('font_family":"' + font._id) !== -1);
                    }))
                {
                    hxp_exports_fonts.push(font);
                }

            });

        }

        hxp_exports_fonts.forEach((font, index, arr) => {
            jQuery('#neededFontsList').append('<li><p>' + font.title + '</p><p>' + font.family + '</p><p>' + font.stack + '</p></li>')
        });

    }

    function hxp_clearExports()
    {
        hxp_export_colors = [];
        jQuery('#neededColorsList').empty();

        hxp_exports_fonts = [];
        jQuery('#neededFontsList').empty();

        hxp_export_images = [];
        jQuery('#needetImagesList').empty();
    }

    function get_selected_Elements()
    {
        hxp_all_for_export_selected_Elements = [];

        let arr = jQuery('#unorderedList input:checked').get();
        arr.forEach((element) => {
            let id    = element.id.replace('Element', '');
            let index = hxp_all_Elements.findIndex((item) => {
                return item.ID === id
            });
            hxp_all_for_export_selected_Elements.push(hxp_all_Elements[index]);
        });

        hxp_all_for_export_selected_Elements.forEach((element) => {
            findImages(element.post_content);
        });

        let set           = new Set(hxp_export_images);
        hxp_export_images = Array.from(set);
        list_all_images_from_selection();

        console.log(hxp_all_for_export_selected_Elements);

    }

    function findImages(searchstring)
    {
        let regEx    = new RegExp('"(?:https?://)' + hostname + '(?:.+?)"', 'g');
        searchstring = searchstring.replace(/\\/g, '');
        let matches  = searchstring.match(regEx);
        if (matches !== null)
        {
            matches.forEach((item) => hxp_export_images.push(item));
        }
    }

    function list_all_images_from_selection()
    {
        hxp_export_images.forEach((image_url) => {
            jQuery('#needetImagesList').append('<li><p>' + image_url + '</p><div class="imagePreview" style="background: url(' + image_url.replace(/"/g, '') + '); width: 100%; height: 100%"> </div></li>');
        });
    }

    function loadImages(image_url)
    {
        console.log(image_url);
        

        hxp_export_images.forEach()


        let index      = image_url.lastIndexOf('/') + 1;
        let image_name = image_url.substr(index);

        let data = {
            'action':     'hxp_save_image',
            'full_url':   image_url,
            'image_name': image_name
        };

        jQuery.post(hxp_ajax_object.ajax_url, data, (response) => {
            if (response === "error_image_parsing")
            {
                alert('Something went wrong by packing image:' + image_name);
            }
        });
    }

    function create_export_bundel()
    {
        console.log("Button Clicked");
        hxp_export_images.forEach((image_url) =>
            loadImages(image_url.replace(/"/g, '')));

    }

});
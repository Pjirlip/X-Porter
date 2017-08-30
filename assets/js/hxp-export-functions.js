/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: X-Porter
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
    let hxp_hostname                         = window.location.host;
    let hxp_export_images                    = [];
    let hxp_export_button                    = jQuery('#exportButton');
    let hxp_download_zip_button              = jQuery('#oButton');
    let hxp_overlay                          = jQuery('#hxpOverlay');
    let hxp_overlay_text                     = jQuery('#oText');
    let hxp_loading_indicator                = jQuery('#oLoader');
    let hxp_progress_bar                     = jQuery('#oProgressBar');

    hxp_export_button.click(() => {
        create_export_bundel();
    });

    hxp_download_zip_button.click(() => {
        hxp_download_zip();
    });

    jQuery('#loadButton').click(() => {

        jQuery('#exportButton').prop("disabled", true);
        hxp_clearExports();

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
                        hxp_export_button.prop("disabled", false);
                    }
                    else
                    {
                        hxp_all_for_export_selected_Elements = [];
                        hxp_export_button.prop("disabled", true);
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

        //console.log(hxp_all_for_export_selected_Elements);

    }

    function findImages(searchstring)
    {
        let regEx    = new RegExp('"(?:https?://)' + hxp_hostname + '(?:[^\\.]+?)\\.(?:jpg|jpeg|gif|png)', 'g');
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

    function loadImages()
    {
        hxp_overlay_text.text("Collecting all Images...");
        let hxp_image_urls  = [];
        let hxp_image_names = [];
        let hxp_image_short_urls = [];

        hxp_export_images.forEach((image_url) => {
            let stripped_image_url = image_url.replace(/"/g, '');
            let index              = stripped_image_url.lastIndexOf('/') + 1;
            hxp_image_names.push(stripped_image_url.substr(index));
            hxp_image_urls.push(stripped_image_url);
            index = stripped_image_url.indexOf('uploads') + 8;
            stripped_image_url = stripped_image_url.substring(index);
            hxp_image_short_urls.push(stripped_image_url);
        });

        let data = {
            'action':      'hxp_save_images',
            'image_urls':  JSON.stringify(hxp_image_urls),
            'image_names': JSON.stringify(hxp_image_names),
        };

        jQuery.post(hxp_ajax_object.ajax_url, data, (response) => {
            if (response == true)
            {
                hxp_overlay_text.text('Collecting all Images completed');
                console.info("Copy Images went well");
            }
            else
            {
                hxp_overlay.css('display', 'none');
                alert('Something went wrong: Copy Images to export Folder');
            }
        });

        let response   = {};
        response.names = hxp_image_names;
        response.paths = hxp_image_urls;
        response.shortPaths = hxp_image_short_urls;
        return response;
    }

    function create_export_bundel()
    {

        hxp_overlay.css('display', 'grid');
        hxp_overlay_text.text('Create Export Bundle...');
        hxp_progress_bar.val(0);
        hxp_loading_indicator.css('display', 'block');
        let response = loadImages();
        hxp_progress_bar.val(33);

        let hxp_protocol_indicator = location.protocol;
        hxp_protocol_indicator = hxp_protocol_indicator.indexOf('https') === -1 ? false : true;


        let export_object         = {};
        export_object.fonts       = hxp_exports_fonts;
        export_object.colors      = hxp_export_colors;
        export_object.elements    = hxp_all_for_export_selected_Elements;
        export_object.oldhostname = hxp_hostname;
        export_object.imageNames  = response.names;
        export_object.imagePaths  = response.paths;
        export_object.imageShortPaths = response.shortPaths;
        export_object.httpsStatus = hxp_protocol_indicator;
        export_object.pluginIndicator = 'HXP_PLUGIN_CREATED';

        //console.log(JSON.stringify(export_object));

        let data = {
            'action':      'hxp_save_json',
            'json_object': JSON.stringify(export_object)
        };

        hxp_overlay_text.text('Creating Configuration File...');
        jQuery.post(hxp_ajax_object.ajax_url, data, (response) => {
            if (response == true)
            {
                hxp_progress_bar.val(66);
                hxp_overlay_text.text("Creating Configuration File completed.");
                console.info("Write JSON Configuration File went well");

                jQuery.post(hxp_ajax_object.ajax_url, {'action': 'hxp_create_export_bundle'}, (response) => {
                    if (response == true)
                    {
                        hxp_loading_indicator.css('display', 'none');
                        hxp_overlay_text.text('Creating ZIP completed! You can download the Archive now.');
                        hxp_progress_bar.val(100);
                        hxp_download_zip_button.css({'pointer-events': 'all', 'color': '#3F72AF'});

                    }
                    else
                    {
                        hxp_overlay.css('display', 'none');
                        alert('Something went wrong: Creating Zip-Archive')
                    }
                });
            }
            else
            {
                hxp_overlay.css('display', 'none');
                alert('Something went wrong: Creating JSON Configuration File');
            }
        });

    }

    function hxp_download_zip()
    {
        hxp_download_zip_button.css({'pointer-events': 'none', 'color': 'lightgrey'});
        hxp_overlay.css('display', 'none');
    }

});
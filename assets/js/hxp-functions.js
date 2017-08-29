/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 14.08.17
 * Copyright: Philipp Dippel
 */

jQuery(document).ready(() => {

    let hxp_success_sound = new Audio('data:audio/wav;base64,' + 'SUQzBAAAAAACblRJVDIAAAAXAAADZmluaXNoZWRfZXhwb3J0X3NvdW5kAFRYWFgAAAAMAAADaVR1 blBHQVAAMABURU5DAAAAEgAAA2lUdW5lcyAxMi42LjIuMjAAVFhYWAAAAGUAAANpVHVuTk9STQAg MDAwMDAwMEIgMDAwMDAwMEUgMDAwMDAwMTIgMDAwMDAwMTQgMDAwMDAxQkMgMDAwMDAxQkMgMDAw MDA0MEIgMDAwMDA0MkQgMDAwMDAxQTEgMDAwMDAxQTEAVFhYWAAAAH8AAANpVHVuU01QQgAgMDAw MDAwMDAgMDAwMDAyMTAgMDAwMDA4QzUgMDAwMDAwMDAwMDAwQTAyQiAwMDAwMDAwMCAwMDAwNDk3 OSAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMCAwMDAwMDAwMABU U1NFAAAADwAAA0xhdmY1Ny43MS4xMDAAAAAAAAAAAAAAAP/7UAAAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAEluZm8AAAAPAAAAJwAAQHwACQkQEBAWFh0dHSMjKioqMDA3Nzc9PT1EREpK SlBQV1dXXV1kZGRqampxcXd3d35+hISEi4uRkZGYmJ6enqWlpaursrKyuLi/v7/FxczMzNLS0tnZ 39/f5ubs7Ozz8/n5+f//AAAAAExhdmM1Ny44OQAAAAAAAAAAAAAAACQCQAAAAAAAAEB88aKRqAAA AAAAAAAAAAAAAAAAAAD/+5BEAAESagDBQCAAAE3AF8UAIwBJVHkZNCGAAT+OIyaCMAAQIEAAVofJ lGicHykuD73Vg+/D4fxOD6JcTvdLg+/D4fyYfRLid7pcLvrB8P4fD6KRO90uPfWD4fw+H0WicP5c DvrB8+6Fw+jB8P4nB+BAAPuzIByP6ujkW/iOlZ/7IjCP+ztn+bLbtxQtO7/STo/9JUqW7osof9lr f9Kcit/qkZGvnRyLf6OlOY1u3/9SC7P3SVK27otO7/STkAAhb6hrNZL2bzi9CtejiKHMKamiIQMw 7nnbXKCEnWWAAwE1nO5wgjHMWYy5ogp21p8o0XP65BYr16iLTE4LOWtCJxRCMtoP1obZWACDFKLg N2MAyTBI3nfV6dhB2DxkgjOi3c/z7BeCAbhAgcLlAtLyLhOPITiwIKHLzVcpOQI4I0FFkIWJoXhc 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 qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+5JE7AES 5lpFwEEYIl4JGKUIAzJKwQMHAYR6iXUuIFQwjkGqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qqqqqqqqqqqqqqqq');

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
        let regEx    = new RegExp('"(?:https?://)' + hxp_hostname + '(?:.+?)"', 'g');
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

        hxp_export_images.forEach((image_url) => {
            let stripped_image_url = image_url.replace(/"/g, '');
            let index              = stripped_image_url.lastIndexOf('/') + 1;
            hxp_image_names.push(stripped_image_url.substr(index));
            hxp_image_urls.push(stripped_image_url);
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

        let export_object         = {};
        export_object.fonts       = hxp_exports_fonts;
        export_object.colors      = hxp_export_colors;
        export_object.elements    = hxp_all_for_export_selected_Elements;
        export_object.oldhostname = hxp_hostname;
        export_object.imageNames  = response.names;
        export_object.imagePaths  = response.paths;

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
                        hxp_success_sound.play();
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
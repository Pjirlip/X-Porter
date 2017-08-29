/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 29.08.17
 * Copyright: Philipp Dippel
 */

jQuery(document).ready(() => {

    jQuery("#uploadForm").on("submit", hxp_upload_zip_file);

    function hxp_upload_zip_file(event)
    {
        let hxp_zip_file = jQuery('#zipFileInput')[0].files[0];
        let formdata = new FormData();

        formdata.append('zip_file', hxp_zip_file);

        console.log(hxp_zip_file);

        if ((hxp_zip_file !== undefined || hxp_zip_file !== null))
        {
            if ((hxp_zip_file.type === 'application/zip') && (hxp_zip_file.size > 0))
            {
                console.log("Bonus!");

                let data = {
                    'action': 'hxp_upload_und_unzip_zip',
                    'zip_file': hxp_zip_file
                };

                jQuery.ajax({
                    url: hxp_ajax_object.ajax_url,
                    type: "POST",
                    data: data,
                    processData: true,
                    success: function (res){
                        console.log(res);

                    }
                });

            }
            else
            {
                alert("Kein gültige Datei ausgewählt! Nur gepackte Zip Archive sind erlaubt")
            }

        }
        else
        {
            alert("Keine Datei ausgewählt!")
        }
    }

});
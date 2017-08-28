<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */

defined( 'ABSPATH' ) || exit();

add_action('wp_ajax_hxp_save_image', 'hxp_save_image');

function hxp_save_image() {

	$hxp_upload_dir = wp_upload_dir();

	mkdir($hxp_upload_dir['basedir'] . '/hxp_exports', 0775, true);
	mkdir($hxp_upload_dir['basedir'] . '/hxp_exports/images', 0775, true);

	$hxp_image_url = $_POST['full_url'];
	$hxp_image_name = $_POST['image_name'];

	if(!copy($hxp_image_url, $hxp_upload_dir['basedir'] . '/hxp_exports/images/' . $hxp_image_name))
	{
		echo 'error_image_parsing';
	}
	else
	{
		echo "success_image_parsing";
	};

	wp_die();


}
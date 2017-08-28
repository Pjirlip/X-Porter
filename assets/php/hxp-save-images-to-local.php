<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */

defined( 'ABSPATH' ) || exit();

add_action( 'wp_ajax_hxp_save_image', 'hxp_save_image' );

function hxp_save_image() {

	$hxp_upload_dir = wp_upload_dir();

	mkdir( $hxp_upload_dir['basedir'] . '/hxp_exports', 0775, true );
	mkdir( $hxp_upload_dir['basedir'] . '/hxp_exports/images', 0775, true );

	$hxp_success_indicator = true;

	//$hxp_images_object = json_decode($_POST['data'] );
	$hxp_image_urls  = json_decode( $_POST['data']['image_urls']);
	$hxp_image_names = json_decode( $_POST['data']['image_names']);


	foreach ( $hxp_image_urls as $hxp_index => $hxp_value ) {
		if ( ! copy( $hxp_value, $hxp_upload_dir['basedir'] . '/hxp_exports/images/' . $hxp_image_names[ $hxp_index ] ) ) {
			$hxp_success_indicator = false;
		}


	}

	/*
	if ( $hxp_success_indicator == true ) {
		echo "true";
	} else {
		echo "false";
	}
	*/

	echo json_encode($hxp_image_urls);
	wp_die();


}
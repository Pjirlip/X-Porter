<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: X-Porter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */

defined( 'ABSPATH' ) || exit();

//get all needed images from ajax call and prepare them to create an zip bundle
add_action( 'wp_ajax_hxp_save_images', 'hxp_save_images' );

function hxp_save_images() {

	$hxp_upload_dir = wp_upload_dir();

	hxp_rrmdir($hxp_upload_dir['basedir'] . '/hxp_exports');

	mkdir( $hxp_upload_dir['basedir'] . '/hxp_exports', 0775, true );
	mkdir( $hxp_upload_dir['basedir'] . '/hxp_exports/images', 0775, true );

	$hxp_success_indicator = true;

	$hxp_image_urls  = json_decode( wp_unslash( $_POST['image_urls'] ), true );
	$hxp_image_names = json_decode( wp_unslash( $_POST['image_names'] ), true );


	foreach ( $hxp_image_urls as $hxp_index => $hxp_value ) {
		if ( ! copy( $hxp_value, $hxp_upload_dir['basedir'] . '/hxp_exports/images/' . $hxp_image_names[ $hxp_index ] ) ) {
			$hxp_success_indicator = false;
		}
	}

	echo $hxp_success_indicator;
	wp_die();


}
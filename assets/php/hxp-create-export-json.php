<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: X-Porter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */


defined( 'ABSPATH' ) || exit();

add_action( 'wp_ajax_hxp_save_json', 'hxp_save_json' );

//get Object with configuration from javascript and create json file
function hxp_save_json() {

	$hxp_upload_dir = wp_upload_dir();

	$hxp_configuration_json = stripslashes( $_POST['json_object'] );

	$hxp_fp = fopen( $hxp_upload_dir['basedir'] . '/hxp_exports/configuration.json', 'w' );
	$hxp_write_success = fwrite( $hxp_fp, $hxp_configuration_json );
	fclose( $hxp_fp );


	if($hxp_write_success !== false)
	{
		$hxp_write_success = true;
	}
	echo $hxp_write_success;
	wp_die();


}
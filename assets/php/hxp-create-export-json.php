<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */


defined( 'ABSPATH' ) || exit();

add_action( 'wp_ajax_hxp_save_json', 'hxp_save_json' );

function hxp_save_json() {

	$hxp_upload_dir = wp_upload_dir();

	$hxp_success_indicator = true;

	$hxp_configuration_json  =  stripslashes( $_POST['json_object'] );

	$hxp_fp = fopen($hxp_upload_dir['basedir'] . '/hxp_exports/configuration.json', 'w');
	fwrite($hxp_fp, $hxp_configuration_json);
	fclose($hxp_fp);


	echo $hxp_success_indicator;
	wp_die();


}
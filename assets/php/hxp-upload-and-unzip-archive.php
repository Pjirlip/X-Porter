<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 29.08.17
 * Copyright: Philipp Dippel
 */



defined( 'ABSPATH' ) || exit();

add_action( 'wp_ajax_hxp_upload_und_unzip_zip', 'hxp_upload_und_unzip_zip' );

function hxp_upload_und_unzip_zip() {

	$hxp_upload_dir = wp_upload_dir();

	hxp_rrmdir($hxp_upload_dir['basedir'] . '/hxp_imports');

	mkdir( $hxp_upload_dir['basedir'] . '/hxp_imports', 0775, true );

	$hxp_success_indicator = true;

	$hxp_uploadet_zip = $_POST['zip_file'];

	/*$zip = new ZipArchive;
	$res = $zip->open($hxp_uploadet_zip);
	if ($res === TRUE) {
		$zip->extractTo($hxp_upload_dir['basedir'] . '/hxp_imports');
		$zip->close();
		echo 'woot!';
	} else {
		echo 'doh!';
	}*/
	echo $hxp_uploadet_zip;
	wp_die();


}
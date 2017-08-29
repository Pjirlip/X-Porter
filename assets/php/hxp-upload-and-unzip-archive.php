<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 29.08.17
 * Copyright: Philipp Dippel
 */

$indicator = false;

if ( isset( $_FILES['hxp_zip_file'] ) ) {


	$hxp_upload_dir = wp_upload_dir();

	hxp_rrmdir( $hxp_upload_dir['basedir'] . '/hxp_imports' );
	mkdir( $hxp_upload_dir['basedir'] . '/hxp_imports', 0775, true );


	move_uploaded_file( $_FILES['hxp_zip_file']['tmp_name'], $hxp_upload_dir['basedir'] . '/hxp_imports/export.zip' );


	$zip = new ZipArchive;
	$res = $zip->open( $hxp_upload_dir['basedir'] . '/hxp_imports/export.zip' );

	$zip->extractTo( $hxp_upload_dir['basedir'] . '/hxp_imports/' );
	$zip->close();


	$hxp_configuration_string = file_get_contents( $hxp_upload_dir['basedir'] . '/hxp_imports/configuration.json' );
	$hxp_configuration        = json_decode( $hxp_configuration_string, true );

	$hxp_imported_fonts       = $hxp_configuration['fonts'];
	$hxp_imported_colors      = $hxp_configuration['colors'];
	$hxp_imported_elements    = $hxp_configuration['elements'];
	$hxp_imported_oldHostname = $hxp_configuration['oldhostname'];
	$hxp_imported_imageNames  = $hxp_configuration['imageNames'];
	$hxp_imported_imagePaths  = $hxp_configuration['imagePaths'];
	$hostname = $_SERVER['HTTP_HOST'];

	foreach ($hxp_imported_imagePaths as $key => &$value)
	{
		str_replace($hxp_imported_oldHostname, $hostname, $value);
	}




	echo print_r($hxp_imported_imagePaths);

}











<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */


defined( 'ABSPATH' ) || exit();

add_action( 'wp_ajax_hxp_create_export_bundle', 'hxp_create_export_bundle' );

function hxp_create_export_bundle() {

	$hxp_sucess_indicator = true;
	$hxp_upload_dir       = wp_upload_dir();


	$hxp_export_zip   = new ZipArchive();
	$hxp_zip_filename = $hxp_upload_dir['basedir'] . '/hxp_exports/export.zip';

	if ( $hxp_export_zip->open( $hxp_zip_filename, ZipArchive::CREATE ) !== true ) {
		$hxp_sucess_indicator = false;
		echo $hxp_sucess_indicator;
		wp_die();
	}

	$hxp_export_zip->addFile( $hxp_upload_dir['basedir'] . '/hxp_exports/configuration.json', 'configuration.json');

	$files = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $hxp_upload_dir['basedir'] . '/hxp_exports/images/' ),
		RecursiveIteratorIterator::LEAVES_ONLY
	);

	foreach ( $files as $name => $file ) {
		// Skip directories (they would be added automatically)
		if ( ! $file->isDir() ) {
			// Get real and relative path for current file
			$filePath     = $file->getRealPath();
			$relativePath = substr( $filePath, strlen( $hxp_upload_dir['basedir'] . '/hxp_exports/images/' ) );

			// Add current file to archive
			$hxp_export_zip->addFile( $filePath, 'images/' . $relativePath );
		}
	}

	$hxp_export_zip->close();

	echo "Hallo";
	wp_die();


}
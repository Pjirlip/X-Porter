<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 29.08.17
 * Copyright: Philipp Dippel
 */


defined( 'ABSPATH' ) || exit();

function hxp_do_something() {


		$hxp_upload_dir = wp_upload_dir();

		hxp_rrmdir( $hxp_upload_dir['basedir'] . '/hxp_imports' );

		mkdir( $hxp_upload_dir['basedir'] . '/hxp_imports', 0775, true );


		$file = current( $_FILES );
		$zip  = new ZipArchive;
		$res  = $zip->open( $file );
		if ( $res === true ) {
			$zip->extractTo( $hxp_upload_dir['basedir'] . '/hxp_imports' );
			$zip->close();
			echo 'woot!';
		} else {
			echo 'doh!';
		}



}

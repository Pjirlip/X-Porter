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

	add_action( 'init', 'hxp_import_headers_and_footer' );

}


function hxp_import_headers_and_footer() {
	$hxp_copyImagesIndicator = true;

	$hxp_upload_dir = wp_upload_dir();

	hxp_rrmdir( $hxp_upload_dir['basedir'] . '/hxp_imports' );
	mkdir( $hxp_upload_dir['basedir'] . '/hxp_imports', 0775, true );


	move_uploaded_file( $_FILES['hxp_zip_file']['tmp_name'], $hxp_upload_dir['basedir'] . '/hxp_imports/export.zip' );


	$hxp_zip      = new ZipArchive;
	$hxp_resource = $hxp_zip->open( $hxp_upload_dir['basedir'] . '/hxp_imports/export.zip' );

	$hxp_zip->extractTo( $hxp_upload_dir['basedir'] . '/hxp_imports/' );
	$hxp_zip->close();


	$hxp_configuration_string = file_get_contents( $hxp_upload_dir['basedir'] . '/hxp_imports/configuration.json' );
	$hxp_configuration        = json_decode( $hxp_configuration_string, true );

	$hxp_imported_fonts             = $hxp_configuration['fonts'];
	$hxp_imported_colors            = $hxp_configuration['colors'];
	$hxp_imported_elements          = $hxp_configuration['elements'];
	$hxp_imported_oldHostname       = $hxp_configuration['oldhostname'];
	$hxp_imported_imageNames        = $hxp_configuration['imageNames'];
	$hxp_imported_image_Paths       = $hxp_configuration['imagePaths'];
	$hxp_imported_short_image_Paths = $hxp_configuration['imageShortPaths'];
	$hxp_new_hostname               = $_SERVER['HTTP_HOST'];
	$hxp_old_host_was_https         = $hxp_configuration['httpsStatus'];
	$hxp_new_host_is_https          = ( ! empty( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] !== 'off' ) || $_SERVER['SERVER_PORT'] == 443;


	foreach ( $hxp_imported_short_image_Paths as $key => $value ) {
		$hxp_copyImagesIndicator = copy( $hxp_upload_dir['basedir'] . '/hxp_imports/images/' . $hxp_imported_imageNames[ $key ], $hxp_upload_dir['basedir'] . '/' . $value );
		$filename                = $hxp_upload_dir['basedir'] . '/' . $value;


		$filetype = wp_check_filetype( basename( $filename ), null );

		$attachment = array(
			'post_mime_type' => $filetype['type'],
			'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
			'post_content'   => '',
			'post_status'    => 'inherit'
		);

		$attach_id = wp_insert_attachment( $attachment, $filename );

		require_once( ABSPATH . 'wp-admin/includes/image.php' );

		$attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
		wp_update_attachment_metadata( $attach_id, $attach_data );

	}

	$hxp_date = current_time( 'mysql' );

	//ADD:  ELEMENTS
	foreach ( $hxp_imported_elements as $key => $value ) {
		$hxp_guid = $value['guid'];

		$hxp_guid = str_replace( $hxp_imported_oldHostname, $hxp_new_hostname, $hxp_guid );

		$hxp_post_content = $value['post_content'];
		$hxp_post_content = str_replace( $hxp_imported_oldHostname, $hxp_new_hostname, $hxp_post_content );

		if ( $hxp_old_host_was_https != $hxp_new_host_is_https ) {
			if ( $hxp_old_host_was_https == true ) {
				$hxp_post_content = str_replace( 'https', 'http', $hxp_post_content );
			} else {
				$hxp_post_content = str_replace( 'http', 'https', $hxp_post_content );
			}
		}


		$hxp_post_content = addslashes( $hxp_post_content );


		$postarr = array(
			'ID'                    => 0,
			'post_author'           => 1,
			'post_date'             => $hxp_date,
			'post_date_gmt'         => $hxp_date,
			'post_content'          => $hxp_post_content,
			'post_content_filtered' => $value['post_content_filtered'],
			'post_title'            => $value['post_title'],
			'post_excerpt'          => $value['post_excerpt'],
			'post_status'           => $value['post_status'],
			'post_type'             => $value['post_type'],
			'comment_status'        => $value['comment_status'],
			'ping_status'           => $value['ping_status'],
			'post_password'         => $value['post_password'],
			'post_name'             => $value['post_name'],
			'to_ping'               => $value['to_ping'],
			'pinged'                => $value['pinged'],
			'post_modified'         => $hxp_date,
			'post_modified_gmt'     => $hxp_date,
			'post_parent'           => 0,
			'menu_order'            => $value['menu_order'],
			'post_mime_type'        => $value['post_mime_type'],
			'guid'                  => $hxp_guid,
			'comment_count'         => $value['comment_count'],
		);

		wp_insert_post( $postarr );

	}


	//UPDATE: COLORS OPTION
	$hxp_old_colors = get_option( 'cornerstone_color_items' );
	if ( false != $hxp_old_colors ) {
		$hxp_old_colors = json_decode( stripslashes( $hxp_old_colors ) );
	}

	//Child Elements need to be of Type Object
	foreach ( $hxp_imported_colors as &$element ) {
		$element = (object) $element;
	}
	unset( $element );

	if ( false != $hxp_old_colors ) {
		$hxp_new_generated_colors_array = array_unique( array_merge( $hxp_old_colors, $hxp_imported_colors ), SORT_REGULAR );
	} else {
		$hxp_new_generated_colors_array = $hxp_imported_colors;
	}

	update_option( 'cornerstone_color_items', addslashes( json_encode( $hxp_new_generated_colors_array ) ) );


	//UPDATE: FONTS OPTION
	$hxp_old_fonts = get_option( 'cornerstone_font_items' );
	if ( false != $hxp_old_fonts ) {
		$hxp_old_fonts = json_decode( stripslashes( $hxp_old_fonts ) );
	}

	foreach ( $hxp_imported_fonts as &$element ) {
		$element = (object) $element;
	}
	unset( $element );

	if ( false != $hxp_old_fonts ) {
		$hxp_new_generated_fonts_array = array_unique( array_merge( $hxp_old_fonts, $hxp_imported_fonts ), SORT_REGULAR );
	} else {
		$hxp_new_generated_fonts_array = $hxp_imported_fonts;
	}

	update_option( 'cornerstone_font_items', addslashes( json_encode( $hxp_new_generated_fonts_array ) ) );

}













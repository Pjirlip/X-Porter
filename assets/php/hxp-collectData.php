<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 14.08.17
 * Copyright: Philipp Dippel
 */


defined( 'ABSPATH' ) || exit();


add_action( 'wp_ajax_hxp_collectData', 'hxp_collectData' );

function hxp_collectData() {
	global $wpdb;
	$hxp_results_headers = $wpdb->get_results( 'SELECT * FROM ' . $wpdb->prefix . 'posts WHERE post_type LIKE \'cs_header\'' );
	$hxp_results_footers = $wpdb->get_results( 'SELECT * FROM ' . $wpdb->prefix . 'posts WHERE post_type LIKE \'cs_footer\'' );
	$hxp_results_colors  = $wpdb->get_results( 'SELECT * FROM ' . $wpdb->prefix . 'options WHERE option_name = \'cornerstone_color_items\'' );
	$hxp_results_fonts   = $wpdb->get_results( 'SELECT * FROM ' . $wpdb->prefix . 'options WHERE option_name = \'cornerstone_font_items\'' );
	echo json_encode( array_merge( $hxp_results_headers, $hxp_results_footers, $hxp_results_colors, $hxp_results_fonts ) );
	wp_die();

}
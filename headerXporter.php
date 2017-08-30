<?php
/*
Plugin Name: X-Porter
Plugin URI: https://dippel.rocks
Description: A Plugin to export and import X Pro (Themeco) created Theme Headers and Footers.
Version: 1.0.0
Author: Philipp Dippel
Author URI: https://dippel.rocks
Licencse: MIT
*/

/*
MIT License

Copyright (c) 2017 Philipp Dippel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

defined( 'ABSPATH' ) || exit();

add_action( 'admin_menu', 'hxp_XPorter' );
add_action( 'admin_enqueue_scripts', 'hxp_add_stylesheet' );
add_action( 'admin_enqueue_scripts', 'hxp_add_javascript' );
register_deactivation_hook( __FILE__, 'hxp_plugin_deactivation' );
require_once( plugin_dir_path( __FILE__ ) . 'assets/php/hxp-collectData.php' );
require_once( plugin_dir_path( __FILE__ ) . 'assets/php/hxp-save-images-to-local.php' );
require_once( plugin_dir_path( __FILE__ ) . 'assets/php/hxp-delete-directorys-function.php' );
require_once( plugin_dir_path( __FILE__ ) . 'assets/php/hxp-create-export-json.php' );
require_once( plugin_dir_path( __FILE__ ) . 'assets/php/hxp-create-export-zip.php' );
require_once( plugin_dir_path( __FILE__ ) . 'assets/php/hxp-upload-and-unzip-archive.php' );

function hxp_main_export_screen() {

	wp_dequeue_style( 'hxp_custom_style' );
	wp_enqueue_style( 'hxp_custom_style' );
	wp_dequeue_script( 'hxp_import_script' );
	wp_enqueue_script( 'hxp_export_script' );
	?>

	<div class="hxp">
		<div id="headertext">
			<div id="innerHeaderContainer">
				<h1> Welcome to the X-Porter</h1>
				<p>This plugin allows you to easily export and import header and footer created with X Pro</p></div>
		</div>
		<div id="generateList">
			<h3 id="firstStepHeading"> Select Header & Footer</h3>
			<div id="progressIndicator"></div>
			<button id="loadButton">Load Elements</button>
			<div id="listElements">
				<div class="tableHead"><p>Selection</p>
					<p>ID</p>
					<p>Name</p>
					<p>Type</p></div>
				<ul id="unorderedList"></ul>
			</div>
		</div>
		<div id="createDownloadArea">
			<div id="neededColorsArea">
				<h3>Associated Colors:</h3>
				<ul id="neededColorsList">
				</ul>
			</div>
			<div id="neededFontsArea">
				<h3> Associated Fonts:</h3>
				<ul id="neededFontsList">
				</ul>
			</div>
			<div id="neededImagesArea">
				<h3> Associated Images:</h3>
				<ul id="needetImagesList">
				</ul>
			</div>

			<div id="downloadButtonArea">
				<button id="exportButton" disabled>Export selected Elements</button>
			</div>
		</div>
		<div id="hxpOverlay"><h1 id="oHeader">Exporting Elements...</h1>
			<div id="oProgressContainer">
				<div id="oLoader"></div>
				<progress id="oProgressBar" value="0" max="100"></progress>
			</div>
			<p id="oText">Some Text</p><a id="oButton" download
			                              href="<?php echo content_url( 'uploads/hxp_exports/export.zip' ) ?>" disabled>Download
				ZIP</a>
		</div>
	</div>
	<?php
}

function hxp_main_import_screen() {
	wp_dequeue_style( 'hxp_custom_style' );
	wp_enqueue_style( 'hxp_custom_style' );
	wp_dequeue_script( 'hxp_export_script' );
	wp_enqueue_script( 'hxp_import_script' );

	if ( is_admin() ) {

		?>
		<div class="hxp hxp-import">
			<div id="uploadHeadertext">
				<div id="innerUploadHeaderContainer">
					<h1> Welcome to the X-Porter</h1>
					<p>This is the Importer. Here you can upload your created Zip-Archives.</p></div>
			</div>

			<form id="uploadForm" method="post" enctype="multipart/form-data">
				<label id="infoUploadHeader">Drag & Drop your Zip File in the highlighted Area or use the Button for File selection </label>
				<input type="file" name="hxp_zip_file" id="zip_file"/>
				<label id="warningHeading">Important!</label>
				<label id="warningUploadLabel">As soon as you click on the "Import Data" button, the Zip-File you selected will be evaluated and written to the database. Only upload Files created with this plugin. Also you shouldn't
					upload files from strangers. It's recommended to create a backup of the database before importing. Also you shouldn't import on an life-site directly, use an staging-site or an local environment. </label>
				<input id="submitButton" type="submit" name="submit" value="Import Data" disabled>
			</form>
		</div>
		<?php
	}
}

function hxp_XPorter() {
	add_menu_page( 'X-Porter', 'X-Porter', '10', __FILE__, 'hxp_main_export_screen' );
	add_submenu_page( __FILE__, 'Importer', 'Importer', '10', 'hxp_second_level_slug', 'hxp_main_import_screen' );
}

function hxp_add_stylesheet() {
	wp_register_style( 'hxp_custom_style', plugins_url( 'assets/css/hxp-main-stylesheet.css', __FILE__ ), array(), '20170829', 'all' );
}

function hxp_add_javascript() {
	wp_register_script( 'hxp_export_script', plugins_url( 'assets/js/hxp-export-functions.js', __FILE__ ), array( 'jquery' ), '20170829', 'true' );
	wp_localize_script( 'hxp_export_script', 'hxp_ajax_object', array(
		'ajax_url' => admin_url( 'admin-ajax.php' ),
	) );

	wp_register_script( 'hxp_import_script', plugins_url( 'assets/js/hxp-import-functions.js', __FILE__ ), array( 'jquery' ), '20170829', 'true' );
	wp_localize_script( 'hxp_import_script', 'hxp_ajax_object', array(
		'ajax_url' => admin_url( 'admin-ajax.php' ),
	) );
}

function hxp_plugin_deactivation() {
	wp_dequeue_style( 'hxp_custom_style' );
	wp_deregister_style( 'hxp_custom_style' );
	wp_dequeue_script( 'hxp_export_script' );
	wp_dequeue_script( 'hxp_import_script' );
	wp_deregister_script( 'hxp_export_script' );
	$hxp_upload_dir = wp_upload_dir();
	hxp_rrmdir( $hxp_upload_dir['basedir'] . '/hxp_exports' );
	hxp_rrmdir( $hxp_upload_dir['basedir'] . '/hxp_imports' );
}


?>

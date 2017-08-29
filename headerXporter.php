<?php
/*
Plugin Name: X-Porter
Plugin URI: https://dippel.rocks
Description: A Plugin to export and import X Pro (Themeco) Theme Headers and Footers.
Version: 1.0.0
Author: Philipp Dippel
Author URI: https://dippel.rocks
Licencse: MIT
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
				<h1> Willkommen beim X-Porter</h1>
				<p>Mit diesem Plugin lassen sich mit X Pro erstellte Header und Footer spielend einfach exportieren und
					importieren.</p></div>
		</div>
		<div id="generateList">
			<h3 id="firstStepHeading"> Header & Footer auswählen</h3>
			<div id="progressIndicator"></div>
			<button id="loadButton">Elemente laden</button>
			<div id="listElements">
				<div class="tableHead"><p>Auswahl</p>
					<p>ID</p>
					<p>Name</p>
					<p>Typ</p></div>
				<ul id="unorderedList"></ul>
			</div>
		</div>
		<div id="createDownloadArea">
			<div id="neededColorsArea">
				<h3>Dazugehörige Farben:</h3>
				<ul id="neededColorsList">
				</ul>
			</div>
			<div id="neededFontsArea">
				<h3> Dazugehörige Schriften:</h3>
				<ul id="neededFontsList">
				</ul>
			</div>
			<div id="neededImagesArea">
				<h3> Dazugehörige Bilder:</h3>
				<ul id="needetImagesList">
				</ul>
			</div>

			<div id="downloadButtonArea">
				<button id="exportButton" disabled>Ausgewählte Elemente exportieren</button>
			</div>
		</div>
		<div id="hxpOverlay"><h1 id="oHeader">Exportiere Elemente</h1>
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
					<h1> Willkommen beim X-Porter</h1>
					<p>Hier können Sie erstelle Archive Importieren</p></div>
			</div>

			<form id="uploadForm" method="post" enctype="multipart/form-data" action="<?php echo menu_page_url('hxp_second_level_slug', 0) . '&action=hxp_do_something' ?>" >
				<label id="uploadAreaLabel">Ziehen Sie einfach per Drag & Drop das Zip-Archiv in diesen Bereich.
					zum Auswählen. <input id="zipFileInput" type="file" name="zip_file" id="zip_file"/> </label>
				<label id="warningHeading">Important Information!</label>
				<label id="warningUploadLabel">Sobald du auf den Button "Daten Importieren" klickst, wird das Archiv
					das du ausgewählt hast ausgewertet und unwiederuflich in die Datenbank geschrieben. Lade nur mit
					diesem Plugin erstellte Archive hoch, außerdem sollteste du keine Fremden Archive hochladen! Es
					ist empfehlenswert vor dem Importieren ein Backup der Datenbank anzulegen.</label>
				<input id="submitButton" type="submit" name="submit" value="Daten Importieren">
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

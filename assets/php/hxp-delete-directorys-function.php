<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: X-Porter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */



defined( 'ABSPATH' ) || exit();

function hxp_rrmdir($hxp_dir) {
	if (is_dir($hxp_dir)) {
		$hxp_objects = scandir($hxp_dir);
		foreach ($hxp_objects as $hxp_object) {
			if ($hxp_object != "." && $hxp_object != "..") {
				if (filetype($hxp_dir."/".$hxp_object) == "dir") hxp_rrmdir($hxp_dir."/".$hxp_object); else unlink($hxp_dir."/".$hxp_object);
			}
		}
		reset($hxp_objects);
		rmdir($hxp_dir);
	}
}
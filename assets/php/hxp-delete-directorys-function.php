<?php
/**
 *  * Created by PhpStorm.
 * User: Philipp Dippel Inf | DMS - M
 * For Project: headerXporter
 * Date: 28.08.17
 * Copyright: Philipp Dippel
 */



defined( 'ABSPATH' ) || exit();

function hxp_rrmdir($hpx_dir) {
	if (is_dir($hpx_dir)) {
		$hxp_objects = scandir($hpx_dir);
		foreach ($hxp_objects as $hxp_object) {
			if ($hxp_object != "." && $hxp_object != "..") {
				if (filetype($hpx_dir."/".$hxp_object) == "dir") hxp_rrmdir($hpx_dir."/".$hxp_object); else unlink($hpx_dir."/".$hxp_object);
			}
		}
		reset($hxp_objects);
		rmdir($hpx_dir);
	}
}
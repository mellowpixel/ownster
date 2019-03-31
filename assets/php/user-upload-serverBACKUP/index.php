<?php
include_once("../../../inc/SessionClass.php");
include("../../../inc/memory_usage.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../../../error_log/php-error$date.log");

$session = new Session();
recordMemoryUsage("user_upload_server/index -> Start");
if(isset($_SESSION["unique_user_id"])){
	$unique_user_ID = $session->getSessionValue("unique_user_id");
} else {
	$unique_user_ID = "unknown";
}
/*$unique_user_ID = $session->uniqueUserSessionID();
$session->setSessionValue("unique_user_id", $unique_user_ID);
$session->setSessionValue("user_folder", "user_upload/$unique_user_ID/");*/
// $json = json_decode( stripcslashes($_POST["sides"]));

/*
 * jQuery File Upload Plugin PHP Example 5.14
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
$dir_appendix = "";
// If file represents an image of the whole complete product, make a thumbnail for it.
if(isset($_FILES["files"]) && isset($_POST["complete_product_img_names"])){
	$complete_product_img_names = explode(",", $_POST["complete_product_img_names"]);

	if(in_array($_FILES["files"]["name"][0], $complete_product_img_names)){
		$dir_appendix = "thumbnails/";
	}
}

error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
$extendedopt = array('upload_url' => "/user_upload/$unique_user_ID/$dir_appendix", 
					 'upload_dir' => "../../../user_upload/$unique_user_ID/$dir_appendix",
					 'image_versions' => array()/*array('thumbnail' => array('max_width' => 400,'max_height' => 400))*/);
$upload_handler = new UploadHandler( $extendedopt );
recordMemoryUsage("user_upload_server/index -> END");

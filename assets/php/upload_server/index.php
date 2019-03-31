<?php
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
ini_set("log_errors", 1);
$date = @date("d-m-y");
ini_set("error_log", "../../../error_log/php-error$date.log");

error_reporting(E_ALL | E_STRICT);
require('UploadHandler.php');
$extendedopt = array('upload_url' => "/products/files/",
					 'upload_dir' => "../../../products/files/",
					 'image_versions' => array('thumbnail' => array('max_width' => 200,'max_height' => 200)));
$upload_handler = new UploadHandler( $extendedopt );

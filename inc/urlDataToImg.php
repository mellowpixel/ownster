<?php
include_once("SessionClass.php");
$session = new Session();

include_once("upload.php");

if(isset($_POST['data'])){
	$data		= $_POST['data'];
	$uri		=  substr($data,strpos($data,",")+1);
	$user_dir	= "../".$session->getSessionValue("user_folder");
	
	// put the data to a file
	if(!is_dir($user_dir."TO_PRINT/")){
		if(mkdir($user_dir."TO_PRINT/", 0777, true)){
			file_put_contents($user_dir.'TO_PRINT/main_img.png', base64_decode($uri));
		}
	} else {
		file_put_contents($user_dir.'TO_PRINT/main_img.png', base64_decode($uri));
	}
	
	
	// put the data to a thumbnail image file
	if(!is_dir($user_dir."thumbnail/")){
		if(mkdir($user_dir."thumbnail/", 0777, true)){
			$thumb_path = saveThumbnail($user_dir."TO_PRINT/", $user_dir.'thumbnail/', "main_img.png", "png", 580, "thumb.png");
		}
	} else {
		$thumb_path = saveThumbnail($user_dir."TO_PRINT/", $user_dir.'thumbnail/', "main_img.png", "png", 580, "thumb.png");
	}
}

?>
<?php
include_once("upload.php");
include_once("SessionClass.php");

$session = new Session();

if(isset($_POST['setSessionValues'])){
	$unique_user_ID = $session->uniqueUserSessionID();
	
	$session->setSessionValue("unique_user_id", $unique_user_ID);
	$session->setSessionValue("user_folder", "user_upload/".$unique_user_ID."/");
	echo "ok";
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if(isset($_FILES['user_image_whole'])){
	$message = upload_file($_FILES['user_image_whole'], "../".$session->getSessionValue("user_folder")."temp", true, "jpg, jpeg, png, gif");
	echo "whole_".$message;
	unset($session);
}

if(isset($_FILES['user_image_left'])){
	$message = upload_file($_FILES['user_image_left'], "../".$session->getSessionValue("user_folder")."temp", true, "jpg, jpeg, png, gif");
	echo "left_".$message;
	unset($session);
}

if(isset($_FILES['user_image_right'])){
	$message = upload_file($_FILES['user_image_right'], "../".$session->getSessionValue("user_folder")."temp", true, "jpg, jpeg, png, gif");
	echo "right_".$message;
	unset($session);
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------




?>
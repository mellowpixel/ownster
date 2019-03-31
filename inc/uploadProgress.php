<?php include_once("SessionClass.php");
$session = new Session();
//-------------------------------------------------------------------------------------------

if(isset($_POST['get_upload_status'])){
	$upload_status = $session->getSessionValue("total_bytes_upload");
	$bytes_uploaded = file_get_contents($session->getSessionValue("file_path_in_progress"));
	echo "value:|".$upload_status." ".$bytes_uploaded;
}

?>
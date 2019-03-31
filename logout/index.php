<?php
	$root = realpath($_SERVER["DOCUMENT_ROOT"]);
	include_once("$root/inc/SessionClass.php");
	if(!isset($session)){
	  $session = new Session();
	}

	$session->deleteSessionKey("user_login");
	$session->deleteSessionKey("user_password");
	$session->deleteSessionKey("user_name");
	$session->deleteSessionKey("user_last_name");
	$session->deleteSessionKey("user_address");	

	header("Location: /");
	end();
?>
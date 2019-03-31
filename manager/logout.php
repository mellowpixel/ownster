<?php
include_once("../inc/SessionClass.php");
include_once("../inc/DataBaseClass.php");

$session	= new Session();
$db			= new DataBase();
$login		= $session->getSessionValue("user_login");
$password	= $session->getSessionValue("user_password");

$login_page = "../cmslogin/";

if($login && $password){
	$result = mysql_query("SELECT * FROM settings WHERE email = '$login'");
	if($result){
		$user_data = mysql_fetch_assoc($result);
		 
		if($user_data && $login === $user_data['email'] && $password === $user_data['password']){
			
			// Enter Edit Mode and Carry on with this page
			// $session->setSessionValue("editmode", true);
			unset($_SESSION["user_login"]);
			unset($_SESSION["user_password"]);

			redirectToPage($login_page);

		} else {
			redirectToPage($login_page);
		}
	} else {
		redirectToPage($login_page);
	}
} else {
	redirectToPage($login_page);
}

function redirectToPage($page){
	echo"<script type='text/javascript'>window.location = '$page'</script>";
}
?>
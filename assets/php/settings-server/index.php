<?php
include_once("../../../inc/DataBaseClass.php");
include_once("../../../inc/SessionClass.php");
include_once("../../../inc/UserClass.php");
$session = new Session();
$db 	= new DataBase();

if (isset($_POST)) {
	switch (key($_POST)) {
		case 'change_security_settings': changeSecuritySettings( $_POST, $session, $db );
			break;
	}
}

/*------------------------------------------------------------------------------------------*/

function changeSecuritySettings( &$post, &$session, &$db ){
	$user 			= new User("settings");
	$new_login		= $post["login"];
	$current_pass	= $post["old_pass"];
	$new_pass		= $post["new_pass"];
	$error			= false;
	$error_msg		= "";
	
	$current_login	= $session->getSessionValue("user_login");
	$user_data		= $user->login($current_login, $current_pass);
	
	// echo $current_login ." | ". $current_pass ." | ". $new_login ." | ". $new_pass;
	
	if($user_data && is_array($user_data)){
		if(strlen($new_login) >= 3){
			if(!mysql_query("UPDATE settings SET email = '$new_login' WHERE email = '$current_login'")){
				$error = true;
				$error_msg .= "Can not udate login.<br/>";
			} else {
				$current_login = $new_login;
				$session->setSessionValue("user_login", $current_login);
			}
		}
		
		if(strlen($new_pass) >= 6){
			$encripted_pass = $user->encriptPassword($new_pass);
			if(!mysql_query("UPDATE settings SET password = '$encripted_pass' WHERE email = '$current_login'")){
				$error = true;
				$error_msg .= "Can not udate password.<br/>";
			} else {
				$session->setSessionValue("user_password", $encripted_pass);
			}
		}
		
	} else {
		echo "3";
		$error 		= true;
		$error_msg	.= "Entered Login or Password is wrong.";
	}
	echo json_encode(array("error"=>$error, "error_msg"=>$error_msg));
}

?>
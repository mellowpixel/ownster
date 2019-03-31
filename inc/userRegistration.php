<?php
include_once("RegExpTest.php");
include_once("UserClass.php");
include_once("SessionClass.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

$session = new Session();
$user	 = new User("users");

if(isset($_POST['new_user'])){
	if($_POST['new_user'] === "register"){
		$reg_exp = new RegExpTest();
		$error = false;
		
		if($reg_exp->name_test($_POST['name'])){
			$name = $_POST['name'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->name_test($_POST['lname'])){
			$lastname = $_POST['lname'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->email_test($_POST['email'])){
			$email = $_POST['email'];
			if(mysql_num_rows(mysql_query("SELECT email FROM users WHERE email = '$email'"))){
				$error = $error ||true;
			}
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->password_test($_POST['password'])){
			$password = $_POST['password'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->address_test($_POST['address1'])){
			$address1 = $_POST['address1'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->address_test($_POST['address2']) || strlen($address2) == 0){
			$address2 = $_POST['address2'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->address_test($_POST['city'])){
			$city = $_POST['city'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->address_test($_POST['postcode'])){
			$postcode = $_POST['postcode'];
		} else {
			$error = $error ||true;
		}
		
		if($reg_exp->address_test($_POST['country'])){
			$country = $_POST['country'];
		} else {
			$error = $error ||true;
		}
		
		if(!$error){
			$password = $user->encriptPassword($password);
			if($user->register_new_account("name, lastname, email, password, address1, address2, city, postcode, country",
					"'$name', '$lastname', '$email', '$password', '$address1', '$address2', '$city', '$postcode', '$country'"))
			{
				echo "default:|New user successfully added.";
			} else {
				echo "default:|".$user->error_message;	
			}
		} else {
			echo "default:|ERROR!";
		}
		
	}
}

//--------------------------------------------------	User Login	------------------------------------------

if(isset($_POST['user'])){
	if($_POST['user'] === "login"){
		
		$reg_exp = new RegExpTest();
		
		if($reg_exp->email_test($_POST['email'])){
			
			$user_email		= $_POST['email'];
			$user_password	= $_POST['password'];
			$user_data 		= $user->login($user_email, $user_password);
			
			if($user_data){
					
				$session->setSessionValue("user_login", $user_data['email']);
				$session->setSessionValue("user_password", $user_data['password']);
				$session->setSessionValue("user_name", $user_data['name']);
				$session->setSessionValue("user_last_name", $user_data['lastname']);
				$session->setSessionValue("user_address1_name", $user_data['address1']);
				$session->setSessionValue("user_address2_name", $user_data['address2']);
				$session->setSessionValue("user_city_name", $user_data['city']);
				$session->setSessionValue("user_postcode_name", $user_data['postcode']);	
					
				echo "default:|Hello ".$user_data['name']." ".$user_data['lastname']."!";
			} else {
				echo "alert:|".$user->error_message;		
			}
		
		} else {
			echo "alert:|Please enter valid e-mail address.<br/>";
		}
		
	}
}

//--------------------------------------------------	User Logout	------------------------------------------
?>
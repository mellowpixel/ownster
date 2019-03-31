<?php
include_once("DataBaseClass.php");
include_once("RegExpTest.php");
include_once("UserClass.php");
include_once("SessionClass.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

$session = new Session();
$db		 = new DataBase();
$user	 = new User("users");

switch(key($_POST)){
	case "new_user": signupNewUser($_POST["new_user"], $session, $user); break;
	case "userLogin": userLogin($_POST["userLogin"], $session, $user); break;
	case "get_users_profile": getUsersDetails($session, $user); break;
}

function signupNewUser($data, $session, $user){
	$reg_exp = new RegExpTest();
	$values = array();
	$fields = array();
	$address = array();

	foreach ($data as $data_name => $value) {
		switch ($data_name) {
			case 'name':
				if($reg_exp->name_test($value)){
					array_push($values, "'".$value."'");
					array_push($fields, "name");
				}
				break;
			case 'lastname':
				if($reg_exp->name_test($value)){
					array_push($values, "'".$value."'");
					array_push($fields, "lastname");
				}
				break;
			case 'email':
				if($reg_exp->email_test($value)){
					array_push($values, "'".$value."'");
					array_push($fields, "email");
					$email = $value;
				}
				break;
			case 'password':
				if($reg_exp->password_test($value)){
					$password = $user->encriptPassword($value);
					array_push($values, "'".$password."'");
					array_push($fields, "password");
				}
				break;
			case 'address':
				if($reg_exp->address_test($value)){
					$address["address"] = $value;
				}
				break;
			case 'address2':
				if($reg_exp->address_test($value)){
					$address["address2"] = $value;
				}
				break;
			case 'city':
				if($reg_exp->address_test($value)){
					$address["city"] = $value;
				}
				break;
			case 'postcode':
				if($reg_exp->address_test($value)){
					$address["postcode"] = $value;
				}
				break;
			case 'country':
				if($reg_exp->address_test($value)){
					$address["country"] = $value;
				}
				break;
		}
	}

	$address = json_encode($address);
	array_push($fields, "addresses");
	array_push($values, "'".$address."'");

	$db_fields = implode(",", $fields);
	$db_values = implode(",", $values);

	
	if($user->register_new_account($db_fields, $db_values))
	{
		$user_details = logUserIn($email, $password, true, $session);
		if($user_details && is_array($user_details)){
			echo json_encode(array("error"=>false, "name" => $user_details["name"], "lastname" => $user_details["lastname"], "email" => $user_details["email"], "address" => $address));	
		} else {
			echo json_encode(array("error"=> true, "error_msg"=> $user_details->error_message));
		}
		
	} else {
		echo json_encode(array("error"=> true, "error_msg"=> $user->error_message ));
	}

	/*$reg_exp = new RegExpTest();
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
			$user->error_message	= "Email $email already exists in our database. if You forgot you password click on \"Forgot your password?\"";
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
		$address = $address1."{§}".$address2."{§}".$city."{§}".$postcode."{§}".$country."{§}[±]";
		$password = $user->encriptPassword($password);
		if($user->register_new_account("name, lastname, email, password, addresses",
				"'$name', '$lastname', '$email', '$password', '$address'"))
		{
			$user_details = logUserIn($email, $password, true, $session);
			
			if($user_details && is_array($user_details)){
				
				echo "array:|".$name."~".$lastname."~".$email."~".$address;	
			} else {
				echo "value:|".$user_details->error_message;
			}
			
		} else {
			echo "securearray:|error[$%£§]".$user->error_message;	
		}
	} else {
		echo "securearray:|error[$%£§]".$user->error_message;
	}*/
}

/*if(isset($_POST['new_user'])){
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
				$user->error_message	= "Email $email already exists in our database. if You forgot you password click on \"Forgot your password?\"";
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
			$address = $address1."{§}".$address2."{§}".$city."{§}".$postcode."{§}".$country."{§}[±]";
			$password = $user->encriptPassword($password);
			if($user->register_new_account("name, lastname, email, password, addresses",
					"'$name', '$lastname', '$email', '$password', '$address'"))
			{
				$user_details = logUserIn($email, $password, true, $session);
				
				if($user_details && is_array($user_details)){
					
					echo "array:|".$name."~".$lastname."~".$email."~".$address;	
				} else {
					echo "value:|".$user_details->error_message;
				}
				
			} else {
				echo "securearray:|error[$%£§]".$user->error_message;	
			}
		} else {
			echo "securearray:|error[$%£§]".$user->error_message;
		}
		
	}
}*/

//--------------------------------------------------	User Login	------------------------------------------

function userLogin($user_data, $session, $user) {
	$user_email	= $user_data["login"];
	if(preg_match("/^[a-zA-Z0-9._-]/", $user_email) > 0){
		// print_r($user_data["login"]);
		$user_password	= $user_data["password"];
		$user_details	= logUserIn($user_email, $user_password, false, $session);
		
		if($user_details && is_array($user_details)){
			echo json_encode(array("error"=>false, "name"=> $user_details['name'], "lastname"=> $user_details['lastname']));	
		} else {
			echo json_encode(array("error"=>true, "error_msg"=>$user_details->error_message));
		}

	} else {
		echo json_encode(array("error"=>true, "error_msg"=>"Please enter valid e-mail address."));
	}
}

//----------------------------------------------	FORGOTTEN PASSWORD	--------------------------------------
if(isset($_POST['forgotten_pass'])){
	
	$reg_exp = new RegExpTest();
	$error = false;
	
	$email = $_POST['email'];
	
	if($reg_exp->email_test($email)){
		
		$result = mysql_query("SELECT name FROM users WHERE email = '$email'");
		if(mysql_num_rows($result)){
			$data = mysql_fetch_assoc($result);
			
			$new_password	= strtolower($user->generatePassword(8));
			$encripted_pass	= $user->encriptPassword($new_password);
			$user->updateRecords(array("password"=> "'".$encripted_pass."'"), $email);
			
			
			mail($email, "Your New Password", "Dear ".$data['name']."\nYour new Ownster password is below:\n".$new_password."\n\nWhen you have successfully logged in, you may want to change your password to something more memorable.\n\nTo do this, go to Ownster My Account section and click on My Details, then click on the Change Password button.\n\nDon't forget that passwords are case sensitive so please remember to check the Caps Lock key.\n\nIf you have any questions please feel free to contact our Support Service at support@ownster.co.uk.\n\nBest wishes! Ownster.");
			
			
			echo "securearray:|success[$%£§]Password Changed<br/>A new password has been sent to ".$email."<br/>Please check your email for a new password. Once you have logged in, we recommend to change your password to something easier to remember. You can do it via My Account section of the site.";
		} else {
			echo "securearray:|error[$%£§]Email $email doesn't exist in our database. Please register.";	
		}
	} else {
		echo "securearray:|error[$%£§]Invalid e-mail format!";
	}
}
//-----------------------------------------------	GET ADDRESSES	------------------------------------------

if(isset($_POST['get_list_of_addresses'])){
	$login		= $session->getSessionValue("user_login");
	$passw		= $session->getSessionValue("user_password");
	$user_data	= $user->login($login, $passw, true);	// CHECK IF SESSION IS GENUE

	if($user_data){
		$addresses = explode("[±]", $user_data["addresses"]);
		
		$addresses[0] = $user_data["name"]."{§}".$user_data["lastname"]."{§}".$addresses[0];
		echo "securearray:|".implode("[$%£§]", $addresses);	
	}
}

//-----------------------------------------------	GET ADDRESSES	------------------------------------------

function getUsersDetails($session, $user){
	$login		= $session->getSessionValue("user_login");
	$passw		= $session->getSessionValue("user_password");
	$user_data	= $user->login($login, $passw, true);	// CHECK IF SESSION IS GENUE
	$output = array();

	// file_put_contents("get_user_details.txt", "$login, $passw");

	if($user_data){
		$output["name"] = $user_data["name"];
		$output["lastname"] = $user_data["lastname"];
		$output["email"] = $user_data["email"];
		$output["addresses"] = array();

		if(isJson($user_data["addresses"])){
			array_push($output["addresses"], json_decode($user_data["addresses"]));	
		} else {
			$addresses = explode("[±]", $user_data["addresses"]);
			foreach ($addresses as $addres_string) {
				$addr_chunks = explode("{§}", $addres_string);
				array_push($output["addresses"], array("address"=> $addr_chunks[0], "city"=> $addr_chunks[1], "postcode"=> $addr_chunks[2], "country"=> $addr_chunks[3]));
			}
		}
		echo json_encode(array("error"=>false, "data"=>$output));
	} else {
		echo json_encode(array("error"=>true, "error_msg"=>"Login Data not found."));
	}

}

function isJson($string) {
	json_decode($string);
	return (json_last_error() == JSON_ERROR_NONE);
}
//------------------------------------------------------------------------------------------------------------

if(isset($_POST["change_user_details"]) || isset($_POST['add_new_address'])){

	if(isset($_POST['change_user_details'])){			// IF SET -> UPDATE ADDRESS LIST ELSE APPEND NEW ADDRESS
		$address_index	= $_POST["change_user_details"];
	}
	
	$login		= $session->getSessionValue("user_login");
	$passw		= $session->getSessionValue("user_password");
	$user_data	= $user->login($login, $passw, true);	// CHECK IF SESSION IS GENUE
		
	if($user_data){
		$reg_exp = new RegExpTest();
		$error = false;
		$fields = array();
		
		if(!isset($_POST['update_saved_address']) && !isset($_POST['add_new_address'])){
			
			if($reg_exp->name_test($_POST['name'])){
				$name = $_POST['name'];
				$fields["name"]="'".$name."'";
			} else {
				$error = $error ||true;
			}
			
			if($reg_exp->name_test($_POST['lname'])){
				$lastname = $_POST['lname'];
				$fields["lastname"]="'".$lastname."'";
			} else {
				$error = $error ||true;
			}
			
		} else {
			
			if($reg_exp->name_test($_POST['name'])){
				$name = $_POST['name'];
				$fields["name"] = $name;
			} else {
				$error = $error ||true;
			}
			
			if($reg_exp->name_test($_POST['lname'])){
				$lastname = $_POST['lname'];
				$fields["lastname"] = $lastname;
			} else {
				$error = $error ||true;
			}
				
		}
		
		if(isset($_POST['email'])){
			if($reg_exp->email_test($_POST['email'])){
				$email = $_POST['email'];
				//email added last. after addresses were added
				
				if(mysql_num_rows(mysql_query("SELECT email FROM users WHERE email = '$email'")) && $user_data['email'] !== $email){
					$error = $error ||true;
				}
			} else {
				$error = $error ||true;
			}
		} else {
			$fields["email"]="'".$user_data['email']."'";	
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
			
			if(isset($_POST['update_saved_address']) || isset($_POST['add_new_address'])){
				$address = $fields["name"]."{§}".$fields["lastname"]."{§}".$address1."{§}".$address2."{§}".$city."{§}".$postcode."{§}".$country."{§}";	
				unset($fields["name"]);
				unset($fields["lastname"]);
			} else {
				$address = $address1."{§}".$address2."{§}".$city."{§}".$postcode."{§}".$country."{§}";	
				$fields["email"]= "'".$email."'";
			}
			
			$addresses	= explode("[±]", $user_data["addresses"]);
			$total		= count($addresses);
			if($addresses[$total-1] == ""){
				array_splice($addresses, $total-1); 	
			}
			
			if(isset($_POST['change_user_details'])){
				array_splice($addresses, $address_index+1, 1, array($address));
			} elseif(isset($_POST['add_new_address'])) {
				
				array_push($addresses, $address);
			}
			
			$new_address_string	= implode("[±]", $addresses);
				
			$fields["addresses"]= "'".$new_address_string."'";
				
			if($user->updateRecords($fields, $login)){
				
				if(isset($_POST['change_user_details'])){
					$session->setSessionValue("user_login", $email);
					
					$login		= $email;
					$user_data	= $user->login($login, $passw, true);
				}
				
				echo "securearray:|".$user_data["name"]."[$%£§]".$user_data["lastname"]."[$%£§]".$user_data["email"]."[$%£§]".implode("[$%£§]", $addresses);
					
			} else {
				echo "securearray:|Error 3";
			}
		
		} else "securearray:|Error 1";	
	}
}


//------------------------------------------------------------------------------------------------------------

if(isset($_POST["delete_saved_address"])){
	
	$address_index	= $_POST["delete_saved_address"];
	$login		= $session->getSessionValue("user_login");
	$passw		= $session->getSessionValue("user_password");
	$user_data	= $user->login($login, $passw, true);	// CHECK IF SESSION IS GENUE
		
	if($user_data){
		
		$addresses	= explode("[±]", $user_data["addresses"]);
		
		array_splice($addresses, $address_index+1, 1);
		$new_address_string	= implode("[±]", $addresses);
			
		if($user->updateRecords(array("addresses"=> "'".$new_address_string."'"), $login)){
				
			echo "value:|success";
				
		} else {
			echo "value:|fail";
		}
		
	}
}

//------------------------------------------------------------------------------------------------------------

if(isset($_POST['change_user_password'])){

	$old_passw	= $_POST['old_password'];
	$new_passw	= $_POST['password'];
	
	$login		= $session->getSessionValue("user_login");	
	$passw		= $session->getSessionValue("user_password");
	$user_data	= $user->login($login, $passw, true);	// CHECK IF SESSION IS GENUE
		
	if($user_data){
		$old_passw = $user->encriptPassword($old_passw);
		
		if($old_passw === $passw){
			$new_passw = $user->encriptPassword($new_passw);	
			if($user->updateRecords(array("password"=> "'".$new_passw."'"), $login)){
				
				$session->setSessionValue("user_password", $new_passw);
				
				$addresses	= explode("[±]", $user_data["addresses"]);
				
				echo "securearray:|".$user_data["name"]."[$%£§]".$user_data["lastname"]."[$%£§]".$user_data["email"]."[$%£§]".implode("[$%£§]", $addresses);;
			}
			
		} else {
			echo "value:|fail";
		}
		
	}
}

//------------------------------------------------------------------------------------------------------------

if(isset($_POST["change_login_details"])){
	$output		= "alert:|";
	$login		= $session->getSessionValue("user_login");	
	$passw		= $session->getSessionValue("user_password");
	$user_data	= $user->login($login, $passw, true);	// CHECK IF SESSION IS GENUE
		
	if($user_data){	
		
		if(isset($_POST["old_login"])){
			$old_log = $_POST["old_login"];
			$new_log = $_POST["new_login"];
			
			if(!mysql_num_rows(mysql_query("SELECT email FROM users WHERE email = '".$new_log."'"))){
				if(mysql_query("UPDATE users SET email = '".$new_log."' WHERE email = '".$old_log."'")){
					$output .="Login Changed!\n";
					$session->setSessionValue("user_login", $new_log);
					$login	= $new_log;
				} else $output .= mysql_error()."\n";
			} else $output .= "Login already Exists\n";
		}
		
		if(isset($_POST["old_pass"])){
			$old_pass = $_POST["old_pass"];
			$new_pass = $_POST["new_pass"];
			
			$old_passw = $user->encriptPassword($old_pass);
		
			if($old_passw === $passw){
				$new_passw = $user->encriptPassword($new_pass);	
				if($user->updateRecords(array("password"=> "'".$new_passw."'"), $login)){
					$session->setSessionValue("user_password", $new_passw);
					
					$output .="Password Changed\n";
				} else $output .= mysql_error()."\n";
			} else $output .= "Wrong Old Password\n";
		}
		echo $output;
	}
}

//------------------------------------------------------------------------------------------------------------

function logUserIn($user_email, $user_password, $encripted, $session){
	$user	 	= new User("users");
	$user_data	= $user->login($user_email, $user_password, $encripted);
		
	if($user_data){
		
		$session->setSessionValue("user_login", $user_data['email']);
		$session->setSessionValue("user_password", $user_data['password']);
		$session->setSessionValue("user_name", $user_data['name']);
		$session->setSessionValue("user_last_name", $user_data['lastname']);
		$session->setSessionValue("user_address", $user_data['addresses']);	
			
		return $user_data;
	} else {
		return $user;		
	}
}

//--------------------------------------------------	User Logout	------------------------------------------
if(isset($_POST['user_logout'])){
	$session->closeSession();
	echo "value:|loged_out";
}

//--------------------------------------------------	Check Email	------------------------------------------

if(isset($_POST['check_email'])){
	$reg_exp = new RegExpTest();
	$email = $_POST['check_email'];
	
	$user_email = $session->getSessionValue("user_login"); // if user logged in
	if($user_email){
		if($reg_exp->email_test($email)){
			if(!mysql_num_rows(mysql_query("SELECT email FROM users WHERE email = '$email'")) || $email == $user_email){
				
				echo "value:|ok";	
			}
		}
	} else {
		if($reg_exp->email_test($email)){
			if(!mysql_num_rows(mysql_query("SELECT email FROM users WHERE email = '$email'"))){
				echo "value:|ok";	
			}
		}
	}
}
//--------------------------------------------------	Get User's Details	----------------------------------

if(isset($_POST['get_user_details'])){
	$email = $session->getSessionValue("user_login");
	$password = $session->getSessionValue("user_password");
	
	$user_data = $user->login($email, $password, true);	// CHECK IF SESSION IS GENUE
	if($user_data){
		$orders_string = $user_data['orderhistory'];
		if($orders_string !== NULL){
			
			echo "value:|".$orders_string;
		} else {
			echo "value:|empty";
		}
		
	} else {
		echo "alert:|Please Login.";
	}
	
}

if (isset($_POST['getOrdersHistory'])) {
	$email = $session->getSessionValue("user_login");
	$password = $session->getSessionValue("user_password");
	
	$user_data = $user->login($email, $password, true);	// CHECK IF SESSION IS GENUE
	if($user_data){
		$orders_string = $user_data['orderhistory'];
		if($orders_string !== NULL){
			
			echo json_encode(array("error"=> false, "history"=>json_decode($orders_string)));

		} else {
			echo json_encode(array("error"=> false, "history"=>false));
		}
		
	} else {
		echo json_encode(array("error"=> true, "logged_in"=>false));
	}
}

?>








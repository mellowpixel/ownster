<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/assets/php/DataBaseClass.php");
include_once("$root/assets/php/SessionClass.php");

ini_set("log_errors", 1);
date_default_timezone_set("Europe/London");
$date = date("d-m-y");
ini_set("error_log", "$root/error_log/php-error$date.log");

$session	= new Session();
$db			= new DataBase();
$login		= $session->getSessionValue("user_login");
$password	= $session->getSessionValue("user_password");

$login_page = "$root/cmslogin/";

if($login && $password){
	$result = mysql_query("SELECT * FROM settings WHERE email = '$login'");
	if($result){
		$user_data = mysql_fetch_assoc($result);
		 
		if($user_data && $login === $user_data['email'] && $password === $user_data['password']){
			
			if( isset( $_POST ) ){
				switch( key( $_POST ) ){					
					case "newOccasion":	newOccasion($_POST["newOccasion"], $db); break;
					case "changeCategoryOrder":	changeCategoryOrder($_POST["changeCategoryOrder"], $_POST["new_val"], $db); break;
					case "changeCategoryName":	changeCategoryName($_POST["changeCategoryName"], $_POST["new_val"], $db); break;
					case "changeCategoryLink":	changeCategoryLink($_POST["changeCategoryLink"], $_POST["new_val"], $db); break;
					case "saveOccasionsData":	saveOccasionsData($_POST["saveOccasionsData"], $db); break;
				}
			}
		
		} else {
			redirectToPage($login_page);
		}
	} else {
		redirectToPage($login_page);
	}
} else {
	redirectToPage($login_page);
}

/*
------------------------------------------------------*/
function redirectToPage($page){
	echo"<script type='text/javascript'>window.location = '$page'</script>";
}

/*
------------------------------------------------------*/

function saveOccasionsData($occ_array, $db){
	$data_to_save = array();

	foreach ($occ_array as $datarow) {
		$datarow["cat_ids"];
		$datarow["product_id"];
		$datarow["template_id"];

		foreach ($datarow["cat_ids"] as $cat_id) {
			if(isset($data_to_save[$cat_id])){
				array_push($data_to_save[$cat_id], array("product_id"=>$datarow["product_id"], "template_id"=>$datarow["template_id"]));
			} else {
				$data_to_save[$cat_id] = array();
				array_push($data_to_save[$cat_id], array("product_id"=>$datarow["product_id"], "template_id"=>$datarow["template_id"]));
			}		
		}
	}

	foreach ($data_to_save as $cat_id => $data) {
		$json_encoded_data = json_encode($data);
		$res = mysql_query("UPDATE occasions SET templates_list = '$json_encoded_data' WHERE id = $cat_id");
		if($res){
			echo json_encode(array("error" => false));
		} else {
			echo json_encode(array("error" => true, "error_msg" => mysql_error()));
		}
	}
}

/*
------------------------------------------------------*/

function echoOccasionsJson($db){
	$occasions_output_data = array();

	$select_result = mysql_query("SELECT * FROM occasions ORDER BY place ASC");
	if($select_result){
		while($row = mysql_fetch_assoc($select_result)){
			array_push($occasions_output_data, $row);
		}
		echo json_encode(array("error" => false, "occasions_data" => $occasions_output_data));
	} else {
		echo json_encode(array("error" => true, "error_msg" => mysql_error()));
	}
}

/*
------------------------------------------------------*/

function newOccasion($new_occasion_name, $db){
	$occasion_name = stringCleanse($new_occasion_name);

	$result = mysql_query("INSERT INTO occasions SET name = '$occasion_name'");
	if($result){
		mysql_query("UPDATE occasions SET place = place + 1");
		echoOccasionsJson($db);
	} else {
		echo json_encode(array("error" => true, "error_msg" => mysql_error()));
	}
}

/*
-----------------------------------------------------*/

function changeCategoryOrder($id, $place, $db){
	$result = mysql_query("UPDATE occasions SET place = $place WHERE id = $id");
	if($result){
		echoOccasionsJson($db);
	}
}

/*
-----------------------------------------------------*/

function changeCategoryName($id, $name, $db){
	$name = stringCleanse($name);
	$result = mysql_query("UPDATE occasions SET name = '$name' WHERE id = $id");
	if($result){
		echoOccasionsJson($db);
	}
}

/*
-----------------------------------------------------*/

function changeCategoryLink($id, $link, $db){
	$link = stringCleanse($link);
	$result = mysql_query("UPDATE occasions SET link = '$link' WHERE id = $id");
	if($result){
		echoOccasionsJson($db);
	}
}
/*
-----------------------------------------------------*/

function stringCleanse($string){
	if(is_string($string)){
		$string = htmlentities($string, ENT_QUOTES, 'UTF-8', false);
		return str_replace(array('&lt;','&gt;','&amp;lt;','&amp;gt'),array('<','>','&lt;','&gt;'), $string);
	}
}

?>















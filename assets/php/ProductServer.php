<?php
include_once("DataBaseClass.php");
include_once("SessionClass.php");
include_once("UserClass.php");

ini_set("log_errors", 1);
date_default_timezone_set("Europe/London");
$date = date("d-m-y");
ini_set("error_log", "../../error_log/php-error$date.log");

/*
$session	= new Session();

$login		= $session->getSessionValue("user_login");
$password	= $session->getSessionValue("user_password");
$description_files_path = "../../portfolio_files/descriptions/";

if($login && $password){
	$result = mysql_query("SELECT * FROM settings WHERE login = '$login'");
	if($result){
		$user_data = mysql_fetch_assoc($result);
		 
		if($user_data && $login === $user_data['login'] && $password === $user_data['password']){*/
			$db	= new DataBase();
			if( isset( $_POST ) ){
				switch( key( $_POST ) ){
					
					case "saveProduct"		:	saveProduct($_POST, $db);						
												break;
					case "get_product_data"	:	getProductData($_POST, $db);
												break;
					case "getProductSpecs"	:	getProductSpecs($_POST, $db);
												break;
					case "editDescription"	:	editDescription($_POST, $db);
												break;
					case "editSpecs"		:	editSpecs($_POST, $db);
												break;
					case "changePlace"		:	changePlace($_POST, $db);
												break;
					case "deleteProduct"	:	deleteProduct($_POST, $db);
												break;
					case "deleteOptImg"		:	deleteFile($_POST, $db);
												break;
					case "changeName"		:	changeName($_POST, $db);
												break;
					case "changePrice"		:	changePrice($_POST, $db);
												break;
					case "toggleActive"		:	toggleActive($_POST, $db);
												break;
					case "logout"			: 	userLogout($session); break;
				}
			}

/*		} else {
			echo json_encode(array("error"=>true, "error_msg"=>"Access Denied!"));
		}
	} else {
		echo json_encode(array("error"=>true, "error_msg"=>"Access Denied!"));
	}
} else	{
	if( isset( $_POST ) ){
		if(	key( $_POST ) == "description"||
			key( $_POST ) == "createProject" )
		{
			echo json_encode(array("error"=>true, "error_msg"=>"Access Denied!"));
		}
	}
}*/

/*if( isset( $_POST ) ){
	switch( key( $_POST ) ){
		case "getProjects"		:	getProjects($_POST["getProjects"], $description_files_path, $db);	break;
		case "get_files"	: getFiles( $_POST["get_files"],$db );	break;
	}
}*/

//******************************************************************************************
// SAVE PRODUCT DATA INTO DATABASE
function saveProduct( $post, $db ){
	$product_places = array();
	$error_msg = "";
	$product_id = $post["product_id"];
	$product_json_data = $post["saveProduct"];
	$product_name = $post["product_name"];
	$product_thumb = $post["product_thumb"];

	$product_json_data = htmlentities($product_json_data, ENT_QUOTES, 'UTF-8', false);

	$insert_q = "INSERT INTO products (name, productdata, preview_thumb) VALUES('$product_name', '$product_json_data', '$product_thumb')";
	$select_q = "SELECT id FROM products WHERE id = $product_id";
	$update_q = "UPDATE products SET name = '$product_name', productdata = '$product_json_data', preview_thumb = '$product_thumb' WHERE id = $product_id";

	if(!mysql_query($select_q)){
		// Insert new Product
		if(mysql_query($insert_q)){
			$product_id = mysql_insert_id();
			// Update Product's db_id
			$product_data = json_decode( stripcslashes($product_json_data) );
			$product_data->db_id = $product_id;
			$product_data = json_encode($product_data);
			if(!mysql_query("UPDATE products SET productdata = '$product_data' WHERE id = $product_id")){
				$error_msg = mysql_error();
			}

			// Return its ID
			if( $product_id ){
				// Rearange places
				if( rearangeFilePlaces( 1, $db, $product_id ) ){
					if(!mysql_query("UPDATE products SET place = 1 WHERE id = ".$product_id)){
						$error_msg = mysql_error();
						outputError("#4 ".$error_msg);
					}
				}

				echo json_encode( array("error"=>false, "product_id"=>$product_id) );
			} else {
				outputError("#3 No product id");
			}
		} else {
			$error_msg = mysql_error();
			outputError("#2 Cannot Insert. ".$error_msg);
		}
	} else {
		// Update Product
		if(mysql_query($update_q)){
			echo json_encode( array("error"=>false, "product_id"=>$product_id) );
		} else {
			$error_msg = mysql_error();
			outputError("#1 ".$error_msg);
		}
	}
	// setDBField($table, $field, $value){
}

//------------------------------	CHANGE PRODUCT PLACE		-----------------------------//
// 
function changePlace($_post, $db){
	$id = $_post["changePlace"];
	$place = $_post["place"];

	if( rearangeFilePlaces( $place, $db, $id ) ){
		if(!mysql_query("UPDATE products SET place = ".$place." WHERE id = ".$id."")){
			echo json_encode(array("error"=>true, mysql_error()));
		} else {
			echo json_encode(array("error"=>false));	
		}
	}
}

function rearangeFilePlaces( $new_place, &$db, $id = NULL ){
	// Check if place is already taken by other file
		if($id != NULL){
			$old_place = mysql_result(mysql_query("SELECT place FROM products WHERE id = $id"), 0);
			
			if( $old_place > $new_place	){
				return ascendPlace( $new_place, $old_place, $db );
						
			} elseif( $old_place < $new_place ){
				return descendPlace( $new_place, $old_place, $db );
			}
		} else {
			return ascendPlace( $new_place, 100000, $db );
		}
}

function ascendPlace( &$new_place, $old_place, &$db ){
	if(mysql_query("UPDATE products SET place = place+1 WHERE place >= $new_place AND place < $old_place")){
		return true;	
	} else {
		return false;	
	}	
}

function descendPlace( &$new_place, &$old_place, &$db ){
	if(mysql_query("UPDATE products SET place = place-1 WHERE place <= $new_place and place > $old_place")){
		return true;	
	} else {
		return false;	
	}	
}

//******************************************************************************************
// GET PRODUCT DATA

function getProductData($post, $db){
	$session = new Session();
	$id = $post["get_product_data"];
	$where = $post["get_product_data"]== "*" ? "" : "WHERE id = $id";
	$result = mysql_query("SELECT * FROM products $where ORDER BY place ASC");
	if($result){
		if( mysql_num_rows($result) > 1 ){
			$response = array();
			while($row = mysql_fetch_assoc($result)){
				$row["productdata"] = html_entity_decode($row["productdata"], ENT_QUOTES, 'UTF-8');
				array_push($response,  $row);
			}
		} else {
			// $product_data = mysql_fetch_assoc($result);
			$response = array(mysql_fetch_assoc($result));
			$response["productdata"] = html_entity_decode($response["productdata"], ENT_QUOTES, 'UTF-8');
		}

		$_SESSION["product_data"] = $response;
		echo json_encode(array("error" => false, "product_data" => $response ));

	} else {
		outputError(mysql_error());
	}
}

//---------------------------------------------------------------------------------
// 

function getProductSpecs($post, $db){
	$id = $post["getProductSpecs"];
	$result = mysql_query("SELECT specs FROM products WHERE id = $id");
	if($result){
		$specs = mysql_result($result, 0);
		if( $specs ){	
			echo json_encode(array("error" => false, "specs" => $specs ));
		}

	} else {
		outputError(mysql_error());
	}
}

//---------------------------------------------------------------------------------
// 
function deleteProduct($_post, $db){
	$id = $_post["deleteProduct"];
	if(mysql_query("DELETE FROM products WHERE id = $id")){
		echo json_encode( array('error' => false) );
	} else {
		echo json_encode( array('error' => true, 'error_msg' => mysql_error()) );
	}
}

//---------------------------------------------------------------------------------
// 

function deleteFile($_post, $db){
	$path = $_post["deleteOptImg"];
	if(file_exists("../../".$path)){
		unlink("../../".$path);
		$thumb_file = dirname($path)."/thumbnail/".basename($path);
		if(file_exists("../../".$thumb_file)){
			unlink("../../".$thumb_file);
		}
		echo json_encode(array("error"=>false));
	} else {
		echo json_encode(array("error"=>true, "error_msg"=>"Can not delete. File doesn't exist."));
	}
}

//---------------------------------------------------------------------------------
// 
function changeName($_post, $db){
	$id = $_post["changeName"];
	$name = $_post["name"];

	if(mysql_query("UPDATE products SET name = '$name' WHERE id = $id")){
		echo json_encode( array('error' => false) );
	} else {
		echo json_encode( array('error' => true, 'error_msg' => mysql_error()) );
	}
}


//---------------------------------------------------------------------------------
// 
function editDescription($post, $db){
	$id = $post["editDescription"];
	$description = $post["description"];

	if(mysql_query("UPDATE products SET description = '$description' WHERE id = $id")){
		echo json_encode( array('error' => false) );
	} else {
		echo json_encode( array('error' => true, 'error_msg' => mysql_error()) );
	}
}

//---------------------------------------------------------------------------------
// 
function editSpecs($post, $db){
	$id = $post["editSpecs"];
	$description = $post["description"];

	if(mysql_query("UPDATE products SET specs = '$description' WHERE id = $id")){
		echo json_encode( array('error' => false) );
	} else {
		echo json_encode( array('error' => true, 'error_msg' => mysql_error()) );
	}
}

//---------------------------------------------------------------------------------
// 
function changePrice($_post, $db){
	$id = $_post["changePrice"];
	$price = $_post["price"];

	if(mysql_query("UPDATE products SET price = $price WHERE id = $id")){
		$price = mysql_result(mysql_query("SELECT price FROM products WHERE id = $id"), 0);
		echo json_encode( array('error' => false, 'price'=> $price) );
	} else {
		echo json_encode( array('error' => true, 'error_msg' => mysql_error()) );
	}
}

//---------------------------------------------------------------------------------
// 
function toggleActive($_post, $db){
	$id = $_post["toggleActive"];
	$state = $_post["active"];

	if(mysql_query("UPDATE products SET active = $state WHERE id = $id")){
		echo json_encode( array('error' => false) );
	} else {
		echo json_encode( array('error' => true, 'error_msg' => mysql_error()) );
	}
}

//---------------------------------------------------------------------------------
// 
function userLogout(&$session){
	$session->closeSession();
}

//---------------------------------------------------------------------------------
// 
function outputError( $msg ){
	$error_msg	= "Error! ".$msg;
	echo json_encode(array("error"=>true, "error_msg"=>$error_msg));	
}

?>





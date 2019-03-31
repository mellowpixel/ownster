<?php
include_once("../../../inc/SessionClass.php");
include("../../../inc/memory_usage.php");
date_default_timezone_set("Europe/London");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../../../error_log/php-error$date.log");

$session = new Session();
// recordMemoryUsage("user_upload_server/index -> Start");
if(isset($_SESSION["unique_user_id"])){
	$unique_user_ID = $_SESSION["unique_user_id"];
} else {
	$unique_user_ID = uniqueUserSessionID();
	$_SESSION["unique_user_id"] = $unique_user_ID;
	$_SESSION["user_folder"] = "user_upload/$unique_user_ID/";
}

// If file represents an image of the whole complete product, make a thumbnail for it.
$complete_product_img_names = isset($_POST["complete_product_img_names"]) ? explode(",", $_POST["complete_product_img_names"])
																		  : array();

$jstr_arr = explode(",", stripcslashes($_POST["sides"]));
$output = array("error"=>false, "error_msg"=>"");

foreach ($_FILES as $file) {
	in_array($file["name"], $complete_product_img_names) ? $dir_appendix = "thumbnails/"
														 : $dir_appendix = "";

	$dir = "user_upload/$unique_user_ID/$dir_appendix";
	$status = uploadFile($file, $dir);
	
	if(isset($status["upload_path"])){
		$filedata = array();
		$filedata["url"] = $status["upload_path"];
		// receive and decode json data about sides names
        foreach($jstr_arr as $json_str){
            $side = (array)json_decode($json_str);
            if(isset($side[ $file["name"] ])){
                $filedata["side_name"] = $side[$file["name"]];
            }
        }

		// search created_products for product id. If it exists add files to it otherwise create new product in session variable
        if( isset($_SESSION["created_products"]) && array_key_exists($unique_user_ID, $_SESSION["created_products"]) ){
            if(in_array($file["name"], $complete_product_img_names)){
                if($file["name"] == $_POST["default_surface"]){
                    $_SESSION["created_products"][$unique_user_ID]["data"]["default_pic"] = $status["upload_path"];    
                }
                array_push( $_SESSION["created_products"][$unique_user_ID]["data"], (object)$filedata);
            }    

        } else {
            $_SESSION["created_products"] = array_combine(array($unique_user_ID), array(array("data"=>array("default_pic"=>""), "quantity"=>1, "product_db_id"=>null)));
            if(in_array($file["name"], $complete_product_img_names)){
                if($file["name"] == $_POST["default_surface"]){
                    $_SESSION["created_products"][$unique_user_ID]["data"]["default_pic"] = $status["upload_path"];
                }
                array_push( $_SESSION["created_products"][$unique_user_ID]["data"], (object)$filedata);
            }
        }

        if(isset($_POST["product_id"])){
            $_SESSION["created_products"][$unique_user_ID]["product_db_id"] = $_POST["product_id"];
        }

        
	} else {
		$output["error"] = true;
		$output["error_mgs"] = isset($status["errors"]) ? $status["errors"]
														: "File Upload Error.";
	}
}

echo json_encode($output);
	//------------------------------------------------------------------------------------------------

function uploadFile($file, $uploadDir ){

	if(!is_dir("../../../".$uploadDir)){		// If dirrectory doesn't exist create dirrectory
		if(!mkdir("../../../".$uploadDir,0777,true)){
			$upload_status["errors"] = addError( $upload_status["errors"],
												 "File upload error! Cannot create new dirrectory. '..$uploadDir'<br/>");
		}
	}
	

	if($file['error'] === UPLOAD_ERR_OK && !$upload_status["errors"]){	//	if no Errors

		preg_match_all("/[\.\w]/", preg_replace("/ /", "_", stripslashes($file['name'])), $legal_characters, PREG_PATTERN_ORDER); // Keep only legal characters in the file name
		$safe_file_name = implode($legal_characters[0]); // fuse all legal characters into safe file name
		if(move_uploaded_file($file['tmp_name'], "../../../".$uploadDir.$safe_file_name.".png")){
			$upload_status["upload_path"] = $uploadDir.$safe_file_name.".png";
		}

	} else {
				
		if(isset($file['name']))
			$fileName = $file['name'];
		else $fileName = "";
					
		switch($file['error']){
					
			case UPLOAD_ERR_INI_SIZE: 		$upload_status["errors"] = addError( $upload_status["errors"],
													 "The uploaded file \"$fileName\" exceeds the maximum filesize.<br/>");
												break;
			case UPLOAD_ERR_FORM_SIZE: 		$upload_status["errors"] = addError( $upload_status["errors"],
													 "The uploaded file \"$fileName\" exceeds the maximum filesize.<br/>");
												break;
			case UPLOAD_ERR_PARTIAL: 		$upload_status["errors"] = addError( $upload_status["errors"],
													 "The file \"$fileName\" was only partially uploaded.<br/>");
												break;
			case UPLOAD_ERR_NO_FILE: 		if($fileName != ""){
												$upload_status["errors"] = addError( $upload_status["errors"],
														 "The file \"$fileName\" was not uploaded.<br/>");
											} 	break;
			case UPLOAD_ERR_NO_TMP_DIR: 	$upload_status["errors"] = addError( $upload_status["errors"],
													 "Missing a temporary folder for the file \"$fileName\".<br/>");
												break;
			case UPLOAD_ERR_CANT_WRITE: 	$upload_status["errors"] = addError( $upload_status["errors"],
													 "Failed to write the file \"$fileName\" to the disk.<br/>");
												break;
			case UPLOAD_ERR_EXTENSION: 		$upload_status["errors"] = addError( $upload_status["errors"],
													 "A PHP extension stopped the upload of file \"$fileName\".<br/>");
												break;
			default:						$upload_status["errors"] = addError( $upload_status["errors"],
													 "File \"$fileName\". ".$file['error']."<br/>");
												break;
								
		}// end of switch 
	}// end of else
	return $upload_status;
}

//--------------------------------------------------------------------------

function addError( &$errorstack, $error_msg ){
	if(!is_array($errorstack)){
		$errorstack = array();
	}
	array_push($errorstack, $error_msg);
	return $errorstack;
}

function uniqueUserSessionID(){
	$output 	= '';
	$roulete	= array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
						'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
						'U', 'V', 'W', 'X', 'Y', 'Z' );
						
	if( shuffle($roulete) ){
		for($i = 0; $i < 4; $i++){
			$output .= $roulete[$i];
		}
				
	}
	
	$unique_name = date("dmy_Gis")."_".$output;
	return $unique_name;
}

?>
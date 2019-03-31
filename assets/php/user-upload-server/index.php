<?php
include_once("../../../inc/SessionClass.php");
include("../../../inc/memory_usage.php");
date_default_timezone_set("Europe/London");
ini_set("log_errors", 1);
ini_set('memory_limit', '128M');
$date = date("d-m-y");
ini_set("error_log", "../../../error_log/php-error$date.log");
// ini_set('apc.max_file_size', '128M');
$session = new Session();
// recordMemoryUsage("user_upload_server/index -> Start");
if(isset($_SESSION["unique_user_id"])){
	$unique_user_ID = $_SESSION["unique_user_id"];
} else {
	$unique_user_ID = uniqueUserSessionID();
	$_SESSION["unique_user_id"] = $unique_user_ID;
	$_SESSION["user_folder"] = "user_upload/$unique_user_ID/";
}


if(isset($_FILES)){
	$post_dta = json_decode($_POST["sides"], true);
/*  $post_dta --- sides[side_n]
				|			|__ product_background_img_url ( false / image url that represent plain product image)
				|			|__ product_background_img_height
				|			|__ product_background_img_width
				|           |__ name (surface name e.g Front)
				|			|__ maskurl (undefined / image url)
				|			|__ user_img_height
				|			|__ user_img_width
				|			|__ user_img_x
				|			|__ user_img_y
				|
				|___ product_info 
								|__ default_side (default side id)
								|__ scale (product scale)
								|__ db_id
								|__ product_name

*/
	$dir = "/user_upload/$unique_user_ID/";
	$status = uploadFile($_FILES["canvasImage"], "../../..".$dir, $post_dta );
	
	if(isset($status["mainprint_path"]) && file_exists($status["mainprint_path"])){
		// variables
		$session_data = array();
		$session_data[$unique_user_ID] = array("data"=>array(), "quantity"=>1, "product_db_id"=>$post_dta["product_info"]["db_id"]);

		$main_side = $post_dta["product_info"]["default_side"];
		$product_img_src = $post_dta["sides"][$main_side]["product_background_img_url"];
		$user_img_width = $post_dta["sides"][$main_side]["user_img_width"];
		$user_img_height = $post_dta["sides"][$main_side]["user_img_height"];
		$user_img_x = $post_dta["sides"][$main_side]["user_img_x"];
		$user_img_y = $post_dta["sides"][$main_side]["user_img_y"];

		list($pr_img_real_w, $pr_img_real_h) = getimagesize(rawurldecode("../../..".$product_img_src));
		$scale = $post_dta["sides"][$main_side]["product_background_img_width"] / $pr_img_real_w;
		$pr_img_res = imageCreateFromAny(rawurldecode("../../..".$product_img_src));
		
		// Resize User generated image and merge it with the product background image
		$user_img_res = resizeImage($status["mainprint_path"], $user_img_width / $scale);
		imagealphablending($pr_img_res, true);
		imagesavealpha($pr_img_res, true);
		imagecopy($pr_img_res, $user_img_res, $user_img_x/ $scale, $user_img_y/ $scale, 0, 0, $user_img_width / $scale, $user_img_height / $scale);

		// Add mask
		if(isset($post_dta["sides"][$main_side]["maskurl"])){
			$mask_src = rawurldecode("../../..".$post_dta["sides"][$main_side]["maskurl"]);
			$mask_res = imageCreateFromAny($mask_src);
			list($mask_w, $mask_h) = getimagesize($mask_src);

			// $mask_res = resizeImage($mask_src, $pr_img_real_w);
			imagecopy($pr_img_res, $mask_res, 0, 0, 0, 0, $mask_w, $mask_h);
		}
		// Save thumbnail image
		if(imagepng($pr_img_res, "../../..".$dir."thumbnails/".$status["mainprint_name"]."_Sidecomplete.png")){
			$session_data[$unique_user_ID]["data"]["default_pic"] = array(	"url"=>$dir."thumbnails/".$status["mainprint_name"]."_Sidecomplete.png", 
																			"sidename"=>$post_dta["sides"][$main_side]["name"]);
		}
		
		// Copy background pictures of remaining sides of the product.
		foreach ($post_dta["sides"] as $key => $value) {
			if($key !== $main_side){
				$othersides = resizeImage(rawurldecode("../../..".$post_dta["sides"][$key]["product_background_img_url"]), $pr_img_real_w);
					
				if(imagepng($othersides, "../../..".$dir.$post_dta["sides"][$key]["name"].".png")){
					$session_data[$unique_user_ID]["data"][$key] = array( "url"=>$dir.$post_dta["sides"][$key]["name"].".png", 
																		  "sidename"=>$post_dta["sides"][$key]["name"]);
				}			
			}
		}

		// Save data to session
		$_SESSION["created_products"] = $session_data;
	} 

	echo json_encode(array("status"=>$status));
}

/* Upload Files
-----------------------------------------------*/

function uploadFile($file, $uploadDir, $post_dta ){
	$upload_status = array();
	if(!is_dir($uploadDir."thumbnails/")){		// If dirrectory doesn't exist create dirrectory
		if(!mkdir($uploadDir."thumbnails/",0777,true)){
			$upload_status["errors"] = addError( $upload_status["errors"],
												 "File upload error! Cannot create new dirrectory. '..$uploadDir'<br/>");
		}
	}
	

	if($file['error'] === UPLOAD_ERR_OK){	//	if no Errors

		preg_match_all("/[\.\w]/", preg_replace("/ /", "_", stripslashes($file['name'])), $legal_characters, PREG_PATTERN_ORDER); // Keep only legal characters in the file name
		$safe_file_name = implode($legal_characters[0]); // fuse all legal characters into safe file name
		if(move_uploaded_file($file['tmp_name'], $uploadDir.$safe_file_name.".png")){

			$upload_status["mainprint_path"] = $uploadDir.$safe_file_name.".png";
			$upload_status["mainprint_name"] = $safe_file_name;
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
													 "Error #0 ".$file['error']."<br/>");
												break;
								
		}// end of switch 
	}// end of else
	return $upload_status;
}

/* Merge Two png's together
-----------------------------------------------*/
function mergeImages($img_A_src, $img_B_src, $save_url){
	$image_1 = imageCreateFromAny($img_A_src);
	$image_2 = imageCreateFromAny($img_B_src);
	list($width, $height) = getimagesize($img_B_src);
	imagealphablending($image_1, true);
	imagesavealpha($image_1, true);
	imagecopy($image_1, $image_2, 0, 0, 0, 0, $width, $height);
	imagepng($image_1, $save_url);
}

/* Resize Image Func
-----------------------------------------------*/

function resizeImage($src_img, $new_width ){
	// Content type
	header('Content-Type: image/png');

	// Get new dimensions
	list($width_orig, $height_orig) = getimagesize($src_img);

	$ratio_orig = $width_orig / $height_orig;
	$new_height = $new_width / $ratio_orig;

	// Resample
	$img_p = imagecreatetruecolor($new_width, $new_height);
	$whiteBackground = imagecolorallocate($img_p, 255, 255, 255);
	imagefill($img_p,0,0,$whiteBackground);
	$image = imageCreateFromAny($src_img);
	imagecopyresampled($img_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width_orig, $height_orig);
	return $img_p;
	// Output
	// imagepng($img_p, $dst_img, 0);
}

function imageCreateFromAny($src_img){
	switch(exif_imagetype($src_img)){
		case IMAGETYPE_JPEG: $image = imagecreatefromjpeg($src_img); break;
		case IMAGETYPE_PNG: $image = imagecreatefrompng($src_img); break;
	}
	return $image;
}
/*
-----------------------------------------------*/

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
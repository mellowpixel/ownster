<?php 

function upload_files($files, $uploadDir, $create_directory = false, $MIME_types_alowed="any"){
	
	$error = false;							// Stores Error messages							
	$alowed_file_extensions = array();		// Array of allowed file extension to compare with.
	$uploaded_Files_status = array();
	if($MIME_types_alowed != "any"){
		$MIME_array = explode(",", $MIME_types_alowed);
		foreach($MIME_array as $extension)
			array_push($alowed_file_extensions, trim(strtolower($extension)));
	}
	
	if(substr($uploadDir, -1) !=='/')	// if last "/" in the directory path is missing 
		$uploadDir .= '/';
	
	if($create_directory){				// If creating derectories is allowed.	
		if(!is_dir($uploadDir)){		// If dirrectory doesn't exist create dirrectory
			if(!mkdir($uploadDir,0777,true)){
				array_push($uploaded_Files_status, "error:|File upload error! Cannot create new dirrectory.<br/>");
				$error = true;
			}
		}
	}
	
	if(is_array($files['name'])){			//	If uploading multiple files	
		for($i = 0; $i < count($files['name']); $i++){
			if($files['error'][$i] === UPLOAD_ERR_OK && !$error){	//	if no Errors
				// --------------------------------------------- IF TYPES OF ACCEPTED FILES IS DEFINED ----------------------------------------------------------
				if($MIME_types_alowed !== "any"){
					$fileType = explode("/", $files['type'][$i]);
					$file_extension = strtolower(substr($files['name'][$i], strrpos($files['name'][$i], ".")+1));
					if(in_array($fileType[1], $alowed_file_extensions) && in_array($file_extension, $alowed_file_extensions)){
						
						preg_match_all("/[\.\w]/", preg_replace("/ /", "_", stripslashes($files['name'][$i])), $legal_characters, PREG_PATTERN_ORDER); // Keep only legal characters in the file name
						$safe_file_name = implode($legal_characters[0]); // fuse all legal characters into safe file name
						
						if(move_uploaded_file($files['tmp_name'][$i], $uploadDir.$safe_file_name)){
							array_push($uploaded_Files_status, "success:|".$uploadDir.$safe_file_name);
						}
						
					} else array_push($uploaded_Files_status, "error:|File \"".$files['name'][$i]."\". Only $MIME_types_alowed expensions allowed."); // Error if file type not accepted
				} else {
					// --------------------------------------------- Any file type ----------------------------------------------------------------------------- 
					preg_match_all("/[\.\w]/", preg_replace("/ /", "_", stripslashes($files['name'][$i])), $legal_characters, PREG_PATTERN_ORDER); // Keep only legal characters in the file name
					$safe_file_name = implode($legal_characters[0]); // fuse all legal characters into safe file name
					if(move_uploaded_file($files['tmp_name'][$i], $uploadDir.$safe_file_name)){
						array_push($uploaded_Files_status, "success:|".$uploadDir.$safe_file_name);
					}
				}
			} else {
				
				if(isset($files['name'][$i]))
					$fileName = $files['name'][$i];
				else $fileName = "";
					
				switch($files['error'][$i]){
					
					case UPLOAD_ERR_INI_SIZE: 		array_push($uploaded_Files_status, "error:|The uploaded file \"$fileName\" exceeds the maximum filesize.<br/>"); break;
					case UPLOAD_ERR_FORM_SIZE: 		array_push($uploaded_Files_status, "error:|The uploaded file \"$fileName\" exceeds the maximum filesize.<br/>"); break;
					case UPLOAD_ERR_PARTIAL: 		array_push($uploaded_Files_status, "error:|The file \"$fileName\" was only partially uploaded.<br/>"); break;
					case UPLOAD_ERR_NO_FILE: 		if($fileName != "") array_push($uploaded_Files_status, "error:|The file \"$fileName\" was not uploaded.<br/>"); break;
					case UPLOAD_ERR_NO_TMP_DIR: 	array_push($uploaded_Files_status, "error:|Missing a temporary folder for the file \"$fileName\".<br/>"); break;
					case UPLOAD_ERR_CANT_WRITE: 	array_push($uploaded_Files_status, "error:|Failed to write the file \"$fileName\" to the disk.<br/>"); break;
					case UPLOAD_ERR_EXTENSION: 		array_push($uploaded_Files_status, "error:|A PHP extension stopped the upload of file \"$fileName\".<br/>"); break;
					default:						array_push($uploaded_Files_status, "error:|File \"$fileName\". Unknown uploadError.<br/>"); break;			
								
				}// end of switch 
			}// end of else
			
		}// end of for loop	
	} else echo "Not an array";// end of is_array
	return $uploaded_Files_status;
}// end of function



function upload_file($file, $uploadDir, $create_directory = false, $MIME_types_alowed="any"){
	
	$error = false;							// Stores Error messages							
	$alowed_file_extensions = array();		// Array of allowed file extension to compare with.
	$uploaded_Files_status = array();
	if($MIME_types_alowed != "any"){
		$MIME_array = explode(",", $MIME_types_alowed);
		foreach($MIME_array as $extension)
			array_push($alowed_file_extensions, trim(strtolower($extension)));
	}
	
	if(substr($uploadDir, -1) !=='/')	// if last "/" in the directory path is missing
		$uploadDir .= '/';
		
	if($create_directory){				// If creatin derectories is allowed.	
		if(!is_dir($uploadDir)){		// If dirrectory doesn't exist create dirrectory
			if(!mkdir($uploadDir,0777,true)){
				array_push($uploaded_Files_status, "error:|File upload error! Cannot create new dirrectory.<br/>");
				$error = true;
			}
		}
	}

	if($file['error'] === UPLOAD_ERR_OK && !$error){	//	if no Errors
		// --------------------------------------------- IF TYPE OF ACCEPTED FILES IS DEFINED ----------------------------------------------------------
		if($MIME_types_alowed !== "any"){
			
	//		$fileType = explode("/", $file['type']);
			$file_extension = strtolower(substr($file['name'], strrpos($file['name'], ".")+1));
	//		if(in_array($fileType[1], $alowed_file_extensions) && in_array($file_extension, $alowed_file_extensions)){
			if(in_array($file_extension, $alowed_file_extensions)){
							
				preg_match_all("/[\.\w]/", preg_replace("/ /", "_", stripslashes($file['name'])), $legal_characters, PREG_PATTERN_ORDER); // Keep only legal characters in the file name
				$safe_file_name = implode($legal_characters[0]); // fuse all legal characters into safe file name
				if(move_uploaded_file($file['tmp_name'], $uploadDir.$safe_file_name)){
					return "success:|".$uploadDir.$safe_file_name;
				}
							
			} else return "error:|File \"".$file['name']."\". Only $MIME_types_alowed expensions allowed."; // Error if file type not accepted
		} else {
		// --------------------------------------------- Any file type ----------------------------------------------------------------------------- 
			preg_match_all("/[\.\w]/", preg_replace("/ /", "_", stripslashes($file['name'])), $legal_characters, PREG_PATTERN_ORDER); // Keep only legal characters in the file name
			$safe_file_name = implode($legal_characters[0]); // fuse all legal characters into safe file name
			if(move_uploaded_file($file['tmp_name'], $uploadDir.$safe_file_name)){
				return "success:|".$uploadDir.$safe_file_name;
			}
		}
	} else {
				
		if(isset($file['name']))
			$fileName = $file['name'];
		else $fileName = "";
					
		switch($file['error']){
					
			case UPLOAD_ERR_INI_SIZE: 		return "error:|The uploaded file \"$fileName\" exceeds the maximum filesize.<br/>"; break;
			case UPLOAD_ERR_FORM_SIZE: 		return "error:|The uploaded file \"$fileName\" exceeds the maximum filesize.<br/>"; break;
			case UPLOAD_ERR_PARTIAL: 		return "error:|The file \"$fileName\" was only partially uploaded.<br/>"; break;
			case UPLOAD_ERR_NO_FILE: 		if($fileName != "")return  "error:|The file \"$fileName\" was not uploaded.<br/>"; break;
			case UPLOAD_ERR_NO_TMP_DIR: 	return  "error:|Missing a temporary folder for the file \"$fileName\".<br/>"; break;
			case UPLOAD_ERR_CANT_WRITE: 	return  "error:|Failed to write the file \"$fileName\" to the disk.<br/>"; break;
			case UPLOAD_ERR_EXTENSION: 		return  "error:|A PHP extension stopped the upload of file \"$fileName\".<br/>"; break;
			default:						return  "error:|File \"$fileName\". Unknown uploadError.<br/>"; break;			
								
		}// end of switch 
	}// end of else
}

function resizeImage($image_path, $width, $file_extension){
	if($file_extension == "jpg" || $file_extension == "jpeg")
		$image	= imagecreatefromjpeg($image_path);
	elseif($file_extension == "png")
		$image	= imagecreatefrompng($image_path);
	
	if($image){
		$img_xw = imagesx($image);
		$img_yh = imagesy($image);
		$ratio	= $img_xw / $img_yh;
		
		// preserve transparency
	  	$new_image = imagecreatetruecolor($width, $width/$ratio);
		if($file_extension == "png"){
			imagecolortransparent($new_image, imagecolorallocatealpha($new_image, 0, 0, 0, 127));
			imagealphablending($new_image, false);
			imagesavealpha($new_image, true);
	  	}
		
		imagecopyresampled($new_image, $image, 0, 0, 0, 0, $width, $width/$ratio, $img_xw, $img_yh);
		return $new_image;
	} else {
		return false;	
	}
}


//----------------------------------------------------------------------------	Create Thumbnail
function saveThumbnail($src_dir, $thumb_dir, $file_name, $file_extension, $thumb_width, $thumb_name="", $status = ""){
	
	$thumbnail = resizeImage($src_dir.$file_name, $thumb_width, $file_extension);	// Resize Image
	if($thumbnail){	
	
		if($file_extension == "jpg" || $file_extension == "jpeg")
			$success = ($thumb_name === "" ? imagejpeg($thumbnail, $thumb_dir.$file_name) : imagejpeg($thumbnail, $thumb_dir.$thumb_name));	// Save Image
		elseif($file_extension == "png")
			$success = ($thumb_name === "" ? imagepng($thumbnail, $thumb_dir.$file_name) : imagepng($thumbnail, $thumb_dir.$thumb_name));	// Save Image
			
		if($success){						
		 	return ($thumb_name === "" ? $thumb_dir.$file_name : $thumb_dir.$thumb_name); 	
		} else {
			return false;
		}
	} else {
		return false;
	}	
}
//----------------------------------------------------------------------------
?>
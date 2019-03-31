<?php
include_once("../SessionClass.php");
include("../../../inc/memory_usage.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../../../error_log/php-error$date.log");

$session	= new Session();
recordMemoryUsage("instagramServer.php/ -> Start");
if(isset($_POST)){
	switch(key($_POST)){

		case 'download_files': downloadFiles($_POST); break;
		case 'download_single_file': downloadSingleFile($_POST["download_single_file"]); break;
		case 'download_FB_file': downloadSingleFile($_POST["download_FB_file"], "?"); break;
	}
}

//---------------------------------------------------------------------------------
// ********************************************************************************

function downloadFiles($post){
	$json_encoded = $post["download_files"];
	$surf_cell_url = json_decode($json_encoded);
	$path = "/user_upload/instagram/".$_SESSION["unique_user_id"]."/";
	$saved_paths = array();
	// print_r($surf_cell_url);

	foreach($surf_cell_url as $side => $sval) {
		$cells = array();
		$saved_paths[$side] = array("cells"=>array());
		foreach ($sval->cells as $cell => $url) {
			$imgdata = file_get_contents($url);
			$fname = basename($url);
			if(!is_dir("../../..".$path)){
				mkdir("../../..".$path, 0777, true);
			}
			file_put_contents("../../..".$path.$fname, $imgdata);
			$host = parse_url($_SERVER['SERVER_NAME']);
			$saved_paths[$side]["cells"][$cell] =  "http://".$_SERVER['SERVER_NAME'].$path.$fname;
		}
	}
	recordMemoryUsage("instagram_server/ -> downloadFiles");
	echo json_encode( array("error"=>false, "data"=> $saved_paths ));
}

//---------------------------------------------------------------------------------
// ********************************************************************************

function downloadSingleFile($url, $split=false){
	$path = "/user_upload/instagram/".$_SESSION["unique_user_id"]."/";
	// print_r($surf_cell_url);
	$imgdata = file_get_contents($url);
	if($split){
		$basename = basename($url);
		$chunks = explode($split, $basename);
		$fname = $chunks[0];
	} else {
		$fname = basename($url);
	}

	if(!is_dir("../../..".$path)){
		mkdir("../../..".$path, 0777, true);
	}
	file_put_contents("../../..".$path.$fname, $imgdata);
	$host = parse_url($_SERVER['SERVER_NAME']);
	$saved_path = "http://".$_SERVER['SERVER_NAME'].$path.$fname;

	echo json_encode( array("error"=>false, "imgurl"=> $saved_path ));
}

/*function getInstagramMedia($post){
	$access_token = $post['getmedia'];
	$user_id = $post['user_id'];
	$client_id = "a6d8e22917604c61b4f2e35b46e21a22";

	$post_fields = array(
		"client_id"=>$client_id,
	);

	curlRequest("https://api.instagram.com/v1/users/$user_id/media/recent/?client_id=$client_id");
}

function curlRequest($endpoint){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $endpoint);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	// grab URL and pass it to the browser
	// print_r("CURL".curl_exec($ch));
	$data = curl_exec($ch);
	curl_close($ch);

	if($data){
		$decoded_resp = json_decode( $data );
		// print_r($decoded_resp);
		$image_data = array();
		foreach($decoded_resp->data as $img_details) {
			$imgdata = file_get_contents($img_details->images->standard_resolution->url);
			$fname = basename($img_details->images->standard_resolution->url);
			file_put_contents($fname, $imgdata);
			// header("Content-type: image/jpeg");
			array_push($image_data, $fname);
		}

		echo json_encode( array("error"=>false, "data"=> $image_data );
	} else {
		echo json_encode( array("error"=>true, "error_msg"=>curl_error($ch)));
	}
	// close cURL resource, and free up system resources
}*/

?>
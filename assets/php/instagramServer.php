<?php
include_once("../../inc/SessionClass.php");
include("../../inc/memory_usage.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../../error_log/php-error$date.log");

$session = new Session();
recordMemoryUsage("instagramServer.php/ -> Start");
if(isset($_POST)){
	switch(key($_POST)){

		case 'getmedia': getInstagramMedia($_POST); break;

	}
}

//---------------------------------------------------------------------------------
// ********************************************************************************

function getInstagramMedia($post){
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

		recordMemoryUsage("instagramServer.php/ -> curlRequest");
		echo json_encode( array("error"=>false, "data"=> $image_data /*json_decode($data)*/));
	} else {
		recordMemoryUsage("instagramServer.php/ -> curlRequest");
		echo json_encode( array("error"=>true, "error_msg"=>curl_error($ch)));
	}
	// close cURL resource, and free up system resources
}

?>
<?php
//set POST variables
// $url = 'http://ownster.mellowpixels.com/assets/php/ProductServer.php';
/*$fields = array("toggleActive=3&active=0",
				"toggleActive=6&active=0",
				"toggleActive=8&active=0",
				"toggleActive=9&active=0");*/

/*//url-ify the data for the POST
$field_string = http_build_query($fields);
print_r(urldecode($field_string));*/

if(isset($_POST["toggleActive"])){

	$field = "toggleActive=".$_POST["toggleActive"]."&active=".$_POST["active"];
	$url = $_POST["url"];

	$ch = curl_init();

	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, 1);
	curl_setopt($ch,CURLOPT_POSTFIELDS, $field);

	//execute post
	$result = curl_exec($ch);
	curl_close($ch);
	json_encode(array("message"=>$result));
}
?>
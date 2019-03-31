<?php

function saveUserBrowsingHistory($data){
	$db_data = array("fields"=>array(), "values"=>array());
	
	// Save data variables --------------------------------------------
	if(isset($data) && is_array($data)){
		foreach ($data as $key => $value) {
			switch ($key) {
				// User Agent Type
				case 'ua_type': 	$type_decoded = '';
									switch ($value) {
										case 'bot' :	$type_decoded = "web bot";			break;
										case 'bro' :	$type_decoded = "normal browser";	break;
										case 'bbro' :	$type_decoded = "simple browser";	break;
										case 'mobile' : $type_decoded = "handheld";			break;
										case 'dow' :	$type_decoded = "downloading agent"; break;
										case 'lib' :	$type_decoded = "http library";		break;
									}
									addField($db_data, "ua_type", $type_decoded);	break;
				// OS
				case 'os':			addField($db_data, "os", array($data["os"], $data['os_number']), " "); break;
				// Browser
				case 'browser_name':addField($db_data, "browser", array($data["browser_name"], $data['browser_number']), " ");break;
				// Engine
				case 'engine_data': if(is_array($data["engine_data"])){ 
										addField($db_data, "engine", array($data["engine_data"][0], $data['engine_data'][1]), " ");
									} break;
				// Mobile
				case 'mobile_data': if(is_array($data['mobile_data'])){
										// Mobile device
										addField($db_data,"mobile_divice", $data["mobile_data"][0]);
										// Browser and browser number
										addField($db_data,"mobile_browser", array( $data["mobile_data"][1], $data["mobile_data"][2]), " ");
										// OS & OS Number
										addField($db_data,"mobile_os", array( $data["mobile_data"][3], $data["mobile_data"][4]), " ");
									} break;

				/*case 'SID': 		addField($db_data,"sid", $data["SID"]);
									break;*/
				case 'user_path':	addField($db_data,"user_path", $data["user_path"]);
									break;
				case 'memory':		addField($db_data,"php_memory", json_encode( $data["memory"]["data"]));
									break;
				case 'order':		addField($db_data,"order_data", $data["order"]);
									break;
				case 'payment_date':addField($db_data,"payment_date", $data["payment_date"]);
									break;
				case 'email':		addField($db_data,"email", $data["email"]);
									break;
				case 'name':		addField($db_data,"name", array($data["name"], $data["lname"]), " ");
									break;
				case 'address1':	addField($db_data,"address", array($data["address1"], $data["address2"], $data["city"], $data["postcode"], $data["country"]), ", ");
									break;
			}
		}
		$fields = implode($db_data["fields"], ",");
		$values = implode($db_data["values"], ",");
		if(!mysql_query("INSERT INTO user_history ($fields) VALUES($values)")){
			echo mysql_error();
		}
	}
}
/*
payment_date
email
name
order
address
os
ua_type
browser
engine
mobile_divice
mobile_browser
mobile_os
user_path
php_memory
*/
//---------------------------------------------------------------------------------------------

function addField( &$db_data, $db_field, $value, $join=false, $val_quotes="'"){
	if(is_array($value)){
		$approved_values = array();
		foreach ($value as $val) {
			if($val !== null && $val !== ''){
				array_push($approved_values, $val);
			}
		}
		$value = ($join && is_string($join)) ? implode($join, $approved_values) : $value;
	}
	if(isset($value) && $value !== null && $value !== ''){
		array_push( $db_data["fields"], $db_field );
		array_push( $db_data["values"], $val_quotes.$value.$val_quotes );
	}
}

?>
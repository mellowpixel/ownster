<?php
include_once("SessionClass.php");
include_once("DataBaseClass.php");
include("email-confirmation-html.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

$session = new Session();
date_default_timezone_set('Europe/London');
// read the post from PayPal system and add 'cmd'
$req = 'cmd=' . urlencode('_notify-validate');

// Choose url
if(array_key_exists('test_ipn', $_POST) && 1 === (int) $_POST['test_ipn'])
    $url = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
else
    $url = 'https://www.paypal.com/cgi-bin/webscr';

foreach ($_POST as $key => $value) {
	$value = urlencode(stripslashes($value));
	$req .= "&$key=$value";
}
 
 
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Host: www.paypal.com'));
$res = curl_exec($ch);
curl_close($ch);
 
 
// assign posted variables to local variables
$item_name = $_POST['item_name'];
$item_number = $_POST['item_number'];
$payment_status = $_POST['payment_status'];
$payment_amount = $_POST['mc_gross'];
$payment_currency = $_POST['mc_currency'];
$txn_id = $_POST['txn_id'];
$receiver_email = $_POST['receiver_email'];
$payer_email = $_POST['payer_email'];
  
if (strcmp ($res, "VERIFIED") == 0) {
	// check the payment_status is Completed
	// check that txn_id has not been previously processed
	// check that receiver_email is your Primary PayPal email
	// check that payment_amount/payment_currency are correct
	// process payment
	
	$db				= new DataBase();
	$fields			= array();
	$values			= array();
	$Items_value	= array();
	$item_num_qty_pair = array();
	
	foreach($_POST as $key => $value){
		switch($key){
			case "payment_type"	:	array_push($fields, $key);
									array_push($values, "'$value'");
									$payment_type	= $value;
									break;
									
			case "payment_date"	:	$date_time = date("Y-m-d H:i:s");
									array_push($fields, $key);
									array_push($values, "'$date_time'");
									break;
				
			case "payment_status"	:	array_push($fields, $key);
										array_push($values, "'$value'");
										$payment_status	= $value;
										break;
										
			case "payer_status"	:	array_push($fields, $key);
									array_push($values, "'$value'");
									$payer_status = $value;	
									break;
										
			case "first_name"	:	array_push($fields, $key);
									array_push($values, "'$value'");
									$first_name = $value;	
									break;
									
			case "last_name"	:	array_push($fields, $key);
									array_push($values, "'$value'");
									$last_name = $value;		
									break;
											
			case "payer_email"	:	array_push($fields, $key);
									array_push($values, "'$value'");
									$payer_email = $value;
									break;
											
			case "payer_id"		:	array_push($fields, $key);
									array_push($values, "'$value'");
									$payer_id = $value;	
									break;
											
			case "address_name"	:	array_push($fields, $key);
									array_push($values, "'$value'");
									$address_name = $value;		
									break;
										
			case "address_country"	:	array_push($fields, $key);
										array_push($values, "'$value'");
										$address_country = $value;		
										break;
												
			case "address_country_code"	:	array_push($fields, $key);
											array_push($values, "'$value'");	
											$address_country_code = $value;	
											break;
									
			case "address_zip"	:	array_push($fields, $key);
									array_push($values, "'$value'");	
									$address_zip = $value;	
									break;
											
			case "address_city"	:	array_push($fields, $key);
									array_push($values, "'$value'");	
									$address_city = $value;	
									break;
										
			case "address_street"	:	array_push($fields, $key);
										array_push($values, "'$value'");
										$address_street = $value;		
										break;
										
			case "mc_gross"	:	array_push($fields, $key);
								array_push($values, $value);
								$mc_gross = $value;		
								break;
			
			case "mc_shipping"	:	$mc_shipping = $value;		
									break;									
												
			case "custom"	:	array_push($fields, $key);
								array_push($values, "'$value'");
								$custom = $value;	
								break;
												
			case "invoice"	:	array_push($fields, $key);
								array_push($values, "'$value'");
								$invoice = $value;		
								break;
								
			default			:	if(substr($key, 0, 11) == "item_number"){
									$qu_key	= str_replace("item_number", "quantity", $key);
									$quantity = false;
									
									if(array_key_exists( $qu_key, $_POST )){
										$quantity = $_POST[$qu_key]; 
									}
									
									if($quantity){
										array_push($Items_value, (object)array( "item_id"=>$value, "qty"=>$quantity));
										array_push($item_num_qty_pair, array($value, $quantity));
									} else {
										array_push($Items_value, (object)array( "item_id"=>$value, "qty"=>1));
										array_push($item_num_qty_pair, array($value, 1));
									}
								}
								break;
									
		}
	}
	
	//---------------------------------------------------------------- If payment completed, carry on
	if(strtolower($payment_status) == "completed"){
		
		$custom = json_decode($custom); //JSON encoded paypal custom variable

		// Write Item Numbers and its quantity into DB
		$product_names = "Personalised Item";
		if(	count($Items_value) >0){
			// Retreive product names from data base based on ids stored in paypal custom variable
			$product_names = array();
			if(is_array($custom->product_ids)){
				$product_db_ids = implode(",", $custom->product_ids);
				$query = "SELECT name FROM products WHERE id in ({$product_db_ids})";
				$rp = mysql_query($query);
		  		if($rp){
		  			while($row = mysql_fetch_array($rp)){
		  				array_push($product_names, $row["name"]);
		  			}

		  			// Add Names and IDs to the saved data
		  			/*foreach ($Items_value as $key => $value) {
		  				$Items_value[$key] += (object)array("product_name"=>$product_names[$key], "product_id"=>$custom->product_ids[$key]);
		  			}*/

		  			$product_names = implode("<br>", $product_names);
		  		} else {
		  			sendMail("mellowpixels@gmail.com", "ipn_listener error", mysql_error()."\nQuery: $query", "Ownster", "sales@ownster.co.uk");
		  			$product_names = "Personalised Item";
		  		}
			} else {
				$product_names = "Personalised Item";
			}

			$json_encoded = json_encode($Items_value);
			array_push($fields, "items");
			array_push($values, "'$json_encoded'");
		}
		
		// Generate Order Number
		do {
			$order_number	= orderNumberGen(8);
			$result			= mysql_query("SELECT order_number FROM completed_payments WHERE order_number = '$order_number'");
		} while(mysql_num_rows($result) > 0);

		array_push($fields, "order_number");
		array_push($values, "'$order_number'");

		$fields_str = implode(",", $fields);
		$values_str = implode(",", $values);

		// Write into DB
		if(!mysql_query("INSERT INTO completed_payments ({$fields_str}) VALUES({$values_str})")){
			sendMail("mellowpixels@gmail.com", "OWNSTER ERROR ipn_listener.php", mysql_error()." --- Fields = {$fields_str}\nvalues = {$values_str}", "Dima", "mellowpixels@gmail.com");
		}
		// Shipping method
		$shp_method = ($address_country_code == "GB") ? "Royal Mail" : "Royal Mail International";
		
		if(!isset($mc_shipping) || (float)$mc_shipping == 0){
			$shipping_price = "Free Shipping";	
		} else {
			$shipping_price = "&pound;".$mc_shipping;
		}
		
		$shipping_info	= $shp_method." - ".$shipping_price;
		
		//------------------------------------------------------------ Create Confirmation Email Body
		$time = strtotime($order_placed_date);
		$order_placed_date = date("d-m-Y H:i:s");
		$order_placed_date .= " GMT";
		$identity = array();
		$addr = array();
		$order = array();
		
		$identity["name"] 			= (isset($first_name) && isset($last_name)) ? ", $first_name $last_name" : "";
		$identity["payer_email"] 	= $payer_email;
		
		$addr["address_name"]		= $address_name;
		$addr["address_street"] 	= $address_street;
		$addr["address_city"] 		= $address_city;
		$addr["address_zip"] 		= $address_zip;
		$addr["address_country"] 	= $address_country;

		$order["order_placed_date"] = $order_placed_date;
        $order["order_number"]		= $order_number;
        $order["delivery_date"]		= $custom->delivery_date;
        $order["shipping_method"]	= "International Standard (via Royal Mail) - Not Tracked";//$shipping_info;
        $order["item_names"]		= $product_names;

        if(property_exists($custom, "voucher")){
        	$order["voucher"] = $custom->voucher;
        }
        // Items info
        $order["item_qtys"] = "";
        $order["item_nums"] = "";
		foreach($item_num_qty_pair as $val){
			$order["item_qtys"] .= $val[1]."<br>";
			$order["item_nums"] .= $val[0]."<br>";
		}
        
        
        $order["subtotal"] 			= ((float)$mc_gross-(float)$mc_shipping);
        $order["shipping_handling"] = $mc_shipping;
        $order["grand_total"] 		= $mc_gross;
		
		$email_body = emailHTML((object)$identity, (object)$order, (object)$addr);
		
		sendMail($payer_email, "Order confirmation: Thank you for your purchase.", $email_body, "Ownster", "sales@ownster.co.uk");
		sendMail("sales@ownster.co.uk", "Order confirmation: Thank you for your purchase.", $email_body, $payer_email, "sales@ownster.co.uk");
		// sendMail("mellowpixels@gmail.com", "Order confirmation: Thank you for your purchase.", $email_body, $payer_email, "sales@ownster.co.uk");
	
		// sendMail("mellowpixels@gmail.com", "Order Confirmation", $email_body, "Ownster", "sales@ownster.co.uk");

	}
}

else if (strcmp ($res, "INVALID") == 0) {
	// log for manual investigation
	$email_body .= "<h3>Ooops! Something went wrong</h3>";
}


//------------------------------------------------------------------------------------------------------------------------------------

function sendMail($recipient, $subject, $body, $senderName, $senderEmail){
	
	$header			= "Content-type: text/html\r\n";
	$header		   .= "From: ". $senderName . " <" . $senderEmail . ">\r\n";
	
	mail($recipient, $subject, $body, $header);
}

//------------------------------------------------------------------------------------------------------------------------------------

function orderNumberGen( $length ){
	$output 	= '';
	$roulete	= array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', );
						
	if( shuffle($roulete) ){
		for($i = 0; $i < $length; $i++){
			$output .= $roulete[$i];
		}
		return $output;	
	} else {
		return false;	
	}
}
?>

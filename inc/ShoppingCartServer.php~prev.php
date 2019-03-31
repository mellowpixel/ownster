<?php
include_once("SessionClass.php");
include_once("DataBaseClass.php");
include_once("UserClass.php");
include("Settings.php");
include("RegExpTest.php");
include("memory_usage.php");
include_once("user_history.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");
ini_set('memory_limit', '128M');
$session = new Session();
$db = new DataBase();
date_default_timezone_set('Europe/Riga');
recordMemoryUsage("ShoppingCart.php -> Start");
// $price_for_item = getPriceForItem();

/* TEST ACCOUNT 

	seller	acc: dimi_1317079231_biz@inbox.com
	buyer 	acc: dimi_1317080275_per@inbox.com
	
	PDT TOKEN:	dfeHJmzfyu7RJUt1gCrYlgx2RQT7Idh5BulOGR2ygWhQj8GaDADKe-cpL3y
	PAYPAL ID:	FB34DR2JLN5X2
	URL:		https://www.sandbox.paypal.com/cgi-bin/webscr

*/

//---------------------------------------------------------------------------------
// TEST ACCOUNT dimi-facilitator@inbox.com
/*$business_email = "BF8JUKJTH6DWCMCV";
$identity_token = "AhCCv-zfhepkrNUhJQo9jRkRa.j2AV326Iqs0FUEnSP1CGM8u8IJQj7t";
$paypal_url		= "https://www.sandbox.paypal.com/cgi-bin/webscr";*/

//---------------------------------------------------------------------------------
// REAL ACCOUNT

$business_email = "MP9HNRXYGPT7Q";
$identity_token = $db->getDBField("settings", "paypal_code");
$paypal_url		= "https://www.paypal.com/cgi-bin/webscr";

/*
https://www.paypal.com/cgi-bin/webscr?
    cmd=_express-checkout
    &useraction=commit
    &token=valueFromSetExpressCheckoutResponse
*/


//-------------------------------------------------------------------------------------

if( isset( $_POST ) ){
	
	switch( key($_POST) ){ // Get Current key ( which is first )
		
		case "new_voucher":			voucherGen($_POST);							break;
		case "get_vouchers":		echo getVouchers();							break;
		case "redeem_voucher":		redeemVoucher($_POST['redeem_voucher']);	break;
		case "check_if_discount":	echo "securearray:|".checkDiscount($session);	break;
		case "getDiscountInfo":		getDiscountInfo($session);					break;
		case "GetPrice":			echo "value:|".getPriceForItem();			break;
		case "change_owner":		changeOwner($_POST);						break;
		case "mark_voucher":		markVoucher($_POST);						break;
		case "new_discount_scheme":	newDiscountScheme($_POST, $db);				break;
		case "itemReorder":			reorderItem($_POST['itemReorder']);			break;
		case "getDiscountSchemes":	echo getDiscountSchemes($db);				break;
		case "scheme_state_change":	schemeStateChange($_POST, $db);				break;
		case "delete_scheme":		deleteScheme($_POST["delete_scheme"], $db);	break;
		case "delete_vaucher":		deleteVaucher($_POST['delete_vaucher']);	break;
		case "delete_vouchers":		deleteMultiple($_POST['IDs']);				break;
		case "delete_expired":		deleteExpired();							break;
		case "email_order":			submitOrderToEmail($_POST, $session, $db);	break;
		case "GetNumOfDiscounts":	echo "value:|".numOfDiscounts($session);	break;
	}
}
//------------------------------------------------------------------------------------------------//
//									F U N C T I O N S											  //
//------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------
//


function newDiscountScheme($post, $db){
	$scheme = json_encode( $post["new_discount_scheme"] );

	$res = mysql_query("INSERT INTO discount_scheme SET discount_script = '$scheme'");
	if($res){
		echo getDiscountSchemes();
	} else {
		echo json_encode(array("error"=>false, "error_msg"=> mysql_error()));
	}
}

function getDiscountSchemes(){
	$schemes = array();
	$res = mysql_query("SELECT * FROM discount_scheme");
	if($res){
		while ($row = mysql_fetch_assoc($res)) {
			array_push($schemes, array("id"=>$row["id"], "discount_script"=>json_decode($row["discount_script"]), "active"=>$row["active"]));
		}
		recordMemoryUsage("ShoppingCart.php -> getDiscountSchemes");
		return json_encode(array("error"=>false, "schemes"=> $schemes));
	} else {
		recordMemoryUsage("ShoppingCart.php -> getDiscountSchemes");
		return json_encode(array("error"=>false, "error_msg"=> mysql_error()));
	}
	
}
//---------------------------------------------------------------------------------
// 
function schemeStateChange($post, $db){
	$state = $post["state"];
	$res = mysql_query("UPDATE discount_scheme SET active = $state WHERE id = ".$post["scheme_state_change"]);
	if($res){
		echo json_encode(array("error"=>false));
	} else {
		echo json_encode(array("error"=>false, "error_msg"=> mysql_error()));
	}
}

function deleteScheme($id, $db){
	$res = mysql_query("DELETE FROM discount_scheme  WHERE id = $id");
	if($res){
		echo json_encode(array("error"=>false));
	} else {
		echo json_encode(array("error"=>false, "error_msg"=> mysql_error()));
	}	
}
//-----------------------------	ADD OORDER TO THE SHOPPING CART	---------------------------//

if(isset($_POST['addToCart'])){
	
	$product_id = $session->getSessionValue("unique_user_id");
	addToBasket($session, $product_id, "orders_in_cart");
	
}

//------------------------------------------------------------------------------------//

function addToBasket($session, $product_id, $key){
	
	if(!isset($_SESSION["orders_in_cart"])){
		$_SESSION["orders_in_cart"] = array();
	}
	
	if(isset($_SESSION["created_products"])){
		array_push( $_SESSION["orders_in_cart"], $_SESSION["created_products"] );
	}
	recordMemoryUsage("ShoppingCart.php -> addToBasket");
}

//----------------------------------------------------------------------------------------//
/*
if(isset($_POST['itemReorder'])){
	$order_id = $_POST['itemReorder'];
	addToBasket($session,$order_id, "orders_from_history");
}*/

function reorderItem($order_id){
	$user  = new User("users");

	if(isset($_SESSION["user_login"]) && isset($_SESSION["user_password"])){

		$email = $_SESSION["user_login"];
		$password = $_SESSION["user_password"];
		
		$user_data = $user->login($email, $password, true);	// CHECK IF SESSION IS GENUE
		if($user_data){
			$orders_string = $user_data['orderhistory'];
			if($orders_string !== NULL){
				
				$order_hist_object = json_decode($orders_string);
				foreach($order_hist_object as $one_order){
					if($one_order->order_id == $order_id){
						$new_order = array();
						$new_order[$order_id]["data"]["default_pic"] = $one_order->product_thubnails->default_pic;
						$new_order[$order_id]["quantity"] = 1;
						$new_order[$order_id]["product_db_id"] = $one_order->order_db_id;
						$new_order[$order_id]["name"] = $one_order->product_name;
						
						if(isset($_SESSION["orders_from_history"])){
							array_push($_SESSION["orders_from_history"], $new_order);
						} else {
							$_SESSION["orders_from_history"] = array();
							array_push($_SESSION["orders_from_history"], $new_order);
						}
					}
				}

				echo json_encode(array("error"=> false));

			} else {
				echo json_encode(array("error"=> false, "history"=>false));
			}
			
		} else {
			echo json_encode(array("error"=> true, "logged_in"=>false));
		}
	} else echo json_encode(array("error"=> true, "logged_in"=>false));
}

//---------------------------------------------------------------------------------
// 

if(isset($_POST['get_total_in_basket'])){
	if($session->getSessionValue("orders_in_cart") || $session->getSessionValue("orders_from_history")){
		$total = 0;
		$a = $session->getSessionValue("orders_in_cart");
		$b = $session->getSessionValue("orders_from_history");
		if(is_array($a)){
			$total += count($a);
		}
		if(is_array($b)){
			$total += count($b);
		}
		recordMemoryUsage("ShoppingCart.php -> get_total_in_basket");
		echo json_encode(array("error"=> false, "total"=>$total));
	} else {
		recordMemoryUsage("ShoppingCart.php -> get_total_in_basket");
		echo json_encode(array("error"=> false, "total"=>0));
	}
}

if(isset($_POST['update_quantity']) && isset($_POST['quantity'])){
	$order_id		= $_POST['update_quantity'];
	$new_quantity	= $_POST['quantity'];
	update_quantity($session, "orders_in_cart", $order_id, $new_quantity);
	update_quantity($session, "orders_from_history", $order_id, $new_quantity);
	echo json_encode(array("error"=>false));
}
//-----------------------------	SUBMIT PAYMENT TO PAY PAL	---------------------------//

/* TEST ACCOUNT 

	seller	acc: dimi_1317079231_biz@inbox.com
	buyer 	acc: dimi_1317080275_per@inbox.com
	
	PDT TOKEN:	dfeHJmzfyu7RJUt1gCrYlgx2RQT7Idh5BulOGR2ygWhQj8GaDADKe-cpL3y
	PAYPAL ID:	FB34DR2JLN5X2
	URL:		https://www.sandbox.paypal.com/cgi-bin/webscr
		


	REAL ACCOUNT

	PDT Token:	c3Nm9ST36yaQTT38nhNA6dTWe_5ngDFWSeNOplSabvnMX5vqyp0mnrJC6He
	URL:		https://www.paypal.com/cgi-bin/webscr
    PAYPAL ID:	Z4GQAWHV67UVL
    			PB826YPGKHYGY                       
							
*/

if(isset($_POST["Submit_payment"])){
	
	/*$order_code					= $_POST["Submit_payment"];
	$delivery_price				= $_POST['delivery_price'];
	$delivery_date				= $_POST['delivery_date'];*/
	$submited_data = $_POST["Submit_payment"];
	// $total_to_pay				= 0;
	// $address_override 			= true;
	// $address_override_inputs 	= "";
	// print_r($submited_data);
	$address_override_inputs = createAddressInputs($submited_data["address"]);
	$delivery_price = $submited_data["delivery"]["price"];
	$delivery_date = $submited_data["delivery"]["date"]." ".$submited_data["delivery"]["month"]." ".$submited_data["delivery"]["year"];

	if(!$address_override_inputs){
		$address_override_inputs = "";
	}
	/*if(isset($_POST['address_override'])){
		$address_override = true;
		$address_override_inputs = createAddressInputs();
		if(!$address_override_inputs){
			$address_override_inputs = "";
		}
	}*/
	
	
	$paypal_form = "<form id='paypall' action=".$paypal_url." method='post'>
                            <input type='hidden' name='cmd' value='_cart' />
                            <input type='hidden' name='upload' value='1' />";
    
	$indiv_orders = $submited_data["order"];
	

	if(is_array($indiv_orders) && count($indiv_orders) > 0){
		$order_history_json_string = "";				// ORDER HISTORY
		$orders_array 	= array();
		$product_ids	= array();	
		// $discount		= checkDiscount($session);
		// $numb_of_dscnt	= numOfDiscounts($session);
		$total_items	= count($indiv_orders);
		$db_id_qty_arr  = array();
	//	$total_copies	= 0;

		// Check for discount schemes in database
		$discount_scheme = array();
        $result = mysql_query("SELECT discount_script FROM discount_scheme WHERE active = 1 ");
        if($result){
            while($row = mysql_fetch_assoc($result)){
                array_push($discount_scheme, json_decode($row["discount_script"]));
            }
        }

		$items = $session->getSessionValue("orders_in_cart");   
		if(isset($_SESSION["orders_in_cart"]) && isset($_SESSION["orders_from_history"])){
            $items = array_merge($_SESSION["orders_in_cart"], $_SESSION["orders_from_history"]);
        } else if(isset($_SESSION["orders_from_history"]) && !isset($_SESSION["orders_in_cart"])) {
            $items = $session->getSessionValue("orders_from_history");
        }

        if($items){
        	$i=0;
            foreach ($items as $product) {
                foreach ($product as $id=>$data) { 
			  		$product_db_id = $data["product_db_id"];
			  		$rp = mysql_query("SELECT price, name FROM products WHERE id = $product_db_id");
			  		if($rp){
			  			$rp_data = mysql_fetch_assoc($rp);
			  			$product_name = $rp_data["name"];
			  		} else {
			  			$product_name = "Personalised Item";
			  		}
                    $price = $rp_data["price"];
                    $qty = $data["quantity"];

                    if(is_array($discount_scheme) && count($discount_scheme) >0){
	                    for($i_d = 0, $tot = count($discount_scheme); $i_d < $tot; $i_d++){
	                        // If product number is in the scheme
	                        if(in_array($product_db_id, $discount_scheme[$i_d]->affected_products)){
	                            // Compare given Qty with the Scheme Qty
	                            foreach($discount_scheme[$i_d]->qty_val_arr as $q_v_obj){
	                                // If given qty is greater or equal then one in the scheme than
	                                // save potential scheme object in $scheme variable and keep looping
	                                if($data["quantity"] >= $q_v_obj->qty){
	                                    $scheme = $q_v_obj;
	                                }
	                            }

	                            $discount_type = $discount_scheme[$i_d]->discount_type;
	                            switch($discount_type){
	                                case "price" : $price = number_format($scheme->val, 2, '.', ''); break;
                                    case "percent" : $price = number_format(($price/100*$scheme->val), 2, '.', ''); break;
	                            }

	                        }
	                    }
	                }
                 	
                 	$subtotal = round($price * $qty, 2);

                    $product_pics = array();
                    
                    if(is_dir("../user_upload/". $id ."/")){
	                    move_file("../user_upload/". $id ."/", "../paid_orders/". $id ."/");
	                    // Save pathnames of thumbnails
	                    $default_pic = returnMovedDirPath($data["data"]["default_pic"]["url"], "/user_upload/$id/", "/paid_orders/$id/" );
                    
	                    foreach($data["data"] as $side){
	                    	if(is_object($side)){
	                    		// Save new path in orders history
							    $new_path = returnMovedDirPath($side->url, "/user_upload/$id/", "/paid_orders/$id/" );
		    					array_push($product_pics, array( "side_name"=>$side->side_name,
		    													 "side_picture"=>$new_path));
		    				}
		    			}
		    		}

	    			if(isset($db_id_qty_arr["id".$product_db_id])){
	    				$db_id_qty_arr["id".$product_db_id]["price"] += $qty;
	    			} else {
	    				$db_id_qty_arr["id".$product_db_id] = array( "qty"=>$qty, "price"=>$price );
	    			}

					$one_order = (object)array(
									"order_id"=>$id,
									"order_db_id"=>$product_db_id,
									"order_qty"=>$qty,
									"order_date"=>date("d/m/Y"),
									"item_price"=>$price,
									"order_total_price"=>$subtotal,
									"product_thubnails"=>array("default_pic"=>$default_pic,
																 "all_pics"=>$product_pics));
					
					array_push($orders_array, $one_order);
					array_push($product_ids, $product_db_id);

					$paypal_form .= "<input type='hidden' name='item_name_".($i+1)."' value='$product_name' />
									<input type='hidden' name='item_number_".($i+1)."' value='".$id."' />
									<input type='hidden' name='quantity_".($i+1)."' value=".$qty." />
									<input type='hidden' name='amount_".($i+1)."' value='".$price."'/>";
			// $mysql_order_history .= $id_qty_pair[0].">".date("d/m/Y").">".$id_qty_pair[1] .">". $price_for_item .">". $id_qty_pair[1]*$price_for_item ."@";	
			
			// move_file("../user_upload/". $id_qty_pair[0] ."/", "../paid_orders/". $id_qty_pair[0] ."/TO_PRINT/main.png");	
				}
				$i++;
			}
			recordMemoryUsage("ShoppingCart.php -> Submit_payment -> if(items)");
		}
		
		//------------------------------------------------------------------------------------------------------------------------------------------------//
		// print_r($_SESSION["discount_price"]);
		if(isset($_SESSION["discount_price"]) || isset($_SESSION["discount_percent"])){
			$num_copies = 0;
			foreach ($orders_array as $one_order) {
				$num_copies += $one_order->order_qty;
			}

			if(isset($_SESSION["discount_price"])){
				$discount = $_SESSION["discount_price"];
				$dis_price = (float)$discount;
				$num_discounts = $_SESSION["num_of_discounts"];

				if($num_discounts !== "@8@"){
					$discounts_remainer = (int)$num_discounts - (int)$num_copies;
					$total_discount = ($discounts_remainer >= 0) ? (int)$num_copies * (float)$dis_price 
																: (int)$num_discounts * (float)$dis_price;
				} else {
					$discounts_remainer = (int)$num_copies;
					$total_discount = (int)$num_copies * (float)$dis_price;
				}

			} else if(isset($_SESSION["discount_percent"])) {
				$tot_price = 0;
				$discount = $_SESSION["discount_percent"];
				
				foreach ($orders_array as $one_order) {
					$tot_price += $one_order->order_total_price;
				}

				$total_discount = ($tot_price / 100) * (int)$discount;
			}

			// $total_discount	= (float)$dis_price * (int)$num_discounts;

			$discount_inp	= "<input type='hidden' name='discount_amount_cart' value=".$total_discount." />";
		} else {
			$discount_inp = "";	
		}
		
		$paypal_form	.= $discount_inp;
		
		//--------------------------------------------------------------------------// ORDER HISTORY
		$user = $session->getSessionValue("user_login");
		if($user){
			// $order_history_json_string = json_encode((object)$orders_array);
			$db->update_unique_record("users", "orderhistory", "email", $user, $orders_array);
		}
		//--------------------------------------------------------------------------//
		$custom_variable = json_encode(array("delivery_date"=>$delivery_date, "product_ids"=>$product_ids));
		$paypal_form .= $address_override_inputs;
		$paypal_form .= "<input type='hidden' name='shipping_1' value='".$delivery_price."' />
						<input type='hidden' name='custom' value='$custom_variable' />
						<input type='hidden' name='currency_code' value='GBP' />
						<input type='hidden' name='image_url' value='http://www.ownster.co.uk/logo150x43.png' />
						<input type='hidden' name='business' value='".$business_email."' />
						</form>";
		// echo $delivery_price;
		
		$vouch_code = $session->getSessionValue("redeemed_voucher");
		if($vouch_code){
			mysql_query("UPDATE vouchers SET redeemed = 1 WHERE voucher_code = '".$vouch_code."'");	// Mark voucher as redeemed	
			$session->deleteSessionKey("redeemed_voucher");
			$session->deleteSessionKey("discount");
			$session->deleteSessionKey("orders_in_cart");
			$session->deleteSessionKey("orders_from_history");
			$session->deleteSessionKey("discount_product_id");
			$session->deleteSessionKey("discount_product_name");
			$session->deleteSessionKey("num_of_discounts");
			$session->deleteSessionKey("discount_price");
			$session->deleteSessionKey("discount_percent");
		} else {
			$session->deleteSessionKey("orders_in_cart");
			$session->deleteSessionKey("orders_from_history");	
		}
		
		recordMemoryUsage("ShoppingCart.php -> Submit_payment -> echo paypal_form");
		// Save Statistics of User's Session
		
		$session_data = $_SESSION;
		// Append data from $_SESSION["user_system"] to the end of $_SESION array 
		if (isset($session_data["user_system"])) {
			$system_data = $session_data["user_system"];
			unset($session_data["user_system"]);
			$session_data += $system_data;

		} 
		
		saveUserBrowsingHistory( $session_data + array("order"=>json_encode($orders_array)) + $_POST + array("payment_date"=>date("Y-m-d H:i:s")) );

		echo json_encode(array("error"=>false, "form"=>$paypal_form));				
	} else {
		recordMemoryUsage("ShoppingCart.php -> Submit_payment -> Error. indiv_orders not array or <= 0");
		echo json_encode(array("error"=>true, "error_msg"=>"Error. Unable to submit data to paypal."));
	}
}

//---------------------------------------------------------------------------------
// 
function returnMovedDirPath($fullpath, $old_dir, $new_dir){
	$piecesA = explode("/", $fullpath);
    $piecesB = explode("/", $old_dir);
    $diff = array_diff($piecesA, $piecesB);
    return $new_dir.implode("/", $diff);
}

//-----------------------------------------------------------------------//

function submitOrderToEmail($post, $session, $db){
	$fields			= "";
	$values			= "";
	$body			= "";
	$headers		= ""; 
	$head			= "<html><body style='font-family:Arial, Helvetica, sans-serif'>";
	$addr			= "";
	$value_names	= array();
	// $order_code		= $post["email_order"];
	$total_to_pay	= 0;
	$indiv_orders	= $post["email_order"]["order"];
	$delivery_date = $post["email_order"]["delivery"]["date"]." ".$post["email_order"]["delivery"]["month"]." ".$post["email_order"]["delivery"]["year"];
	$address_arr 	= validateAddress($post["email_order"]["address"]);
		
	// print_r($post["email_order"]);
			
	if(is_array($indiv_orders) && count($indiv_orders) > 0){
		$order_history_json_string = "";				// ORDER HISTORY
		$orders_array 	= array();		
		$total_items	= count($indiv_orders);
		// $db_id_qty_arr  = array();

		$body	.= "<p>";
		
		$items = $session->getSessionValue("orders_in_cart");

		if(isset($_SESSION["orders_in_cart"]) && isset($_SESSION["orders_from_history"])){
            $items = array_merge($_SESSION["orders_in_cart"], $_SESSION["orders_from_history"]);
        } else if(isset($_SESSION["orders_from_history"]) && !isset($_SESSION["orders_in_cart"])) {
            $items = $session->getSessionValue("orders_from_history");
        }
        
        if($items){
        	$i=0;
            foreach ($items as $product) {
                foreach ($product as $id=>$data) { 
			  		$product_db_id = $data["product_db_id"];
			  		$res = mysql_query("SELECT price, name FROM products WHERE id = $product_db_id");
			  		if($res){
			  			$price_name = mysql_fetch_assoc($res);
			  		}
                    $price = $price_name["price"];
                    $product_name = $price_name["name"];
                    $qty = $data["quantity"];
                    $subtotal = $price * $qty;
                    $product_pics = array();

                    if(is_dir("../user_upload/". $id ."/")){
	                   	move_file("../user_upload/". $id ."/", "../paid_orders/". $id ."/");
	                    // Save pathnames of thumbnails
	                    $default_pic = returnMovedDirPath($data["data"]["default_pic"]["url"], "/user_upload/$id/", "/paid_orders/$id/" );    
	                    foreach($data["data"] as $side){
	                    	if(is_object($side)){
	                    		// Save new path in orders history
							    $new_path = returnMovedDirPath($side->url, "/user_upload/$id/", "/paid_orders/$id/" );
		    					array_push($product_pics, array( "side_name"=>$side->side_name,
		    													 "side_picture"=>$new_path));
		    				}
		    			}
		    		}

	    			$body.= "Item ".($i+1).":&nbsp;&nbsp;&nbsp;".$qty." x Oyster Card Wallet <b style='color:#08A708'>".$id."</b><br/>";
	    			
					$one_order = (object)array(
									"order_id"=>$id,
									"order_db_id"=>$product_db_id,
									"order_qty"=>$qty,
									"order_date"=>date("d/m/Y"),
									"item_price"=>$price,
									"order_total_price"=>$subtotal,
									"product_name"=>$product_name,
									"product_thubnails"=>array("default_pic"=>$default_pic,
																 "all_pics"=>$product_pics));

					array_push($orders_array, $one_order);	
				}
				$i++;
			}
			recordMemoryUsage("ShoppingCart.php -> submitOrderToEmail -> if(items)");
		}

		/*for($i = 0, $total = count($indiv_orders); $i < $total; $i++){
			$id_qty_pair = explode(":|:", $indiv_orders[$i]);
			$body		.= "Item ".($i+1).":&nbsp;&nbsp;&nbsp;".$id_qty_pair[1]." x Oyster Card Wallet <b style='color:#08A708'>".$id_qty_pair[0]."</b><br/>";
							
			//------------------------------------------------------------------------------------------------------------------------------------------------// ORDER HISTORY					
			$mysql_order_history .= $id_qty_pair[0].">".date("d/m/Y").">".$id_qty_pair[1] .">0>0@";	
			move_file("../user_upload/". $id_qty_pair[0] ."/thumbnail/thumb.png", "../paid_orders/". $id_qty_pair[0] ."/thumbnail/thumb.png");
			move_file("../user_upload/". $id_qty_pair[0] ."/TO_PRINT/main_img.png", "../paid_orders/". $id_qty_pair[0] ."/TO_PRINT/".$id_qty_pair[0].".png");
	
		}*/
		$body	.= "</p>";
		
		if(isset($post["email_order"]["address"]["email"])){
			$payer_email	= $post["email_order"]["address"]["email"];
			$headers		= "From: ".$payer_email."\r\n";
			$body		   .= "e-mail: <b>".$payer_email."</b><br/>";
		}
		
		$vouch_code	 = $session->getSessionValue("redeemed_voucher");
		if($vouch_code){
			$vouch_code_defis = substr_replace($vouch_code, "-", 4, 0);
			$body .= "Voucher Code: <b>".$vouch_code_defis."</b><br/>";
		}
		
		if(is_array($address_arr)){
			$addr .= $address_arr["fullname"]."<br/>"
					.$address_arr["address1"]."<br/>";
					
			if(isset($address_arr["address2"])) 
				$addr .= $address_arr["address2"]."<br/>";
			
				
			$addr .= $address_arr["city"]."<br/>"
					.$address_arr["postcode"]."<br/>"
					.$address_arr["country"]."<br/>";
					
			$fields	.= "first_name";		$values	.= "'".$address_arr["name"]."'";
			$fields	.= ",last_name";		$values	.= ",'".$address_arr["lname"]."'";
			$fields	.= ",address_street";	$values	.= (isset($address_arr["address2"])) ? ",'".$address_arr["address1"]." ".$address_arr["address2"]."'" : ",'".$address_arr["address1"]."'" ;
			$fields	.= ",address_city";		$values	.= ",'".$address_arr["city"]."'";
			$fields	.= ",address_zip";		$values	.= ",'".$address_arr["postcode"]."'";
			$fields	.= ",address_country";	$values	.= ",'".$address_arr["country"]."'";
			$fields	.= ",payer_email";		$values	.= ",'$payer_email'";
			
			
		}
		
		if($vouch_code){
			$fields	.= ",voucher_code";
			$values	.= ",'$vouch_code'";
			$vr = mysql_query("SELECT v_selling_price FROM vouchers WHERE voucher_code = '$vouch_code'");
			if($vr){
				$vouch_price = @mysql_result($vr, 0);
				$fields .= ",mc_gross";
				$values .= ",".$vouch_price;
			}
		}

		$datetime	= date("Y-m-d H:i:s"); //YYYY-MM-DD HH:MM:SS
		$fields		.= ",payment_date";	$values	.= ",'$datetime'";
					
		//------------------------------------------------------------------------------------------------------------------------- Generate Order Number
		
		do {
			$order_number	= orderNumberGen(8);
			$result			= mysql_query("SELECT order_number FROM completed_payments WHERE order_number = '$order_number'");
		} while(mysql_num_rows($result) > 0);
		
		/*$orders_json_array = array();
		for($i = 0, $total = count($indiv_orders); $i < $total; $i++){
			$id_qty_pair = explode(":|:", $indiv_orders[$i]);
			array_push( $orders_json_array, (object)array( "item_id"=>$id_qty_pair[0], "qty"=>$id_qty_pair[1]));
		}

		$orders	 = json_encode( $orders_json_array );  //str_ireplace(":|:","[><]", implode("[**]", $indiv_orders));*/
		$fields .= ",items";
		$values .= ",'$orders'";
		
		$fields .= ",order_number";
		$values .= ",'$order_number'";

		// Save Statistics of User's Session
		
		$session_data = $_SESSION;
		// Addend data from $_SESSION["user_system"] to the end of $_SESION array 
		if (isset($session_data["user_system"])) {
			$system_data = $session_data["user_system"];
			unset($session_data["user_system"]);
			$session_data += $system_data;

		} 
		
		saveUserBrowsingHistory( $session_data + array("order"=>json_encode($orders_array)) + $_POST + array("payment_date"=>date("Y-m-d H:i:s")) );
		// Write into DB
		
		if(!mysql_query("INSERT INTO completed_payments ($fields) VALUES($values)")){
			sendMail("dimi@inbox.com", "OWNSTER ERROR ShoppingCartServer.php", "".mysql_error()." --- Fields = ".$fields."\nvalues = ".$values, "Dima", "dima@mellowpixels.com");
		}
		
		sendOrderConfirmation($address_arr["name"], $address_arr["lname"], $payer_email, $addr, $delivery_date, $order_number, $vouch_code, $orders_array, $db);
	
		//-------------------------------------------------------------------------------------------------------------------------
		
		$body		.= "</p><p><b>Please send my order to:</b><br/><br/>".$addr."</p>";
		
		$body = $head.$body."</body></html>";
		
		//--------------------------------------------------------------------------// ORDER HISTORY
		$user = $session->getSessionValue("user_login");
		if($user){
			// $order_history_json_string = json_encode((object)$orders_array);
			$db->update_unique_record("users", "orderhistory", "email", $user, $orders_array);
		}
		//--------------------------------------------------------------------------//				
		
		
		if($vouch_code){
			mysql_query("UPDATE vouchers SET redeemed = 1 WHERE voucher_code = '".$vouch_code."'");	// Mark voucher as redeemed	
			$session->deleteSessionKey("redeemed_voucher");
			$session->deleteSessionKey("discount");
			$session->deleteSessionKey("orders_in_cart");
			$session->deleteSessionKey("orders_from_history");
			$session->deleteSessionKey("discount_product_id");
			$session->deleteSessionKey("discount_product_name");
			$session->deleteSessionKey("num_of_discounts");
			$session->deleteSessionKey("discount_price");
			$session->deleteSessionKey("discount_percent");
		}
		
    	$headers .= "Content-type: text/html\r\n";
		
		mail(getContactEmail()/**/, "Ownster.co.uk NEW ORDER", $body, $headers);
		
		recordMemoryUsage("ShoppingCart.php -> submitOrderToEmail -> end of function");
		echo json_encode( array( "address" => $address_arr ));
	} else {
		recordMemoryUsage("ShoppingCart.php -> submitOrderToEmail -> Error indiv_orders not array or <= 0");
		echo "alert:|ERROR #2 Detected!";	
	}
}

function sendOrderConfirmation($first_name, $last_name, $payer_email, $address, $delivery_date, $order_number, $vouch_code, $orders_array, $db){
	/*$one_order = (object)array(
									"order_id"=>$id,
									"order_qty"=>$qty,
									"order_date"=>date("d/m/Y"),
									"item_price"=>$price,
									"order_total_price"=>$subtotal,
									"product_name"=>$product_name;
									"product_thubnails"=>array("default_pic"=>$default_pic,
																 "all_pics"=>$product_pics));

					array_push($orders_array, $one_order);	*/
	// print_r($orders_array);
	$items_info	= "";
	$email_body = "<html><body style='font-family:Arial, Helvetica, sans-serif; font-size:12px'>";
	
	// Items info
	for($i = 0, $tot = count($orders_array); $i < $tot; $i++){
		
		$items_info .= "<p>".($i+1)." <span>".$orders_array[$i]->product_name."</span><span style='margin-left:162px;'>".$orders_array[$i]->order_id."</span><span style='margin-left:120px;'>".$orders_array[$i]->order_qty."</span></p>";
	}
	
	$vouch_code = substr_replace($vouch_code, "-", 4, 0);
	
	//------------------------------------------------------------ Create Confirmation Email Body	
	$email_body .= (isset($first_name) && isset($last_name)) ? "<h3>Hello, $first_name $last_name!</h3>" : "<h3>Hello!</h3>";
	
	$email_body .= 
	"<table border='0' width='698' align='center' style='font-family:Arial, Helvetica, sans-serif; font-size:12px;'>
		<tr>
			<td colspan='2'>
				<p>Thank you for redeeming you voucher with Ownster. Your order will be sent by us within the next 24 hours. If you have any questions about your order please contact us at <a href='mailto:support@ownster.co.uk?Subject=Question%20About%20The%20Order.'>support@ownster.co.uk</a></p>
			   <p>Below are your order details.</p>
			   <p style='font-size:14px'>Your Order <b>#$order_number</b></p>
			</td>
		</tr>
		<tr height='150'>
			<td width='338'>	
			   <div style='border: solid thin #49af17; height:150px;'>
					<div style='display:block; padding:5px; background-color:#49af17; color:#fff;'><b>Shipping Information:</b></div>
					<div style='padding:5px;'><p>$address</p></div>
				</div>
			</td>
			<td width='338'>	
			   <div style='border: solid thin #49af17; height:150px;'>
					<div style='display:block; padding:5px; background-color:#49af17; color:#fff;'><b>Payment information:</b></div>
					<div style='padding:5px;'><p>Order is paid in full.</p><p>Voucher Code: $vouch_code</p><b style='font-size:14'>Payer Email: $payer_email</b></div>
				</div>
			</td>
		</tr>
		<tr height='105'>
			<td width='338'>
			   <div style='border: solid thin #49af17; height:75px; margin-top:10px;'>
					<div style='display:block; padding:5px; background-color:#49af17; color:#fff;'><b>Estimated delivery date:</b></div>
					<div style='padding:5px;'><p>$delivery_date</p></div>
				</div>
			</td>
			<td width='338'>   
			   <div style='border: solid thin #49af17;  height:75px; margin-top:10px;'>
					<div style='display:block; padding:5px; background-color:#49af17; color:#fff;'><b>Shipping Method:</b></div>
					<div style='padding:5px;'><p>International Standard (via Royal Mail) - Not Tracked</p></div>
				</div>
			</td>
		</tr>
		<tr>
			<td colspan='2'>
				<div style='border: solid thin #49af17; height:75px;'>
					<div style='display:block; background-color:#49af17; color:#fff; text-decoration:none;'><b><span>Item:</span><span style='margin-left: 320px;'>Item Number.</span><span style='margin-left:195px;'>Qty.</span></b></div>
					<div style='padding:5px;'>$items_info</div>
				</div>
			</td>
		</tr>
		<tr>
			<td colspan='2' height='50'>
				<div style='text-align:center; display:block; height:50px; background-color:#49af17; color:#fff; text-decoration:none; margin-top:4px;'>
					<p>Thank you again, Ownster.co.uk</p>
				</div>
			</td>
		</tr>
		</table>		
</body>
</html>";
	
	sendMail($payer_email, "Order Confirmation", $email_body, "Ownster", "sales@ownster.co.uk");
	// sendMail("sales@ownster.co.uk", "Order Confirmation", $email_body, "Ownster", "sales@ownster.co.uk");
	sendMail("sales@ownster.co.uk", "Order Confirmation", $email_body, $payer_email, "sales@ownster.co.uk");
	sendMail("mellowpixels@gmail.com", "Order Confirmation", $email_body, $payer_email, "sales@ownster.co.uk");
	
}

//-----------------------------	REMOVE FROM SHOPPING CART	---------------------------//

if(isset($_POST["removeFromCart"])){
//	echo $_POST["Remove_item"];
	removeFromCart($_POST["removeFromCart"], $session, true);
	// removeFromCart($_POST["removeFromCart"], $session, false);
//	echo "alert:|". $_POST["Remove_item"];
}

function removeFromCart($product_id, $session, $delete_files){
	$orders = $_SESSION["orders_in_cart"];
	$orders_from_h = $_SESSION["orders_from_history"];

	foreach ($orders as $key=>$val) {
		if( array_key_exists($product_id, $val) ){
			$dir_name = dirname($val[$product_id]["data"][0]->url);
			if(strlen($dir_name) > 5 && is_dir("..".$dir_name)){
				if($delete_files){
					rrmdir("..".$dir_name);
				}
			}

			unset($orders[$key]);
			array_values($orders);
		}
	}
	$_SESSION["orders_in_cart"] = $orders;

	foreach ($orders_from_h as $key=>$val) {
		if( array_key_exists($product_id, $val) ){
			unset($orders_from_h[$key]);
			array_values($orders_from_h);
		}
	}
	$_SESSION["orders_from_history"] = $orders_from_h;
	
}


function sendMail($recipient, $subject, $body, $senderName, $senderEmail){
	
	$header			= "Content-type: text/html\r\n";
	$header		   .= "From: ". $senderName . " <" . $senderEmail . ">\r\n";
	
	mail($recipient, $subject, $body, $header);
}

//-------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------
function newVoucherCode( $length ){
	$output 	= '';
	$roulete	= array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
						'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
						'U', 'V', 'W', 'X', 'Y', 'Z',
						'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', );
						
	if( shuffle($roulete) ){
		for($i = 0; $i < $length; $i++){
			
			$output .= $roulete[$i];
				
		}
		
		return $output;	
	} else {
		return false;	
	}
}

//-------------------------------------------------------------------------------------------------

function voucherGen($post_val){
	$vaucher_qty		= $post_val["new_voucher"];
	$voucher_output 	= '';
	$discount_db_field	= '';
	$exp_date			= false;
	
	//--------------------------------------// check if discount is set in pounds or percents
	if(isset($post_val["discount_price"])){
		$discount_value		= $post_val["discount_price"];
		$discount_db_field	= 'discount_price';
		
	} else if(isset($post_val["discount_percent"])){
		$discount_value		= $post_val["discount_percent"];
		$discount_db_field = 'discount_percent';
	}
	
	// Price of the voucher on ebay/amazon
	if(isset($post_val['v_sell_price'])){
		$voucher_selling_price = $post_val['v_sell_price'];	
	}

	//-------------------------------------// check if expiration date is set. Convert date format from MM/DD/YYYY to YYYY/MM/DD
	if(isset($post_val['exp_date'])){
		$exp_date = $post_val['exp_date'];	
	}
	//-------------------------------------// Get Number of discounts per voucher
	if(isset($_POST['num_of_disc'])){
		$num_of_discount	= $_POST['num_of_disc'];
	}
	
	//-------------------------------------// Get Number of discounts per voucher
	if(isset($_POST['product_id'])){
		$product_id = $_POST['product_id'];
	}
	
	//-------------------------------------// save new vouchers into database 
	
	for($i = 0; $i < $vaucher_qty; $i++ ){

		if(isset($_POST['voucher_name'])){
			$vouch_code = strtoupper(preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['voucher_name']));
		} else {
			$vouch_code	= newVoucherCode(8);	
		}
		
		if($exp_date){

			$query = mysql_query( "INSERT INTO vouchers (voucher_code, ".$discount_db_field.", v_selling_price, expires_date, num_of_discounts) VALUES('".$vouch_code."', ".$discount_value.", $voucher_selling_price, '".$exp_date."', 0)" );
		} else {
			$query = mysql_query( "INSERT INTO vouchers (voucher_code, ".$discount_db_field.", v_selling_price, num_of_discounts) VALUES('".$vouch_code."', ".$discount_value.", $voucher_selling_price, ".$num_of_discount.")" );	
		}
		
		if(!$query){
			if(mysql_errno() == '1062'){ // if voucher code already exists -> decrement $i
				$i =-1;
			} else echo mysql_error();
		}
	}
	
	echo getVouchers();
}

//----------------------------------------------------------------------------------------//

function getVouchers(){
	$voucher_output = '';
	$exp_date		= '';
	$expired		= 0;
	
	$result = mysql_query( "SELECT * FROM vouchers ORDER BY id" );
	if($result){
		if(mysql_num_rows($result) > 0){
			while($row = mysql_fetch_assoc($result)){
				$expired		= 0;
				
				if( is_null($row['discount_percent']) )
					$row['discount_percent'] = "NA";
				if( is_null($row['discount_price']) )
					$row['discount_price'] = "NA";
				
				if($row['expires_date'] == NULL){
					$row['expires_date'] = "NA";
					$row['voucher_code'] = substr($row['voucher_code'], 0, 4)."-".substr($row['voucher_code'], 4, 4);
				} else {
					
					$expires	= strtotime($row['expires_date']);
					$today		= strtotime(date("Y-m-d"));
			
					if($today >= $expires && $row['expires_date'] != NULL){
						$expired = 1;
					} else $expired = 0;
					
					$exp_date = explode("-", $row['expires_date']);
					$row['expires_date'] = $exp_date[2]."/".$exp_date[1]."/".$exp_date[0];
				}
				
				$voucher_output .=	 $row['id']."[$%£Sub]"
									.$row['voucher_code']."[$%£Sub]"
									.$row['discount_price']."[$%£Sub]"
									.$row['discount_percent']."[$%£Sub]"
									.$row['expires_date']."[$%£Sub]"
									.$row['redeemed']."[$%£Sub]"
									.$row['voucher_owner']."[$%£Sub]"
									.$row['issued']."[$%£Sub]"
									.$expired."[$%£Sub]"
									.$row['num_of_discounts']."[$%£Sub]"
									.$row["v_selling_price"]."[$%£Sub]"
									."[$%£§]";	
			}
		} else return "value:|No Vauchers";
	} else return "value:|".mysql_error();
	
	$voucher_output = substr($voucher_output, 0, -8);
	return"multyarray:|".$voucher_output;	
}

//----------------------------------------------------------------------------------------//
function numOfDiscounts($session){
	$num_disc	= $session->getSessionValue("num_of_discounts");
	if($num_disc){
		return $num_disc;
	} else return "undefined";
}
//----------------------------------------------------------------------------------------//

function redeemVoucher($vouch_code){
	$reg_exp		= "/[a-z0-9]/i";
	preg_match_all($reg_exp, $vouch_code, $match);
	
	if(count($match) > 0){
		$vouch_code = strtoupper(implode($match[0]));
		$result		= mysql_query( "SELECT voucher_code, discount_price, discount_percent, expires_date, redeemed, num_of_discounts FROM vouchers WHERE voucher_code = '".$vouch_code."'" );
		
		if( mysql_num_rows($result) ){
			$data		= mysql_fetch_assoc($result);
			$expires	= strtotime($data['expires_date']);
			$today		= strtotime(date("Y-m-d"));


			if($today <= $expires || $data['expires_date'] == NULL){
				if($data['redeemed'] == 0){	
					if($data['discount_price'] != NULL){
						$_SESSION["discount_price"] = $data['discount_price'];
						if(isset($_SESSION["discount_percent"])){
							unset($_SESSION["discount_percent"]);
						}
					} else if($data['discount_percent'] != NULL) {
						$_SESSION["discount_percent"] = $data['discount_percent'];
						if(isset($_SESSION["discount_price"])){
							unset($_SESSION["discount_price"]);
						}
					}

					$_SESSION["num_of_discounts"] = ($data['expires_date'] == NULL) ? $data["num_of_discounts"] : "@8@";
					$_SESSION["redeemed_voucher"] = ($data['expires_date'] == NULL) ? $vouch_code : $vouch_code."exp. Date:".$data['expires_date'];
					echo json_encode(array("error"=>false, "notice"=>false, "success"=>true));
			//		mysql_query("UPDATE vouchers SET redeemed = 1 WHERE voucher_code = '".$vouch_code."'");
					
				} else echo json_encode(array("notice"=>true, "notice_msg"=>"The voucher code you have entered has already been redeemed."));
			} else echo json_encode(array("notice"=>true, "notice_msg"=>"The voucher code you have entered has expired."));
			
		} else echo json_encode(array("notice"=>true, "notice_msg"=>"The voucher code you have entered is incorrect."));
	}	
}

//----------------------------------------------------------------------------------------//

function deleteExpired(){
	$today		= date("Y-m-d");
	if(mysql_query("DELETE FROM vouchers WHERE redeemed = 1 OR expires_date < '".$today."'")){
		echo getVouchers();
	} else echo "alert:|".mysql_error();
}

//----------------------------------------------------------------------------------------//

function checkDiscount($session){
	$discount	= $session->getSessionValue("discount");
	if($discount){
		return $discount;
	} else return "undefined";
}

function getDiscountInfo($session){
	$discount = $_SESSION["discount_price"] || $_SESSION["discount_percent"];
	if($discount){
		$d_val = 0;
		$d_type = "na";

		if(isset($_SESSION["discount_percent"])){
			$d_val = $_SESSION["discount_percent"];
			$d_type = "percent";
		} else if(isset($_SESSION["discount_price"])){
			$d_val = $_SESSION["discount_price"];
			$d_type = "price";
		}

		echo json_encode(array(	"discount"=> true,
								"discount_value"=> $d_val,
								"discount_type"=> $d_type,
								"num_of_discounts"=> $session->getSessionValue("num_of_discounts")));
	} else {
		echo json_encode(array("discount"=>false));
	}
}

//----------------------------------------------------------------------------------------//

function changeOwner($post_vals){
	$new_name	= $post_vals['change_owner'];
	$vouch_id	= $post_vals['id'];
	
	if(!mysql_query("UPDATE vouchers SET voucher_owner='".$new_name."' WHERE id='".$vouch_id."' ")){
		echo mysql_error();
	} else echo "ok";	
}

//----------------------------------------------------------------------------------------//

function markVoucher($post_vals){
	$new_val	= $post_vals['mark_voucher'];
	$vouch_id	= $post_vals['id'];
	
	if( mysql_query( "UPDATE vouchers SET issued = $new_val WHERE id = '".$vouch_id."'" ) )
		 echo "ok";
	else echo "alert:|".mysql_error(); 
}

//----------------------------------------------------------------------------------------//

function deleteVaucher($id){
	if( mysql_query( "DELETE FROM vouchers WHERE id='".$id."'" ) )
		 echo "ok";
	else echo "alert:|".mysql_error();
		
}

//----------------------------------------------------------------------------------------//
function deleteMultiple($ids){
	$id_arr		= explode("ID", $ids);
	$deleted_id = '';
	
	for($i = 0, $tot = count($id_arr); $i < $tot; $i++){
		if( mysql_query( "DELETE FROM vouchers WHERE id = '".$id_arr[$i]."'" ) )
			$deleted_id .= $id_arr[$i]."[$%£§]";
	}
	
	echo "securearray:|".$deleted_id;
}


function saveSetupToSession(&$session, $order_id, $key, $value){
								$orders_setup = $session->getSessionValue("orders_setup");
							
								if(!$orders_setup){
									$orders_setup = array();	
								}
							
								$order_setup_exists = false;
								foreach($orders_setup as &$wallet_settings){
									if($wallet_settings[0] == $order_id){
										$wallet_settings[$key] = $value;
										$order_setup_exists = true;
										break;
									}
								}
								
								if(!$order_setup_exists){
									array_push($orders_setup, array($order_id, $key=>$value));	
								}
								
								return $orders_setup;
							}

//-----------------------------------------------------------------------------------------

function update_quantity($session_var, $session_key, $order_id, $new_quantity){
	if(isset($_SESSION[$session_key])){
		$orders = $_SESSION[$session_key];
		foreach ($orders as $key=>$val) {
			if( array_key_exists($order_id, $val) ){
				$orders[$key][$order_id]["quantity"] = $new_quantity;
			}
		}
		$_SESSION[$session_key] = $orders;
	}
}

//-----------------------------------------------------------------------------------------


function createAddressInputs($subm_data){
	$reg_exp = new RegExpTest();
	$error			= false;
	$address_input	= "";
	
	if($reg_exp->name_test($subm_data['name'])){
		$address_input .= "<input type='hidden' name='first_name' value='".$subm_data['name']."' />";
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->name_test($subm_data['lastname'])){
		$address_input .= "<input type='hidden' name='last_name' value='".$subm_data['lastname']."' />";
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->address_test($subm_data['address'])){
		$address_input .= "<input type='hidden' name='address1' value='".$subm_data['address']."' />";
	} else {
		$error = $error ||true;
	}
	
	if(isset($subm_data['address2'])){
		if($reg_exp->address_test($subm_data['address2']) || strlen($subm_data['address2']) == 0){
			if(strlen($subm_data['address2']) > 1){
				$address_input .= "<input type='hidden' name='address2' value='".$subm_data['address2']."' />";
			}
		} else {
			$error = $error ||true;
		}
	}

	if($reg_exp->address_test($subm_data['city'])){
		$address_input .= "<input type='hidden' name='city' value='".$subm_data['city']."'/>";
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->address_test($subm_data['postcode'])){
		$address_input .= "<input type='hidden' name='zip' value='".$subm_data['postcode']."'/>";
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->address_test($subm_data['country'])){
		switch($subm_data['country']){
			case "United Kingdom":	$country_code = "GB"; break;
			case "Ireland":			$country_code = "IE"; break;
			case "Afghanistan":		$country_code = "AF"; break;
			case "Åland Islands":	$country_code = "AX"; break;
			case "Albania":			$country_code = "AL"; break;
			case "Algeria":			$country_code = "DZ"; break;
			case "American Samoa":	$country_code = "AS"; break;
			case "Andorra":			$country_code = "AD"; break;
			case "Angola":			$country_code = "AO"; break;
			case "Anguilla":		$country_code = "AI"; break;
			case "Antarctica":			$country_code = "AQ"; break;
			case "Antigua and Barbuda":			$country_code = "AG"; break;
			case "Argentina":			$country_code = "AR"; break;
			case "Armenia":			$country_code = "AM"; break;
			case "Aruba":			$country_code = "AW"; break;
			case "Australia":			$country_code = "AU"; break;
			case "Austria":			$country_code = "AT"; break;
			case "Azerbaijan":			$country_code = "AZ"; break;
			case "Bahamas":			$country_code = "BS"; break;
			case "Bahrain":			$country_code = "BH"; break;
			case "Bangladesh":			$country_code = "BD"; break;
			case "Barbados":			$country_code = "BB"; break;
			case "Belarus":			$country_code = "BY"; break;
			case "Belgium":			$country_code = "BE"; break;
			case "Belize":			$country_code = "BZ"; break;
			case "Benin":			$country_code = "BJ"; break;
			case "Bermuda":			$country_code = "BM"; break;
			case "Bhutan":			$country_code = "BT"; break;
			case "Bolivia":			$country_code = "BO"; break;
			case "Bosnia and Herzegovina":			$country_code = "BA"; break;
			case "Botswana":			$country_code = "BW"; break;
			case "Bouvet Island":			$country_code = "BV"; break;
			case "Brazil":			$country_code = "BR"; break;
			case "British Indian Ocean Territory":			$country_code = "IO"; break;
			case "Brunei Darussalam":			$country_code = "BN"; break;
			case "Bulgaria":			$country_code = "BG"; break;
			case "Burkina Faso":			$country_code = "BF"; break;
			case "Burundi":			$country_code = "BI"; break;
			case "Cambodia":			$country_code = "KH"; break;
			case "Cameroon":			$country_code = "CM"; break;
			case "Canada":			$country_code = "CA"; break;
			case "Cape Verde":			$country_code = "CV"; break;
			case "Cayman Islands":			$country_code = "KY"; break;
			case "Central African Republic":			$country_code = "CF"; break;
			case "Chad":			$country_code = "TD"; break;
			case "Chile":			$country_code = "CL"; break;
			case "China":			$country_code = "CN"; break;
			case "Christmas Island":			$country_code = "CX"; break;
			case "Cocos (Keeling) Islands":			$country_code = "CC"; break;
			case "Colombia":			$country_code = "CO"; break;
			case "Comoros":			$country_code = "KM"; break;
			case "Congo":			$country_code = "CG"; break;
			case "Congo, the Democratic Republic of the":			$country_code = "CD"; break;
			case "Cook Islands":			$country_code = "CK"; break;
			case "Costa Rica":			$country_code = "CR"; break;
			case "Côte D'Ivoire":			$country_code = "CI"; break;
			case "Croatia":			$country_code = "HR"; break;
			case "Cuba":			$country_code = "CU"; break;
			case "Cyprus":			$country_code = "CY"; break;
			case "Czech Republic":			$country_code = "CZ"; break;
			case "Denmark":			$country_code = "DK"; break;
			case "Djibouti":			$country_code = "DJ"; break;
			case "Dominica":			$country_code = "DM"; break;
			case "Dominican Republic":			$country_code = "DO"; break;
			case "Ecuador":			$country_code = "EC"; break;
			case "Egypt":			$country_code = "EG"; break;
			case "El Salvador":			$country_code = "SV"; break;
			case "Equatorial Guinea":			$country_code = "GQ"; break;
			case "Eritrea":			$country_code = "ER"; break;
			case "Estonia":			$country_code = "EE"; break;
			case "Ethiopia":			$country_code = "ET"; break;
			case "Falkland Islands (Malvinas)":			$country_code = "FK"; break;
			case "Faroe Islands":			$country_code = "FO"; break;
			case "Fiji":			$country_code = "FJ"; break;
			case "Finland":			$country_code = "FI"; break;
			case "France":			$country_code = "FR"; break;
			case "French Guiana":			$country_code = "GF"; break;
			case "French Polynesia":			$country_code = "PF"; break;
			case "French Southern Territories":			$country_code = "TF"; break;
			case "Gabon":			$country_code = "GA"; break;
			case "Gambia":			$country_code = "GM"; break;
			case "Georgia":			$country_code = "GE"; break;
			case "Germany":			$country_code = "DE"; break;
			case "Ghana":			$country_code = "GH"; break;
			case "Gibraltar":			$country_code = "GI"; break;
			case "Greece":			$country_code = "GR"; break;
			case "Greenland":			$country_code = "GL"; break;
			case "Grenada":			$country_code = "GD"; break;
			case "Guadeloupe":			$country_code = "GP"; break;
			case "Guam":			$country_code = "GU"; break;
			case "Guatemala":			$country_code = "GT"; break;
			case "Guernsey":			$country_code = "GG"; break;
			case "Guinea":			$country_code = "GN"; break;
			case "Guinea-Bissau":			$country_code = "GW"; break;
			case "Guyana":			$country_code = "GY"; break;
			case "Haiti":			$country_code = "HT"; break;
			case "Heard Island and Mcdonald Islands":			$country_code = "HM"; break;
			case "Holy See (Vatican City State)":			$country_code = "VA"; break;
			case "Honduras":			$country_code = "HN"; break;
			case "Hong Kong":			$country_code = "HK"; break;
			case "Hungary":			$country_code = "HU"; break;
			case "Iceland":			$country_code = "IS"; break;
			case "India":			$country_code = "IN"; break;
			case "Indonesia":			$country_code = "ID"; break;
			case "Iran, Islamic Republic of":			$country_code = "IR"; break;
			case "Iraq":			$country_code = "IQ"; break;
			case "Ireland":			$country_code = "IE"; break;
			case "Isle of Man":			$country_code = "IM"; break;
			case "Israel":			$country_code = "IL"; break;
			case "Italy":			$country_code = "IT"; break;
			case "Jamaica":			$country_code = "JM"; break;
			case "Japan":			$country_code = "JP"; break;
			case "Jersey":			$country_code = "JE"; break;
			case "Jordan":			$country_code = "JO"; break;
			case "Kazakhstan":			$country_code = "KZ"; break;
			case "KENYA":			$country_code = "KE"; break;
			case "Kiribati":			$country_code = "KI"; break;
			case "Korea, Democratic People's Republic of":			$country_code = "KP"; break;
			case "Korea, Republic of":			$country_code = "KR"; break;
			case "Kuwait":			$country_code = "KW"; break;
			case "Kyrgyzstan":			$country_code = "KG"; break;
			case "Lao People's Democratic Republic":			$country_code = "LA"; break;
			case "Latvia":			$country_code = "LV"; break;
			case "Lebanon":			$country_code = "LB"; break;
			case "Lesotho":			$country_code = "LS"; break;
			case "Liberia":			$country_code = "LR"; break;
			case "Libyan Arab Jamahiriya":			$country_code = "LY"; break;
			case "Liechtenstein":			$country_code = "LI"; break;
			case "Lithuania":			$country_code = "LT"; break;
			case "Luxembourg":			$country_code = "LU"; break;
			case "Macao":			$country_code = "MO"; break;
			case "Macedonia, the Former Yugoslav Republic of":			$country_code = "MK"; break;
			case "Madagascar":			$country_code = "MG"; break;
			case "Malawi":			$country_code = "MW"; break;
			case "Malaysia":			$country_code = "MY"; break;
			case "Maldives":			$country_code = "MV"; break;
			case "Mali":			$country_code = "ML"; break;
			case "Malta":			$country_code = "MT"; break;
			case "Marshall Islands":			$country_code = "MH"; break;
			case "Martinique":			$country_code = "MQ"; break;
			case "Mauritania":			$country_code = "MR"; break;
			case "Mauritius":			$country_code = "MU"; break;
			case "Mayotte":			$country_code = "YT"; break;
			case "Mexico":			$country_code = "MX"; break;
			case "Micronesia, Federated States of":			$country_code = "FM"; break;
			case "Moldova, Republic of":			$country_code = "MD"; break;
			case "Monaco":			$country_code = "MC"; break;
			case "Mongolia":			$country_code = "MN"; break;
			case "Montenegro":			$country_code = "ME"; break;
			case "Montserrat":			$country_code = "MS"; break;
			case "Morocco":			$country_code = "MA"; break;
			case "Mozambique":			$country_code = "MZ"; break;
			case "Myanmar":			$country_code = "MM"; break;
			case "Namibia":			$country_code = "NA"; break;
			case "Nauru":			$country_code = "NR"; break;
			case "Nepal":			$country_code = "NP"; break;
			case "Netherlands":			$country_code = "NL"; break;
			case "Netherlands Antilles":			$country_code = "AN"; break;
			case "New Caledonia":			$country_code = "NC"; break;
			case "New Zealand":			$country_code = "NZ"; break;
			case "Nicaragua":			$country_code = "NI"; break;
			case "Niger":			$country_code = "NE"; break;
			case "Nigeria":			$country_code = "NG"; break;
			case "Niue":			$country_code = "NU"; break;
			case "Norfolk Island":			$country_code = "NF"; break;
			case "Northern Mariana Islands":			$country_code = "MP"; break;
			case "Norway":			$country_code = "NO"; break;
			case "Oman":			$country_code = "OM"; break;
			case "Pakistan":			$country_code = "PK"; break;
			case "Palau":			$country_code = "PW"; break;
			case "Palestinian Territory, Occupied":			$country_code = "PS"; break;
			case "Panama":			$country_code = "PA"; break;
			case "Papua New Guinea":			$country_code = "PG"; break;
			case "Paraguay":			$country_code = "PY"; break;
			case "Peru":			$country_code = "PE"; break;
			case "Philippines":			$country_code = "PH"; break;
			case "Pitcairn":			$country_code = "PN"; break;
			case "Poland":			$country_code = "PL"; break;
			case "Portugal":			$country_code = "PT"; break;
			case "Puerto Rico":			$country_code = "PR"; break;
			case "Qatar":			$country_code = "QA"; break;
			case "Réunion":			$country_code = "RE"; break;
			case "Romania":			$country_code = "RO"; break;
			case "Russian Federation":			$country_code = "RU"; break;
			case "Rwanda":			$country_code = "RW"; break;
			case "Saint Helena":			$country_code = "SH"; break;
			case "Saint Kitts and Nevis":			$country_code = "KN"; break;
			case "Saint Lucia":			$country_code = "LC"; break;
			case "Saint Pierre and Miquelon":			$country_code = "PM"; break;
			case "Saint Vincent and the Grenadines":			$country_code = "VC"; break;
			case "Samoa":			$country_code = "WS"; break;
			case "San Marino":			$country_code = "SM"; break;
			case "Sao Tome and Principe":			$country_code = "ST"; break;
			case "Saudi Arabia":			$country_code = "SA"; break;
			case "Senegal":			$country_code = "SN"; break;
			case "Serbia":			$country_code = "RS"; break;
			case "Seychelles":			$country_code = "SC"; break;
			case "Sierra Leone":			$country_code = "SL"; break;
			case "Singapore":			$country_code = "SG"; break;
			case "Slovakia":			$country_code = "SK"; break;
			case "Slovenia":			$country_code = "SI"; break;
			case "Solomon Islands":			$country_code = "SB"; break;
			case "Somalia":			$country_code = "SO"; break;
			case "South Africa":			$country_code = "ZA"; break;
			case "South Georgia and the South Sandwich Islands":			$country_code = "GS"; break;
			case "Spain":			$country_code = "ES"; break;
			case "Sri Lanka":			$country_code = "LK"; break;
			case "Sudan":			$country_code = "SD"; break;
			case "Suriname":			$country_code = "SR"; break;
			case "Svalbard and Jan Mayen":			$country_code = "SJ"; break;
			case "Swaziland":			$country_code = "SZ"; break;
			case "Sweden":			$country_code = "SE"; break;
			case "Switzerland":			$country_code = "CH"; break;
			case "Syrian Arab Republic":			$country_code = "SY"; break;
			case "Taiwan, Province of China":			$country_code = "TW"; break;
			case "Tajikistan":			$country_code = "TJ"; break;
			case "Tanzania, United Republic of":			$country_code = "TZ"; break;
			case "Thailand":			$country_code = "TH"; break;
			case "Timor-Leste":			$country_code = "TL"; break;
			case "Togo":			$country_code = "TG"; break;
			case "Tokelau":			$country_code = "TK"; break;
			case "Tonga":			$country_code = "TO"; break;
			case "Trinidad and Tobago":			$country_code = "TT"; break;
			case "Tunisia":			$country_code = "TN"; break;
			case "Turkey":			$country_code = "TR"; break;
			case "Turkmenistan":			$country_code = "TM"; break;
			case "Turks and Caicos Islands":			$country_code = "TC"; break;
			case "Tuvalu":			$country_code = "TV"; break;
			case "Uganda":			$country_code = "UG"; break;
			case "Ukraine":			$country_code = "UA"; break;
			case "United Arab Emirates":			$country_code = "AE"; break;
			case "United Kingdom":			$country_code = "GB"; break;
			case "United States":			$country_code = "US"; break;
			case "United States Minor Outlying Islands":			$country_code = "UM"; break;
			case "Uruguay":			$country_code = "UY"; break;
			case "Uzbekistan":			$country_code = "UZ"; break;
			case "Vanuatu":			$country_code = "VU"; break;
			case "Vatican City State":			$country_code = "VA"; break;
			case "Venezuela":			$country_code = "VE"; break;
			case "Viet Nam":			$country_code = "VN"; break;
			case "Virgin Islands, British":			$country_code = "VG"; break;
			case "Virgin Islands, U.S.":			$country_code = "VI"; break;
			case "Wallis and Futuna":			$country_code = "WF"; break;
			case "Western Sahara":			$country_code = "EH"; break;
			case "Yemen":			$country_code = "YE"; break;
			case "Zaire":			$country_code = "CD"; break;
			case "Zambia":			$country_code = "ZM"; break;
			case "Zimbabwe":		$country_code = "ZW"; break;
			default : 				$country_code = "GB"; break;
		}
		$address_input .= "<input type='hidden' name='country' value='$country_code'/>";
		
	} else {
		$error = $error ||true;
	}
		
	if(!$error){
		// $address_override_inputs = "<input type='hidden' name='address_override' value='1' />".$address_input;
		return "<input type='hidden' name='address_override' value='1' />".$address_input;
	} else {
		return false;
	}
}

//---------------------------	Validate Address	---------------------------//

function validateAddress($submited_data){
	$reg_exp = new RegExpTest();
	$error			= false;
	$address_array	= array();
	
	if($reg_exp->name_test($submited_data['name'])){
		$address_array["name"] = $submited_data['name'];
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->name_test($submited_data['lastname'])){
		$address_array["lname"] = $submited_data['lastname'];
	} else {
		$error = $error ||true;
	}
	
	if(isset($address_array["name"]) && isset($address_array["lname"])){
		$address_array["fullname"] = $submited_data['name'] ." ". $submited_data['lastname'];
	}
	
	if($reg_exp->address_test($submited_data['address'])){
		$address_array["address1"] = $submited_data['address'];
	} else {
		$error = $error ||true;
	}
	
	if(isset($submited_data['address2'])){
		if($reg_exp->address_test($submited_data['address2']) || strlen($submited_data['address2']) == 0){
			if(strlen($submited_data['address2']) > 1){
				if($submited_data['address2'] != "Address 2"){
					$address_array["address2"] = $submited_data['address2'];
				}
			}
		} else {
			$error = $error ||true;
		}
	}

	if($reg_exp->address_test($submited_data['city'])){
		$address_array["city"] = $submited_data['city'];
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->address_test($submited_data['postcode'])){
		$address_array["postcode"] = $submited_data['postcode'];
	} else {
		$error = $error ||true;
	}
	
	if($reg_exp->address_test($submited_data['country'])){
		$address_array["country"] = $submited_data['country'];
		
	} else {
		$address_array["country"] = "United Kingdom";
	}
	
	if(!$error){
		
		return $address_array;
	} else {
		return false;
	}
}

//---------------------------	Delete Folder Recursive		---------------------------//

function rrmdir($dir) {
   if (is_dir($dir)) {
     $objects = scandir($dir);
     foreach ($objects as $object) {
       if ($object != "." && $object != "..") {
         if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
       }
     }
     reset($objects);
     rmdir($dir);
   }
}

//---------------------------	Move File to new Dirrectory (recursively create new dirrectory if it doesn't exist)	---------------------------//
function move_file($src, $dst){
	/*$pos = strrpos($dst, "/");
	$dst = substr($dst, 0, $pos);

	$dir = opendir($src);
    @mkdir($dst);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                move_file($src . '/' . $file,$dst . '/' . $file);
            }
            else {
                copy($src . '/' . $file,$dst . '/' . $file);
            }
        }
    }
    closedir($dir);*/
	$pos = strrpos($dst, "/");
	$new_dir_path = substr($dst, 0, $pos);
	if(is_dir($new_dir_path)){
		rename($src, $dst);
		// copy($src, $dst);	
	} else {
		if(mkdir($new_dir_path, 0777, true)){
			rename($src, $dst);
			// copy($src, $dst);
		}
	}	
}

//---------------------------

function returnToken(){
	return $identity_token;
}
?>






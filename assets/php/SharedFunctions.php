<?php
ini_set("log_errors", 1);
date_default_timezone_set('Europe/London');
$date = date("d-m-y");

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/inc/DataBaseClass.php");

ini_set("error_log", "$root/error_log/php-error$date.log");


//---------------------------------------------------------------------------------
//
function returnFooterLinks(){
	$DBase = new DataBase();
	$response = array();

	$result = mysql_query("SELECT id, link_name FROM footer_links WHERE link_name IS NOT NULL ORDER BY id");
	if($result){
		while($row = mysql_fetch_assoc($result)){
			array_push($response, $row);	
		}
		return $response;
	} else {
		return false;	
	}
}

//---------------------------------------------------------------------------------
// 
function getReviews($start_pos, $num_records){
	$db = new DataBase();
	$reviews_data = array();

	$result = mysql_query("SELECT first_name, user_review FROM completed_payments WHERE active_review = 1 ORDER BY payment_date DESC LIMIT $start_pos, $num_records");
	if($result){
		// print_r($reviews_data);
		//---------------------------------------------------------------------------------
		while($row = mysql_fetch_assoc($result)){
			$data = json_decode(nl2br(preg_replace("/\n/m", '\n', $row["user_review"])));
			if(is_object($data) && property_exists($data, "review")){
				$data->first_name = $row["first_name"];
				array_push($reviews_data, (array)$data);
			}
		}
	  
		usort($reviews_data, 'date_compare');
		return $reviews_data;
	  
	} else { return false; }
}

function date_compare($a, $b){
  // print_r(strtotime($a["date"])."\n");
  $t1 = strtotime($a["date"]);
  $t2 = strtotime($b["date"]);
  return $t2 - $t1;
}

//---------------------------------------------------------------------------------
// Get the list of products from database 

function loadProducts($list=""){
    $result = mysql_query("SELECT id, place, name, price, description FROM products WHERE active > 0 $list ORDER BY place ASC");    
    if($result){
        while($row = mysql_fetch_assoc($result)){
            echo "<div class='product-cover-block' data-id='".$row["id"]."' data-name='".$row["name"]."' data-price='".$row["price"]."'>".$row["description"]."</div>";
        }
    } else {
        echo mysql_error();
    }
}

//---------------------------------------------------------------------------------
// 

function getProductSpecs($id){
	$DBase = new DataBase();
	$result = mysql_query("SELECT specs FROM products WHERE id = $id");
	if($result){
		$specs = mysql_result($result, 0);
		if( $specs ){	
			echo $specs;
		}
	}
}

//---------------------------------------------------------------------------------
// 

function outputBasketContent($session){
	$db = new DataBase();
    $items = $session->getSessionValue("orders_in_cart");

    $output = false;

    if(isset($_SESSION["orders_in_cart"]) && isset($_SESSION["orders_from_history"])){
        $items = array_merge($_SESSION["orders_in_cart"], $_SESSION["orders_from_history"]);
    } else if(isset($_SESSION["orders_from_history"]) && !isset($_SESSION["orders_in_cart"])) {
        $items = $session->getSessionValue("orders_from_history");
    }
    
    $discount_scheme = array();
    $result = mysql_query("SELECT discount_script FROM discount_scheme WHERE active = 1 ");
    if($result){
        while($row = mysql_fetch_assoc($result)){
            array_push($discount_scheme, json_decode($row["discount_script"]));
        }
    }
    if($items){
    	$output = array();
        foreach ($items as $product) {
            foreach ($product as $id=>$data) { 
                $product_db_id = $data["product_db_id"];
                $res = mysql_query("SELECT price FROM products WHERE id = $product_db_id");
                $price = mysql_result( $res, 0);
                $qty = $data["quantity"];

                if(is_array($discount_scheme) && count($discount_scheme) >0){
                    for($i = 0, $tot = count($discount_scheme); $i < $tot; $i++){
                        // If product number is in the scheme
                        if(in_array($product_db_id, $discount_scheme[$i]->affected_products)){
                            // Compare given Qty with the Scheme Qty
                            foreach($discount_scheme[$i]->qty_val_arr as $q_v_obj){
                                // If given qty is greater or equal then one in the scheme than
                                // save potential scheme object in $scheme variable and keep looping
                                if($qty >= $q_v_obj->qty){
                                    $scheme = $q_v_obj;
                                }
                            }

                            $discount_type = $discount_scheme[$i]->discount_type;
                            switch($discount_type){
                                case "price" : $price = number_format($scheme->val, 2, '.', ''); break;
                                case "percent" : $price = number_format(($price/100*$scheme->val), 2, '.', ''); break;
                            }

                        }
                    }
                } 

                $subtotal = $price * $qty;
                $pic_url = is_string(urldecode( $data["data"]["default_pic"])) ? urldecode( $data["data"]["default_pic"]) : urldecode( $data["data"]["default_pic"]["url"]);
                array_push($output, array(	
                					"id"=>$id,
			                		"price"=>$price,
			                		"qty"=>$qty,
			                		"subtotal"=>$subtotal,
			                		"filepath"=> $pic_url));
            }
        }
    }
    return $output;
}

//---------------------------------------------------------------------------------
// 

function getBasketQty($session){
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

        return $total;

    } else {
        return 0;
    }
}

function getOccasionsData($db){
    $occasions_output_data = array();

    $select_result = mysql_query("SELECT * FROM occasions ORDER BY place ASC");
    if($select_result){
        if(mysql_num_rows($select_result)){
            while($row = mysql_fetch_assoc($select_result)){
                array_push($occasions_output_data, $row);
            }
            return array("error" => false, "occasions_data" => $occasions_output_data);
        } else {
            return array("error" => false, "occasions_data" => 0);
        }
    } else {
        return array("error" => true, "error_msg" => mysql_error());
    }
}


/*
    $templates_array = loadGraphicTemplates($db, array("occasion_url"=>$this->occasion_url, "product_ids"=>array("8")));
*/

function loadGraphicTemplates($db, $data_obj){
    $templates = array();
    $res = mysql_query("SELECT * FROM occasions WHERE link = '{$data_obj['occasion_url']}'");
    if($res){
        if(mysql_num_rows($res) >0){
            $data = mysql_fetch_assoc($res);
            // print_r($data);
            $data = json_decode($data["templates_list"]);
            foreach ($data as $template_inf) {
                // check if object ids match, then load its templates
                if(in_array($template_inf->product_id, $data_obj['product_ids'])) {

                    $pdata = getProductData($template_inf->product_id, $db);
                    /*print "<pre>";
                    print_r($opt_p_data["productdata"]);
                    print "</pre>";*/
                    if($pdata["productdata"]){
                        // print_r($template_inf);
                        if(isset($pdata["productdata"]["graphic_templates"]) && isset($pdata["productdata"]['graphic_templates'][$pdata["productdata"]['default_surface']][$template_inf->template_id]['product_preview'])){
                            
                            if(!is_array($templates[$template_inf->product_id])){
                                $templates[$template_inf->product_id] = array();
                            }
                            // Check if Template has name
                            $template_name = isset($pdata["productdata"]['graphic_templates'][$pdata["productdata"]['default_surface']][$template_inf->template_id]["template_name"]) ? $pdata["productdata"]['graphic_templates'][$pdata["productdata"]['default_surface']][$template_inf->template_id]["template_name"] : "";
                            
                            // 
                            $templates[$template_inf->product_id][$template_inf->template_id] = (object)array(
                                    "group_img"  => $pdata["productdata"]['graphic_templates'][$pdata["productdata"]['default_surface']][$template_inf->template_id]['product_preview']['url'],
                                    "group_link_to" => "/personalize/?product_id={$template_inf->product_id}&template_id={$template_inf->template_id}"
                                    // "group_description"  => $template_name
                                );
                            

                            if(isset($data_obj['product_variations']) && isset($data_obj['product_variations'][$template_inf->product_id])){

                                $templates_options = array();
                                foreach ($data_obj['product_variations'][$template_inf->product_id] as $option_product_id) {
                                    $opt_p_data = getProductData($option_product_id, $db);
                                    if($opt_p_data["productdata"]){
                                        /*print "<pre>";
                                        print_r($opt_p_data);
                                        print "</pre>";*/
                                        if(isset($opt_p_data["productdata"]['graphic_templates']) && isset($opt_p_data["productdata"]['graphic_templates'][$opt_p_data["productdata"]['default_surface']][$template_inf->template_id]['product_preview'])){
                                            $template_nameB = isset($opt_p_data["productdata"]['graphic_templates'][$opt_p_data["productdata"]['default_surface']][$template_inf->template_id]["template_name"]) ? $opt_p_data["productdata"]['graphic_templates'][$opt_p_data["productdata"]['default_surface']][$template_inf->template_id]["template_name"] : "";
                                            array_push($templates_options, (object)array(
                                                "group_img"  => $opt_p_data["productdata"]['graphic_templates'][$opt_p_data["productdata"]['default_surface']][$template_inf->template_id]['product_preview']['url'],
                                                "group_link_to" => "/personalize/?product_id={$option_product_id}&template_id={$template_inf->template_id}",
                                                "group_description"  => $template_nameB,
                                                "price" => $opt_p_data["price"]
                                            ));
                                        }
                                    }
                                }
                                $templates[$template_inf->product_id][$template_inf->template_id]->product_variations = $templates_options;
                            }
                        }
                    }
                }
            }
            return $templates;

        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getProductData($id, &$db){
    $result = mysql_query("SELECT * FROM products WHERE id = $id");
    if($result){
        $response = mysql_fetch_assoc($result);
        $response["productdata"] = json_decode(html_entity_decode($response["productdata"], ENT_QUOTES, 'UTF-8'), true);
        return $response;
    } else {
        return false;
    }
}

?>















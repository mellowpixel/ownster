<?php
include_once("DataBaseClass.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

function getItemsPerPage(){
	
	return getDBField('settings','items_per_page');
}

function setItemsPerPage($items_per_page){
	return setDBField("settings", "items_per_page", $items_per_page);
}

function getPriceForItem(){
	
	return getDBField('settings','price_for_item');
}

function getContactEmail(){
	
	return getDBField('settings','contact_email');
}

function setPriceForItem($price_for_item){
	
	return setDBField("settings", "price_for_item", $price_for_item);
}

function getPayPalToken(){
	
	return getDBField('settings','paypal_code');
}

function setPayPalToken($token){
	
	return setDBField("settings", "paypal_code", $token);
}



if(isset( $_POST )){
	switch( key( $_POST ) ){
		
		case "get_settings":				getSettings(); 	break;
		case "change_price_for_item":		changeSetting($_POST['change_price_for_item'],"settings", "price_for_item", "Новая цена за продукт £"); break;
		case "change_price_for_delivery":	changeSetting($_POST['change_price_for_delivery'], "settings", "price_for_delivery", "Новая цена за доставку £"); break;
		case "change_templates_per_page":	changeSetting($_POST['change_templates_per_page'], "settings", "items_per_page", "Новое количество!"); break;
		case "change_token":				changeSetting($_POST['change_token'], "settings", "paypal_code", "Новый Токен!"); break;
		case "change_contact_email":		changeSetting($_POST['change_contact_email'], "settings", "contact_email", "Новый email"); break;
	}
}

//-------------------------------------------------------------------------------------------------------

function getSettings(){
	$db		= new DataBase();
	$output	= "";
	
	$result = mysql_query("SELECT * FROM settings");
	if($result){
		$values = mysql_fetch_row($result);
		foreach($values as $value){
			$output .=$value."~";
		}
		echo "array:|".$output;
	}
	unset($db);
}

function changeSetting($new_value, $table, $field, $message){
	$db = new DataBase();
	
	if( setDBField( $table, $field, "'".$new_value."'" ) ){
		echo "alert:|".$message." ".getDBField($table, $field);	
		
	} else {
		echo "alert:|Fail".mysql_error();
	}
}

function getDBField($table, $field){
	$result = mysql_query("SELECT $field FROM $table");
	if($result){
		$output = mysql_result($result,0);
		
		if($output !== NULL){
			return $output;	
			
		} else return false;
	} else return false;
}

function setDBField($table, $field, $value){
	if(mysql_query("UPDATE $table SET $field = $value")){
		return true;
	} else return false;
}







?>
<?php

class DataBase
{
	public static $connection,
				$encriptA = "",
				$encriptB = "";
	
	public function __construct()
	{
		include('login.php');
		
		self::$encriptA = $md5_A;
		self::$encriptB = $md5_B;
		
		self::$connection = @mysql_connect($mysql_host, $mysql_user, $mysql_password)
							or die('Can not connect to host.'.mysql_error().'<br/>');
		if(!mysql_select_db($db_name, self::$connection))
			echo"Can not connect to database.".mysql_error()."<br/>";
	//	else echo"Connected to the database.<br/>";
	}
	
	public function __destruct()
	{
		mysql_close(self::$connection);
	}
	
//****************************************************************************************************************	CREATE TABLES	
	public function createTable()
	{
		$statusMessage = '';
		//-------------------------------------------------------------------------------------	CREATE TABS TABLE
		if(!mysql_query("CREATE TABLE tabs (	id			INT UNIQUE AUTO_INCREMENT,
												name		VARCHAR(30) UNIQUE
												)", self::$connection))
												
		{		 $statusMessage .= "Error Creating Table 'Tabs'! ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'Tabs' Successfully Created.<br/>";
		
		//-------------------------------------------------------------------------------------	CREATE TEMPLATE CATEGORIES TABLE
		if(!mysql_query("CREATE TABLE template_categories (		id			INT UNIQUE AUTO_INCREMENT,
																position		SMALLINT(4),
																type			CHAR(1),
																category_name	VARCHAR(30),
																tab_name		VARCHAR(30)
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'template_categories'. ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'template_categories' Successfully Created.<br/>";
		
		//-------------------------------------------------------------------------------------	CREATE FOOTER TABLE
		if(!mysql_query("CREATE TABLE footer_links (		id	INT UNIQUE AUTO_INCREMENT,
															link_name		VARCHAR(30),
															html_content	TEXT
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'footer_links'. ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'footer_links' Successfully Created.<br/>";
		
		//-------------------------------------------------------------------------------------	CREATE INTRO TEXT TABLE
		if(!mysql_query("CREATE TABLE intro_texts (		id				INT UNIQUE AUTO_INCREMENT,
														category_id		INT,
														file_path		TEXT
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'intro_texts'. ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'intro_texts' Successfully Created.<br/>";
		
		//-------------------------------------------------------------------------------------	CREATE SETTINGS TABLE
		if(!mysql_query("CREATE TABLE settings (	items_per_page		SMALLINT(4) DEFAULT 5,
													price_for_item		DECIMAL(6,2) DEFAULT 5.99,
													price_for_delivery	DECIMAL(6,2) DEFAULT 4.20,
													paypal_code			VARCHAR(70),
													contact_email		VARCHAR(120)
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'settings'. ".mysql_error()."<br/>";
		}	else {
			
			if(mysql_query("INSERT INTO settings (items_per_page, price_for_item, price_for_delivery) VALUES(5, 5.99, 4.20)")){
				$statusMessage .= "Table 'settings' Successfully Created.<br/>";
			} else {
				$statusMessage .= "Table 'settings' Successfully Created.<br/>Cannot insert new user into the table.<br/>";
			}
		}
		
		//-------------------------------------------------------------------------------------	CREATE VAUCHERS TABLE
		if(!mysql_query("CREATE TABLE vouchers (		id	INT UNIQUE AUTO_INCREMENT,
															date_created 		DATETIME DEFAULT CURRENT_TIMESTAMP,
															voucher_code		VARCHAR(9) UNIQUE,
															discount_price		DECIMAL(6,2),
															discount_percent	SMALLINT(3),
															expires_date		DATE,
															redeemed			TINYINT(1) DEFAULT 0,
															voucher_owner		VARCHAR(30) DEFAULT 'Имя Владельца',
															issued				TINYINT(1) DEFAULT 0
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'vouchers'. ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'vouchers' Successfully Created.<br/>";
		
		
		//-------------------------------------------------------------------------------------	CREATE TEMPLATE CATEGORIES TABLE
		
		if(!mysql_query("CREATE TABLE Gallery_tab_frontpage_link (	id			INT UNIQUE AUTO_INCREMENT,
																	path		VARCHAR(120),
																	position	INT,
																	description TEXT,
																	buy_counter	INT)", self::$connection))
		{	$statusMessage .= "Error Creating Table 'Gallery_tab_frontpage_link'. ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'Gallery_tab_frontpage_link' Successfully Created.<br/>";
		
		//-------------------------------------------------------------------------------------	CREATE COMPLETED PAYMENTS TABLE
		if(!mysql_query("CREATE TABLE completed_payments (		order_number		VARCHAR(8) UNIQUE,
																payment_type		VARCHAR(15),
																voucher_code		VARCHAR(9),
																payment_date		DATETIME,
																payment_status		VARCHAR(20),
																payer_status		VARCHAR(20),
																first_name			VARCHAR(120),
																last_name			VARCHAR(120),
																payer_email			VARCHAR(120),
																payer_id			VARCHAR(60),
																address_name		VARCHAR(120),
																address_country		VARCHAR(120),
																address_country_code	VARCHAR(4),
																address_zip			VARCHAR(10),
																address_city		VARCHAR(120),
																address_street		VARCHAR(120),
																items				TEXT,
																mc_gross			DECIMAL(6,2),
																custom				TEXT,
																invoice				VARCHAR(120)
																
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'Completed Payments'. ".mysql_error()."<br/>";
		}	else $statusMessage .= "Table 'Completed Payments' Successfully Created.<br/>";
		
		//-------------------------------------------------------------------------------------	CREATE TEMPLATE CATEGORIES TABLE
		if(!mysql_query("CREATE TABLE users (		id			INT UNIQUE AUTO_INCREMENT,
																name		VARCHAR(30),
																lastname	VARCHAR(30),
																email		VARCHAR(120) UNIQUE,
																password	VARCHAR(128),
																status		VARCHAR(5) DEFAULT 'guest',
																addresses	TEXT,
																orderhistory TEXT
														)", self::$connection))
														
		{	$statusMessage .= "Error Creating Table 'users'. ".mysql_error()."<br/>";
		}	else {
			
			$password = 'admin1';
			
			$md5_A = self::$encriptA;
			$md5_B = self::$encriptB;
			$encripted_pass = md5("$md5_A$password$md5_B");
			
			if(mysql_query("INSERT INTO users (name, lastname, email, password, status) VALUES('Артём', 'Сапоненко', 'boss@admin.aa', '$encripted_pass', 'admin')")){
				$statusMessage .= "Table 'users' Successfully Created.<br/>";
			} else {
				$statusMessage .= "Table 'users' Successfully Created.<br/>Cannot insert new user into the table.<br/>";
			}
		}
		
		return $statusMessage;
	}

//***************************************************************************************************************	GET TEMPLATE PATH	
	public function getTemplatePath($template, $category){
		$gallery = "Gallery_".$category;
		$result = mysql_result(mysql_query("SELECT path FROM $gallery WHERE id = '$template'", self::$connection), 0);
		if($result){
			return $result;
		} else {
			return false;	
		}
	}

//***************************************************************************************************************	GET TAB LIST	
	public function getTabList()
	{
		$result = mysql_query("SELECT * FROM tabs WHERE name IS NOT NULL ORDER BY id", self::$connection);
		if($result){
			return $result;
		}
		else echo "mySQL Query Error!".mysql_error()."<br/>";
	}
	
//***************************************************************************************************************	LIST OF TABS SELECTED
	public function getTabListSelected($selectedTab="")
	{
		$result = $this->getTabList();
		$selectOptions='';
		while($row = mysql_fetch_assoc($result)){
			if($row['name'] == $selectedTab && $selectedTab != "")
				$selectOptions.="<option selected>".$row['name']."</option>";
			else
				$selectOptions.="<option>".$row['name']."</option>";
		}			
		return $selectOptions;	
	}
	

//***************************************************************************************************************	GET CATEGORIES LIST FROM TAB
	public function getListFromTab($tabName)
	{
		$ArrayOfCategories = array();
		$categoriesArray = array();
	//	$tabID = mysql_result(mysql_query("SELECT id FROM tabs WHERE name = '$tabName'", self::$connection),0);
		$listResult = mysql_query("SELECT id, position, type, category_name FROM template_categories WHERE tab_name = '$tabName' ORDER BY position", self::$connection);

		while($row = mysql_fetch_assoc($listResult)){
			array_push($ArrayOfCategories, $row);
		}
		
		return $ArrayOfCategories;	
	}
	
//***************************************************************************************************************	GET CATEGORIES SELECTED
	public function getCategoriesSelected($tabName, $categoryID=""){
		$arrayOfCategories = $this->getListFromTab($tabName);
		$selectList = "";
		foreach($arrayOfCategories as $category){
			if($category[0] == $categoryID && $categoryID != "")
				$selectList .= "<option id='option_".$category[0]."' selected>".$category[1]."</option>";
			else
				$selectList .= "<option id='option_".$category[0]."'>".$category[1]."</option>";
			
		}
		return $selectList;
	}

//***************************************************************************************************************	MOVE IMAGE TO DIFFERENT CATEGORY
	public function moveBetweenTables($oldTable, $newTable, $itemID){
		
		$result = mysql_query("SELECT * FROM $oldTable WHERE id = '$itemID'", self::$connection);
		if($result){
			$row = mysql_fetch_assoc($result);
			if(!mysql_num_rows(mysql_query("SELECT path FROM $newTable WHERE path = '".$row['path']."'"))){
				if(mysql_query("INSERT INTO $newTable (path, description, buy_counter) VALUES('".$row['path']."', '".$row['description']."', '".$row['buy_counter']."')", self::$connection)){
					if(mysql_query("DELETE FROM $oldTable WHERE path = '".$row['path']."'")){
						return true;
						
					} else return mysql_error();
				} else return mysql_error();
			} else return mysql_error();
		} else return mysql_error();
	}
	
//***************************************************************************************************************	MOVE IMAGE TO DIFFERENT CATEGORY
	public function removeFile($table, $front_page_table, $ID){
		$result = mysql_query("SELECT path FROM $table WHERE id='$ID'", self::$connection);
		if($result){
			$path		= mysql_result($result, 0);
			$thumb_path	= substr($path, 0, strrpos($path, "/")) ."/thumbnail/". basename($path);
			
			if(mysql_query("DELETE FROM $table WHERE id='$ID'", self::$connection)){
				mysql_query("DELETE FROM $front_page_table WHERE path='$path'", self::$connection);
				if(file_exists("../".$path)){
					//DELETE THUMBNAIL FILE
					if(file_exists("../".$thumb_path)){
						unlink("../".$thumb_path);
					}
					
					if(!unlink("../".$path)){
						return "Cannot delete file.";
					}else return "ok";
				}else return "File doesn't exist.";
			} else return "Mysql error. Cannot delete from table.";
		}else return "Mysql error. Cannot find file in the table.";
	}

//---------------------------------------------------------------------------------------------------------------// Append to the field record (records are not unique)	
	public function update_record( $table, $field_to_update, $where_field, $where_field_value, $value)
	{	
		$result = mysql_query("SELECT $field_to_update FROM  $table WHERE $where_field = '$where_field_value'");
		if(!$result)
			echo"Error";
		else
		{
			$row = mysql_fetch_assoc($result);
				
			if($row[$field_to_update] != NULL) //		If field is not empty combine old field with new one.
			{
				if(!mysql_query("UPDATE  $table SET $field_to_update = CONCAT($field_to_update, '$value') WHERE $where_field='$where_field_value'"))	//		Append data to the field
					echo"Error #1.<br/>"; // if error...
			//	else
			//		echo " . . . . . $concatee<br/>";
					
			} else {
					if(!mysql_query("UPDATE  $table SET $field_to_update ='$value' WHERE $where_field='$where_field_value'"))	//		If field is empty fill it with data
						echo "Error #2.<br/>"; // if error
				//	else
				//		echo " . . . . . $concatee<br/>"; 
					}
		}
	}
	

//---------------------------------------------------------------------------------------------------------------// Append to the field of unique records	
	public function update_unique_record( $table, $field_to_update, $where_field, $where_field_value, $value)
	{	
		$result = mysql_query("SELECT $field_to_update FROM  $table WHERE $where_field = '$where_field_value'");
		if(!$result)
			echo"Error";
		else
		{
			$row = mysql_fetch_assoc($result);
				
			if($row[$field_to_update] != NULL) //		If field is not empty combine old field with new one.
			{
				$existing_array = json_decode($row[$field_to_update], true);
				if(!is_array($existing_array)){
					$existing_array = array();
				}
				
				$records = json_encode(array_merge($existing_array, $value));
			
				if(!mysql_query("UPDATE  $table SET $field_to_update = '$records' WHERE $where_field='$where_field_value'"))	//		Append data to the field
					echo"Error #1.<br/>"; // if error...
					
			}
			else {
				$record = json_encode($value);
				if(!mysql_query("UPDATE  $table SET $field_to_update ='$record' WHERE $where_field='$where_field_value'")){	//		If field is empty fill it with data
					echo "Error 3! Can not update record.<br/>"; // if error
				}
			}
		}
	}
	
//---------------------------------------------------------------------------------------------------------------//	

	public function getDBField($table, $field){
		$result = mysql_query("SELECT $field FROM $table");
		if($result){
			$output = mysql_result($result,0);
			
			if($output !== NULL){
				return $output;	
				
			} else return false;
		} else return false;
	}

//---------------------------------------------------------------------------------------------------------------//
	
	public function setDBField($table, $field, $value){
		if(mysql_query("UPDATE $table SET $field = $value")){
			return true;
		} else return false;
	}
	
}

?>
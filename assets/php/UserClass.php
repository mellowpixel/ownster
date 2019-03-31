<?php

///--------------------------------------------------------------------------//

class User
{
	public	$error_message;
		
	public static $table,	
			$encriptA = "",
			$encriptB = "";
//----------------------------------------------------------------------------------------------// CONSTRUCTOR
	function __construct($mysql_table)
	{
		include('login.php');	// THIS IS WHERE MD5 SALT IS STORED
		self::$encriptA = $md5_A;
		self::$encriptB = $md5_B;
		self::$table = $mysql_table;
	}
	
//----------------------------------------------------------------------------------------------// LOGIN EXISTING USER Function

	function login($login, $password, $encripted)
	{

		$result = mysql_query("SELECT * FROM ".self::$table." WHERE email = '$login'");
		if(mysql_num_rows($result))
		{	
			if(!$encripted){
				$md5_A = self::$encriptA;
				$md5_B = self::$encriptB;
				$encripted_password = md5("$md5_A$password$md5_B"); 
			} else {
				$encripted_password = $password;	
			}
			
			$user_data = mysql_fetch_assoc($result);
			if($user_data['password'] == $encripted_password)
				return $user_data;
			else
			{
				$this->error_message = "You have entered wrong login or password.";
				return FALSE;
			}
				
		}
		else
		{
			$this->error_message = "You have entered wrong login or password.";
			return FALSE;
		}
	}

//----------------------------------------------------------------------------------------------// Password Encription	
	public function encriptPassword($password){
		$md5_A = self::$encriptA;
		$md5_B = self::$encriptB;
		return md5("$md5_A$password$md5_B");	// SALTING IS IN login.php
	}
	
	public function generatePassword($length){
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
//----------------------------------------------------------------------------------------------// REGISTER NEW USER Function

	function register_new_account($db_fields, $values)
	{		
		$query = "INSERT INTO ".self::$table."($db_fields) VALUES($values)";
		$result = mysql_query($query);
		if(!$result)
		{
			$this->error_message = "Unable to create new user: ".mysql_error()."<br />";
			return FALSE;
		} 
		else	return TRUE;
//		}// else
	}//	function


//----------------------------------------------------------------------------------------------// UPDATE RECORDS

	function updateRecords($db_key_value, $user_login)
	{
		$this->error_message = "";
		foreach($db_key_value as $field=>$value){
			$query = "UPDATE ".self::$table." SET ".$field."=".$value." WHERE email='".$user_login."'";
			$result = mysql_query($query);
			if(!$result)
			{
				echo "<p>".mysql_error()."</p>";
				
			} 	
		}
		
		if($this->error_message === "")
			return true;
		else
			return false;
				
	}//	function
		
//----------------------------------------------------------------------------------------------//
}// class

?>
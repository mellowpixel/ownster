<?php

class RegExpTest
{
	
	public function email_test($email)
	{
		$reg = "/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/";
		
		if(preg_match($reg, $email) > 0){
			return true;
		} else {
			return false;
		}
	}
	
	public function name_test($name)
	{
		$reg = "/[^a-zA-Z -]/";
		
		if(preg_match($reg, $name) >0){
			return false;
		} else {
			if(strlen($name) > 0){
				return true;
			} else {
				return false;
			}
		}	
	}
	
	public function password_test($password){
		$reg = "/.{6,}/";
		
		if(preg_match($reg, $password) > 0){
			return true;
		} else {
			return false;
		}	
	}
	
	public function address_test($address){
		$reg = "/[^\w.,\s()]/";
		
		if(preg_match($reg, $address) > 0){
			return false;
		} else {
			if(strlen($address) > 0){
				return true;
			} else {
				return false;
			}
		}
	}	
}

?>
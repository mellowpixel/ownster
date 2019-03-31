<?php
class Session
{
	public $session_ID;
	public $session_started = false;
	public $error_message = "";
	public $test;
	
	function __construct(){
		session_start();
		$this->session_started = true;
		date_default_timezone_set('Europe/Riga');
		if(!isset($_SESSION['SID']) || (isset($_SESSION['regenerate']) && $_SESSION['regenerate'] === true)){
			session_regenerate_id();
			$this->session_ID = session_id();
			$_SESSION["SID"] = $this->session_ID;
			$this->test = true;
			$_SESSION['regenerate'] = false;
		} else	{
			$this->test = $_SESSION['regenerate'];
			$this->session_ID = $_SESSION['SID'];	
		}
		
	}
	
	public function setSessionValue($key_name, $value){
		if($this->session_started){
			$_SESSION[$key_name] = $value;
		} else {
			$this->error_message = "Error! Session not started.";	
		}

	}
	
	public function getSessionValue($key_name){
		
		if($this->session_started){
			if(isset($_SESSION[$key_name])){
				return $_SESSION[$key_name];
			} else {
				$this->error_message .= "Error! Session value is not set.<br/>";
				return false;
			}
		} else {
			$this->error_message .= "Error! Session not started.<br/>";
			return false;
		}	
	}
	
	public function deleteSessionKey($key_name){
		if($this->session_started){
			if(isset($_SESSION[$key_name])){
				unset($_SESSION[$key_name]);
				return true;
			} else {
				$this->error_message .= "Error! Session value is not set.<br/>";
				return false;
			}
		} else {
			$this->error_message .= "Error! Session not started.<br/>";
			return false;
		}
	}
	
	public function uniqueUserSessionID(){
		$output 	= '';
		$roulete	= array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
							'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
							'U', 'V', 'W', 'X', 'Y', 'Z' );
							
		if( shuffle($roulete) ){
			for($i = 0; $i < 4; $i++){
				$output .= $roulete[$i];
			}
					
		}
		
		$unique_name = date("dmy_Gis")."_".$output;
		return $unique_name;
	}
	
	public function newSessionID($delete_old_session = false){
		if($this->session_started){
			session_regenerate_id($delete_old_session);
			$this->session_ID = session_id();
			$_SESSION['SID'] = $this->session_ID;

		}
	}
	
	
	
	public function closeSession(){
		session_unset();
		session_destroy();	
	}
}
?>
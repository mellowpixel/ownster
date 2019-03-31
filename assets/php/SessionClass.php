<?php
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../../error_log/php-error$date.log");

class Session
{
	public $session_ID;
	public $session_started = false;
	public $error_message = "";
	public $test;
	
	function __construct(){
		if(!isset($_SESSION)){
			session_start();
			$this->session_started = true;
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
		$letters = array('A','B','C','D','E','F','G','H','I','J');
		$numbers = str_split(hexdec(substr($this->session_ID, 0, 4))+hexdec(substr($this->session_ID, 3, 4))+hexdec(substr($this->session_ID, 7, 4))+hexdec(substr($this->session_ID, 11, 4)));
		$total = count($numbers);
		$string = "";
		for($i = 0; $i < $total; $i++){
			$string .= $letters[$numbers[$i]];
		}
		return $unique_name = date("dmy")."_".str_replace(".", "", $_SERVER['REMOTE_ADDR'])."_".$string;
	}
	
	
	public function closeSession(){
		session_unset();
		session_destroy();	
	}
}
?>
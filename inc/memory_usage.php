<?php
	function convert($size)
	{
	    $unit=array('b','kb','mb','gb','tb','pb');
	    return @round($size/pow(1024,($i=floor(log($size,1024)))),2).' '.$unit[$i];
	}

	function recordMemoryUsage($function_name){
		date_default_timezone_set('Europe/Riga');
		if(isset($_SESSION["memory"])){
			if(isset($_SESSION["memory"]["data"]) && isset($_SESSION["memory"]["current_page"])){
				$memory_data = $_SESSION["memory"]["data"];
				$this_page = $_SESSION["memory"]["current_page"];
				$time = date("H:i:s");
				// $memory_data["data"][$this_page] = array("function"=>$function_name, "memory_used"=>convert(memory_get_usage(true)));
				if(isset($_SESSION["memory"]["data"][$this_page]) && is_array($_SESSION["memory"]["data"][$this_page])){
					array_push($_SESSION["memory"]["data"][$this_page], array("time"=>$time, "function"=>$function_name, "memory_used"=>convert(memory_get_usage(true))));
				} else {
					$_SESSION["memory"]["data"][$this_page] = array();
					array_push($_SESSION["memory"]["data"][$this_page], array("time"=>$time, "function"=>$function_name, "memory_used"=>convert(memory_get_usage(true))));
				}
			}
		}

	}

	// recordMemoryUsage("ShoppingCart.php -> Start");
?>
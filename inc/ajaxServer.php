<?php
include_once("DataBaseClass.php");
include("upload.php");
include("Settings.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

date_default_timezone_set('Europe/London');

if(isset($_POST['sendReviewInvitations'])){
	$db = new DataBase();
	$error = false;
	$error_msg = "";
	// $test_obj = array();
	$url = "http://ownster.co.uk/your-review/";
	// GET EMAILS OLDER THAN ONE WEEK AND user_review NOT SET
	$result = mysql_query("SELECT order_number, payer_email, first_name, last_name, payment_date FROM completed_payments WHERE ( payment_date < ( NOW() - INTERVAL 10 DAY ) AND payment_date > ( NOW() - INTERVAL 20 DAY )) AND user_review IS NULL ORDER BY payment_date DESC LIMIT 0, 100");
	if($result){
		// Copy emails to array
		$emails = array();
		while($row = mysql_fetch_assoc($result)){
			$client_email = strtolower($row["payer_email"]);
			
			if(!in_array($client_email, $emails)){
				array_push($emails, $client_email);

				$review_link = $url."?code=".$user_code = generateCode(32);

				sendReviewProposal($row["payer_email"], $row["first_name"], $row["last_name"], $review_link, $db);
				$update_res = mysql_query("UPDATE completed_payments SET user_review = '$user_code' WHERE order_number =".$row["order_number"]);
			
				if(!$update_res){
					$error = true;
					$error_msg.= mysql_error();
				}
			}
		}

		echo json_encode(array("error"=>$error, "error_msg"=>$error_msg, "emails"=> $emails));
	} else {
		$error = true;
		$error_msg = mysql_error();
		echo json_encode(array("error"=>$error, "error_msg"=>$error_msg));
	}
}

//---------------------------------------------------------------------------------
// 

if(isset($_POST["save_review"])){
	//text: review, rating: rating
	$db = new DataBase();
	$code = $_POST["save_review"];
	$content = strip_tags($_POST["text"]);
	$text = htmlentities($content, ENT_QUOTES);
	$rating = $_POST["rating"];
	date_default_timezone_set('Europe/Riga');
	$json_review_data = json_encode((object)array("review"=>$text, "rating"=>$rating, "date"=>date("d-m-Y")));

	if(!isset($_POST["check_email"])){
		$user_res = mysql_query("SELECT first_name, last_name, payer_email FROM completed_payments WHERE user_review = '$code'");
		$result = mysql_query("UPDATE completed_payments SET user_review = '$json_review_data', active_review = 1 WHERE user_review = '$code'");
		if($result){
			if($user_res){
				$user_data = mysql_fetch_assoc($user_res);
			} else $user_data = array("first_name"=>"Unknown", "last_name"=>"Unknown", "payer_email"=>"Unknown");

			$body = "<html>
					<style type='text/css'>
					body{font-family:Arial, Helvetica, sans-serif;}
					.content{width:600px;margin:0px auto 0px auto;text-align: left;}
					.content h1{color: #090;font-weight: normal;}
					</style>
					<body>
					<div class='content'>
						<h1>New Review From ".$user_data["first_name"]." ".$user_data["last_name"]."</h1>
						<h3>".$user_data["payer_email"]."</h3>
						<p>He rated Us $rating / 5</p>
						<p>$text</p>
					</div>	
					</body>
					</html>";

			sendMail("support@ownster.co.uk", "New Review Received.", $body, "Ownster", "support@ownster.co.uk");
			// sendMail("mellowpixels@gmail.com", "New Review Received.", $body, "Ownster", "support@ownster.co.uk");
			echo json_encode(array("error"=>false));
		}
	}
}

//---------------------------------------------------------------------------------
//	Toggle Review Visibility

if(isset($_POST["changeReviewState"]) && isset($_POST["order"])){
	$order_num = $_POST["order"];
	$db = new DataBase();
	$active_review = ( $_POST["changeReviewState"] == "true" ) ? 1 : 0;
	if( mysql_query("UPDATE completed_payments SET active_review = $active_review WHERE order_number = $order_num") ){
		echo json_encode(array("error"=>false));
	} else echo json_encode(array("error"=>true, "error_msg"=>mysql_error()));
}

//*******************************************************************	NEW FOOTER LINK
if(isset($_POST['new_footer_item'])){
	$DBase = new DataBase();
	$newCategoryName = cleanString($_POST['new_footer_item']);
	if(!mysql_num_rows(mysql_query("SELECT link_name FROM footer_links WHERE link_name = '$newCategoryName'", DataBase::$connection))){
		if(mysql_query("INSERT INTO footer_links SET link_name = '$newCategoryName'", DataBase::$connection)){
			$id = mysql_insert_id();
			echo json_encode(array( "error"=>false, "new_name"=> $newCategoryName, "id"=>$id ));
			
		}else echo json_encode(array( "error"=>true, "error_msg"=> mysql_error() ));
	}else echo json_encode(array( "error"=>true, "error_msg"=> mysql_error() ));
	unset($DBase);
}
//------------------------------------------------
if(isset($_POST['get_footer_links'])){
	echo json_encode(returnFooterLinks());
}

function returnFooterLinks(){
	$DBase = new DataBase();
	$response = array();

	$result = mysql_query("SELECT id, link_name FROM footer_links WHERE link_name IS NOT NULL ORDER BY id", DataBase::$connection);
	if($result){
		while($row = mysql_fetch_assoc($result)){
			array_push($response, $row);	
		}
		return $response;
	} else {
		return array("error"=> true);	
	}
}

if(isset($_POST["getLinkContent"])){
	$DBase = new DataBase();
	$id = $_POST["getLinkContent"];

	$result = mysql_query("SELECT html_content FROM footer_links WHERE id = $id");
	if($result){
		$content = mysql_result($result, 0);
		$content = stripslashes($content);
		$content = html_entity_decode($content, ENT_QUOTES, "ISO-8859-1");
		echo json_encode(array( "error"=>false, "content"=>$content ));
	} else {
		echo json_encode(array( "error"=>true, "error_msg"=>mysql_error() ));
	}
}

//------------------------------------------------
if(isset($_POST['delete_footer_link'])){
	$DBase = new DataBase();
	$link_id = $_POST['delete_footer_link'];
	if(mysql_query("DELETE FROM footer_links WHERE id = '$link_id'", DataBase::$connection)){
		echo json_encode(array("error"=>false));	
	} else {
		echo json_encode(array( "error"=>true, "error_msg"=>mysql_error() ));	
	}
}

if(isset($_POST["save_link_name"])){
	if(isset($_POST["new_link_name"])){
		
		$DBase = new DataBase();
		$link_id	= $_POST["save_link_name"];
		$new_name	= $_POST["new_link_name"];
		
		if(mysql_query("UPDATE footer_links SET link_name = '$new_name' WHERE id = '$link_id'", DataBase::$connection)){
			echo json_encode(array("error"=>false));	
		} else {
			echo json_encode(array( "error"=>true, "error_msg"=>mysql_error() ));	
		}
	}
}

if(isset($_POST['saveFooterContent']) && isset($_POST['description'])){
	
	$DBase 		= new DataBase();
	$link_id	= $_POST['saveFooterContent'];
	$html_raw	= $_POST['description'];
	$html		= htmlentities($html_raw, ENT_QUOTES, "UTF-8");

	if(mysql_query("UPDATE footer_links SET html_content = '$html' WHERE id = '$link_id'")){
		echo json_encode(array("error"=>false));
	} else {
		echo json_encode(array( "error"=>true, "error_msg"=>mysql_error() ));
	}
}

if(isset($_POST['load_html'])){
	
	$DBase 		= new DataBase();
	$link_id = $_POST['load_html'];
	
	if(isset($_POST['is_page_name']) && $_POST['is_page_name'] == "yes"){
		$result = mysql_query("SELECT html_content FROM footer_links WHERE link_name = '$link_id'", DataBase::$connection);
		
	} else {
		$result = mysql_query("SELECT html_content FROM footer_links WHERE id = '$link_id'", DataBase::$connection);
	}
	
	if($result){
		$text = mysql_fetch_assoc($result);
		$html_content = html_entity_decode($text['html_content'], ENT_QUOTES);
		echo "value:|$html_content";
	} else {
		echo "value:|Error. Cannot load page content.<br/>"; 	
	}
}

function encodeExistingEntities($html){
	$patern = '/&[^\s]*/';

}

  //////////////////////////////////////////////////////////////////////////////////////////
 //										FUNCTIONS										 //
//////////////////////////////////////////////////////////////////////////////////////////

function sendReviewProposal($payer_email, $first_name, $last_name, $code, $db){
	$name = (isset($first_name) && isset($last_name)) ? "Dear $first_name $last_name," : "Hello!";
	$email_body = "<html>
					<style type='text/css'>
					body{font-family:Arial, Helvetica, sans-serif;}
					.content{width:600px;margin:0px auto 0px auto;text-align: left;}
					.content h1{color: #090;font-weight: normal;}
					#link{font-size:2em;color:rgb(51,102,153);}
					</style>
					<body>
					<div class='content'>
						<h1>Please share your experience with us!</h1>
						<h3>$name</h3>
						<p>Thank you for your recent purchase from ownster.co.uk.</p>
						<p>In order to improve the satisfaction of our customers, we have created this service to collect customer reviews.</p>
						<p><a id='link' href='$code'>Click here to rate us</a></p>
						<p>All reviews, good, bad or otherwise will be viewable immediately.<p>
						<p>Thanks for your time.<p>
						<p><b>Best Regards!</b></p>
						<a href='http://ownster.co.uk'>Ownster.co.uk</a>
						<p><strong>Please notice:</strong> This email is sent automatically, therefore it is possible you have received this before your package or service. If this is the case, you are of course welcomed to wait until you have received your package or service before writing your review.</p>
					</div>	
					</body>
					</html>";
	
	sendMail($payer_email, "Your opinion matters to Ownster.co.uk", $email_body, "Ownster", "sales@ownster.co.uk");
	// sendMail("sales@ownster.co.uk", "Order Confirmation", $email_body, "Ownster", "sales@ownster.co.uk");
	
}

//-------------------------------------------------------------------------------------------------
function generateCode( $length ){
	$output 	= '';
	$roulete	= array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
						'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
						'u', 'v', 'w', 'x', 'y', 'z',
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

function sendMail($recipient, $subject, $body, $senderName, $senderEmail){
	
	$header			= "Content-type: text/html\r\n";
	$header		   .= "From: ". $senderName . " <" . $senderEmail . ">\r\n";
	
	mail($recipient, $subject, $body, $header);

	// file_put_contents("EmailsLog.txt", $recipient."\n", FILE_APPEND); //. $body ."\n". $header ."\n"
}

function get_total_pages($gallery_table, $items_per_page, &$DBase){
	$total_items	= mysql_num_rows(mysql_query("SELECT id FROM $gallery_table", DataBase::$connection));
	$tot_pages		= ceil($total_items / $items_per_page);
//	echo "____ Per Page = $items_per_page ________ Total items = $total_items _______ Total Pages = $tot_pages __________";
	return $tot_pages;
}

//-------------------------------------------------------------------------------	SEND MESSAGE
function sendMessage($Message){
	
	 echo "msg:|$Message";
}

function cleanString($string){
	preg_match_all("/[\.\w -_]/", $string, $legal_characters, PREG_PATTERN_ORDER);
	return implode($legal_characters[0]);
}

function rrmdir($dir) {
   if (is_dir($dir)) {
     $objects = scandir($dir);
     foreach ($objects as $object) {
       if ($object != "." && $object != "..") {
         if (filetype($dir."/".$object) == "dir")
		 	rrmdir($dir."/".$object); else unlink($dir."/".$object);
       }
     }
     reset($objects);
     rmdir($dir);
   }
 } 

?>

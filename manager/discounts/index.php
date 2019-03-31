<?php
include_once("../../inc/SessionClass.php");
include_once("../../inc/DataBaseClass.php");

$session	= new Session();
$db			= new DataBase();
$login		= $session->getSessionValue("user_login");
$password	= $session->getSessionValue("user_password");

$login_page = "../../cmslogin/";

if($login && $password){
	$result = mysql_query("SELECT * FROM settings WHERE email = '$login'");
	if($result){
		$user_data = mysql_fetch_assoc($result);
		 
		if($user_data && $login === $user_data['email'] && $password === $user_data['password']){
			
			// Enter Edit Mode and Carry on with this page
			// $session->setSessionValue("editmode", true);
		
		} else {
			redirectToPage($login_page);
		}
	} else {
		redirectToPage($login_page);
	}
} else {
	redirectToPage($login_page);
}

function redirectToPage($page){
	echo"<script type='text/javascript'>window.location = '$page'</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Canvas Manager</title>
	<link href="../../assets/js/jHtmlArea/style/jHtmlArea.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/page-layout.css" rel="stylesheet" type="text/css" />
    <!-- <link href="../../assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" /> -->
    <link href="../../assets/css/discounts-style.css" rel="stylesheet" type="text/css" />

    <!--[if lt IE9]
        <link rel="stylesheet" type="text/css" href="../../assets/css/ie8-FontsFormat.css" />
        <script src="../../assets/js/html5shiv.min.js"></script>
    <![endif]-->
</head>

<body>
	<header>
		<nav>
			
		</nav>
	</header>

	<main>
		 <div class='center'>
		 	<table>
		 		<tr>
		 			<td>
		 				<input type='radio' name="discount-type" id='price-discount' value="price" checked><label for='price-discount'>Цена</label> 
		 				<input type='radio' name="discount-type" id='percent-discount' value="percent"><label for='percent-discount'>Проценты</label>
		 			</td>
		 			<td class='gap'></td>
		 			<td><input type="text" name='qty-values' /></td>
		 			<td>-<input type="text" name='qty-values' /></td>
		 			<td>-<input type="text" name='qty-values' /></td>
		 			<td>-<input type="text" name='qty-values' /></td>
		 			<td>-<input type="text" name='qty-values' /></td>
		 			<td>-<input type="text" name='qty-values' /></td>
		 			<td>-<input type="text" name='qty-values' /></td>
		 			<td rowspan='2' class='gap'></td>
		 			<td rowspan='2'>
		 				<select class='product-select' name='selected-products' multiple>
		 					<?php
		                		// include_once("../../inc/DataBaseClass.php");
		                		ini_set("log_errors", 1);
					            $date = date("d-m-y");
					            ini_set("error_log", "../../error_log/php-error$date.log");
					            
		                		// $db = new DataBase();
		                		$result = mysql_query("SELECT id, name FROM products");

		                		if($result){
		                			while($row = mysql_fetch_assoc($result)){
		                                echo "<option value='".$row["id"]."'>".$row["name"]."</option>";
		                			}
		                		}
		                	?>
		 				</select>
		 			</td>
		 			<td class='gap'></td>
		 			<td><button id='create-scheme-butt'>Создать</button></td>

		 		</tr>
		 		<tr>
		 			<td></td>
		 			<td>&nbsp;</td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td><a class="value-sign">£</a><input type='text' name='price-value'></td>
		 			<td class='gap'></td>
		 			
		 		</tr>
		 	</table>

		 	<div class="schemes-page-wrapper">
		 	</div>
		 </div>
	</main>

	<footer>
	</footer>

</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript">window.rootpath = "../../", productserverpath = "/assets/php/ProductServer.php"</script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/discounts-main.js"></script>
</html>
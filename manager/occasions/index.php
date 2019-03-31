<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/inc/SessionClass.php");
include_once("$root/inc/DataBaseClass.php");
include_once("$root/assets/php/SharedFunctions.php");

ini_set("log_errors", 1);
date_default_timezone_set("Europe/Riga");
$date = date("d-m-y");
ini_set("error_log", "$root/error_log/occasions-manager-error$date.log");

@$session	= new Session();
$db			= new DataBase();
$login		= $session->getSessionValue("user_login");
$password	= $session->getSessionValue("user_password");

$login_page = "$root/cmslogin/";

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
    <link href="/assets/css/page-layout.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/occasions-manager.css" rel="stylesheet" type="text/css" />
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
		<div class="center">
		<section id="occasions-left-menu">
			<div id="new-occasion-toolbar">
				<input type="text" id="new-occasion-input" />&nbsp;&nbsp;<button id='add-new-occasion-butt'>Add occasion</button>
			</div>
			<div id="occasions-list-wrapper">
				<table id='occasions-list-table'>
					<tr align='left'>
						<th>ID</th><th>Order</th><th>Name</th><th>Link</th><th colspan='2'>Actions</th>
					</tr>
				<?php
					$occ_data_array = getOccasionsData($db);

					if(!$occ_data_array["error"]){
						$occs = $occ_data_array["occasions_data"];
						if(is_array($occs)){
							foreach ($occs as $occ) {
								echo "<tr data-occasion_id='{$occ["id"]}'>
										<td>{$occ["id"]}</td>
										<td><input type='text' class='place-input' maxlength='4' value='{$occ["place"]}'></td>
										<td><input type='text' class='name-input' maxlength='120' value='{$occ["name"]}'></td>
										<td><input type='text' class='link-input' value='{$occ["link"]}'></td>
										<td><button class='delete-cat-name-butt' title='Delete'>X</button></td>
									  </tr>";
							}
						} else {
							echo "<tr><td><h3>No Occasions.</h3></td></tr>";
						}
					} else {
						echo $occ_data_array["error_msg"];
					}
				?>
				</table>
			</div>
		</section>

		<section id="product-templates-list">
			<div id="savechanges-panel"><button id='save-changes-butt'>Save Changes</button></div>
			<?php
				$result = mysql_query("SELECT * FROM products");
				if($result){
					// ---- Render graphic Templates
					while($response = mysql_fetch_assoc($result)){
						$response["productdata"] = html_entity_decode($response["productdata"], ENT_QUOTES, 'UTF-8');
						$pdata = json_decode($response["productdata"], true);
						if(isset($pdata["graphic_templates"])){
							echo "<h3 class='product-name'>{$pdata['name']}</h3>";
							// echo"<script>console.log(".json_encode($pdata).")</script>";
							foreach ($pdata["graphic_templates"][ $pdata["default_surface"]] as $template_id => $templ) {
								
								if(isset($templ["preview_thumb"]) && isset($templ["preview_thumb"]["url"])){
									$preview_src = $templ["preview_thumb"]["url"];
									echo "<div class='single-template-wrapper'>
											<img class='templ-preview-img' src='$preview_src' />
											<span>
												<select multiple class='assign-occasion-select' data-product_id='{$pdata['db_id']}' data-template_id='$template_id'>";
													// ---- Make Occasions <select> options
													if(!$occ_data_array["error"]){
														if(is_array($occ_data_array["occasions_data"])){
															foreach ($occ_data_array["occasions_data"] as $occ) {
																$selected = "";
																// ---- Check if option should be selected
																$templates_data = json_decode($occ['templates_list'], true);
																if(is_array($templates_data)){
																	foreach ($templates_data as $templ_info) {
																		if( $pdata['db_id'] == $templ_info["product_id"] && $template_id == $templ_info["template_id"]){
																			$selected = "selected='selected'";
																		}
																	}
																}
																echo "<option value='{$occ['id']}' $selected>{$occ['name']}</option>";
															}
														}
													}
									echo		"</select>
											</span>
										  </div>";
								}
							}
						}
					}
				} else {
					echo mysql_error();
				}
			?>
		</section>
		</div>
	</main>

	<footer>
	</footer>

</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/main_occasions_manager.js"></script>

</html>
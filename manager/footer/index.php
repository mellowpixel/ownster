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
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html" />
	<title>Canvas Manager</title>
    <link href="../../assets/js/jHtmlArea/style/jHtmlArea.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/page-layout.css" rel="stylesheet" type="text/css" />
    <link href="../../assets/css/footer-edit-style.css" rel="stylesheet" type="text/css" />

    <!--[if lt IE9]
        <link rel="stylesheet" type="text/css" href="../assets/css/ie8-FontsFormat.css" />
        <script src="../assets/js/html5shiv.min.js"></script>
    <![endif]-->
</head>

<body>
	<header>
		<nav>
			
		</nav>
	</header>

	<main>
		<aside>
			<ul id='footer-links-list'>
				<?php
					// include_once("../../inc/DataBaseClass.php");
                	// $db = new DataBase();
					
					$result = mysql_query("SELECT id, link_name FROM footer_links ORDER BY id");
					if($result){
						while ($row = mysql_fetch_assoc($result)) {
							echo "<li class='footer-link-li' data-footerid='".$row["id"]."'>".$row["link_name"]."</li>";
						}
					}
				?>
				<li id='add-new-footer-link-butt'><a>Add New Link</a></li>
			</ul>
			<div id="link-edit-wrapper">
				<input type="text" disabled>
				<button id="delete-link">Удалить раздел</button>
			</div>
		</aside>
		<div id='editing-page'>
			<div id='html-content'></div>
			<div id="buttons">
				<button class='edit-butt'>Редактировать</button>
			</div>
		</div>

	</main>

	<footer>
	</footer>
</body>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/jquery.storageapi.min.js"></script>
<script type="text/javascript">window.rootpath = "../../", productserverpath = "/assets/php/ProductServer.php"</script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/jHtmlArea/scripts/jHtmlArea-0.8.js"></script>
<script type="text/javascript" src="../../assets/js/main-footer.js"></script>
</html>
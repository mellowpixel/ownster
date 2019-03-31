<?php
include_once("../inc/SessionClass.php");
include_once("../inc/DataBaseClass.php");
include_once("../inc/UserClass.php");

$session	= new Session();
$db		 	= new DataBase();
$user 		= new User("settings");
echo"<script>console.log(".json_encode($_POST).")</script>";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link type="text/css" rel="stylesheet" href="../assets/css/login-page-style.css" />
<title>Please Login</title>
</head>
<script type="text/javascript">
	function errorMsg(message){
		document.getElementById("message_cell").innerHTML = message;
	}
</script>
<body>
	<form id="login_form" action="./" method="post">
    	<table>
        	<!-- <tr>
            	<td colspan="3"><span id="plain_logo"></span></td>
            </tr> -->
        	<tr>
            	<td colspan="3" align="center" id="message_cell"></td>
            </tr>
            <tr>
            	<td colspan="3">&nbsp;</td>
            </tr>
        	<tr>
            	<td class="form_cells" align="left"><a class="cell_label">Login</a></td><td class="form_cells"><input name="login" type="text" /></td><td class="form_cells">&nbsp;</td>
            </tr>
            <tr>    
        		<td class="form_cells" align="left"><a class="cell_label">Password</a></td><td class="form_cells"><input name="password" type="password" /></td><td class="form_cells">&nbsp;</td>
            </tr>
            <tr>
            	<td colspan="3">&nbsp;</td>
            </tr>
            <tr>
            	<td colspan="3" align="center"><input type="submit" value="Login" /></td>
            </tr>
    	</table>   
	</form>
    
	<?php
	if( isset($_POST["login"]) && isset($_POST["password"])){
		$login		= $_POST["login"];
		$password	= $user->encriptPassword($_POST["password"]);
		$user_data	= $user->login($_POST["login"], $_POST["password"]);
        // print_r($user_data);
		if($user_data){
            // print_r($user_data);
			if($login === $user_data['email'] && $password === $user_data['password']){
                // print_r($user_data);
				$session->setSessionValue("user_login", $user_data["email"]);
				$session->setSessionValue("user_password", $user_data["password"]);
				echo"<script type='text/javascript'>window.location = '../manager/'</script>";
				
			} else echo "<script type='text/javascript'>errorMsg('Entered Login or Password is incorrect.');</script>";
		} else echo "<script type='text/javascript'>errorMsg('Entered Login or Password is incorrect.');</script>";
	}
	?>
</body>
</html>
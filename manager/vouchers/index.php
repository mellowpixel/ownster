<?php
include_once("../../inc/SessionClass.php");
include_once("../../inc/DataBaseClass.php");

ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../../error_log/php-error$date.log");

$session    = new Session();
$db         = new DataBase();
$login      = $session->getSessionValue("user_login");
$password   = $session->getSessionValue("user_password");

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
	// $session->closeSession();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!-- <link href="../../css2/admin.css" type="text/css" rel="stylesheet"/> -->
<link href="../../assets/css/page-layout.css" rel="stylesheet" type="text/css" />
<link href="../../css2/vouchers_layout.css" type="text/css" rel="stylesheet"/>
<script type="text/javascript" src="../../inc/js/Utilities.js"></script>
<script type="text/javascript" src="../../inc/js/textFunctions.js"></script>
<!-- <script type="text/javascript" src="../../inc/js/PageSwitch.js"></script> -->

<title>Untitled Document</title>
</head>
<body id="body">
<header>
    <nav>
            
    </nav>
</header>

<div id="wrapper">
    <div id="app_wrapp">
        <div id="statuswrapper">
            <h2 id='message' class="status-wait"></h2>
            <div id='details'></div>
            <button class='close_butt'>X</button>
        </div>

    	<div id="voucher_entries">
        	<form>
                <table class='input-fields-table'>
                    <tr>
                        <td><input type="radio" name="radio_butt" id="price_radio" checked="checked" />Скидка £ <input type="text" id="price_input" class="discount_input" maxlength="5" value="4.99" /></td>
                        <td><input type="radio" name="radio_butt" id="percents_radio" /> % <input type="text" id="percent_input" class="discount_input" maxlength="3" value="0" disabled="disabled" /></td>
                        <td>К-во скидок <input type="text" id="num_of_disc" maxlength="3" value="1" /></td>
                        <td>К-во ваучеров <input type="text" id="quantity" maxlength="3" value="1" /></td>
                        <td>Цена <input type="text" id="vouch_sell_price" maxlength="4" value="4.99" /></td>
                        <td>Годен До: <input type="checkbox" id="exp_date_checker" /></td>
                        <td><input type="text" class="exp_date_inp" id="exp_dd" maxlength="2" value="DD" disabled="disabled" />
                            <input type="text" class="exp_date_inp" id="exp_mm" maxlength="2" value="MM" disabled="disabled" />
                            <input type="text" class="exp_date_inp" id="exp_yyyy" maxlength="4" value="YYYY" disabled="disabled" /></td>
                        <td><label for="voucher-name-checker">Назвать</label><input type="checkbox" id="voucher-name-checker"><input type="text" id="voucher-name" disabled="disabled" maxlength="8"></td>
                        <td><input type="button" id="generate_butt" value="Создать" /></td>
                    </tr>
                </table>
             </form>
        </div>
        <div id='search-wrapper'><form id='voucher-search'>Искать номер ваучера: <input type='text' id='search-input' />&nbsp;<button type='submit'>Search</button></form></div>
    	<table border="0" id="voucher_codes_wrap">
        </table>
    </div>
    
    <div class='popup-window'>
        <div class='output-wrapper'>
        </div>
        <button>Close</button>
    </div>
</div>

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/menu.js"></script>
<script type="text/javascript" src="../../assets/js/main_vouchers.js"></script>
</body>
</html>









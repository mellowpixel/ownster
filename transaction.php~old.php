<?php
include_once("inc/SessionClass.php");
include_once("inc/DataBaseClass.php");
ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "error_log/php-error$date.log");

$session = new Session();
$DBase = new DataBase();

echo"<script>console.log(".json_encode($_SESSION).")</script>";
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    
<meta name="description" content="Ownster :: Custom Travel Card Holders | Photo Gift Idea | Personalised Bus Pass, Oyster Card Wallets No minimum orders. Make personalised oyster card holder online. Add your own photos, design, logo or text. Printed and despatched in 24 hours. Perfect gift Idea for relatives, loved ones, friends or colleagues.">
<meta name="keywords" content="bus pass holder, bus pass wallet, credit card holder, credit card wallet, customised travel wallets, custom travel wallet, freedom pass holder, freedom pass wallet, id card wallet, id card holder, oyster card, oyster card holder, oyster card wallet, oyster online, rail card holder, rail card wallet, train ticket holder, train ticket wallet, travel card, travel card holder, travel card wallet, personalised travel, card holder, personalised travel card wallet, personalised photo wallet, gift idea
gift ideas, personalised gift, personalised gifts, personalised photo gift, personalised photo gifts, personalized gift, personalized gifts, personalized items, personalized photo gift, personalized photo gifts, photo gift, photo gift ideas, photo gifts, picture gifts, unique gift, unique gifts, unique photo gift, custom gifts, customized gift, unusual gifts, picture gifts, cool presents, presents online">
<meta name="author" content="Dmitry Ulyanov, contacts@mellowpixels.com, mellowpixels@gmail.com, http://www.mellowpixels.com" />

<link href="../assets/css/header-style.css" rel="stylesheet" type="text/css" />    
<link href="../assets/css/layout.css" rel="stylesheet" type="text/css" />
<link href="../assets/css/clients-review-style.css" type="text/css" rel="stylesheet" />
<link href="../css2/transparent_message.css" type="text/css" rel="stylesheet" />
<link rel="icon" type="../image/png" href="../favicon.png">
    
<title>Ownster Reviews</title>	
</head>

<body>

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div id="page-wrapper">
<header>
    <div id="logo"></div>
    
    <nav id="main-navigation">
        <ul>
            <li id="home-link"><a>Home</a></li>
            <li id="products-link"><a>Products</a></li>
            <?php $u_email=$session->getSessionValue("user_login");
                if($u_email) echo "<li id='my_account_entrance'><a>".$session->getSessionValue("user_name")."'s Account</a></li><li id='signout'><a>Logout</a></li><script type='text/javascript'>is_loggedin = true</script>";
                else echo "<li id='login-link'><a>Login / Register</a></li>";
            ?>
            <li id="help-link"><a>Help</a></li>
            <li id="cart"><a id="cart-items-counter"></a><span></span></li>
        </ul>
    </nav>

</header>
<!--*************************************************************************************************-->

<main>
    <div class="center">
        <style type="text/css">
            #message_wrapper    {   font-size:12px; }
            .title_message  {   font-size:18px;
                                color:#5dbb6b;  }
            #centered_message{ width: 600px;margin-left: auto;margin-right: auto;text-align: justify;}                
        </style>
        
        <div id="centered_message">
            <?php
                date_default_timezone_set('Europe/Riga');
                include_once("inc/PayPal_PDT_Transaction.php");
                $tx = $_GET['tx'];
                // $pdt_token = $db->getDBField("settings", "paypal_code");;
                
                $response = process_pdt($tx, $DBase->getDBField("settings", "paypal_code"), "https://www.paypal.com/cgi-bin/webscr");
                
                if($response){
                    echo "<h1> Thank you ".$response['first_name']."</h1><p>We have received your payment of <strong>£".$response['mc_gross']."</strong>.<br/>A receipt for your purchase has been sent to your email address: <strong>".$response['payer_email']."</strong></p><p>We will post your order within 24 hours after payment has cleared.<p>Here’s your delivery information:</p><p><strong>".$response['first_name']." ".$response['last_name']."<br/>".$response['address_street']."<br/>".$response['address_city']."<br/>".$response['address_zip']."<br/>".$response['address_country']."</strong></p>";
                    // Save Statistics of User's Session
                    $vouch_code = $session->getSessionValue("redeemed_voucher");
                    if($vouch_code){
                        mysql_query("UPDATE vouchers SET redeemed = 1 WHERE voucher_code = '".$vouch_code."'"); // Mark voucher as redeemed 
                        $session->deleteSessionKey("redeemed_voucher");
                        $session->deleteSessionKey("discount");
                        $session->deleteSessionKey("orders_in_cart");
                        $session->deleteSessionKey("orders_from_history");
                        $session->deleteSessionKey("discount_product_id");
                        $session->deleteSessionKey("discount_product_name");
                        $session->deleteSessionKey("num_of_discounts");
                        $session->deleteSessionKey("discount_price");
                        $session->deleteSessionKey("discount_percent");
                    } else {
                        $session->deleteSessionKey("orders_in_cart");
                        $session->deleteSessionKey("orders_from_history");  
                    }
                } else  {
                    echo "Failed!"; 
                }
            ?>                        
            <p>You may log into your account at <a href="http://www.paypal.com/uk">www.paypal.com/uk</a> to view details of this transaction.</p>
            
        </div>            
    </div>

</main>

<div class="push"></div>
</div>

<footer>
    <div class="footer-links">
        <a href="/clients-reviews/">Reviews</a>
    </div>
    <div id="socnet-icons-wrapper">
        <a id="twitter" target="_blank" href="http://twitter.com/ownster_uk"></a>
        <a id="facebook" target="_blank" href="http://www.facebook.com/ownster.co.uk"></a>
        <a id="instagram" ></a>
    </div>
    <div id="pay-cards-wrapper">
        <img src="/visamastermaestro.png">
    </div>
</footer>

</body>
<script type="text/javascript" src="../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../assets/js/general-functions.js"></script>
<script type="text/javascript" src="../inc/js/Utilities.js"></script>
<script type="text/javascript" src="../inc/js/RegExpTest.js"></script>
<script type="text/javascript" src="../inc/js/validateForm.js"></script>
<script type="text/javascript" src="../assets/js/main_menu.js"></script>
<script type="text/javascript" src="../assets/js/main_clients_review.js"></script>

</html>










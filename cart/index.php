<?php
error_reporting(E_ERROR | E_PARSE);
include_once("../inc/SessionClass.php");
include_once("../inc/DataBaseClass.php");
include_once("../inc/browser_detection.php");
include_once("../assets/php/SharedFunctions.php");
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
$session = new Session();

ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "$root/error_log/php-error$date.log");

$_SESSION["user_system"] = browser_detection('full_assoc');

if( isset($_SESSION["user_path"]) ){
    $_SESSION["user_path"] .= " -> Products";
} else {
    $_SESSION["user_path"] = "Products";
}

if (isset($_SESSION["memory"])) {
    $_SESSION["memory"]["current_page"]="Products";
} else {
    $_SESSION["memory"] = array("data"=>array(), "current_page"=>"Products");
}
// echo"<script>console.log(".json_encode($_SESSION).")</script>";

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Ownster :: Custom Travel Card Holders | Photo Gift Idea | Personalised Bus Pass, Oyster Card Wallets No minimum orders. Make personalised oyster card holder online. Add your own photos, design, logo or text. Printed and despatched in 24 hours. Perfect gift Idea for relatives, loved ones, friends or colleagues.">
    <meta name="keywords" content="bus pass holder, bus pass wallet, credit card holder, credit card wallet, customised travel wallets, custom travel wallet, freedom pass holder, freedom pass wallet, id card wallet, id card holder, oyster card, oyster card holder, oyster card wallet, oyster online, rail card holder, rail card wallet, train ticket holder, train ticket wallet, travel card, travel card holder, travel card wallet, personalised travel, card holder, personalised travel card wallet, personalised photo wallet, gift idea
gift ideas, personalised gift, personalised gifts, personalised photo gift, personalised photo gifts, personalized gift, personalized gifts, personalized items, personalized photo gift, personalized photo gifts, photo gift, photo gift ideas, photo gifts, picture gifts, unique gift, unique gifts, unique photo gift, custom gifts, customized gift, unusual gifts, picture gifts, cool presents, presents online">
    <meta name="author" content="Dmitry Ulyanov, contacts@mellowpixels.com, mellowpixels@gmail.com, http://www.mellowpixels.com" />

    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <!-- Bootstrap -->
    <!-- <link href="/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet"> -->
    <!-- <link href="assets/js/fotorama-4.6.2/fotorama.css" rel="stylesheet" type="text/css" /> -->
    <link href="../assets/css/cart.css" rel="stylesheet">
    <!-- <link href="../assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="../assets/css/homepage-style.css" rel="stylesheet" type="text/css" /> -->
    <title>Ownster Shopping Basket</title>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

  </head>
  <body>
    <!-- Google Tag Manager -->
    <noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-N9VDMC" 
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-N9VDMC');</script>
<!-- End Google Tag Manager -->
    <script type="text/javascript">
        window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
            alert("Error at: line "+lineNumber+", message: "+errorMsg, ", at:"+url);
        }
    </script>
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

    <div class="page-wrapper">
        <header>
            <?php
              include("$root/html-include/header.php");
            ?>
        </header>
        <main>
            <div id='stage-process-image-wrapper'>
                <div class="stage-progress-image basket">
                </div>
            </div>   
            <div class="content-wrapper">                     
                <?php
                   
                    $output = outputBasketContent($session);

                    if($output && $basket_qty > 0){
                        foreach ($output as $product) {
                            $src = "";
                            // One side of the product
                            
                            if(file_exists("../".$product["filepath"])) {
                                $src = "../".$product["filepath"];
                            }
                            
                            echo"<div class='item-wrapper' id='".$product["id"]."' data-price='".$product["price"]."' >
                                    <img class='thumb_img' src='$src'>
                                    <div class='item-controlls'>
                                        <div class='item-details-header'>
                                            <span>Price</span><span>Quantity</span><span>Subtotal</span>
                                        </div>
                                        <div class='item-details'>
                                            <span><a class='price'>".$product["price"]."</a></span>
                                            <span><input name='quantity' class='form-control quantity' maxlength='3' type='text' value='".$product["qty"]."' /></span>
                                            <span><a class='subtotal'>£".$product["subtotal"]."</a></span>
                                            <span><button class='remove-butt'>Remove</button></span>
                                        </div>
                                    </div>
                                </div>";
                        }
                        echo "<div id='subtotal-wrapper'>
                                    <div id='total_order'>
                                    </div>
                                </div>

                                <div class='buttons_wrapper'>
                                    <button id='continue_shop_butt'>Continue Shopping</button>
                                    <button id='checkout_butt'>Proceed to checkout</button>
                                </div>";
                    } else{
                        echo "<div class='empty-basket-wrapper'>
                                <div>
                                    <h1>Your basket is empty</h1>
                                    <h3>What would you like to do?</h3>
                                    
                                    <ul>
                                        <li><a href='/personalised-gifts/personalised-travel-card-holders/'>Create a new travel card wallet?</a></li>
                                        <li><a href='/personalised-gifts/personalised-notebooks/'>Create a new notebook?</a></li>
                                    </ul>
                                </div>
                             </div>";
                    }
                ?>  
               
            </div> <!-- END center -->

            <!-- *********************************************************** -->

            
            <section class='popup-window'>
                <div class="transparrent_back"></div>
                
                <div class="opaque_window">
                    <div class="message_area">
                        <h2>Would you like to Login or Signup to keep your created wallets and address saved in your account?</h2>
                    </div>
                    <div class="confirmation_buttons">
                        <button id='login-butt' title='Register a new account.' >Login</button>
                        <button id='signup-butt' title='Register a new account.' >Signup</button>
                        <button id='guest-checkout-butt' title='Checkout as a guest. Your design will not be saved for future access.' >No Thanks</button>
                    </div>
                </div>
            </section>
            <!-- ********************************************************************** -->

            <footer>
                <?php
                  include("../html-include/footer.php");
                ?>
            </footer>
        </main> <!-- main -->
    </div> <!-- page-wrapper -->
</body>
<script type="text/javascript" src="../inc/js/Utilities.js"></script>
<script type="text/javascript" src="../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../assets/js/general-functions.js"></script>
<script type="text/javascript" src="../assets/js/cart-main.js"></script>

</html>








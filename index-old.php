<?php
include_once("inc/SessionClass.php");
include_once("inc/DataBaseClass.php");
include("inc/browser_detection.php");

ini_set("log_errors", 1);
date_default_timezone_set("Europe/Riga");
$date = date("d-m-y");
ini_set("error_log", "error_log/php-error$date.log");

$session = new Session();
$_SESSION["user_system"] = browser_detection('full_assoc');

if( isset($_SESSION["user_path"]) ){
    $_SESSION["user_path"] .= " -> Homepage";
} else {
    $_SESSION["user_path"] = "Homepage";
}

if (isset($_SESSION["memory"])) {
    $_SESSION["memory"]["current_page"]="Homepage";
} else {
    $_SESSION["memory"] = array("data"=>array(), "current_page"=>"Homepage");
}
// echo"<script>console.log(".json_encode($_SESSION).")</script>";
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="description" content="Ownster :: Custom Travel Card Holders | Photo Gift Idea | Personalised Bus Pass, Oyster Card Wallets No minimum orders. Make personalised oyster card holder online. Add your own photos, design, logo or text. Printed and despatched in 24 hours. Perfect gift Idea for relatives, loved ones, friends or colleagues.">
<meta name="keywords" content="bus pass holder, bus pass wallet, credit card holder, credit card wallet, customised travel wallets, custom travel wallet, freedom pass holder, freedom pass wallet, id card wallet, id card holder, oyster card, oyster card holder, oyster card wallet, oyster online, rail card holder, rail card wallet, train ticket holder, train ticket wallet, travel card, travel card holder, travel card wallet, personalised travel, card holder, personalised travel card wallet, personalised photo wallet, gift idea
gift ideas, personalised gift, personalised gifts, personalised photo gift, personalised photo gifts, personalized gift, personalized gifts, personalized items, personalized photo gift, personalized photo gifts, photo gift, photo gift ideas, photo gifts, picture gifts, unique gift, unique gifts, unique photo gift, custom gifts, customized gift, unusual gifts, picture gifts, cool presents, presents online">
<meta name="author" content="Dmitry Ulyanov, contacts@mellowpixels.com, mellowpixels@gmail.com, http://www.mellowpixels.com" />
<meta name="viewport" content="user-scalable=no" />

    <link href="assets/js/fotorama-4.6.2/fotorama.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/header-style.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/layout.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" />
    <link href="assets/css/homepage-style.css" rel="stylesheet" type="text/css" />
    
    <title>Ownster :: Custom Travel Card Holders | Photo Gift Idea | Personalised Bus Pass, Oyster Card Wallets</title>
    <!--[if lt IE9]
        <link rel="stylesheet" type="text/css" href="assets/css/ie8-FontsFormat.css" />
        <script src="assets/js/html5shiv.min.js"></script>
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

<div id="page-wrapper">
    <header>
        <div id="logo"></div>
        
        <nav id="main-navigation">
            <ul>
                <li id="home-link" class="active"><a>Home</a></li>
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

    <main>
        <script type="text/javascript">
            window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                alert("Error at: line "+lineNumber+", message: "+errorMsg);
            }
        </script>
        <div id="homepage-main-img">
            <div class='fotorama'
                 data-autoplay="7000"
                 data-loop="true"
                 data-nav="none"
                 data-transition="dissolve"
                 data-transitionduration="1000">
                
                <div data-img="assets/layout-img/banner-slides/Diary_on_a_table.jpg">
                    <!-- <div class='banner-text slide1'>
                        <h1>WELCOME TO NEW OWNSTER!</h1>
                        <p>Now with even more unique ideas in using your most treasured photos…</p>
                    </div> -->
                </div>

                <div data-img="assets/layout-img/banner-slides/Jeans_frontpage_image_london.jpg">
                </div>
                
            </div>
        </div>

        <div id='turnaround-info'>
            <table>
                <tr>
                    <td>Quick &amp; Easy Five Stage Process</td>
                    <td class="spliter" >&bull;</td>
                    <td>Free UK Shipping</td>
                    <td class="spliter" >&bull;</td>
                    <td>24h Despatch on all Travel Card Holders</td>
                </tr>
            </table>
        </div>

        <div id='stage-process-image-wrapper'>
            <!-- <div class="stage-progress-image select">
            </div> -->
            <img src="assets/layout-img/progress-front-page.png"/>
            <div class="stage-description">
                <ol>
                    <li>1. Select</li>
                    <li>2. Personalise</li>
                    <li>3. Review</li>
                    <li>4. Basket</li>
                    <li>5. Checkout</li>
                </ol>
            </div>
        </div>
       <!--  <div class="text-block">
            <p>
                Ownster lets you design your own unique travel card wallet online in just a few minutes! We allow you to upload your favourite photos and personalise the caption to get your special travel card holder printed and posted to your preferred address.
            </p>
            <p>
                Personalised travel card holder can become either an individual accessory for yourself or a thoughtful gift for your relatives, loved ones, friends or colleagues. Ownsters will make it easy and fascinating for you to create your own personalised oyster card holder and to expand the opportunities to showcase your exciting and original ideas, illustrating those precious treasured moments of your life.
            </p>
            <p>
                Looking for quantities of 250 and more? <a href="http://www.carboncubedesign.com/" target="blank">Click here.</a>
            </p>
        </div> -->
       
        <!-- TRAVELCARD WALLETS -->
        <div class="group-block">
            <div class="product-img-wrapper">
                <img src="/products/covers/Portrait_Landscape_walletsCombo.jpg">
            </div>
            <div class="product-description-wrapper">
                <div class="product-description">
                    <h2>Personalised Travel Card Holders</h2>
                    <p>
                    <ul>
                        <li>2 shapes and 10 inner colours are now available to order.</li>
                        <li>Choose from tens of different layouts to make beautiful collages.</li>
                        <li>Connect to your Facebook or Instagram account to customize your travel card holder.</li>
                        <li>A number of fonts available to personalise the caption.</li> 
                    </ul>
                    <p>
                        Ownster lets you design your own unique travel card wallet online in just a few minutes! We allow you to upload your favourite photos and personalise the caption to get your special travel card holder printed and posted to your preferred address. 
                    </p>
                    </p>
                </div>
                <div class="product-actions-wrapper">
                    <div class='price-holder'><a>from only</a> <a class="price">£4.99</a><br>free UK delivery</div>

                    <!-- Add same data-group value to the Switch Case in /our-products/index.php -->
                    <button class='product-range-butt' data-group="travel-card-wallets">View Range</button>
                </div>
            </div>
        </div>
        <!-- DIARY GROUP -->
        <div class="group-block">
            <div class="product-img-wrapper">
                <img src="/products/covers/Diary_cover.jpg">
            </div>
            <div class="product-description-wrapper">
                <div class="product-description">
                    <h2>Photo Notebooks</h2>
                    <p>

                    <ul>
                    <li>Hard PU Cover (bicast leather)</li>
                    <li>Both Front and Back covers are printable</li>
                    <li>Choice of squared or lined paper</li>
                    <li>Rounded corners</li>
                    <li>Bookmark</li>
                    <li>Connect to your Facebook or Instagram account to customize your travel card holder.</li>
                    <li>A number of fonts available to personalise the caption.</li>
                    </ul>
                    <p>
                    Personalised photo notebook can become either an individual accessory for yourself or a thoughtful gift for your relatives, loved ones, friends or colleagues. Ownsters will make it easy and fascinating for you to create your own custom photo notebook and to expand the opportunities to showcase your exciting and original ideas, illustrating those precious treasured moments of your life.
                    </p>
                    </p>
                </div>
                <div class="product-actions-wrapper">
                    <div class='price-holder'><a>from only</a> <a class="price">£10.99</a><br>free UK delivery</div>

                    <!-- Add same data-group value to the Switch Case in /our-products/index.php -->
                    <button class='product-range-butt' data-group="notebook">View Range</button>
                </div>
            </div>
        </div>

<!--         <?php

        /*$db = new DataBase();

        $result = mysql_query("SELECT id, place, name, price, description FROM products WHERE active > 0 ORDER BY place ASC");
        if($result){
            while($row = mysql_fetch_assoc($result)){
                echo "<div class='product-cover-block' data-id='".$row["id"]."' data-name='".$row["name"]."' data-price='".$row["price"]."'>".$row["description"]."</div>";
            }
        }*/

        ?>
 -->
    </main>

<div class="push"></div>
</div>

<footer>

    <div class="footer-links">
        <a href="/clients-reviews/">Reviews</a>
        <a href="https://plus.google.com/114735459338047042839" rel="publisher">Google+</a>
    </div>
    <div class="footer-extra-info">Looking for quantities of 250 and more? <a href="http://carboncubedesign.com">Click here...</a></div>
    <div id="socnet-icons-wrapper">
        <a id="twitter" target="_blank" href="http://twitter.com/ownster_uk"></a>
        <a id="facebook" target="_blank" href="http://www.facebook.com/ownster.co.uk"></a>
        <a id="instagram" ></a>
    </div>
    <div id="pay-cards-wrapper">
        <img src="/visamastermaestro.png">
    </div>
</footer>

<div class="popup-message-window do-action">
    <div id="transparent-background"></div>
        </div>
        <div class="buttons-wrapper">
            <button class="yes-butt">Ok</button>
        </div>
    </div>
</div>
</body>

<script type="text/javascript" src="assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="assets/js/fotorama-4.6.2/fotorama.js"></script>
<script type="text/javascript" src="assets/js/general-functions.js"></script>
<script type="text/javascript" src="assets/js/main_menu.js"></script>
<script type="text/javascript" src="assets/js/main_homepage.js"></script>
</html>









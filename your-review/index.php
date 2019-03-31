<?php
error_reporting(E_ERROR | E_PARSE);
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/inc/SessionClass.php");
include_once("$root/inc/DataBaseClass.php");
// include_once("$root/inc/browser_detection.php");

ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "$root/error_log/php-error$date.log");

$session = new Session();
// $_SESSION["user_system"] = browser_detection('full_assoc');

if( isset($_SESSION["user_path"]) ){
    $_SESSION["user_path"] .= " -> Leave Review";
} else {
    $_SESSION["user_path"] = "Leave Review";
}

if (isset($_SESSION["memory"])) {
    $_SESSION["memory"]["current_page"]="Leave Review";
} else {
    $_SESSION["memory"] = array("data"=>array(), "current_page"=>"Leave Review");
}
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
    <link href="../../assets/css/your-review.css" rel="stylesheet" type="text/css" />    
    <link rel="icon" type="../../image/png" href="../../favicon.png">
    <!-- <link href="../assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="../assets/css/homepage-style.css" rel="stylesheet" type="text/css" /> -->
    <title>Please Leave Your Rewiew</title>
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
            alert("Error at: line "+lineNumber+", message: "+errorMsg);
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
            <div class="content-wrapper">
                <div class="centered">
                    <div id="thanx_msg">
                        <h1>Thank you! We have your review!</h1>
                        <div class="buttons_wrapper">
                            <a href="/"><button id="but1">Go to Home Page</button></a>
                            <a href="/clients-reviews/"><button id="but2">Go to Reviews Page</button></a>
                        </div>
                    </div>
                    <div id="review_edit_area">
                        <?php

                            if(isset($_GET["code"])){
                                include_once("../inc/DataBaseClass.php");
                                $db = new DataBase();

                                $code = $_GET["code"];

                                $result = mysql_query("SELECT first_name, last_name FROM completed_payments WHERE user_review ='$code'");
                                if ($result) {
                                    echo "<script>var user_code = '$code';</script>";
                                    $user_data = mysql_fetch_assoc($result);
                                }
                            }
                        ?>
                        <div class="message">
                            <?php 
                                if(isset($user_data) && is_array($user_data)){
                                    echo "<h1 id='greetings_message'>Hello ".$user_data["first_name"]." ".$user_data["lastname_name"]."!</h1>";
                                    echo "<h2>Thank you for coming back! We are grateful that you decided to share your experience with us and our customers!</h2>";
                                } else {
                                    echo "<h1 id='greetings_message'>Hello! Would You like to leave a review?</h1>";
                                    echo "<h3>Please enter your E-mail address, so we can find your order:</h3>";
                                    echo "<a id='error-message'></a></br>";
                                    echo "<input type='text' id='user-email-input'>";
                                }
                             ?>
                        </div>

                        <div id="rate-wrapper" data-rating='5'>
                            <h3>How would you rate your overall experience with us?</h3>
                            <div id='stars-wrapper'>
                                <!-- &#9733; full
                                     &#9734; empty -->
                                <input type="radio" name='rating' id="star1" value="1"/><label class='star full' for="star1">&#9733;</label>
                                <input type="radio" name='rating' id="star2" value="2"/><label class='star full' for="star2">&#9733;</label>
                                <input type="radio" name='rating' id="star3" value="3"/><label class='star full' for="star3">&#9733;</label>
                                <input type="radio" name='rating' id="star4" value="4"/><label class='star full' for="star4">&#9733;</label>
                                <input type="radio" name='rating' id="star5" value="5"/><label class='star full' for="star5">&#9733;</label>
                            </div>
                        </div>

                		<div id="text_area_wrapper">
                            <textarea id="html-text-area"></textarea>
                        </div>

                        <div class="buttons_wrapper">
                            <button id="save-review-butt">Leave Review</button>
                        </div>
                    </div>
                </div>
            </div>
            <footer>
                <?php
                  include("$root/html-include/footer.php");
                ?>
            </footer>
        </main>
    </div>
</body>
<script type="text/javascript" src="../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../assets/js/general-functions.js"></script>
<script type="text/javascript" src="../inc/js/Utilities.js"></script>
<script type="text/javascript" src="../inc/js/RegExpTest.js"></script>
<script type="text/javascript" src="../inc/js/validateForm.js"></script>
<script type="text/javascript" src="../assets/js/main_menu.js"></script>
<script type="text/javascript" src="../assets/js/jHtmlArea/scripts/jHtmlArea-0.8.js"></script>
<script type="text/javascript" src="../assets/js/main_leave_review.js"></script>

</html>










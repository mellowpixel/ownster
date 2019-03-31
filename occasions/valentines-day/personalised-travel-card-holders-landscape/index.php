<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/inc/SessionClass.php");
include_once("$root/inc/DataBaseClass.php");
include_once("$root/inc/browser_detection.php");
include_once("$root/assets/configs/OccasionsConfig.php");

ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "$root/error_log/php-error$date.log");

@$session = new Session();
$conf = new OccasionsConfig();
// $db = new DataBase();
$_SESSION["user_system"] = browser_detection('full_assoc');

if( isset($_SESSION["user_path"]) ){
    $_SESSION["user_path"] .= " -> Occasions";
} else {
    $_SESSION["user_path"] = "Occasions";
}
// echo"<script>console.log(".json_encode($_SESSION).")</script>";

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Make your own oyster card holder with favourite photos – from only £4.99. Free UK Delivery. Add your own photos, designs, logos or text. Unique Personalised Gifts for your relatives, loved ones, friends or colleagues.">
    <meta name="keywords" content="personalised oyster card holders, oyster card, oyster card holder, travel card holder, bus pass holder, id card holder">
    <meta name="author" content="Dmitry Ulyanov, contacts@mellowpixels.com, mellowpixels@gmail.com, http://www.mellowpixels.com" />

    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <!-- Bootstrap -->
    <!-- <link href="/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet"> -->
    <!-- <link href="assets/js/fotorama-4.6.2/fotorama.css" rel="stylesheet" type="text/css" /> -->
    <link href="/assets/css/occasions.css" rel="stylesheet">
    <!-- <link href="/assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="/assets/css/homepage-style.css" rel="stylesheet" type="text/css" /> -->
    <title>Personalised Oyster Card Holders, Travel Wallets – from only £4.99</title>
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
            <?php 
                $conf = new OccasionsConfig(array(  "occasion"  => "valentines", 
                                                    "level"     => "load landscape wallet templates")); 
            ?>
            <div class='content-wrapper'>
                
                <?php include("$root/html-include/occasions/select_product_options_content.php"); ?>
                
                <footer>
                    <?php
                      include("$root/html-include/footer.php");
                    ?>
                </footer>
            </div>
        </main>
</body>

<script type="text/javascript" src="/assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="/assets/js/main_occasions.js"></script>
</html>

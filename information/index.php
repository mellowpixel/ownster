<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/inc/SessionClass.php");
include_once("$root/inc/DataBaseClass.php");
include_once("$root/inc/browser_detection.php");

ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "$root/error_log/php-error$date.log");

$session = new Session();
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
    <link href="../../assets/css/information.css" rel="stylesheet" type="text/css" />    
    <link rel="icon" type="../../image/png" href="../../favicon.png">
    <!-- <link href="../assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="../assets/css/homepage-style.css" rel="stylesheet" type="text/css" /> -->
    <title>Ownster Information</title>
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
                   <?php
                        $db = new DataBase();

                        $id = isset($_GET["page_id"])   ? $_GET["page_id"]
                                                        : 1; // privacy-policy;

                        $result = mysql_query("SELECT html_content FROM footer_links WHERE id = $id");
                        
                        if ($result) {
                            $content = mysql_result($result, 0);
                            echo stripcslashes(html_entity_decode($content, ENT_QUOTES, "UTF-8"));
                        }
                   ?>
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

<script type="text/javascript" src="../../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../../assets/js/general-functions.js"></script>

</html>










<?php
error_reporting(E_ERROR | E_PARSE);
include_once("../inc/SessionClass.php");
include_once("../inc/DataBaseClass.php");
include_once("../inc/browser_detection.php");
include_once("../assets/php/SharedFunctions.php");

ini_set("log_errors", 1);
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

$session = new Session();
$_SESSION["user_system"] = browser_detection('full_assoc');

$mobile = false;
if( isset($_SESSION["user_system"]["mobile_data"]) && 
    $_SESSION["user_system"]["mobile_data"] !=='' && 
    $_SESSION["user_system"]["mobile_data"] !== null) {

    $mobile = true;
}

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

$output = outputBasketContent($session);                            

if($output){
    $basket_content = "";
    foreach ($output as $id=>$product) {
        $src = "";
        // One side of the product
        
        if(file_exists("../".$product["filepath"])) {
            $src = "../".$product["filepath"];
        }
        
        $basket_content .= "<div class='item_container' data-price='".$product["price"]."' data-db_id='".$product["id"]."'>
                <div class='img-wrapper'>
                    <img name='thumb_img' src='$src' />
                </div>
                
                <div class='quantity_label'>
                    <div>
                        <div class='price-wrapper'><h3 class='show-on-mobile'>Price </h3><span class='price' id='price_holder".$id."'></span></div>
                        <div class='qty-wrapper'><h3 class='show-on-mobile'>Qty. </h3><span class='quantity'>x".$product["qty"]."</span></div>
                        <div class='subtotal-wrapper'><h3 class='show-on-mobile'>Subtotal </h3><span class='total_for_item' id='total_for_item".$id."'></span></div>
                    </div>
                </div>
                <input type='hidden' name='item_order_details' id='".$product["id"]."' value='".$product["qty"]."' />
            </div>";
    }
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
    <link href="../assets/css/checkout.css" rel="stylesheet">
    <!-- <link href="../assets/css/product-description-block-style.css" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="../assets/css/homepage-style.css" rel="stylesheet" type="text/css" /> -->
    <title>Ownster Checkout</title>
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="/assets/js/jquery-1.11.0.min.js"></script>
    <script src="/assets/angular/angular.min.js"></script>
    <script src="/assets/angular/validation-config.js"></script>
  </head>
  <body ng-app="validationApp" ng-controller="payController">
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
              include("../html-include/header.php");
            ?>
        </header>
        <main>
            <div class='content-wrapper'>
                <div class="web-content">
                    <form name="signupform" ng-submit="submitForm(signupform.$valid)" novalidate>
                    <div id='cat_name_container'>
                        <div class="titles-wrapper">
                            <div class="left-side">
                                <h3 id='postal_info'>Postal Information</h3>
                            </div>
                            <div class="right-side">
                                <div class="row-wrapper">
                                    <div class="pic-title">
                                        <h3 id='item_descr'>Item Description</h3>
                                    </div>
                                    <div class="quote-wrapper">
                                        <div class="quote-row">
                                            <h3 id='price_caption'>Price</h3>
                                            <h3 id='quantity_caption'>Qty</h3>
                                            <h3 id='subtotal_caption'>Subtotal</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="left-column">

                    	<div id="address_list_window" style="display:none;">
                    	    <div id="scrolable_page">        
                    	    </div>
                    	</div>
                        <!-- ************************************************************** -->
                        
                        <div id="delivery_info">
                            <div class="form-row" ng-class="{ 'has-error' : signupform.name.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.name.$invalid && submitted">You name is required.</p>
                                    </div>
                                </div>
                                <label for="name-input" class="control-label">Name</label>
                                <input class="form-control" type="text" name="name" ng-model="name" required>
                            </div>
                            <div class="form-row" ng-class="{ 'has-error' : signupform.lastname.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.lastname.$invalid && submitted">You Last Name is required.</p>
                                    </div>
                                </div>
                                <label for="last-name-input" class="control-label">Last Name</label>
                                <input class="form-control" type="text" name="lastname" ng-model="lastname" required>
                            </div>
                            <div class="form-row" ng-class="{ 'has-error' : signupform.email.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.email.$invalid && submitted">Enter a valid email.</p>
                                    </div>
                                </div>
                                <label class="control-label">E-mail</label>
                                <input class="form-control" type="email" name="email" ng-model="email" ng-pattern="/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/" required>
                            </div>
                            <div class="form-row" ng-class="{ 'has-error' : signupform.address.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.address.$invalid && submitted">Your address is required.</p>
                                    </div>
                                </div>
                                <label class="control-label">Address</label>
                                <input class="form-control" type="text" name="address" ng-model="address" required>
                            </div>
                            <div class="form-row" ng-class="{ 'has-error' : signupform.address2.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.address2.$invalid && submitted">Please enter a valid address.</p>
                                    </div>
                                </div>
                                <label class="control-label">Address 2</label>
                                <input class="form-control" type="text" name="address2" ng-model="address2">
                            </div>
                            <div class="form-row" ng-class="{ 'has-error' : signupform.city.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.city.$invalid && submitted">Your city is required.</p>
                                    </div>
                                </div>
                                <label class="control-label">City</label>
                                <input class="form-control" type="text" name="city" ng-model="city" required>
                            </div>
                            <div class="form-row" ng-class="{ 'has-error' : signupform.postcode.$invalid && submitted }">
                                <div class="help-block">
                                    <div>
                                        <p ng-show="signupform.postcode.$invalid && submitted">Your postcode is required.</p>
                                    </div>
                                </div>
                                <label class="control-label">Postal Code</label>
                                <input class="form-control" type="text" name="postcode" ng-model="postcode" required>
                            </div>
                            <div class="form-row">
                                <label class="control-label">Country</label>
                                <select class="form-control country_input" name="country" ng-model="country">
                                    <option ng-repeat="c in countries" value="{{c}}">{{c}}</option>
                                </select>
                            </div>
                        </div> <!-- <div id="delivery_info"> -->                      
                    </div>
                    <!-- *************************************************************** -->
                    <div class="right-column basket-content" id="non-mobile-basket-content">
                        <?php
                            echo $basket_content;
                    	?>	
                    </div>

                    <div class="bottom-wrapper">
                        <hr>
                        <div id="captions-row">
                            <span><h4>Estimated Delivery Date</h4></span>
                            <span><h4>Your order will be sent to:</h4></span>
                            <span><h4>Redeem Voucher</h4></span>
                            <span><h4>Total Order</h4></span>
                        </div>

                        <div class="left-column">
                            <div id="delivery_details_container">
                                <span id="estimated_msg"><h4>Estimated Delivery Date</h4></span>
                                <span id="order_will_be_sent"><h4>Your order will be sent to:</h4></span>
                            </div>
                            
                            <div class="delivery-info-wrapper">
                                <div id="delivery_date_wrapper">
                                    <div class="weekday"></div>
                                    <span class="date"></span>
                                    <span class="month"></span>
                                    <div id="delivery-message">Please contact our support team for details.</div>
                                </div>

                                <div id="address_render">
                                </div>
                            </div>
                        </div>

                        <div class="right-column">
                            <div id="pay-details-wrapper">
                                <span><h4>Redeem Voucher</h4></span>
                                <span><h4>Total Order</h4></span>
                            </div>
                            <div id="voucher-order-amount-wrapper">
                                <span>
                                    <input class="form-control redeem_input" type="text" maxlength="9" />
                                    <button class="redeem_butt" type="button">Ok</button>
                                </span>
                                <span>
                                    <h2 class="total_order"></h2>
                                </span>
                            </div>

                           <!--     PayPal checkout -->
                            <div id="quote_wrapper">
                            </div>
                            
                            <div class='pay-butt-wrapper'>
                                <!-- <button class="pay_butt" src="../layoutimg2/ui/pay_now_butt.png" name="submit" alt="PayPal — The safer, easier way to pay online.">Pay Now</button> -->
                                <button class="pay_butt" type="button" class="btn btn-primary">Pay Now</button>
                            </div>

                        </div>
                    </div>
                    </form>
                </div>

                <div class="mobile-content">
                    <div class="row-A basket-content" id="mobile-basket-content">
                        <?php
                            echo $basket_content;    
                        ?> 
                    </div>

                    <div class="row-B">
                        <hr>
                        <h2>Total Order:</h2><h2 class="total_order"></h2>
                    </div>

                    <div class="row-C">
                        <h3>Redeem Voucher</h3>
                        <span><input class="form-control redeem_input" type="text" maxlength="9" /></span>
                        <span><button class="redeem_butt" type="button">Ok</button></span>

                    </div>

                    <div class="row-D">
                        <h3 class="title">Estimated Delivery Date:</h3>
                        <div><h3><a class="weekday"></a> <a class="date"></a> <a class="month"></a></h3></div>
                    </div>

                    <form name="signupform" ng-submit="submitForm(signupform.$valid)" novalidate>
                        <div class="row-E">
                            <hr>
                            <!-- <span class="load-addr-butt"><button class="load_from_address_butt">My Saved Addresses</button></span> -->
    
                            <div id="delivery_info_mobile">
                                <div class="form-row" ng-class="{ 'has-error' : signupform.name.$invalid && submitted }">
                                    <label for="name-input" class="control-label">Name</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.name.$invalid && submitted">You name is required.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="text" name="name" ng-model="name" required>
                                </div>
                                <div class="form-row" ng-class="{ 'has-error' : signupform.lastname.$invalid && submitted }">
                                    <label for="last-name-input" class="control-label">Last Name</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.lastname.$invalid && submitted">You Last Name is required.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="text" name="lastname" ng-model="lastname" required>
                                </div>
                                <div class="form-row" ng-class="{ 'has-error' : signupform.email.$invalid && submitted }">
                                    <label class="control-label">E-mail</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.email.$invalid && submitted">Enter a valid email.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="email" name="email" ng-model="email" ng-pattern="/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/" required>
                                </div>
                                <div class="form-row" ng-class="{ 'has-error' : signupform.address.$invalid && submitted }">
                                    <label class="control-label">Address</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.address.$invalid && submitted">Your address is required.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="text" name="address" ng-model="address" required>
                                </div>
                                <div class="form-row" ng-class="{ 'has-error' : signupform.address2.$invalid && submitted }">
                                    <label class="control-label">Address 2</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.address2.$invalid && submitted">Please enter a valid address.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="text" name="address2" ng-model="address2">
                                </div>
                                <div class="form-row" ng-class="{ 'has-error' : signupform.city.$invalid && submitted }">
                                    <label class="control-label">City</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.city.$invalid && submitted">Your city is required.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="text" name="city" ng-model="city" required>
                                </div>
                                <div class="form-row" ng-class="{ 'has-error' : signupform.postcode.$invalid && submitted }">
                                    <label class="control-label">Postal Code</label>
                                    <div class="help-block">
                                        <div>
                                            <p ng-show="signupform.postcode.$invalid && submitted">Your postcode is required.</p>
                                        </div>
                                    </div>
                                    <input class="form-control" type="text" name="postcode" ng-model="postcode" required>
                                </div>
                                <div class="form-row">
                                    <label class="control-label">Country</label>
                                    <select class="form-control country_input" name="country" ng-model="country">
                                        <option ng-repeat="c in countries" value="{{c}}">{{c}}</option>
                                    </select>
                                </div>
                            </div> <!-- <div id="delivery_info"> -->  
                                
                        </div>
                        <div class="row-F">
                            <div class='pay-butt-wrapper'>
                                <!-- <button class="pay_butt" src="../layoutimg2/ui/pay_now_butt.png" name="submit" alt="PayPal — The safer, easier way to pay online.">Pay Now</button> -->
                                <button class="pay_butt" type="button" class="btn btn-primary">Pay Now</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div> <!-- content_wrapper -->
            
            <div id="submit_form"></div>

            <section class='popup-window'>
                <div class="transparrent_back"></div>
                
                <div class="opaque_window">
                    <div class="message_area">
                        
                    </div>
                    <div class="confirmation_buttons">
                        
                    </div>
                </div>
            </section>

            <footer>
                <?php
                  include("../html-include/footer.php");
                ?>
            </footer>
        </main>
</body>

<?php if(isset($_SESSION["user_login"])){ echo "<script>var USER_EMAIL = '".$_SESSION["user_login"]."'</script>"; } ?>
<script type="text/javascript" src="../inc/js/RegExpTest.js"></script>
<script type="text/javascript" src="../inc/js/countrySelect.js"></script>
<!-- <script type="text/javascript" src="../inc/js/validateForm.js"></script> -->
<script type="text/javascript" src="../inc/js/Utilities.js"></script>

<!-- <script type="text/javascript" src="../assets/js/jquery-1.11.0.min.js"></script> -->
<script type="text/javascript" src="../assets/js/general-functions.js"></script>
<!-- <script type="text/javascript" src="../assets/js/main_menu.js"></script> -->
<script type="text/javascript" src="../assets/js/checkout_main.js"></script>
</html>









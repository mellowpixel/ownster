<?php
error_reporting(E_ERROR | E_PARSE);
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
include_once("$root/inc/SessionClass.php");
include_once("$root/inc/DataBaseClass.php");
include_once("$root/assets/php/SharedFunctions.php");
if(!isset($session)){
  $session = new Session();
}
$basket_qty = getBasketQty($session);
?>
<img class="logo-background" src="/assets/layout-img/header/large-yellow-top-corner.png">

<div class="logo-wrapper">
  <a href="/">
    <img src='/assets/layout-img/header/logo.png'>
  </a>
</div>

<nav class="header-navigation web">
  <!-- <div id="main-menu"> -->
    <div class="user-navigation web">
      <ul>
          <?php $u_email=$session->getSessionValue("user_login");
            if($u_email) echo "<li id='my_account_entrance' data-ajax='false'><a href='/my-account/' data-ajax='false'>".$session->getSessionValue("user_name")."'s Account</a></li><li><a href='/logout/' data-ajax='false'>Logout</a></li><script type='text/javascript'>is_loggedin = true</script>";
            else echo "<li><a href='/login/' data-ajax='false'>Login</a></li>";
          ?>
        <li><a href="/signup/" data-ajax="false">Signup</a></li>
        <li><a href="/information/help/" data-ajax="false">Help</a></li>
      </ul>
    </div>
    <div class="page-navigation headermenu" onmouseout="hideSubMenu('make')">
      <ul>
        
        <li><a href="/" data-ajax="false"><img src="/assets/layout-img/header/icon_home.png"><span>Home</span></a></li>
        <li id="nav-make-butt" onmouseover="showSubMenu('make');">
          <a href="/personalised-gifts/" data-ajax="false"><img src="/assets/layout-img/header/icon_personalize.png">
            <span>Make</span>
          </a>
          <div class="popup-menu make">
            <ul>
              <li><a data-ajax="false" href="/personalised-gifts/personalised-travel-card-holders/">Travel Card Holder</a></li>
              <li><a data-ajax="false" href="/personalised-gifts/personalised-notebooks/">Notebook</a></li>
            </ul>
            <div class="decor-triangle-pointer"></div>
            <div class="mouse-reaction"></div>
          </div>
        </li>

        <li id="nav-occasions-butt" onmouseover="showSubMenu('occasions');">
          <!-- <a href="/occasions/" data-ajax="false"> -->
            <img src="/assets/layout-img/header/icon_gifts.png">
            <span>Occasions</span>
          <!-- </a> -->
          <div class="popup-menu occasions">
            <ul>
              <?php
                $db = new DataBase();
                $occ_data_array = getOccasionsData($db);

                if(!$occ_data_array["error"]){
                  $occs = $occ_data_array["occasions_data"];
                  if(is_array($occs)){
                    foreach ($occs as $occ) {
                      echo "<li><a data-ajax='false' href='{$occ["link"]}'>{$occ["name"]}</a></li>";
                    }
                  }
                }
                unset($db);
              ?>
            </ul>
            <div class="decor-triangle-pointer"></div>
            <div class="mouse-reaction"></div>
          </div>
        </li>

        <!-- <li><a href="#" data-ajax="false"><img src="/assets/layout-img/header/icon_gifts.png"><span>Occasions</span></a></li> -->
        <li><a href="/cart/" data-ajax="false"><div class="basq-qty-wrapper"><img src="/assets/layout-img/header/icon_basket.png"><?php echo "<b class='basket-qty'>$basket_qty</b>"; ?></div><span>Basket</span></a></li>
      </ul>
    </div>
  <!-- </div> -->
</nav>

<nav class='header-navigation mobile'>
  <div class="mob-nav-wrapper">
    <div class='mobile-basket'>
      <div class="basket-content-wrapper">
        <a href="/cart/" data-ajax="false">
          <?php echo "<b class='mob-basket-qty'>$basket_qty</b>"; ?>
          <img src="/assets/layout-img/header/icon_basket_mobile.png">
        </a>
      </div>
    </div>
    <div class="sandwich">
      <img src="/assets/layout-img/header/icon_sandwich.png" onclick="openMenu();">
    </div>
  </div>
</nav>

<div id="mobile-menu">
  <div class="list-wrapper">
    <ul>
      <li><a href="/" data-ajax="false"><div><img src="/assets/layout-img/header/high_res/icon_home.png" width="40px"><span>Home</span></div></a></li>
      <li><a href="/personalised-gifts/" data-ajax="false"><div><img src="/assets/layout-img/header/high_res/icon_personalize.png" width="40px"><span>Make</span></div></a></li>
      <li><a href="/occasions/valentines-day/" data-ajax="false"><div><img src="/assets/layout-img/header/high_res/icon_gifts.png" width="40px"><span>Occasions</span></div></a></li>
      <li><a href="/login/" data-ajax="false"><div><span>Login</span></div></a></li>
      <li><a href="/signup/" data-ajax="false"><div><span>Signup</span></div></a></li>
      <li><a href="/information/help/" data-ajax="false"><div><span>Help</span></div></a></li>
    </ul>
  </div>
</div>

<script>
  
  function doToValentines(){
    if($("#mobile-style-detector:visible").length >= 1 ){
      window.location = "/occasions/valentines-day/";
    }
  }

  window.onresize = function(event) {
      
  };

  function openMenu(){
    var menu = document.getElementById("mobile-menu");
    if(menu.className !== "visible"){
      menu.className = "visible";  
    } else {
      menu.className = "";
    }
    
  }

  function showSubMenu(menu){
    switch(menu){
      case "make": $(".popup-menu.make").css({"display":"block"}).addClass("fadein"); break;
      case "occasions": $(".popup-menu.occasions").css({"display":"block"}).addClass("fadein"); break;
    }
  }

  function hideSubMenu(){
    $(".popup-menu").css({"display":"none"});
  }

</script>











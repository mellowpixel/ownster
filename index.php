<?php
  ini_set("log_errors", 1);
  $root = realpath($_SERVER["DOCUMENT_ROOT"]);
  ini_set("error_log", "$root/error_log/php-error$date.log");
  error_reporting(E_ERROR | E_PARSE);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="description" content="Make your own unique personalised gifts online in just a few minutes! Upload your favourite photos and personalise the caption. Photo gift ideas from only £4.99.">
    <meta name="keywords" content="personalised gifts, personalized gifts, gift ideas, gifts online, photo gifts, oyster card, oyster card holder, travel card holder">

    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Personalised Gifts - Photo Gift Ideas - Ownster.co.uk</title>
    <!-- Bootstrap -->
    <!-- <link href="/assets/bootstrap/css/bootstrap.min.css" rel="stylesheet"> -->
    <link href="assets/js/fotorama-4.6.2/fotorama.css" rel="stylesheet" type="text/css" />
    <link href="/assets/css/homepage.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

  </head>
  <body>
    <div class="page-wrapper">
      
      <header>
        <?php
          include("$root/html-include/header.php");
        ?>
      </header>
      <main>
        <div class='content-wrapper'>
          <!-- Slides -->
          
          <!-- <section class="slider-section">
            <div class="fotorama slider"
              data-autoplay="7000"
              data-loop="true"
              data-arrows="always"
              data-transition="slide"
              data-click="true"
              data-transitionduration="500"
              data-width="100%"
              data-ratio="990/460">

              <div>
                <a class="mobile-link" href="/personalised-gifts/personalised-travel-card-holders/">
                  <div class="homepage-slide-1">
                    <div class="slide img">
                      <img src="/products/slider_images/portrait_wallet_slide.png">
                    </div>
                    <div class="slide description">
                      <h1>£1 &nbsp;OFF ALL PREMIUM TRAVEL CARD HOLDERS</h1>
                      <h1 style="margin-top:0px;"><strike style='color:#555 !important;'>£6.99</strike> NOW ONLY £5.99</h1>
                      <p>
                        <ol style='margin:0; padding:0; margin-left:20px;'>
                          <li class="tickcheck">Double thickness</li>
                          <li class="tickcheck">10 inner colours available to order</li>
                        </ol>
                      </p>
                      <p class='little-tip-text'></p>
                      
                      <div class="show-hide hide">
                        <ul>
                          <li>
                            <button class="product-range-butt brick bg-green" data-group="travel-card-wallets">Personalise &nbsp;Now</button>
                          </li>
                        </ul>
                      </div>

                    </div>
                    <div class="show-hide show">
                      <button class="product-range-butt brick bg-green" data-group="travel-card-wallets">Personalise &nbsp;Now</button>
                    </div>
                  </div>
                </a>
              </div>

            </div>
            <img class="gallery-larg-yellow-corner-bottom-right" src="/assets/layout-img/yellow-coener-right-bottom_2.png">
          </section> -->

          <div class='main-banner'>
            
              <div class="homepage-slide-valentines_day">
                <a href="/occasions/valentines-day/personalised-travel-card-holders-landscape/">
                <div class="slide img">
                  
                  <img class='banner-img-lg' src="/assets/layout-img/homepage_banner/valentines_day_banner_1470px.jpg">
                  <img class='banner-img-s' src="/assets/layout-img/homepage_banner/valentines_banner_short_mob.jpg">
                  
                </div>
                <div class='bottom-wrapper'>
                  <span>
                    <h3>... with a personalised oyster card holder from ownster.co.uk</h3>
                  </span>
                  <span>
                    <button class="personalise-butt" >Personalise &nbsp;Now</button>
                  </span>
                </div>
                </a>
              </div>
              <img class="gallery-larg-yellow-corner-bottom-right" src="/assets/layout-img/yellow-coener-right-bottom_2.png">
          </div>

          <div class="offers-line">
            <div class="centered">
              <h3>Now use the most of iPhone, iPad and Android devices to upload your photos!</h3>             
            </div>
          </div>

          <!-- CONTENT -->
          <section class ="content products">
            <!-- ************** -->
            <div class='product-wrapper'>

              <div class='product-picture-wrapper'>
                <h1>Personalised Travel Card Holders</h1>
                <img src="/products/covers/wallets_group.jpg">
                <p>24H Despatch, Free UK Shipping, from only £4.99</p>
                <button class='product-range-butt' data-group="personalised-travel-card-holders/">Shop Now</button>
              </div>

              <div class='web-content'>
                <div class='menue-list-item'>
                  <img src="/assets/layout-img/info-zone/web/info_upload.png">
                </div>
                <div class='menue-list-item'>
                  <img src="/assets/layout-img/info-zone/web/info_layouts.png">
                </div>
              </div>
            </div>

            <!-- ************** -->
            <div class='product-wrapper'>
              <div class='product-picture-wrapper'>
                <h1>Personalised Photo Notebooks</h1>
                <img src="/products/covers/Diary_group.jpg">
                <p>Free UK Shipping, from only £7.99</p>
                <button class='product-range-butt' data-group="personalised-notebooks/">Shop Now</button>
              </div>
              <div class='web-content'>
                <div class='menue-list-item'>
                  <img src="/assets/layout-img/info-zone/web/info_pay-met.png">
                </div>
              </div>
            </div>

            <div class='mobile-content'>
              <div class='menue-list-item'>
                <img src="/assets/layout-img/info-zone/mob/info_upload.png">
              </div>
              <div class='menue-list-item'>
                <img src="/assets/layout-img/info-zone/mob/info_layouts.png">
              </div>
              <div class='menue-list-item'>
                <img src="/assets/layout-img/info-zone/mob/info_pay-met.png">
              </div>
            </div>
            
          </section>

          <section class="stage-process">

            <div class="web-content show-on-sm-scr">
              <h5>Quick & Easy Five - Stage Process!</h5>
              <img src="/assets/layout-img/stage-process.png">
            </div>
            <div class="mobile-content show-on-sm-scr">
              <p>Quick & Easy Five - Stage Process!</p>
              <div class="stage-unit">
                <img src="/assets/layout-img/steps/step_select.png">
                <p>1. Select</p>
              </div>
              <div class="stage-unit">
                <img src="/assets/layout-img/steps/step_personalize.png">
                <p>2. Personalise
              </div>
              <div class="stage-unit">
                <img src="/assets/layout-img/steps/step_review.png">
                <p>3. Review</p>
              </div>
              <div class="stage-unit">
                <img src="/assets/layout-img/steps/step_basket.png">
                <p>4.Basket</p>
              </div>
              <div class="stage-unit">
                <img src="/assets/layout-img/steps/step_checkout.png">
                <p>5. Checkout</p>
              </div>
            </div>
          </section>

          <section class="reviews-section">
            <div class="fotorama review"
            data-autoplay="9000"
            data-loop="true"
            data-nav="false"
            data-arrows="true"
            data-transition="slide"
            data-transitionduration="500"
            data-width="100%"
            data-ratio="16/4">

            <?php
              include_once("$root/assets/php/SharedFunctions.php");

              $reviews_data = getReviews(0,20);
              $reviews_per_page = 3; 
              $reviews_on_page = 0;
              
              if($reviews_data){
                foreach ($reviews_data as $data) {
                    if($reviews_on_page == 0){
                      echo "<div>"; 
                    }

                    echo "<div class='review-content'>";

                    $a = "";
                    for($i = 0; $i < 5; $i++ ){
                        if($i < $data["rating"]){
                            /*  &#9733; full
                                &#9734; empty   */
                            $a.= "<a class='star'>&#9733;</a>";
                        } else {
                            $a.= "<a class='star'>&#9734;</a>";
                        }
                    }
                    
                    $review_text = html_entity_decode($data["review"], ENT_QUOTES, "ISO-8859-1");
                    if(strlen($review_text) > 200){
                      $review_text = substr($review_text, 0, 200);
                      $review_text .= "...";
                    }

                    echo "<p class='rating'>$a </p>
                          <p class='review-name'>".$data["first_name"]."</p>
                          <p class='review-date'>".$data["date"]."</p>
                          <p class='review-text'>$review_text</p>";

                    echo "</div>";
                    $reviews_on_page ++;
                    if($reviews_on_page >=3){
                      $reviews_on_page = 0;
                      echo "</div>";
                    }
                }
              }

            ?>

          </section>

          <footer>
            <?php
              include("$root/html-include/footer.php");
            ?>
          </footer>

          <span id="mobile-mob-screen-detector"></span>
          <span id="mobile-xs-screen-detector"></span>
        </div>

        <section class='popup-window'>
            <div class="transparrent_back"></div>
            
            <div class="opaque_window">
                <div class="message_area">
                    <h2>You are using an outdated browser. Please upgrade to the latest version for the best Ownster experience.</h2>
                </div>
                <div class="confirmation_buttons">
                    <button id='proceed-butt' >OK</button><br>
                </div>
            </div>
        </section>
      </main>
    </div>
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="/assets/js/jquery-1.11.0.min.js"></script>
    <script src="/assets/js/main_homepage.js"></script>
    <script src="/assets/js/fotorama-4.6.2/fotorama.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="/assets/bootstrap/js/bootstrap.min.js"></script>
  </body>
</html>
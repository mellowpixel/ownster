<img class="footer-decor-top" src="/assets/layout-img/footer/footer-decor-top.png">
<div class="footer-content">

  <div class="payment-methods">
    <div class="center-aligned">
      <em>We Accept&nbsp;</em><img src="/assets/layout-img/footer/payment-icons.png">
    </div>
  </div>
  
  <div class="seo-text">
    <?php
      switch ($_SERVER['REQUEST_URI']) {
        case '/':
          echo "<p>Ownster lets you design your own unique personalised travel card holders and personalised notebooks online in just a few minutes! We allow you to upload your favourite photos and personalise the caption to get your special photo gift printed and posted to your preferred address.</p>
                <p>Personalised oyster card holders and personalised notebooks can become either an individual accessory for yourself or a thoughtful photo gift for your family, friends, loved ones or colleagues.</p>
                <p>Ownsters will make it easy and fascinating for you to create your personalised gifts and to expand the opportunities to showcase your exciting and original ideas, illustrating those precious treasured moments of your life.</p>
                <p>Use our easy online tool to make your own Personalised Gifts: Birthday Gifts, Christmas Gifts, Valentine’s Gifts, Father's Day Gifts, Mother's Day Gifts, Wedding Gifts and Christening Gifts.</p>
                <p>Turn your Facebook and Instagram photos into your very own Personalised Gift in just a few minutes! Connect to your social account to begin customising your travel card holder or notebook online!</p>
                <p>With our new mobile-friendly website you can use the most of iPhone, iPad and Android devices to upload your photos!</p>";
          break;
        
        case '/personalised-gifts/personalised-travel-card-holders/':
          echo "<p>Ownster lets you design your own unique personalised travel card holders and personalised notebooks online in just a few minutes! We allow you to upload your favourite photos and personalise the caption to get your special photo gift printed and posted to your preferred address.</p>
                <p>Personalised oyster card holders and personalised notebooks can become either an individual accessory for yourself or a thoughtful photo gift for your family, friends, loved ones or colleagues.</p>
                <p>Ownsters will make it easy and fascinating for you to create your personalised gifts and to expand the opportunities to showcase your exciting and original ideas, illustrating those precious treasured moments of your life.</p>
                <p>Use our easy online tool to make your own Personalised Gifts: Birthday Gifts, Christmas Gifts, Valentine’s Gifts, Father's Day Gifts, Mother's Day Gifts, Wedding Gifts and Christening Gifts.<p>
                <p>Turn your Facebook and Instagram photos into your very own Personalised Gift in just a few minutes! Connect to your social account to begin customising your travel card holder or notebook online!</p>
                <p>With our new mobile-friendly website you can use the most of iPhone, iPad and Android devices to upload your photos!</p>";
          break;

        case '/personalised-gifts/personalised-notebooks/':
          echo "<p>Ownster lets you design your own unique personalised travel card holders and personalised notebooks online in just a few minutes! We allow you to upload your favourite photos and personalise the caption to get your special photo gift printed and posted to your preferred address.</p>
                <p>Personalised oyster card holders and personalised notebooks can become either an individual accessory for yourself or a thoughtful photo gift for your family, friends, loved ones or colleagues.</p>
                <p>Ownsters will make it easy and fascinating for you to create your personalised gifts and to expand the opportunities to showcase your exciting and original ideas, illustrating those precious treasured moments of your life.</p>
                <p>Use our easy online tool to make your own Personalised Gifts: Birthday Gifts, Christmas Gifts, Valentine’s Gifts, Father's Day Gifts, Mother's Day Gifts, Wedding Gifts and Christening Gifts.</p>
                <p>Turn your Facebook and Instagram photos into your very own Personalised Gift in just a few minutes! Connect to your social account to begin customising your travel card holder or notebook online!</p>
                <p>With our new mobile-friendly website you can use the most of iPhone, iPad and Android devices to upload your photos!</p>";
          break;

        default:
          echo "<p>Ownster lets you design your own unique personalised travel card holders and personalised notebooks online in just a few minutes! We allow you to upload your favourite photos and personalise the caption to get your special photo gift printed and posted to your preferred address.</p>
                <p>Personalised oyster card holders and personalised notebooks can become either an individual accessory for yourself or a thoughtful photo gift for your family, friends, loved ones or colleagues.</p>
                <p>Ownsters will make it easy and fascinating for you to create your personalised gifts and to expand the opportunities to showcase your exciting and original ideas, illustrating those precious treasured moments of your life.</p>
                <p>Use our easy online tool to make your own Personalised Gifts: Birthday Gifts, Christmas Gifts, Valentine’s Gifts, Father's Day Gifts, Mother's Day Gifts, Wedding Gifts and Christening Gifts.</p>
                <p>Turn your Facebook and Instagram photos into your very own Personalised Gift in just a few minutes! Connect to your social account to begin customising your travel card holder or notebook online!</p>
                <p>With our new mobile-friendly website you can use the most of iPhone, iPad and Android devices to upload your photos!</p>";
          break;
      }
      // echo "URL: ".$_SERVER['REQUEST_URI'];
    ?>
  </div>

  <div class="bottom-row">
    <span class="footer-links">
      <p>© Ownster Limited 2015 – All Right Reserved.</br>
        <ul>
          <?php
          $root = realpath($_SERVER["DOCUMENT_ROOT"]);
          include_once("$root/inc/DataBaseClass.php");
          include_once("$root/assets/php/SharedFunctions.php");

          $links = returnFooterLinks();
          if($links){
            foreach($links as $link){
              switch( $link["id"] ){
                case "7": $href = "/information/large-orders/"; break;
                case "6": $href = "/information/help/"; break;
                case "5": $href = "/information/contact-us/"; break;
                case "4": $href = "/information/terms-and-conditions/"; break;
                case "1": $href = "/information/privacy-policy/"; break;
                default: $href = "/information/?page_id=".$link["id"]; break;
              }
              echo "<li><a href='$href'>".$link["link_name"]."</a></li>";  
            }
          }
        ?>
        </ul>
      </p>
    </span>
    <span class="social-media">
      <ul>
        <li><a target="_blank" href="http://www.facebook.com/ownster.co.uk"><img src="/assets/layout-img/footer/social-icon_fb.png"></a></li>
        <li><a target="_blank" href="http://twitter.com/ownster_uk"><img src="/assets/layout-img/footer/social-icon_twit.png"></a></li>
        <li><a target="_blank" href="https://plus.google.com/+OwnsterCoUkproducts/posts"><img src="/assets/layout-img/footer/social-icon_goog.png"></a></li>
        <li><a target="_blank" href="https://www.pinterest.com/ownster/"><img src="/assets/layout-img/footer/social-icon_pin.png"></a></li>
        <li><a target="_blank" href=""><img src="/assets/layout-img/footer/social-icon_insta.png"></a></li>
        <li><a target="_blank" href=""><img src="/assets/layout-img/footer/social-icon_tub.png"></a></li>
      </ul>
    </span>
  </div>

</div>
<img class="footer-decor-bottom" src="/assets/layout-img/footer/footer-decor-bottom.png">
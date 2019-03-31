<?php
include_once("../inc/SessionClass.php");
include_once("../inc/DataBaseClass.php");
include_once("../inc/browser_detection.php");

ini_set("log_errors", 1);
date_default_timezone_set("Europe/Riga");
$date = date("d-m-y");
ini_set("error_log", "../error_log/php-error$date.log");

$session = new Session();
$unique_user_ID = $session->uniqueUserSessionID();
$session->setSessionValue("unique_user_id", $unique_user_ID);
$session->setSessionValue("user_folder", "user_upload/$unique_user_ID/");


if( isset($_SESSION["user_path"]) ){
    $_SESSION["user_path"] .= " -> Personalize";
} else {
    $_SESSION["user_path"] = "Personalize";
}

if (isset($_SESSION["memory"])) {
    $_SESSION["memory"]["current_page"]="Personalize";
} else {
    $_SESSION["memory"] = array("data"=>array(), "current_page"=>"Personalize");
}

$mobile = false;
$_SESSION["user_system"] = browser_detection('full_assoc');
if( isset($_SESSION["user_system"]["mobile_data"]) && 
    $_SESSION["user_system"]["mobile_data"] !=='' && 
    $_SESSION["user_system"]["mobile_data"] !== null) {

    $mobile = true;
}

$workdesk_output = "";

if(isset($_GET["product_id"])){
	
	$db	= new DataBase();
	$id = $_GET["product_id"];
	$result = mysql_query("SELECT * FROM products WHERE id = $id");
	if($result){
		$response = mysql_fetch_assoc($result);
		$response["productdata"] = html_entity_decode($response["productdata"], ENT_QUOTES, 'UTF-8');
		if(isset($_GET["template_id"])){
			$response["prelode_template_id"] = $_GET["template_id"];
		}
		// echo"<script>console.log(".json_encode($response["productdata"]).")</script>";
		$workdesk_output .= "<script>var PRODUCT_DATA = ".json_encode($response)."</script>"; 
		/* Calculate dimensions of the product image */
		$pdata = json_decode($response["productdata"], true);
		$side = $pdata["surfaces"][ $pdata["default_surface"] ];
		$scale = $pdata["scale"] / 100;

		$img_height = $side["img_height"] * 300 / 25.4 * $scale;
		$img_width	= $side["img_width"] * 300 / 25.4 * $scale;

		$workdesk_output .= "<div id='product-wrapper' data-product_css_w_px='$img_width' data-product_css_h_px='$img_height'>
				<div id='product-image-container'></div>
				<div id='product-other-side'></div>
				<div id='template-grid'></div>
				<div id='grid-helper-frame'></div>
				<div id='texts-layer'></div>
			</div>";
	}
	unset($db);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<meta name="description" content="Personalize your own product.">
	<meta name="author" content="Dmitry Ulyanov, contacts@mellowpixels.com, mellowpixels@gmail.com, http://www.mellowpixels.com" />

	<title>Ownster Personalization</title>
	<!-- <link href="../assets/js/jquery-mobile/jquery.mobile-1.4.5.min.css" rel="stylesheet" type="text/css" /> -->
    <link href="../assets/css/personalize-page.css" rel="stylesheet" type="text/css" />
    <link href="../assets/css/jquery-ui.css" rel="stylesheet">
    <link href="../assets/js/spectrum/spectrum.css" rel="stylesheet">

    <!--[if lt IE9]
        <link rel="stylesheet" type="text/css" href="../../assets/css/ie8-FontsFormat.css" />
        <script src="../../assets/js/html5shiv.min.js"></script>
    <![endif]-->
    <script type="text/javascript" src="../assets/js/modernizr.ownster.js"></script>
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

	<!-- FACEBOOK SDK INITIALIZATION -->
	<script>
        window.fbAsyncInit = function() {
    FB.init({
      appId      : '687574281337911',
      xfbml      : true,
      version    : 'v2.1'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  	window.addEventListener('resize', function(event){
	  var inf = document.getElementById("info");
	  inf.innerHtml = "W: "+event.target.outerWidth+"/H: "+event.target.outerHeight;
	});
    </script>
<div class="page-wrapper">
	<header class='personalise-page'>
        <?php
          include("../html-include/header.php");
        ?>
    </header>

	<main>

		<script type="text/javascript">
            window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
                alert("Error at: line "+lineNumber+", message: "+errorMsg);
            }
        </script>

		<div id="info"></div>
		<span id="mobile-style-detector"></span>
		<input type='hidden' id="files-stack"/>
		<input type='file' accept='image/*' id="user-files-inp" />

		<section class="mobile-content">
			
			<div class="back-next-butt-wrapper mobile" data-current_step="select layout" data-layout_selected="not selected">
				<span><button class='back-button'>← Back </button></span>
				<span><button class='next-button'>Next →</button></span>
			</div>
			
			<div class='user-message'>
				<div class="relative-pos-message">
					<p></p>
				</div>
				<div class="absolute-pos-message user-focus">
					<p></p>
				</div>
			</div>

			<div id="transparent-popup-back" class='user-focus'>
			</div>

			<div class="work-desk mobile">
				<!-- Product 
				*************************************** -->
				<?php
					if($mobile){
						echo $workdesk_output;
					}
				?>
				<!-- <div id='overal-image-quality-wrapper'></div> -->
			</div>

			<!-- Upload buttons fullscreen page 
			*************************************** -->

			<div class="page upload-page-wrapper mobile">
				<div class='cancel-butt-wrapper'>
					<span class="full-width"><button class='cancel-button' data-current_step="upload page">Cancel </button></span>
				</div>
				<ul>
					<li>
						<label class="upload-method-butt" for="user-files-inp" title="Upload Pictures from your computer.">
							<img src="/assets/layout-img/action-tools/orange/icon-method-upload.png" class="action-icon upload">
						</label>
						<h4>Upload Photo</h4>
						<p>Upload pictures from your computer</p>
					</li>
					<li>
						<label class="upload-method-butt fb-upload" title="Select from your facebook pictures.">
							<img src="/assets/layout-img/action-tools/orange/icon-method-facebook.png" class="action-icon upload">
						</label>
						<h4>Facebook</h4>
						<p>Print photos from your facebook albums</p>
					</li>
					<li>
						<label class="upload-method-butt insta-upload" title="Select from Instagram pictures.">
							<img src="/assets/layout-img/action-tools/orange/icon-method-instagram.png" class="action-icon upload">
						</label>
						<h4>Instagram</h4>
						<p>Choose photos from your Instagram.</p>
					</li>
				</ul>
			</div>
			
			<div class="page user-files-preview-wrapper mobile">
				<div class='cancel-butt-wrapper'>
					<span class="full-width"><button class='cancel-button' data-current_step="socnet page">Cancel </button></span>
				</div>
				<div class='back-to-fb-album-butt-wrapper'>
					<span class="full-width"><button class='back-to-fb-album-butt'>Back to Albums</button></span>
				</div>
				<div class="fb-login-wrapper">
					<div class="fb-login-wrapper">
						<div class="fb-login-button" onlogin="reloadFBAfterLogin" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="false"></div>
					</div>
				</div>
				<div class="socnet-thumbs-container"></div>
				<span class="scroll_detector"></span>
			</div>

			<div class="page upload-progress-page">
				<div class="progress-center-wrapper">
					<h1></h1>
					<p>Please wait while we uploading your image.</p>
				</div>
			</div>
			<!-- Layouts fullscreen page 
			*************************************** -->

			<div class="page layout-templates mobile">
				<div class='cancel-butt-wrapper'>
					<span class="full-width"><button class='cancel-button' data-current_step="select layout-templates">Cancel</button></span>
				</div>
				<div id="template-thumbnails-container-mobile">
				</div>
			</div>
			
			<!-- Graphic Templates fullscreen page 
			*************************************** -->

			<div class="page graphic-templates mobile">
				<div class='cancel-butt-wrapper'>
					<span class="full-width"><button class='cancel-button' data-current_step="select graphic-templates">Cancel </button></span>
				</div>
				<div id="graphic-thumbnails-container-mobile">
				</div>
			</div>

			<!-- Text Tools Wrapper 
				*************************************** -->
			<div class="page text-tools-wrapper">
				<div id="font-atributes-wrapper-mobile">
					<select id="font-family-select-mobile">
						<option>Select a Font</option>
						<option selected value="Arial">Arial</option>
						<option value="'Abel', sans-serif">Abel</option>
						<option value="'Lobster', cursive">Lobster</option>
						<option value="'Pacifico', cursive">Pacifico</option>
						<option value="'Comfortaa', cursive">Comfortaa</option>
						<option value="'Cookie', cursive">Cookie</option>
						<option value="'Kaushan Script', cursive">Kaushan</option>
						<option value="Baskerville,'Baskerville Old Face'">Baskerville</option>
						<option value="'Comic Sans', 'Comic Sans MS'">Comic Sans</option>
						<option value="'Courier New',Courier,'Lucida Sans Typewriter','Lucida Typewriter',monospace">Courier New</option>
						<option value="Impact,Haettenschweiler,'Franklin Gothic Bold',Charcoal,'Helvetica Inserat','Bitstream Vera Sans Bold','Arial Black','sans serif'">Impact</option>
						<option value="TimesNewRoman,'Times New Roman',Times">Times New Roman</option>
						<option value="'Astloch', cursive">Astloch</option>
						<option value="'IM Fell English SC', serif">IM Fell English SC</option>
						<option value="'Nosifer', cursive">Nosifer</option>
						<option value="'Alfa Slab One', cursive">Alfa Slab One</option>
						<option value="'Ubuntu Mono'">Ubuntu Mono</option>
						<option value="'Trade Winds', cursive">Trade Winds</option>
						<option value="'Codystar', cursive">Codystar</option>
						<option value="'Stalemate', cursive">Stalemate</option>
						<option value="'Poiret One', cursive">Poiret One</option>
						<option value="'Henny Penny', cursive">Henny Penny</option>
						<option value="'Quicksand', sans-serif">Quicksand</option>
						<option value="'Petit Formal Script', cursive">Petit Formal Script</option>
						<option value="'Fugaz One', cursive">Fugaz One</option>
						<option value="'Shadows Into Light', cursive">Shadows Into Light</option>
						<option value="'Josefin Slab', serif">Josefin Slab</option>
						<option value="'Frijole', cursive">Frijole</option>
						<option value="'Fredoka One', cursive">Fredoka One</option>
						<option value="'Gloria Hallelujah', cursive">Gloria Hallelujah</option>
						<option value="'UnifrakturCook', cursive">UnifrakturCook</option>
						<option value="'Tangerine', cursive">Tangerine</option>
						<option value="'Monofett', cursive">Monofett</option>
						<option value="'Monoton', cursive">Monoton</option>
						<option value="'Spirax', cursive">Spirax</option>
						<option value="'UnifrakturMaguntia', cursive">UnifrakturMaguntia</option>
						<option value="'Creepster', cursive">Creepster</option>
						<option value="'Maven Pro', sans-serif">Maven Pro</option>
						<option value="'Amatic SC', cursive">Amatic SC</option>
						<option value="'Dancing Script', cursive">Dancing Script</option>
						<option value="'Pirata One', cursive">Pirata One</option>
						<option value="'Play', sans-serif">Play</option>
						<option value="'Audiowide', cursive">Audiowide</option>
						<option value="'Open Sans Condensed', sans-serif">Open Sans Condensed</option>
						<option value="'Kranky', cursive">Kranky</option>
						<option value="'Black Ops One', cursive">Black Ops One</option>
						<option value="'Indie Flower', cursive">Indie Flower</option>
						<option value="'Sancreek', cursive">Sancreek</option>
						<option value="'Press Start 2P', cursive">Press Start 2P</option>
						<option value="'Abril Fatface', cursive">Abril Fatface</option>
						<option value="'Jacques Francois Shadow', cursive">Jacques Francois Shadow</option>
						<option value="'Ribeye Marrow', cursive">Ribeye Marrow</option>
						<option value="'Playball', cursive">Playball</option>
						<option value="'Roboto Slab', serif">Roboto Slab</option>
						
					</select>
					<select id="font-size-select-mobile">
						<option>10</option>
						<option>12</option>
						<option>14</option>
						<option>16</option>
						<option>18</option>
						<option selected>20</option>
						<option>22</option>
						<option>24</option>
						<option>26</option>
						<option>28</option>
						<option>30</option>
						<option>32</option>
						<option>34</option>
						<option>36</option>
						<option>38</option>
						<option>40</option>
						<option>50</option>
						<option>60</option>
						<option>70</option>
						<option>80</option>
						<option>90</option>
						<option>100</option>
						<option>110</option>
						<option>120</option>
					</select>
					<div class="font-color-picker-wrapper">
						<input type="text" id="colorSelector-mobile" />
					</div>
				</div>

				<div class="texts-container">
					<div id='text-inputs-wrapper-mobile'>
					</div>
				</div>
			</div>
			<!-- Colored Insets fullscreen page 
			*************************************** -->

			<div class="page optional-surface">
				<div class='back-next-butt-wrapper mobile' data-current_step="select layout" data-layout_selected="not selected">
					<span><button class='back-button'>← Back </button></span>
					<span><button class='next-button'>Next →</button></span>
				</div>
				<div class="options-container">
				</div>
			</div>
		</section>
		<!-- THIS CONTENT DISPLAYED ONLY IN DESCTOP VERSION  -->
		<section class="web-content">
			<div id="left-column">
				
				<div class='user-message web'>
					
						<div class="relative-pos-message">
							<h2></h2>
						</div>
						<div class="click-cell-tips">
							<!-- <img class="your-photo-badge" src="/assets/layout-img/personalization/Your-photo-white.png"> -->
							<img class="arrow-right wiggle-side-to-side" src="/assets/layout-img/personalization/arrow_right.png">
						</div>
						<!-- <img class="arrow-down wiggle-up-down" src="/assets/layout-img/personalization/arrow_down.png"> -->
				</div>
				
				<div class="page user-files-preview-wrapper">
					<div class='cancel-butt-wrapper'>
						<span class="full-width"><button class='cancel-button' data-current_step="socnet page">Cancel </button></span>
					</div>
					<div class='back-to-fb-album-butt-wrapper'>
						<span class="full-width"><button class='back-to-fb-album-butt'>Back to Albums</button></span>
					</div>
					<div class="fb-login-wrapper">
						<div class="fb-login-button" onlogin="reloadFBAfterLogin" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="false"></div>
					</div>
					<div class="socnet-thumbs-container"></div>
					<span class="scroll_detector"></span>
				</div>
				<!-- Layouts fullscreen page 
				*************************************** -->

				<table class='tabs-wrapper'>
					<tr class='layouts-tabs-set'>
						<td class='active-tab'>
							<span class='layout-butt'>
								<img class="active-img" src="/assets/layout-img/action-tools/orange/icon-layout.png">
								<img class="inactive-img" src="/assets/layout-img/action-tools/black/icon-layout.png"> Layouts
							</span>
						</td>
						<td>
							<span class='styles-butt'>
								<img class="active-img" src="/assets/layout-img/action-tools/orange/icon-styles.png">
								<img class="inactive-img" src="/assets/layout-img/action-tools/black/icon-styles.png"> Styles
							</span>
						</td>
					</tr>
					<tr class='upload-texts-tabs-set'>
						<td class='active-tab'>
							<span class='upload-tab'>
								<img class="active-img" src="/assets/layout-img/action-tools/orange/icon-upload-active.png">
								<img class="inactive-img" src="/assets/layout-img/action-tools/black/icon-upload-inactive.png"> Upload
							</span>
						</td>
						<td>
							<span class='texts-tab'>
								<img class="active-img" src="/assets/layout-img/action-tools/orange/icon-texts-active.png">
								<img class="inactive-img" src="/assets/layout-img/action-tools/black/icon-texts-inactive.png"> Texts
							</span>
						</td>
					</tr>
				</table>
				<div id='lyouts-page-wrapp'>
					
					<div class="page layout-templates">
						<div id="template-thumbnails-container-web">
						</div>
						<span class="scroll_detector"></span>
					</div>
					
					<!-- Graphic Templates fullscreen page 
					*************************************** -->

					<div class="page graphic-templates">
						<div id="graphic-thumbnails-container-web">
						</div>
						<span class="scroll_detector"></span>
					</div>

					<div class="page upload-page-wrapper web">
						<ul>
							<li>
								<label class="upload-method-butt" for="user-files-inp" title="Upload Pictures from your computer.">
									<img src="/assets/layout-img/action-tools/orange/icon-method-upload.png" class="action-icon upload">
								</label>
								<h4>Upload Photo</h4>
								<p>Upload pictures from your computer</p>
							</li>
							<li>
								<label class="upload-method-butt fb-upload" title="Select from your facebook pictures.">
									<img src="/assets/layout-img/action-tools/orange/icon-method-facebook.png" class="action-icon upload">
								</label>
								<h4>Facebook</h4>
								<p>Print photos from your facebook albums</p>
							</li>
							<li>
								<label class="upload-method-butt insta-upload" title="Select from Instagram pictures.">
									<img src="/assets/layout-img/action-tools/orange/icon-method-instagram.png" class="action-icon upload">
								</label>
								<h4>Instagram</h4>
								<p>Choose photos from your Instagram.</p>
							</li>
						</ul>
						<span class="scroll_detector"></span>
					</div>
					<!-- Text Tools Wrapper 
					*************************************** -->

					<div class="page text-tools-wrapper">
						<div id="font-atributes-wrapper-web">
							<div class="font-size-color-wrapper">
								<select id="font-family-select-web">
									<option>Select a Font</option>
									<option selected value="Arial">Arial</option>
									<option value="'Abel', sans-serif">Abel</option>
									<option value="'Lobster', cursive">Lobster</option>
									<option value="'Pacifico', cursive">Pacifico</option>
									<option value="'Comfortaa', cursive">Comfortaa</option>
									<option value="'Cookie', cursive">Cookie</option>
									<option value="'Kaushan Script', cursive">Kaushan</option>
									<option value="Baskerville,'Baskerville Old Face'">Baskerville</option>
									<option value="'Comic Sans', 'Comic Sans MS'">Comic Sans</option>
									<option value="'Courier New',Courier,'Lucida Sans Typewriter','Lucida Typewriter',monospace">Courier New</option>
									<option value="Impact,Haettenschweiler,'Franklin Gothic Bold',Charcoal,'Helvetica Inserat','Bitstream Vera Sans Bold','Arial Black','sans serif'">Impact</option>
									<option value="TimesNewRoman,'Times New Roman',Times">Times New Roman</option>
									<option value="'Astloch', cursive">Astloch</option>
									<option value="'IM Fell English SC', serif">IM Fell English SC</option>
									<option value="'Nosifer', cursive">Nosifer</option>
									<option value="'Alfa Slab One', cursive">Alfa Slab One</option>
									<option value="'Ubuntu Mono'">Ubuntu Mono</option>
									<option value="'Trade Winds', cursive">Trade Winds</option>
									<option value="'Codystar', cursive">Codystar</option>
									<option value="'Stalemate', cursive">Stalemate</option>
									<option value="'Poiret One', cursive">Poiret One</option>
									<option value="'Henny Penny', cursive">Henny Penny</option>
									<option value="'Quicksand', sans-serif">Quicksand</option>
									<option value="'Petit Formal Script', cursive">Petit Formal Script</option>
									<option value="'Fugaz One', cursive">Fugaz One</option>
									<option value="'Shadows Into Light', cursive">Shadows Into Light</option>
									<option value="'Josefin Slab', serif">Josefin Slab</option>
									<option value="'Frijole', cursive">Frijole</option>
									<option value="'Fredoka One', cursive">Fredoka One</option>
									<option value="'Gloria Hallelujah', cursive">Gloria Hallelujah</option>
									<option value="'UnifrakturCook', cursive">UnifrakturCook</option>
									<option value="'Tangerine', cursive">Tangerine</option>
									<option value="'Monofett', cursive">Monofett</option>
									<option value="'Monoton', cursive">Monoton</option>
									<option value="'Spirax', cursive">Spirax</option>
									<option value="'UnifrakturMaguntia', cursive">UnifrakturMaguntia</option>
									<option value="'Creepster', cursive">Creepster</option>
									<option value="'Maven Pro', sans-serif">Maven Pro</option>
									<option value="'Amatic SC', cursive">Amatic SC</option>
									<option value="'Dancing Script', cursive">Dancing Script</option>
									<option value="'Pirata One', cursive">Pirata One</option>
									<option value="'Play', sans-serif">Play</option>
									<option value="'Audiowide', cursive">Audiowide</option>
									<option value="'Open Sans Condensed', sans-serif">Open Sans Condensed</option>
									<option value="'Kranky', cursive">Kranky</option>
									<option value="'Black Ops One', cursive">Black Ops One</option>
									<option value="'Indie Flower', cursive">Indie Flower</option>
									<option value="'Sancreek', cursive">Sancreek</option>
									<option value="'Press Start 2P', cursive">Press Start 2P</option>
									<option value="'Abril Fatface', cursive">Abril Fatface</option>
									<option value="'Jacques Francois Shadow', cursive">Jacques Francois Shadow</option>
									<option value="'Ribeye Marrow', cursive">Ribeye Marrow</option>
									<option value="'Playball', cursive">Playball</option>
									<option value="'Roboto Slab', serif">Roboto Slab</option>
									
								</select>
								<select id="font-size-select-web">
									<option>10</option>
									<option>12</option>
									<option>14</option>
									<option>16</option>
									<option>18</option>
									<option selected>20</option>
									<option>22</option>
									<option>24</option>
									<option>26</option>
									<option>28</option>
									<option>30</option>
									<option>32</option>
									<option>34</option>
									<option>36</option>
									<option>38</option>
									<option>40</option>
									<option>50</option>
									<option>60</option>
									<option>70</option>
									<option>80</option>
									<option>90</option>
									<option>100</option>
									<option>110</option>
									<option>120</option>
								</select>
								
								<div class="font-color-picker-wrapper">
									<input type="text" id="colorSelector-web" />
								</div>
							</div>

						</div>

						<div class="texts-container">
							<div id='text-inputs-wrapper-web'>
							</div>
						</div>
						<button class="add-new-text-butt inwindow">Add More Text</button>
						<span class="scroll_detector"></span>
					</div>

					<div class="page optional-surface">
						<h2>Please select the inner colour of your travel card holder.</h2>
						<div class="options-container">
						</div>
						<span class="scroll_detector"></span>
					</div>
				</div>

				<!-- Colored Insets fullscreen page 
				*************************************** -->

				

				<div class="page" id="presave-page">
					<h2>
						Now take a look at your personalised travel card wallet one more time.</br></br>
						If you happy with it, go on, Save it !
					</h2>
					
					<!-- <img class="arrow-down wiggle-up-down" src="/assets/layout-img/personalization/arrow_down.png"> -->
				</div>

			</div>
			<div id="main-column">
				<div id="tools-panel-wrapper">
					<span>
						<div id="tools-panel">
							<ul class='toolset web product-title'>
								<li><!-- <h3>Ownster Travel Card Wallet</h3> --></li>
							</ul>
							<ul class='toolset web sides-switch'>
								<li class="sides-switch-butt" id='side-inside-switch'>
									<span class="tool-button-container">
										<img src="/assets/layout-img/personalization/tool_side_inside.png">
										<img class="active-tool" src="/assets/layout-img/personalization/tool_selected_side_inside.png">
									</spn>
									<span class="tool-title">Inside<span>
								</li>
								<li class="sides-switch-butt" id='side-outside-switch'>
									<span class="tool-button-container">
										<img src="/assets/layout-img/personalization/tool_side_outside.png">
										<img class="active-tool" src="/assets/layout-img/personalization/tool_selected_side_outside.png">
									</spn>
									<span class="tool-title">Outside<span>
								</li>
							</ul>
							<ul class='toolset web workdesk'>
								<li class='rotate-butt'>
									<img src="/assets/layout-img/personalization/tool_rotate-left.png">
								</li>
								<li class='move-butt'>
									<img src="/assets/layout-img/personalization/tool_move.png">
								</li>
								<li class='zoom-butt'>
									<img src="/assets/layout-img/personalization/tool_zoomin.png">
								</li><!-- 
								<li class='text-butt'>
									<img src="/assets/layout-img/personalization/tool_text.png">
								</li> -->
							</ul>
							<!-- ROTATE buttons subset -->
							<ul class='subset rotate'>
								<li class='rotate-left-butt'>
									<img src="/assets/layout-img/personalization/tool_rotate-left.png">
								</li>
								<li class='rotate-right-butt'>
									<img src="/assets/layout-img/personalization/tool_rotate-right.png">
								</li>
								<li class="done-butt-container">
									<button class='done-butt'>Done</button>
								</li>
							</ul>

							<!-- ZOOM buttons subset -->
							<ul class='subset zoom'>
								<li class='zoomin-butt'>
									<img src="/assets/layout-img/personalization/tool_zoomin.png">
								</li>
								<li class='zoomout-butt'>
									<img src="/assets/layout-img/personalization/tool_zoomout.png">
								</li>
								<li class="done-butt-container">
									<button class='done-butt'>Done</button>
								</li>
							</ul>

							<!-- MOVE buttons subset -->
							<ul class='subset move'>
								<li>
								</li>
								<li class='move-butt'>
									<img src="/assets/layout-img/personalization/tool_move.png">
								</li>
								<li class="done-butt-container">
									<button class='done-butt'>Done</button>
								</li>
							</ul>

							<!-- <ul class='subset text'>
								<li class='add-new-text-butt'>
									<img src="/assets/layout-img/personalization/tool_text.png"><span>Add Text</span>
								</li>
								<li class="done-butt-container">
									<button class='done-butt'>Done</button>
								</li>
							</ul> -->
						</div>
					</span>
					<span>
						<div class="back-next-butt-wrapper web" data-current_step="select layout" data-layout_selected="not selected">
							<span><button class='back-button'>← Back </button></span>
							<span><button class='next-button'>Next →</button></span>
							<!-- <img class="arrow-right" src="/assets/layout-img/personalization/arrow-right-green.png"> -->
						</div>
					</span>
				</div>
				<div class="work-desk web">
					<!-- Product 
					*************************************** -->
					<?php
						if(!$mobile){
							echo $workdesk_output;
						}
					?>

				</div>
				<div id="product-info"></div>
			</div>

			<div class="page upload-progress-page">
				<h1></h1>
				<p>Please wait while we uploading your image.</p>
			</div>
		</section>
		<!--  -->
		<section class='popup-window empty-cells'>
            <div class="transparrent_back"></div>
            
            <div class="opaque_window">
                <div class="message_area">
                    <h2>Some cells in your design have left without an image. Would you like to proceed?</h2>
                </div>
                <div class="confirmation_buttons">
                    <button id='proceed-butt' >Proceed</button><br>
                    <button class='cancel-close-butt' >No, Stay</button>
                </div>
            </div>
        </section>
        <!--  -->
        <section class='popup-window color-inset'>
            <div class="transparrent_back"></div>
            
            <div class="opaque_window">
                <div class="message_area">
                    <h2>Please select the inner colour of your travel card holder.</h2>
                </div>
                <div class="confirmation_buttons">
                    <button class='cancel-close-butt' >Ok</button>
                </div>
            </div>
        </section>
	</main>
	
	<div id='bottom-panel' class="mobile-content" data-current_subset="null">
		<ul class='toolset mobile layout'>
			<li class='layout-butt'>
				<img src="/assets/layout-img/action-tools/icon-layout.png"> <span>More Layouts</span>
			</li>
			<li class='styles-butt'>
				<img src="/assets/layout-img/action-tools/icon-styles.png"> <span>Styles</span>
			</li>
		</ul>
		<ul class='toolset mobile workdesk'>
			<li id='upload-butt'>
				<img src="/assets/layout-img/action-tools/icon-upload.png">
			</li>
			<li class='rotate-butt'>
				<img src="/assets/layout-img/action-tools/icon-rotate-left.png">
			</li>
			<li class='move-butt'>
				<img src="/assets/layout-img/action-tools/icon-move.png">
			</li>
			<li class='zoom-butt'>
				<img src="/assets/layout-img/action-tools/icon-zoom.png">
			</li>
			<!-- <li class='text-butt'>
				<img src="/assets/layout-img/action-tools/icon-text.png">
			</li> -->
		</ul>

		<!-- UPLOAD buttons subset -->
		<ul class='subset upload'>
			<li class='method-upload-butt'>
				<label class="upload-method-butt" for="user-files-inp" title="Upload Pictures from your computer.">
					<img src="/assets/layout-img/action-tools/icon-method-upload-sm.png">
				</label>
			</li>
			<li class='method-facebook-butt'>
				<label class="upload-method-butt fb-upload" title="Select from your facebook pictures.">
					<img src="/assets/layout-img/action-tools/icon-method-facebook-sm.png">
				</label>
			</li>
			<li class='method-instagram-butt'>
				<label class="upload-method-butt insta-upload" title="Select from Instagram pictures.">
					<img src="/assets/layout-img/action-tools/icon-method-instagram-sm.png">
				</label>
			</li>
			<li>
				<button class='done-butt'>Done</button>
			</li>
		</ul>

		<!-- ROTATE buttons subset -->
		<ul class='subset rotate'>
			<li class='rotate-left-butt'>
				<img src="/assets/layout-img/action-tools/icon-rotate-left.png">
			</li>
			<li class='rotate-right-butt'>
				<img src="/assets/layout-img/action-tools/icon-rotate-right.png">
			</li>
			<li>
				<button class='done-butt'>Done</button>
			</li>
		</ul>

		<!-- ZOOM buttons subset -->
		<ul class='subset zoom'>
			<li class='zoomin-butt'>
				<img src="/assets/layout-img/action-tools/icon-zoom.png">
			</li>
			<li class='zoomout-butt'>
				<img src="/assets/layout-img/action-tools/icon-zoomout.png">
			</li>
			<li>
				<button class='done-butt'>Done</button>
			</li>
		</ul>

		<!-- MOVE buttons subset -->
		<ul class='subset move'>
			<li>
			</li>
			<li class='move-butt'>
				<img src="/assets/layout-img/action-tools/icon-move.png">
			</li>
			<li>
				<button class='done-butt'>Done</button>
			</li>
		</ul>

		<!-- MOVE buttons subset -->
		<ul class='subset text'>
			<li class='add-new-text-butt'>
				<img src="/assets/layout-img/action-tools/icon-text.png"><span>Add Text</span>
			</li>
			<li>
				<button class='done-butt'>Done</button>
			</li>
		</ul>

	</div>
</div>
</body>

<script type="text/javascript" src="../assets/js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../assets/js/jquery-mobile/jquery.mobile-1.4.5.min.js"></script>
<script type="text/javascript" src="../assets/js/jquery-ui.min.js"></script>
<!-- <script type="text/javascript" src="../assets/js/jcanvas.min.js"></script> -->
<script type="text/javascript" src="../assets/js/jquery.ui.touch-punch.min.js"></script>
<script>
	window.productserverpath = "../assets/php/ProductServer.php"
</script>
<script type="text/javascript" src="../assets/js/spectrum/spectrum.js"></script>
<script type="text/javascript" src="../assets/js/jquery.ddslick.min.js"></script>
<script type="text/javascript" src="../assets/js/jquery.fileupload.js"></script>
<script type="text/javascript" src="../assets/js/general-functions.js"></script>
<script type="text/javascript" src="../assets/js/instajam.min.js"></script>
<script type="text/javascript" src="../assets/js/MellowPixels_Utilities.js"></script>
<script type="text/javascript" src="../assets/js/mouse_wheel/jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="../assets/js/FileHandler.js"></script>
<script type="text/javascript" src="../assets/js/OwnsterCanvasClass.js"></script>
<script type="text/javascript" src="../assets/js/ScrollClass.js"></script>
<script type="text/javascript" src="../assets/js/main_customize.js"></script>
</html>
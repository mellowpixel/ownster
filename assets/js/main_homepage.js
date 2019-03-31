$(document).ready(function(){
	responsiveSetup();
	$(window).resize(function(){
		responsiveSetup();
	})
	
	$(".personalize-butt").click( go2ProductPersonalisation );
	// ( For /personalised-gifts/index.php ) Write price of the product; Add Personalize Button 
	$(".product-cover-block")
		.find(".price").each(function(){
			$(this).text("£"+$(this).closest(".product-cover-block").data("price"))
		}).end()
		.find(".product-actions-wrapper").each(function(){
			$(this).append($("<div class='button-wrapper'>").append($("<button class='personalize-butt'>").text("Personalise").click( go2ProductPersonalisation )))
		}).end()
		.find(".product-img-wrapper").click( go2ProductPersonalisation );
	//----------
	$(".product-range-butt").click(function(){ go2Group( $(this).data("group") ); })
	$(".group-block .product-img-wrapper").click(function(){ go2Group( $(this).parent().find(".product-range-butt").data("group") ); })
	$(".review-content").click(function(){ window.location = "/clients-reviews/"; });
	
	// Check The Browser. If < IE10 than output warning message
	if (isIE () && isIE () <= 9) {
		/*$(".popup-window").css({ display: "block" })
		  .addClass("fadein");
		$("#proceed-butt").unbind("click").bind("click", function(){
			$(".popup-window").removeClass("fadeout").css({ display: "none" });
		})*/
		alert("You are using an outdated browser. Please upgrade to the latest version for the best Ownster experience.");
	}
})

/* Check if browser is IE
-----------------------------------------------------------------------------------*/
function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

/* Adjust responsive elements based on its current state
-----------------------------------------------------------------------------------*/
function responsiveSetup(){
	// change ratio of fotorama slider if bottom buttons wrapper is visible
	/*if( typeof $(".show-hide.show") !== "undefined" && $(".show-hide.show").css("display") == "block"){
		resizeFotorama(".fotorama.slider", { ratio: "16/30", arrows: "true" });		
	} else {
		resizeFotorama(".fotorama.slider", { ratio: "990/400", arrows: "true" });
	}*/
	//---------------------------------------------------------------------
	// if width of fotorama review is 100% then change its dimensions ratio
	if( $(".fotorama.review").length > 0){
		
		if($("#mobile-mob-screen-detector:visible").length > 0){
			resizeFotorama(".fotorama.review", { ratio: "16/32" });
		} else {
			if($("#mobile-xs-screen-detector:visible").length > 0){
				resizeFotorama(".fotorama.review", { ratio: "16/16" });
			} else {
				resizeFotorama(".fotorama.review", { ratio: "16/4" });
			}
		}

	};
	//---------------------------------------------------------------------
}

function resizeFotorama(fotorama_class, resize_data){
	if( typeof $(fotorama_class).fotorama == "function" ){
	    var $fotoramaDiv = $(fotorama_class).fotorama(),
	    	fotorama = $fotoramaDiv.data('fotorama');
	    fotorama.resize(resize_data);
		// fotorama.setOptions({ arrows: false });
	}
}

//---------------------------------------------------------------------------------
// Go to personalisation page. Use details stored in data- atribute of the container (.product-block)

function go2ProductPersonalisation(){
	var p_id = $(this).closest(".product-cover-block").data("id");
	window.location = "/personalize/?product_id="+p_id;
}

function go2Group(group){
	window.location = "/personalised-gifts/"+group;
}

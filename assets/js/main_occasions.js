
$(document).ready(function(){


});

/*--------------------------------------------------------------------------
--------------------------------------------------------------------------*/

function showVariations(variations_obj){
	// console.log(json_encoded_data);
	$(".popup-window.product_variations").css({ display: "block" }).addClass("fadein");
	$(".generated-content-wrapper",".popup-window.product_variations").empty();

	$("<img class='prod-img' src='"+variations_obj[0].group_img+"' >")
			.appendTo(".generated-content-wrapper");

	$("<div class='options-wrapper'>").appendTo(".generated-content-wrapper");
	
	for(var variant in variations_obj){
		// console.log(variations_obj[variant]);
		$("<div class='variant-option-wrap'>")
				.html("<input type='radio' id='variant-radio-"+variant+"' name='varian-option' value='"+variations_obj[variant].group_link_to+"' >"+
						"<label for='variant-radio-"+variant+"'>&nbsp;&nbsp;"+variations_obj[variant].group_description+" - £"+variations_obj[variant].price+"</label>")
				.appendTo(".options-wrapper");
	}

	$("input[name='varian-option']").first().prop("checked", "checked");

	$("<div class='buttons_wrap'>")
		.html("<button class='proceed-butt' >Proceed</button>")
		.appendTo(".generated-content-wrapper");

	// $(".generated-content-wrapper",".popup-window.product_variations").append();

	$(".proceed-butt", ".popup-window.product_variations").unbind("click").bind("click", function(){
		var link = $("input[name='varian-option']:checked").val();
		// alert($("input[name='varian-option']:checked").length);
		window.location = link;
		// $(".popup-window.product_variations").removeClass("fadeout").css({ display: "none" });
	})

	$(".close-butt", ".popup-window.product_variations").click(function(){
		$(".popup-window").removeClass("fadein").css({ display: "none" });					
	});
}
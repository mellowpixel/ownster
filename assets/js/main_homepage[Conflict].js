$(document).ready(function(){

	$(".personalize-butt").click( go2ProductPersonalisation );
	// ( For /our-products/index.php ) Write price of the product; Add Personalize Button 
	$(".product-cover-block")
		.find(".price").each(function(){
			$(this).text("£"+$(this).closest(".product-cover-block").data("price"))
		}).end()
		.find(".product-actions-wrapper").each(function(){
		$(this).append($("<button class='personalize-butt'>").text("Personalise").click( go2ProductPersonalisation ))
	});
	//----------
	$(".product-range-butt").click(function(){
		go2Group( $(this).data("group") );
	})
	$(".product-img-wrapper").click(function(){
		go2Group( $(this).parent().find(".product-range-butt").data("group") );
	})

	updateBasketInfo()
	getFooterLinks();
})

//---------------------------------------------------------------------------------
// Go to personalisation page. Use details stored in data- atribute of the container (.product-block)

function go2ProductPersonalisation(){
	sessionStorage.productID = $(this).closest(".product-cover-block").data("id");
	window.location = "/personalize/";
}

function go2Group(group){
	window.location = "/our-products/?group="+group;
}
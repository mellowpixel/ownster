// review-main.js
$(document).ready(function(){
	$("#add_to_cart_butt").click( addToCart );
});

//---------------------------------------------------------------------------------
//
function addToCart(){	
	$.post("../inc/ShoppingCartServer.php", {addToCart:true}, function(){ window.location = "../cart/" });
}


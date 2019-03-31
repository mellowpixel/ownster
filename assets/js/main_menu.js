$(document).ready(function(){
	$("#home-link").click(function(){ window.location = "/"; });
	$("#products-link").click(function(){ window.location = "/our-products/"; });
	$("#login-link").click(function(){ window.location = "/login/"; });
	$("#my_account_entrance").click(function(){ window.location = "/my-account/"; });
	$("#help-link").click(function(){ window.location = "/information/help/"; })
	$("#cart").click(function(){ window.location = "/cart/"; });
	$("#logo").click(function(){ window.location = "/"; });

	updateBasketInfo();
})

//---------------------------------------------------------------------------------
// 
function updateBasketInfo(){
	a_basket = $("#cart-items-counter");
	$.post("/inc/ShoppingCartServer.php", { get_total_in_basket: true }, function(data){
		if(!data.error){
			if(data.total >0){
				remainder = data.total%10;
				if(remainder === 1){
					$("#cart-items-counter").html( data.total +" item");
				}else{
					$("#cart-items-counter").html( data.total +" items");	
				}
			} else {
				$("#cart-items-counter").html("0 items");
			}
		} else {
			$("#cart-items-counter").html("0");
		}
	}, "json")
}
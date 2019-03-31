/*var DESIGN_SETUP = [];
 
function designSetup(setup_name, d_s){
	DESIGN_SETUP.push([setup_name, d_s]);	
}
*/
$(document).ready(function(){

	var total_items,
		scrl_page_height,
		setup_string,
		a,
		s,
		non_digit = /[\D]/;
	
	BASKET = {};
			
	utils 	 				= new Utilities();
	quantities 				= document.getElementsByName("quantity");


	$(".remove-butt").click(removeFromCart);
	$("#login-butt").click(function(){ window.location = "/login/" });
	$("#signup-butt").click(function(){ window.location = "/signup/" });
	$("#guest-checkout-butt").click(function(){ window.location = "/checkout/" });
	$("#continue_shop_butt").click(function(){ window.location = "/personalised-gifts/" });
	//---------------------------	ON CHECKOUT BUTTON PRESSED	-------------------------------------//
	
	$("#checkout_butt").click(function(){
		if(typeof is_loggedin == "undefined" || is_loggedin == false){
			$(".popup-window").css({ display: "block" })
							  .addClass("fadein");
		} else {
			window.location = "/checkout/";
		}
	});
	
	a_basket = document.getElementById("a_basket");							
	
	//----------------------------------------------------------	Logout user		
	sign_out_butt = document.getElementById("signout");
	
	if(sign_out_butt !== null){
		sign_out_butt.onclick = function(){
			utils.ajax_server_path = "../inc/userAccount.php";
			utils.sendReceiveToID(null, "user_logout=1", function(l){ window.location = "index.php";});
		}
	}
	
	//-------------------------------	WRITE QUOTE		----------------------------------------//
	// updateBasketInfo();
	writeQuote();

	//---------------------------	ON QUANTITY CHANGE	--------------------------//
	
	for(var i = 0, total = quantities.length; i < total; i += 1){
		quantities.item(i).onchange = function(){
			var parent = document.getElementById(this.parentNode.id);
			
			if(non_digit.test(this.value) || this.value == ""){
				this.value = "1";	
			}

			$.post("../inc/ShoppingCartServer.php", { update_quantity: $(this).closest(".item-wrapper").prop("id"), quantity: this.value },
					function(){ window.location = "./" }, "json")
			// writeQuote();
		}
	}
	
	
	//---------------------------	ON LOG ME IN BUTTON PRESSED	-------------------------------------//
	
	/*login_butt.onclick = function(){
		var login_data;
		
		login_data = validateForm(login_fields);
		
		if(!login_data.error){
			
			utils.ajax_server_path = "../inc/userAccount.php";
			utils.sendReceiveToID(null, "user=login"+login_data.post_data,
						function(a){  
							if(typeof a === "object"){
								if(a[0] === "success"){
									window.location = "../checkout/";
								} else {
									if(a[0] === "fail"){
										document.getElementById("login_message").innerHTML = a[1];
									}	
								}
							}
						}
			);
			
		}
		
	}*/ // end of onClick
	
	//--------------------------------------------------------//
	
	/*forgot_password.onclick = function(){
		login_table.style.display			= "none";
		forgot_password_instruction.style.display = "block";
		forgot_password_table.style.display = "block";
		
		login_reveal_butt	= document.getElementById("login_reveal_butt");
		forgot_form_field	= document.getElementsByName("forgot_form_field");
		formFieldEffect(forgot_form_field);
		
		forgot_pass_butt.onclick = function(){
			forgot_form_field		= document.getElementsByName("forgot_form_field");
			forgotten_pass_respond	= document.getElementById("forgotten_pass_respond");
			form_data = validateForm(forgot_form_field);
			
			if(!form_data.error){
				utils.ajax_server_path = "../inc/userAccount.php";
				utils.sendReceiveToID(null, "forgotten_pass=1"+form_data.post_data,
									function(respond){
										if(respond[0] === "success"){
											forgotten_pass_respond.style.color = "#5dbb6b";
											forgotten_pass_respond.innerHTML = respond[1];	
										} else {
											if(respond[0] === "error"){
												forgotten_pass_respond.style.color = "#f00";
												forgotten_pass_respond.innerHTML = respond[1];
											}
										}
									}
				);
				
			}
			
		}
		
		login_reveal_butt.onclick = function(){
			login_table.style.display			= "block";
			forgot_password_instruction.style.display = "none";
			forgot_password_table.style.display = "none";
		}
	}*/

	
	//--------------------------------------------------------// SUBMIT REGISTRATION FORM
	
	/*continue_checkout_butt.onclick = function(){
		window.location = "../checkout/";	
	}*/
	
	/*submit_butt.onclick = function(){
		var form_data;
		
		form_data = validateForm(form_fields);
		
		if(!form_data.error){
			utils.ajax_server_path = "../inc/userAccount.php";
			utils.sendReceiveToID(null, "new_user=register"+form_data.post_data,
					function(a){
						var form_wrapper,
							address_array,
							address_string = "";
						if(typeof a == "object" && a[0] !== "error"){	
							form_wrapper = document.getElementById("form_wrapper");
							form_wrapper.style.display = "none";
												
							if(typeof a !== "undefined"){*/
													
								/*
									a[0] - Name
									a[1] - Last Name
									a[2] - e-mail
									a[3] - joined address string. glue is {§} 
								*/
								/*address_array = a[3].split("{§}");
								for(var i = 0, tot = address_array.length; i < tot-1; i += 1){
									address_string += address_array[i]+"</br>";
								}
								
								register_window.style.height 	= "410px";
								register_window.style.top		= "50%";
								register_window.style.marginTop	= "-205px";
													
								message_area.innerHTML = "<a id='success_message'>You have successfully created a new account "+a[0]+"!</a></br><a id='info_message'>You have entered the following information about your self:</a><p id='address'>"+a[0]+" "+a[1]+"</br>"+address_string+"</p><a id='loggedin_message'>You are now logged in as <b id='email'>"+a[2]+"</b> Feel free to access your account to change your details, check status of your order or reorder saved designs.</a>";	
								
								form_wrapper.style.display				= "none";
								submit_butt.style.display				= "none";
								register_me_butt.style.display			= "none";		
								guest_checkout_butt.style.display		= "none";
								continue_checkout_butt.style.display	= "block";	
								login_wrapper.style.display				= "none";
								title_container1.style.display			= "none";
								title_container2.style.display			= "none";
								forgot_password_instruction.style.display = "none";
								forgot_password_table.style.display		= "none";
								register_message.style.display			= "none";
								document.getElementById("login_message").style.display	= "none";
							}
						} else {
							if(a[0] == "error"){
								register_message.innerHTML = a[1];	
							}
						}
					}
			);
		}
		
	}*/
	
	//--------------------------------------------------------// GET FOOTER LINKS
	// getFooterLinks();
});

function removeFromCart(){
	var self = this;
	$.post("../inc/ShoppingCartServer.php", { removeFromCart: $(self).closest(".item-wrapper").prop("id") },
		function(data){
			//console.log(data); 
			$(self).closest(".item-wrapper").remove();
			window.location = "./";
			/*BASKET.total_quantity = updateQuantities();
			updateBasketInfo(); */
		});
/*	utils.ajax_server_path = "../inc/ShoppingCartServer.php";
	utils.sendReceiveToID(self.parentNode.id, "Remove_item="+self.parentNode.id, );*/
	writeQuote();
		
}

//----------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------// Update Basket Info

function updateBasketInfo(){
	a_basket = $("#cart-items-counter");
	$.post("../inc/ShoppingCartServer.php", { get_total_in_basket: true }, function(data){
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
				shopping_wrapper = document.getElementById("shopping_scrollable_page");
				
				create_new_link = $("<a>Create a new travel card wallet?</a>").prop("id",'create_new');
				
				message =$("<div>").prop("id", "empty_message")
									.append($("<h2>").text("Your Basket is Empty"))
									.append($("<p>").html("What would you like to do?<br/>")
													.append(create_new_link));

				$("main div.center").empty().append(message);
				
				$("#total_order").hide();
				checkout_button.style.display	= "none";
				
				create_new_link.click(function(){
					window.location = "/";
				})
			}
		} else {
			$("#cart-items-counter").html("0");
		}
	}, "json")
}

//-------------------------------	writeQuote OUTPUTS QUOTE TABLE	-------------//

function writeQuote(){
	var copies_price = 0;
	
	$(".item-wrapper").each(function(){
		var price = $(this).data("price"),
			qty = $(this).find(".quantity").val(),
			total_for_item = parseFloat(parseFloat(price) * parseInt(qty));

		$(this).find(".subtotal").text("£"+(total_for_item).toFixed(2));
		copies_price += total_for_item;
	})

	$("#total_order").html("Subtotal: <a class='green_price'>£"+(copies_price).toFixed(2)+"</a>");
			
}


//--------------------------	ADDS "s" to an end of the word   ---------------------//

function add_S_If_mod_1(value, word){	
	if(value >0){
		remainder = value%10;
		if(remainder === 1){
			return word;
		}else{
			return word+"s";
		}
	} else {
		return word+"s";	
	}
}

//--------------------------	UPDATE QUANTITY   ---------------------//
function updateQuantities(){
	var total = 0;
	$(".item-wrapper").each(function(){
		total += $(this).find(".quantity").val();
	})
	return total;
}



//-------------------------------	MSG   ----------------------------//
function msg(message){
	var div = document.getElementById("inf");
	div.style.backgroundColor = "#fff";
	div.innerHTML = message;	
}

function LoadTabContent(something){
	window.location = "index.php?at="+something;
	
}

function goToPhotoUpload(){
	document.getElementById("category_post_data").value = "*%*^Photo_upload";
	document.getElementById("template_post_data").value = "*%*^Photo_upload";
	document.getElementById("load_page_form").submit();	
}

var DELIVERY_PRICE = 0,
	DELIVERY_DATE,
	total_price,
	transparent_back,
	OVERRIDE_ADDRESS = false;
//	FORM_DATA		={};
	TOTAL_DISCOUNTS	= undefined;
	TOTAL_COPIES	= undefined;

$(document).ready(function(){
	var total_items,
		scrl_page_height,
		non_digit = /[\D]/;
		
		utils			= new Utilities();
		
	basket_items			= document.getElementsByName("thumb_img");
	addr_scrolable_page		= document.getElementById("scrolable_page");
	form_fields				= document.getElementsByName("form_field");
//	first_class				= document.getElementById("first_class");
	special_delivery		= document.getElementById("special_delivery");
	address_list_window		= document.getElementById("address_list_window");
	transparent_back		= document.getElementById("register_transparent_back");
	design_gallery			= $("main div.center")[0];
	address_render			= document.getElementById("address_render");
	form_wrapper			= document.getElementById("form_wrapper");
//	new_addr_butt			= document.getElementById("new_addr_butt");
	
	
	// $(".country_cell").html(createCountrySelect("country_input", "form_field"));
	
	responsiveSetup();
	
//	address_render.style.textAlign	= "left";
	address_render.innerHTML		= "Please Enter delivery address where your order should be sent to.";
	
	$("main div.center").prepend(cat_name_container);
	$(".redeem_input").change(redeemVoucher);
	$(".redeem_butt:visible").click(redeemVoucher);
	//----------------------------------------------------------	
	
	$(".pay_butt").click(function(){ $(this).submit(); });

	updateBasketInfo();
	//----------------------------------------------------------	Logout user	
	
	sign_out_butt = document.getElementById("signout");
	
	if(sign_out_butt !== null){
		sign_out_butt.onclick = function(){
			utils.ajax_server_path = "../inc/userAccount.php";
			utils.sendReceiveToID(null, "user_logout=1", function(l){ window.location = "index.php";});
		}
	}
		
	//---------------------------	LOAD ADDRESS	-----------------------------//

	$(".load_from_address_butt").click(function(){
		if(typeof is_loggedin !== "undefined" && is_loggedin == true){
			transparent_back.style.display	= "block";
			addr_scrolable_page.innerHTML	= "";
			close_window_button				= document.createElement("span");
			close_window_button.id			= "close_window_button";
			close_window_button.title		= "Close this window";
			
			close_window_button.onclick	= function(){
				address_list_window.style.display	= "none";
				transparent_back.style.display		= "none";
			}
			
			address_list_window.appendChild(close_window_button);
			
			utils.ajax_server_path = "../inc/userAccount.php";
			utils.sendReceiveToID(null, "get_list_of_addresses=1",
					function(addresses){ 
						
						for(var i = 0, tot = addresses.length; i < tot-1; i += 1){
							
							if(typeof addresses[i] !== "undefined"){
								address_fields 			= addresses[i].split("{§}");		// Splits Address string into address fields
								if(address_fields.length > 2){
									new_address				= document.createElement("div");
									select_butt				= document.createElement("a");
									
									new_address.className	= "address_block_from_list";	
									select_butt.innerHTML	= "Select Address";
									select_butt.className	= "select_addr_butt";
									select_butt.address		= address_fields;
									
									new_address.appendChild(select_butt);
						
									for(var f = 0, tot = address_fields.length; f < tot; f += 1){
										a	= document.createElement("a");
										br	= document.createElement("br");
										a.className = "address_field";
										a.innerHTML = address_fields[f];
										
										new_address.appendChild(a);
										new_address.appendChild(br);
									}
									
									select_butt.onclick = function(){

										var address_string	= "";
										
										name_input		= document.getElementById("name_input");
										lname_input		= document.getElementById("lname_input");
										addr_input		= document.getElementById("addr_input");
										addr2_input		= document.getElementById("addr2_input");
										city_input		= document.getElementById("city_input");
										postcode_input	= document.getElementById("postcode_input");
										country_input	= document.getElementById("country_input");
										email_login		= document.getElementById("email_login");
										
										name_input.value		= this.address[0];
										lname_input.value		= this.address[1];
										addr_input.value		= this.address[2];
										addr2_input.value		= this.address[3];
										city_input.value		= this.address[4];
										postcode_input.value	= this.address[5];
										country_input.value		= this.address[6];
										
										if(typeof USER_EMAIL != "undefined"){
											email_login.value = USER_EMAIL;
										}
										
										document.getElementById("name_isset").value		= 1;

										document.getElementById("lname_isset").value	= 1;
										document.getElementById("addr_isset").value		= 1;
										document.getElementById("addr2_isset").value	= 1;
										document.getElementById("city_isset").value		= 1;
										document.getElementById("postcode_isset").value = 1;
										document.getElementById("email_isset").value	= 1;
										
										address_string			= name_input.value+" "+lname_input.value+"<br/>"+
																  addr_input.value+"<br/>";
										if(typeof addr2_input.value !== "undefined" && addr2_input.value !== "Address 2" && addr2_input.value.length > 0){
											address_string	+= addr2_input.value;
										}
										
										address_string	+= city_input.value+"<br/>"+
															postcode_input.value+"<br/>"+
															country_input.value+"<br/>";
										
										address_list_window.style.display	= "none";
										transparent_back.style.display		= "none";
										OVERRIDE_ADDRESS = true;
										
										address_render.style.textAlign	= "left";
										address_render.innerHTML		= address_string;
									}
									
									addr_scrolable_page.appendChild(new_address);
									
								}
							}
						}
						
						last_element			= document.createElement("a");
						last_element.id			= "last_element";
						addr_scrolable_page.appendChild(last_element);
						
						last_elements = document.getElementById("last_element");
						address_list_window.style.display = "block";
						
						// reloadScrollBar(last_elements.offsetTop);
					}
			);	
		}
	});
	
	
	//---------------------------	ON COUNTRY SELECT	-------------------------------------//
	$(".country_input").bind("change", function(){
		var total_items = 0,
			item_details;
		if($(this).val() != "United Kingdom" && $(this).val() != "Ireland"){
			
				toggleDeliveryDateVisible(false);

			item_details	= document.getElementsByName("item_order_details");
			for(var i = 0, tot = item_details.length; i < tot; i+=1){
				total_items += parseInt(item_details.item(i).value);
			}
			
			if(typeof TOTAL_DISCOUNTS != undefined || TOTAL_DISCOUNTS <= 0){
				DELIVERY_PRICE = ((total_items-1)*0.5)+2;
			}
			
			if($("#delivery_item").length == 0){
				$(".basket-content:visible").append( 
					$("<div class='item_container' id='delivery_item' >")
						.append( $("<span class='int_text'>").html("<h4>International Delivery</h4>") )
						.append( $("<span class='delivery_price'>").text("£"+(DELIVERY_PRICE).toFixed(2)) )
				)
			}

		} else {
			toggleDeliveryDateVisible(true);

			container = document.getElementById("delivery_item");
			if(container != null){
				container.parentNode.removeChild(document.getElementById("delivery_item"));
				DELIVERY_PRICE = 0;	
			}
		}
		writeQuote();
	});

	//---------------------------
	
	writeQuote();
	
	//-------------------------------	DELIVERY DATE	-----------------------------//

	days = productDeliveryTime();
	updateDeliveryDate(days);	// default	

	$(".form_field").bind("change", checkSyntax).bind("focus", checkIfHasError);
	//---------------------------
});

function toggleDeliveryDateVisible(visible){
	if(visible){
		$(".weekday").css("display","block");
		$(".date").css("display","inline");
		$(".month").css("display","inline");
		$("#delivery-message").css("display", "none");
	} else {
		$("#delivery-message").css("display", "block");
		$(".weekday").css("display","none");
		$(".date").css("display","none");
		$(".month").css("display","none");
	}
}

//---------------------------	ON PAY	-------------------------------------//
	
function submitPayment(formscope){
	var order = [],
		submitFunction,
		calculate = function(total_price, discount){
			var address = { address_override: 1, country: $(".country_input:visible").val() },
				//------------------------------------
				submitData = function(post_data){
					DELIVERY_DATE.price = DELIVERY_PRICE;
					$.post(utils.ajax_server_path, { Submit_payment: post_data}, 
						function(data){
							if(!data.error){
								$("#submit_form").append(data.form);
								if($("#paypall").length > 0){
									$("#paypall")[0].submit();	  
								}
							} else { alert(data.error_msg); }
						}, "json")
				},
				//------------------------------------
				submitDataFree = function(post_data){
					DELIVERY_DATE.price = DELIVERY_PRICE;
					$.post("../inc/ShoppingCartServer.php", { email_order: post_data }, 
						function(data){
							if( data.address ){
								var message ="<div class='text-left'><h2>Thank you for your order! We will send it to:</h2>";
								for(var row in data.address){ 
									if(row !== "name" && row !== "lname"){
										message += data.address[row]+"</br>";
									}
								}
								message += "</div>";

								outputMessage(message,
									function(){ 
										document.location = "/" 
									});
							}
					}, "json");
					
				};

			
			$("input[name='item_order_details']").each(function(){
				order.push({ id: $(this).prop("id"),  qty: $(this).val() });
			})
			
			// COPY FORM DATA ---------------------------------------------------------------------
			for(ff in formscope.signupform){
				if( typeof formscope.signupform[ff] == "object" && 
					formscope.signupform[ff].hasOwnProperty("$modelValue") && 
					formscope.signupform[ff].hasOwnProperty("$name") &&
					typeof formscope.signupform[ff].$modelValue !== "undefined"){
					
					address[formscope.signupform[ff].$name] = formscope.signupform[ff].$modelValue;
				}
			}

			// IF PRICE IS ZERO => SEND NEW ORDER CONFIRMATION  
			var conf_msg =  "<h3 class='text-left'>You can order up to ";
				conf_msg += String(TOTAL_DISCOUNTS);
				conf_msg += " "+add_S_If_mod_1(TOTAL_DISCOUNTS,"item");
				conf_msg += " using this voucher. Are you sure you want to order ";
				conf_msg += +TOTAL_COPIES+" item only?</h3>";

			if(parseFloat(total_price) <= 0){
				// IF NUMBER OF ITEMS ON THE CHECKOUT MATCHES NUMBER OF ITEMS ALLOWED BY VOUCHER
				if(TOTAL_COPIES >= TOTAL_DISCOUNTS || TOTAL_DISCOUNTS == "@8@"){
					submitDataFree({ order: order, delivery: DELIVERY_DATE, address: address }); 
				} else {
					// IF NUMBER OF ITEMS ON THE CHECKOUT IS LESS THAN NUMBER OF ITEMS ALLOWED BY VOUCHER
					confirmationMessage(conf_msg, "Yes", "No", function(){ 
											submitDataFree({ order: order, delivery: DELIVERY_DATE, address: address });
										});	
				}
			
			} else {
				// IF NUMBER OF ITEMS ON THE CHECKOUT MATCHES NUMBER OF ITEMS ALLOWED BY VOUCHER
				if(TOTAL_COPIES < TOTAL_DISCOUNTS && TOTAL_DISCOUNTS !== "@8@"){ 
					confirmationMessage(conf_msg, "Yes", "No", function(){ 
											submitData({ order: order, delivery: DELIVERY_DATE, address: address });
										});	
				} else {
					submitData({ order: order, delivery: DELIVERY_DATE, address: address });
				}
			}		
		}

		utils.ajax_server_path	= "../inc/ShoppingCartServer.php";
		writeQuote(calculate);
}
//---------------------------------------------------------------------------------
// 

function responsiveSetup(){
	/*if($(".mobile-content").css("display") == "block"){
		$("#non-mobile-basket-content").empty();
	} else {
		$("#mobile-basket-content").empty();
	}*/
}

//---------------------------------------------------------------------------------
// 

function productDeliveryTime(){
	var product_db_ids = [],
		delivery_days = 4;

	$(".item_container").each(function(){
		product_db_ids.push( $(this).data("db_id") );
		//console.log($(this).data("db_id"))
	});

	if( $.inArray( 10, product_db_ids ) > -1 ||
		$.inArray( 11, product_db_ids ) > -1 ||
		$.inArray( 12, product_db_ids ) > -1 ||
		$.inArray( 13, product_db_ids ) > -1 ||
		$.inArray( 14, product_db_ids ) > -1 ||
		$.inArray( 15, product_db_ids ) > -1 ){
		
		delivery_days = 6; 
	} // Diary

	return delivery_days
}

//-----------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------//
function checkSyntax(){
	$this		= $(this),
//	regex_phone	= /[^0-9+()\s]/,
	regex_name	= /[^a-zA-Z -]/,
	regex_email	= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	regex_street= /[^\w.,\s()]/,
	regex_city	= /[^a-zA-Z\s-.]/,
	
	name_error_msg		= "Please use only letters and \"-\". No numbers or other symbols",
	street_error_msg	= "Please use only letters, numbers and () '.' ','",
	city_error_msg		= "Please use only letters and \"-\", \".\" . No numbers or other symbols",
	email_error_msg		= "Please use only letters, numbers or - _ . symbols. Make sure email format is as name@server.xxx",
	tel_error_msg		= "Please use only numbers and + () symbols.";
	
	$("#save_form").text("Speichern").removeClass("saved");
	
	switch($this.attr("id")){

		case "name_input"		:	checkFieldErrors( $this, regex_name, name_error_msg);			break;
		case "lname_input"		:	checkFieldErrors( $this, regex_name, name_error_msg);			break;
		case "addr_input"		:	checkFieldErrors( $this, regex_street, street_error_msg);		break; 
		case "addr2_input"		:	checkFieldErrors( $this, regex_street, street_error_msg);		break;
		case "city_input"		:	checkFieldErrors( $this, regex_city, city_error_msg);			break;
		case "email_login"		:	checkFieldErrors( $this, regex_email, email_error_msg, true );	break;
		case "postcode_input"	:	checkFieldErrors( $this, regex_street, street_error_msg);		break;
	}
}

//-------------------------------------------------------------------------------------//
function checkFieldErrors( $this_field, regex_pattern, error_msg, inverse){
	var outputErrors = function(){
							$this_field.css("color", "#f33");
							$this_field.closest("td").addClass("error_field");
							$("#error_message_cell").html(error_msg);
						},
							
		clearErrors  = function(){
							$this_field.css("color", "#000");
							$this_field.closest("td").removeClass("error_field");
						//	$("#error_message_cell").html("");
						}

	
	if( regex_pattern.test( $this_field.val() )){
		(inverse != undefined && inverse == true) ? clearErrors() : outputErrors();
	} else {
		(inverse != undefined && inverse == true) ? outputErrors() : clearErrors();
	}

}

//-----------------------------------------------------------------------------------------
function checkIfHasError(){
	var name_error_msg		= "Please use only letters and \"-\". No numbers or other symbols",
		street_error_msg	= "Please use only letters, numbers and () '.' ','",
		city_error_msg		= "Please use only letters and \"-\", \".\" . No numbers or other symbols",
		email_error_msg		= "Please use only letters, numbers or - _ . symbols. Make sure email format is as name@server.xxx",
		tel_error_msg		= "Please use only numbers and + () symbols.",
		$this				= $(this);
	if( $this.closest("td").hasClass("error_field") ){

		switch($this.attr("id")){
	
			case "name_input"		:	$("#error_message_cell").html( name_error_msg);			break;
			case "lname_input"		:	$("#error_message_cell").html( name_error_msg);			break;
			case "addr_input"		:	$("#error_message_cell").html( street_error_msg);		break; 
			case "addr2_input"		:	$("#error_message_cell").html( street_error_msg);		break;
			case "city_input"		:	$("#error_message_cell").html( city_error_msg);			break;
			case "email_login"		:	$("#error_message_cell").html( email_error_msg, true );	break;
			case "postcode_input"	:	$("#error_message_cell").html( street_error_msg);		break;
		}
	} else {
		if($(".error_field").length == 0){
			$("#error_message_cell").html("");
		}
	}
}

//-------------------------------	OUTPUT MESSAGE	--------------------------------------------//

function outputMessage(optionalHtml, okFunction, msg_wrap_class, window_class){
	$(".popup-window").css({ display: "block" })
					  .addClass("fadein");

	$(".opaque_window .confirmation_buttons").empty();

	$ok_butt = $("<button class='ok_button'>").text("OK")
											  .appendTo(".opaque_window .confirmation_buttons");
	
	if(typeof optionalHtml !== "undefined"){
		$(".opaque_window .message_area").html(optionalHtml);
		 
	}
	
	$ok_butt.click(function(){
		$(".popup-window").removeClass("fadein")
						  .css({ display: "none" });
					  
		if(typeof okFunction == "function"){
			okFunction();
		}
	});
		
}

function confirmationMessage(optionalHtml, yes_butt_text, no_butt_text, okFunction, noFunction){
	$(".popup-window").css({ display: "block" })
					  .addClass("fadein");
	
	$(".opaque_window .confirmation_buttons").empty();

	if(typeof optionalHtml !== "undefined"){
		$(".opaque_window .message_area").html(optionalHtml);
		 
	}

	if(typeof yes_butt_text !== "undefined"){
		$("<button>").text(yes_butt_text)
	  			   	 .appendTo(".opaque_window .confirmation_buttons")
	  			     .click(function(){
	  			     	$(".popup-window").removeClass("fadein")
						  				  .css({ display: "none" });
		  			   	if(typeof okFunction == "function"){
							okFunction();
						}
	  			  	 });
	}

	if(typeof no_butt_text !== "undefined"){
		$("<button>").text(no_butt_text)
					 .appendTo(".opaque_window .confirmation_buttons")
					 .click(function(){
					 	$(".popup-window").removeClass("fadein")
						  				  .css({ display: "none" });
						if(typeof noFunction == "function"){
							noFunction();
						}
					 });
	}
}
//---------------------------------------------------------------------------------
// 
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
			}
		} else {
			$("#cart-items-counter").html("0");
		}
	}, "json")
}
//---------------------------------------------------------------------------------
// 
function updateDeliveryDate(days_from_now){
	delivery_date	= {};
	delivery_date = returnDate(days_from_now);						//<<<<<<<<< UNREM AFTER 08.01.2013
//	delivery_date = { month: "January", date: "11", day: "Friday", year: "2013" }; // DELETE AFTER 08.01.2013
		
	$(".month").html(delivery_date.month);
	$(".date").html(delivery_date.date);
	$(".weekday").html(delivery_date.day);

	DELIVERY_DATE		= delivery_date;	
}
//---------------------------------------------------------------------------------
// 
function returnDate(days_in_time){
	var month, date, day, add_days = 0,
		checkWeekends = function(add_days){
			// ----------------------------- Check day of the week (0 based)
			switch(date_obj.getDay()){
				// case 6:	add_days += 2; checkHolidays(add_days); break;// If Saturday
				case 0:	add_days += 2; checkHolidays(add_days); break;// If Sunday
				case 1:	add_days += 2; checkHolidays(add_days); break;// If Monday
				case 2:	add_days += 1; checkHolidays(add_days); break;// If tuesday
			}
			return add_days;
		},

		checkHolidays = function(add_days){
			// ----------------------------- Check for holidays
			month = date_obj.getMonth()+1;
			date = date_obj.getDate();
			switch(date+"-"+month){
				case "25-12": add_days +=2; checkWeekends(add_days); break;
				case "26-12": add_days +=1; checkWeekends(add_days); break;
				case "28-12": add_days +=1; checkWeekends(add_days); break;
				case "1-1": add_days +=1; checkWeekends(add_days); break;
			}
			return add_days;
		};
	
	date_obj = new Date();
	
	date_obj.setDate(date_obj.getDate() + days_in_time);
	
	add_days = checkHolidays(add_days);
	add_days = checkWeekends(add_days);

	add_days > 0 ? date_obj.setDate(date_obj.getDate() + add_days) : false;
	
	date	= date_obj.getDate();
	
	switch(date_obj.getMonth()){
	
		case 0:		month = "January"; 	break;
		case 1:		month = "February"; break;
		case 2:		month = "March"; 	break;
		case 3:		month = "April"; 	break;
		case 4:		month = "May"; 		break;
		case 5:		month = "June"; 	break;
		case 6:		month = "July"; 	break;
		case 7:		month = "August"; 	break;
		case 8:		month = "September"; break;
		case 9:		month = "October"; 	break;
		case 10:	month = "November"; break;
		case 11:	month = "December"; break;
		
	}
	
	switch(date_obj.getDay()){
	
		case 1:		day = "Monday";		break;
		case 2:		day = "Tuesday";	break;
		case 3:		day = "Wednesday";	break;
		case 4:		day = "Thursday";	break;
		case 5:		day = "Friday";		break;
		case 6:		day = "Saturday";	break;
		case 0:		day = "Sunday";		break;
		
	}

	year = date_obj.getFullYear();
	date_obj= null;
	return {month: month, date: date, day: day, year: year};
}

//---------------------------	REDEEM VOUCHER	-----------------------------//
	
function redeemVoucher(){

	var voucher = $(".redeem_input:visible").val();
	$.post( "../inc/ShoppingCartServer.php", 
			{ redeem_voucher: voucher },
			function(data){
				
				 if(data.success){
				 	// alert("success");
					 writeQuote(function(tot_pr, disc){
					 	if($(".mobile-content").css("display") == "block"){
						 	outputMessage("<h3 class='success-msg'>Your total order has changed to: £"+tot_pr+"</h3>");
						 }
					 });
				 } else {
				 	if(data.notice){
				 		// alert(data.notice);
				 		outputMessage("<h3 class='notice-msg'>"+data.notice_msg+"</h3>");
				 	}
				 }
			}, "json");
}

//---------------------------------------------------------------------------------
// 

function writeQuote(optFunction){

	$.post("../inc/ShoppingCartServer.php", { getDiscountInfo:true },
		function(data){

			calculateQuote( data, optFunction );
		}
	, "json");
}
//---------------------------------------------------------------------------------
//

function calculateQuote( discount, optFunction ){
	var total_price = 0;
	TOTAL_DISCOUNTS = discount.num_of_discounts;
	TOTAL_COPIES = 0,
	discounted_object_is_in_cart = false;

	$($(".item_container:not(#delivery_item):visible").get().reverse()).each(function(){
		var this_price = $(this).data("price"),
			this_qty= $(this).find("input[name='item_order_details']").val(),
			this_subtotal = this_price * this_qty,
			discounts_remainer;

		if(discount.discount && discount.num_of_discounts > 0 || discount.num_of_discounts == "@8@"){

			if( discount.discount_type == "price"){
				if(discount.num_of_discounts == "@8@"){
					discount_amount = this_qty * discount.discount_value;
					discounts_remainer = this_qty;
				} else {
					discounts_remainer = discount.num_of_discounts - this_qty;
					discount_amount = (discounts_remainer >= 0) ? this_qty * discount.discount_value 
																: discount.num_of_discounts * discount.discount_value;
				}

			} else if(discount.discount_type == "percent"){ // Discount in Percents applied to all items
				discount_amount = this_qty * ( this_price * (discount.discount_value / 100) ); 
				discounts_remainer = this_qty;
			}

			this_subtotal = (this_qty * this_price) - discount_amount;
			
			if(discount.discount_type !== "percent"){
				discount.num_of_discounts = (discount.num_of_discounts !== "@8@" ) ? discount.num_of_discounts-this_qty : "@8@";
			} else {
				discount.num_of_discounts = (discount.num_of_discounts !== "@8@" ) ? discount.num_of_discounts : "@8@";
			}

			TOTAL_COPIES += parseInt(this_qty);

			if (this_subtotal < 0 ) { this_subtotal = 0 };
		}

		total_price += this_subtotal;

		$(this).find(".price").text("£"+this_price);
		$(this).find(".total_for_item").text("£"+(this_subtotal).toFixed(2));
	});
	// discount_product_name
	// Remove delivery price if there is discount
	if(discount.discount && TOTAL_DISCOUNTS > 0 || TOTAL_DISCOUNTS == "@8@"){					
		DELIVERY_PRICE	= 0;
		$("#delivery_item").remove();
	}

	total_price = ( total_price  + DELIVERY_PRICE ).toFixed(2)

	$(".total_order").text("£"+total_price);
	
	//----------------------- CHANGE BUTTON TITLE FROM "PAY NOW" TO "ORDER NOW"
	if(parseFloat(total_price) > 0){
		$(".pay_butt").text("Pay Now");
	} else {
		$(".pay_butt").text("Order Now");
	}
	//-----------------------
	if(typeof optFunction == "function"){
		optFunction(total_price, discount);
	}
}

//---------------------------------------------------------------------------------
// 
function add_S_If_mod_1($value, $word){	
	if($value >0){
		$remainder = $value%10;
		if($remainder === 1){
			return $word;
		}else{
			return $word+"s";
		}
	} else {
		return $word+"s";	
	}
}
//-------------------------------	MSG   ----------------------------//
function msg(message){
	var div = document.getElementById("inf");
	div.style.backgroundColor = "#fff";
	div.innerHTML = message;	
}
//---------------------------------------------------------------------------------
// 
function LoadTabContent(something){
	window.location = "index.php?at="+something;
	
}
//---------------------------------------------------------------------------------
// 
function goToPhotoUpload(){
	document.getElementById("category_post_data").value = "*%*^Photo_upload";
	document.getElementById("template_post_data").value = "*%*^Photo_upload";
	document.getElementById("load_page_form").submit();	
}

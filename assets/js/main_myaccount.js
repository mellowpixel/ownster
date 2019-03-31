$(document).ready(function(){

utils		= new Utilities();
USER_TABS	=	{};
	
	sign_out_butt		= document.getElementById("signout");
	form_wrapper		= document.getElementById("form_wrapper");
		
//	page_scroll 		= new Slider();
		
	updateBasketInfo();
	
	RadioButton.prototype.class_name_normal		= "normal";
	RadioButton.prototype.class_name_over		= "over";
	RadioButton.prototype.class_name_active 	= "active";
	
	loadUsersDetails();
	loadOrdersHistory();
	
	//--------------------------------------------------------------------------------// Sign Out	
	if(sign_out_butt !== null){
		sign_out_butt.onclick = function(){
			utils.ajax_server_path = "../inc/userAccount.php";
			utils.sendReceiveToID(null, "user_logout=1", function(l){ window.location = "/";});
		}
	}
});

//---------------------------------------------------------------------------------
// 

function loadUsersDetails(){
	FORM = {};
	$.post("../inc/userAccount.php", { get_users_profile: true },
		function(data){
		
			putDetailsOnStage(data.data);
			
		}, "json");
		
//	reloadScrollBar(900);
}

//------------------------------------------------------------------------------------------------------------------------

function putDetailsOnStage(details){
	// console.log(details)
	var name			= details.name, 
		lastname		= details.lastname, 
		email			= details.email, 
		user_address	= details.addresses[0], 

		
	edit_details_butt		= $("<button>").addClass("small-butt").prop("id", "edit_details_butt").text("Edit my details");
	change_password_butt	= $("<button>").addClass("small-butt").prop("id", "change_password_butt").text("Change password");
	add_new_addr_butt		= $("<button>").addClass("small-butt").prop("id", "add_new_addr_butt").text("Add new address");
	
	details_wrapper	= $("#user_details_wrapper").html(createDetailsTable(true, details))
							.append($("<div class='address-controlls-left'>").append(change_password_butt)
														 				.append(add_new_addr_butt)
														 				.append(edit_details_butt))
							// .appendTo("#user-data-section");
								  		
	// ADD USER'S DETAILS WRAPPER TO THE STAGE
				
	//---------------------------------------------------------------------- CREATE EDIT DETAILS BUTTON		
	edit_details_butt.click(function(){
	
		editDetailsForm(true, [name, lastname, email, user_address], -1, false, $("#user_details_wrapper")[0]);
	});
				
	
	//---------------------------------------------------------------------- CHANGE PASSWORD BUTTON
	
	change_password_butt.click(function(){
		var parent = this.parentNode,
			form_data;
		
		$("#user_details_wrapper").html( createPasswordChangeForm() );

		form_fields			= document.getElementsByName("form_field");		// GET TABLE FIELDS WITH USER DETAILS
		form_submit_butt	= document.getElementById("form_submit_butt");	// GET SAVE CHANGES BUTTON
		cancel_form			= document.getElementById("cancel_form");
				
		formFieldEffect(form_fields);	// CREATE FORM FIELD EFFECTS. NAME OF THE FIELD POPING OUT TO THE LEFT OF THE INPUT WHEN USER FOCUSES ON THE STRING
	
		form_submit_butt.onclick = function(){			
			form_fields		= document.getElementsByName("form_field");		// GET TABLE FIELDS WITH USER DETAILS
			form_data	 	= validateForm(form_fields);
			
			if(!form_data.error){
				utils.ajax_server_path	= "../inc/userAccount.php";
				utils.sendReceiveToID(null, "change_user_password=1"+form_data.post_data, function(d){ window.location = "./" });
			}
		}
		
		cancel_form.onclick = function(){
			putDetailsOnStage(details);
		}
		
	});
	
	
	//---------------------------------------------------------------------- ADD NEW ADDRESS BUTTON
	
	add_new_addr_butt.click(function(){
		var form_data;
		
		
		$("#user_details_wrapper").html(createForm(false));
		
		form_fields			= document.getElementsByName("form_field");		// GET TABLE FIELDS WITH USER DETAILS
		form_submit_butt	= document.getElementById("form_submit_butt");	// GET SAVE CHANGES BUTTON
		cancel_form			= document.getElementById("cancel_form");
				
		formFieldEffect(form_fields);	// CREATE FORM FIELD EFFECTS. NAME OF THE FIELD POPING OUT TO THE LEFT OF THE INPUT WHEN USER FOCUSES ON THE STRING
		
	
	
		form_submit_butt.onclick = function(){			
			form_fields		= document.getElementsByName("form_field");		// GET TABLE FIELDS WITH USER DETAILS
			form_data	 	= validateForm(form_fields);
			
			if(!form_data.error){
				utils.ajax_server_path	= "../inc/userAccount.php";
				utils.sendReceiveToID(null, "add_new_address=1"+form_data.post_data,function(){ window.location = "./" });
			}
		}
		
		cancel_form.onclick = function(){
			putDetailsOnStage(details);
		}
	});
				
	//---------------------------------------------------------------------- PRINT SAVED ADDRESSES
	
	if(details.addresses.length > 1){
		for(var i = 1, tot = details.addresses.length; i < tot; i += 1){				
			printSavedAddresses(details.addresses[i], i);
		}
	}
}

//------------------------------------------------------------------------------------------------------------------------

function printSavedAddresses(saved_address, index){
	
	addr_wrapper			= $("<div>").addClass("addr_wrapper").html(createDetailsTable(false, saved_address));	
	edit_addr_butt			= $("<button>").addClass("small-butt").text("Edit address");
	delete_addr_butt		= $("<button>").addClass("small-butt").text("Delete address");

	$(addr_wrapper).append( $("<div class='address-controlls'>").append(edit_addr_butt).append(delete_addr_butt));
	saved_addresses_frame	= $("#saved_addresses_frame").append(addr_wrapper).appendTo("#user-data-section");
					
	edit_addr_butt.click(function(){
		var parent = $(this).parent()[0].parentNode;	
		editDetailsForm(false, saved_address, index, true, parent);
	});
	
	//----------------------------------------------------------------------------------------------------- DELETE ADDRESS BUTTON
	
	delete_addr_butt.click(function(){
		
		if( confirm("Are you sure you want to delete this address") ){
			utils.ajax_server_path	= "../inc/userAccount.php";		
			utils.sendReceiveToID(null, "delete_saved_address="+index, function(){ window.location = "./" });
		}
	});
	
}

//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

function createDetailsTable(account_user, details){
	var address = "", profile_table = "", fields, adr_ch = true;

	if(account_user){

		for(a in details.addresses[0]){
			address += adr_ch ? "<tr><td class='row_name_primary'>Address:&nbsp;</td><td class='gap_primary'>&nbsp;</td><td>"+details.addresses[0][a]+"</td></tr>"
							  : "<tr><td class='row_name_primary'>&nbsp;</td><td class='gap_primary'>&nbsp;</td><td>"+details.addresses[0][a]+"</td></tr>";
			adr_ch = false;
		}

		// console.log(address)
		profile_table = "<table class='details-table'>"+
							"<tr>"+
								"<td class='row_name_primary'>Name:</td>"+
								"<td class='gap_primary'>&nbsp;</td>"+
								"<td class='row_data_primary'>"+details.name+" "+details.lastname+"</td>"+
							"</tr>"+
							"<tr>"+
								"<td class='row_name_primary'>E-mail:</td>"+
								"<td class='gap_primary'>&nbsp;</td>"+
								"<td class='row_data_primary'>"+details.email+"</td>"+
							"</tr>"+address+
						"</table>";

	} else {
		/*fields			= details.split("{§}");
		profile_table	= "<table class='details-table'><tr><td class='row_name'>Name:</td><td class='gap'>&nbsp;</td><td class='row_data'>"+fields[0]+"</td></tr>";
		for(var i = 1, tot = fields.length; i < tot; i += 1){
			if(i < 2){
				profile_table += "<tr><td class='row_name'>Address:</td><td class='gap'>&nbsp;</td><td class='row_data'>"+fields[i]+"</td></tr>";	
			} else {
				profile_table += "<tr><td class='row_name'>&nbsp;</td><td class='gap'>&nbsp;</td><td class='row_data'>"+fields[i]+"</td></tr>";	
			}
		}*/
	}
	
	return profile_table+"</table>";
}

//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

function editDetailsForm(account_user, profile_array, address_index, update_saved_address, this_container){
	var name, 
		lastname, 
		email, 
		address_fields;					
					
	this_container.innerHTML		= createForm(account_user);	// CREATE TABLE WITH USER'S DETAILS 
	
	form_fields						= document.getElementsByName("form_field");		// GET TABLE FIELDS WITH USER DETAILS
	form_submit_butt				= document.getElementById("form_submit_butt");	// GET SAVE CHANGES BUTTON
	cancel_form						= document.getElementById("cancel_form");
					
	formFieldEffect(form_fields);	// CREATE FORM FIELD EFFECTS. NAME OF THE FIELD POPING OUT TO THE LEFT OF THE INPUT WHEN USER FOCUSES ON THE STRING
	
	if(account_user){	
		form_fields.item(0).value	= profile_array[0]; // COPY USER'S NAME
		form_fields.item(1).value	= profile_array[1]; // COPY USER'S LAST NAME
		form_fields.item(2).value	= profile_array[2]; // COPY USER'S EMAIL
		
		form_fields.item(0).isset	= true;
		form_fields.item(1).isset	= true;
		form_fields.item(2).isset	= true;
		 
		address_fields				= profile_array[3].split("{§}");
		
		copyAddressIntoFormFields(form_fields, address_fields, 3);
		
	} else {
		address_fields				= profile_array.split("{§}");
		form_fields.item(0).value	= address_fields.shift();
		form_fields.item(0).isset	= true;
		
		copyAddressIntoFormFields(form_fields, address_fields, 1);
	}
				
	// WHEN USER PRESSES SAVE CHANGES BUTTON
			
	form_submit_butt.onclick = function(){
		var form_data;
		
		form_fields	= document.getElementsByName("form_field");			
		form_data	= validateForm(form_fields);
		if(!form_data.error){
			utils.ajax_server_path	= "../inc/userAccount.php";
			
			if(!update_saved_address){
				
				utils.sendReceiveToID(null, "change_user_details="+address_index+form_data.post_data,
						function(){
							window.location = "./";
						}
				);
				
			} else {
				utils.sendReceiveToID(null, "change_user_details="+address_index+"&update_saved_address=1"+form_data.post_data,
						function(){
							window.location = "./";
						}
				);
			}
		}
	}
	
	cancel_form.onclick = function(){
		loadUsersDetails();
	}
}

//------------------------------------------------------------------------------------------------------------------------

function copyAddressIntoFormFields(form_fields, address_fields, inputs_offset){
	for(var i = 0, tot = form_fields.length; i < tot-2; i +=1){
		if(form_fields.item(i+inputs_offset) !== null){
			form_fields.item(i+inputs_offset).value	= address_fields[i];
			form_fields.item(i+inputs_offset).isset	= true;
				
			if(i === 1){
				if(address_fields[i+inputs_offset] !== ""){
					form_fields.item(i+inputs_offset).value	= address_fields[1];
					form_fields.item(i+inputs_offset).isset	= true;
				} else {
					form_fields.item(i+inputs_offset).value	= "";
					form_fields.item(i+inputs_offset).isset	= true;
				}
			}
		}
	}
}

//--------------------------------------------------------------------------------------// Create Form
function createForm(user){
	var table = "";
	
	table += "<table>";
	
	if(user){ // IF DETAILS BEING EDITED BELONG TO THE ACCOUNT USER, ADD "Name", "Last Name", and "Email" FIELDS. OTHERWISE ADD ONLY "Full Name" FIELD  
		table += "<tr><td><a class='invisible_text' id='name_input_label'>Name</a> </td><td> <input type='text' name='form_field' id='name_input' value='Name' /></td><td class='message' id='name_msg'></td></tr>";
		table += "<tr><td><a class='invisible_text' id='lname_input_label'>Last Name</a></td><td><input type='text' name='form_field' id='lname_input' value='Last Name' /></td><td class='message' id='lname_msg'></td></tr>";
		table += "<tr><td><a class='invisible_text' id='email_edit_input_label'>e-mail address</a></td><td><input type='text' name='form_field' id='email_edit_input' value='e-mail address'/></td><td class='message' id='email_msg'></td></tr>";
	} else {
		table += "<tr><td><a class='invisible_text' id='name_input_label'>Name</a> </td><td> <input type='text' name='form_field' id='name_input' value='Name' /></td><td class='message' id='name_msg'></td></tr>";
		table += "<tr><td><a class='invisible_text' id='lname_input_label'>Last Name</a></td><td><input type='text' name='form_field' id='lname_input' value='Last Name' /></td><td class='message' id='lname_msg'></td></tr>";
	}
	
	table += "<tr><td><a class='invisible_text' id='addr_input_label'>Address</a></td><td><input type='text' name='form_field' id='addr_input' value='Address' /></td><td class='message' id='addr_msg'></td></tr>";
	
	table += "<tr><td><a class='invisible_text' id='addr2_input_label'>Address 2</a></td><td><input type='text' name='form_field' id='addr2_input' value='Address 2' /></td><td class='message' id='addr2_msg'></td></tr>";
	
    table += "<tr><td><a class='invisible_text' id='city_input_label'>City</a></td><td><input type='text' name='form_field' id='city_input' value='City' /></td><td class='message' id='city_msg'></td></tr>";
	
	table += "<tr><td><a class='invisible_text' id='postcode_input_label'>Postal Code</a></td><td><input type='text' name='form_field' id='postcode_input' value='Postal Code' /></td><td class='message' id='postcode_msg'></td></tr>";                            
	
    table += "<tr><td><a class='invisible_text' id='country_input_label'>Country</a></td><td>"+createCountrySelect("country_input", "form_field");
	
	table += 	"</td><td class='message' id='country_msg'></td>"+
             "</tr>";                               
	
    table += "<tr><td></td><td style='text-align:center'><button class='small-butt' id='form_submit_butt'>Register</button></td></tr>";
	
	table += "<tr><td></td><td style='text-align:center'><button class='small-butt' id='cancel_form'>Cancel</button></td></tr>";
	
    table += "</table>";
	
	return table;
	
}

function createPasswordChangeForm(){

	var table = "";
	
	table += "<table>";
	table += "<tr><td><a class='invisible_text' id='old_paswd_input_label'>Old Password</a></td>";				// Input Name 
	table += "<td><input type='text' name='form_field' id='old_paswd_input' value='Old Password' /></td>";		// Input
	table += "<td class='message' id='old_paswd_msg'></td></tr>";												// Input message
			
	table += "<tr><td><a class='invisible_text' id='paswd_input_label'>New Password</a></td>";
	table += "<td><input type='text' name='form_field' id='paswd_input' value='New Password' /></td>";
	table += "<td class='message' id='paswd_msg'></td></tr>";		
	 
	table += "<tr><td><a class='invisible_text' id='confpaswd_input_label'>Confirm</a></td>";
	table += "<td><input type='text' name='form_field' id='confpaswd_input' value='Confirm new Password' /></td>";
	table += "<td class='message' id='confpaswd_msg'></td></tr>";
	
	table += "<tr><td></td><td style='text-align:center'><button class='small-butt' id='form_submit_butt'>Register</button></td></tr>";
	
	table += "<tr><td></td><td style='text-align:center'><button class='small-butt' id='cancel_form'>Cancel</button></td></tr>";
			
	table += "</table>";
	
	
	return table;
				
}
//-------------------------------------------------------------------------------// Lad Orders History
function loadOrdersHistory(){

	$.post("../inc/userAccount.php", { getOrdersHistory: true },function(data){
		if (!data.error && data.history) {
			for(order in data.history){
				// console.log("Here: ", data.history[order]);
				default_pic_src = data.history[order].product_thubnails.default_pic;

				order_wrapper = $("<div>").addClass("order_wrapper");
				img_container = $("<div>").addClass("img_container");
				order_details_container = $("<div>").addClass("order_details_container");
				button_container = $("<div>").addClass("button_container");
				reorder_butt = $("<button class='small-butt reorder-butt'>Reorder</button>")
									.appendTo(button_container)
									.data("order_id", data.history[order].order_id)
									.click(reorderItem);

				details_table = $("<table>").html(
									"<tr class='t_header_row'>"+
										"<th>Order Date</th>"+
										"<th>Price</th>"+
										"<th>Quantity</th>"+
										"<th>Subtotal</th>"+
										
									"</tr>"+
									"<tr>"+
										"<td>"+data.history[order].order_date+"</td>"+
										"<td>"+data.history[order].item_price+"</td>"+
										"<td>"+data.history[order].order_qty+"</td>"+
										"<td>"+data.history[order].order_total_price+"</td>"+
										
									"</tr>"
								);

				order_wrapper.append( img_container)
							 .append( order_details_container.append(details_table) )
							 .append( reorder_butt )
							 .appendTo( "#orders-container" );

				$("<img>").prop("src", default_pic_src ).appendTo(img_container);
			}
		};
		// console.log(data);
	}, "json");
}

//---------------------------------------------------------------------------------
// 

function reorderItem(){
	var order_id = $(this).data("order_id");
	$.post("../inc/ShoppingCartServer.php", { itemReorder: order_id }, 
		function(){ 
			updateBasketInfo();
			$(".message_area",".popup-window").empty().append($("<h2>").append("Your order has been added to the basket."));
			$(".popup-window").css({ display: "block" })
			  .addClass("fadein");
			$("#proceed-butt").unbind("click").bind("click", function(){
				$(".popup-window").removeClass("fadeout").css({ display: "none" });
			})
			/*confirmMSG( ".do-action",
				"Your order has been added to the basket.",
				function(){
					$(".popup-message-window.do-action").css("display", "none");
				},
				function(){}
			);*/
		},
		"json")
}

//-------------------------------------------------------------------------------// ADD "s" FUNCTION	
							
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

//-------------------------------------------------------------------------------// Update Basket Info

function updateBasketInfo(){
	$.post("../inc/ShoppingCartServer.php", { get_total_in_basket: true }, function(data){
		if(!data.error){
			$(".mob-basket-qty").html(data.total);
			$(".basket-qty").html(data.total);
		} else {
			$(".mob-basket-qty").html("0");
			$(".basket-qty").html("0");
		}
	}, "json")
}

//-------------------------------------------------------------------------------// Reorder Butt
function reorder(order_id, self){
	utils = new Utilities();	
	utils.ajax_server_path = "../inc/ShoppingCartServer.php";
	utils.sendReceiveToID(null, "reorder="+order_id, function(){	self.src = "../layoutimg2/ui/added_to_basket_butt.gif"; updateBasketInfo(); });
	
}
//-------------------------------	MSG   ----------------------------//
function msg(message){
	var div = document.getElementById("inf");
	div.style.backgroundColor = "#fff";
	div.innerHTML = message;	
}

function confirmMSG(window_class, message, yesFunc, noFunk){
	$(".popup-message-window"+window_class).css("display", "block");
	$(".popup-message-window"+window_class).find(".message-wrapper").html(message);
	$(".popup-message-window"+window_class).find(".yes-butt").click(yesFunc);
	$(".popup-message-window"+window_class).find(".no-butt").click(noFunk);
}

function goToPhotoUpload(){
	document.getElementById("category_post_data").value = "*%*^Photo_upload";
	document.getElementById("template_post_data").value = "*%*^Photo_upload";
	document.getElementById("load_page_form").submit();	
}
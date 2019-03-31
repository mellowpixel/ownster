//main_register.js

$(document).ready(function(){

	var Util 	 = new Utilities(),
		submit_butt,
		form_wrap,
		form_container;
	
	Util.ajax_server_path = "/inc/userAccount.php";
	
	form_wrap 		= document.getElementById("form_wrapper")	//	{	margin-top:0px; margin-left:120px; }
	form_container	= document.getElementById("form_container");	//	{	min-height:400px;	}
	submit_butt		= document.getElementById("form_submit_butt");
	form_fields		= document.getElementsByName("form_field");
	register_message_area	= document.getElementById("register_message_area");
	
	login_wrapper 	= document.getElementById("login_wrapper")	//	{	margin-top:0px; margin-left:120px; }
	login_butt		= document.getElementById("login_butt");
	login_fields	= document.getElementsByName("login_field");
	login_table		= document.getElementById("login_table");
	
	forgot_password_table	= document.getElementById("forgot_password_table");
	forgot_password			= document.getElementById("forgot_password");
	forgot_password_instruction = document.getElementById("forgot_password_instruction");
	forgot_pass_butt		= document.getElementById("forgot_pass_butt");
	
	sign_out_butt 	= document.getElementById("signout");
	
	updateBasketInfo();
	
	if(sign_out_butt !== null){
		sign_out_butt.onclick = function(){
			Util.ajax_server_path = "/inc/userAccount.php";
			Util.sendReceiveToID(null, "user_logout=1", function(l){ window.location = "/";});
		}
	}
	
	
	//--------------	FORM FIELD HANDLER	------------------//
	
	
	formFieldEffect(form_fields);
	formFieldEffect(login_fields);
	
	login_butt.onclick = function(){
//		var login_data;
		
//		login_data = validateForm(login_fields);
		
//		if(!login_data.error){
			
			Util.ajax_server_path = "/inc/userAccount.php";
			Util.sendReceiveToID(null, "user=login&email="+document.getElementById("email_login").value+"&password="+document.getElementById("password_input").value,
					function(a){  
							if(typeof a === "object"){
								if(a[0] === "success"){
									login_wrapper.style.display	= "none";
									
									document.getElementById("form_wrapper").style.display = "none";
                        			document.getElementById("login_wrapper").style.display = "none";
									document.getElementById("title_container1").style.display = "none";
									document.getElementById("title_container2").style.display = "none";
									
									document.getElementById("login_message").innerHTML = "<a id='success_message'>Hello "+a[1]+" "+a[2]+"!</a></br><a id='loggedin_message'>You are now logged in. Feel free to access your account if you wish to change your details, check status of your order or reorder saved designs.</a><br/><button class='greenongray-butt' id='go_to_account_butt' title='Go to yor account.'>Go to my account</button>";
									
									document.getElementById("go_to_account_butt").onclick = function(){
										window.location = "/my-account/";	
									}
								} else {
									if(a[0] === "fail"){
										document.getElementById("login_message").innerHTML = a[1];
									}	
								}
							}
						}
			);
//		}
		
	} // end of onClick
	
	//--------------------------------------------------------//
	
	forgot_password.onclick = function(){
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
				Util.ajax_server_path = "/inc/userAccount.php";
				Util.sendReceiveToID(null, "forgotten_pass=1"+form_data.post_data,
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
	}
	
	//--------------------------------------------------------//
	
//	formFieldEffect(form_fields);
	
	submit_butt.onclick = function(){
		var form_data;
		Util.ajax_server_path = "/inc/userAccount.php";
		form_data = validateForm(form_fields);
		
		if(!form_data.error){
			Util.sendReceiveToID("form_wrapper", "new_user=register"+form_data.post_data,
					function(a){
						var form_wrapper,
							address_array,
							address_string = "";
							
						form_wrapper = document.getElementById("form_wrapper");
						form_wrapper.style.display = "none";
											
						if(typeof a !== "undefined"){
												
							/*
								a[0] - Name
								a[1] - Last Name
								a[2] - e-mail
								a[3] - joined address string. glue is {§} 
							*/
							address_array = a[3].split("{§}");
							for(var i = 0, tot = address_array.length; i < tot-1; i += 1){
								address_string += address_array[i]+"</br>";
							}
							
							document.getElementById("form_wrapper").style.display = "none";
                        	document.getElementById("login_wrapper").style.display = "none";
							document.getElementById("title_container1").style.display = "none";
							document.getElementById("title_container2").style.display = "none";
								
							register_message_area.innerHTML = "<a id='registered_message'>You have successfuly created a new account "+a[0]+"!</a></br><a id='info_message'>You have entered the following information about your self:</a><p id='address'>"+a[0]+" "+a[1]+"</br>"+address_string+"</p><a id='loggedin_message'>You are now logged in as <b id='email'>"+a[2]+"</b> Feel free to access your account to change your details, check status of your order or reorder saved designs.</a>";	
							
							form_wrap.style.display				= "none";
								
						}
					}
			);
		}
		
	} // end of onClick
	
	//--------------------------------------------------------//
	getFooterLinks();
	
});

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

function goToPhotoUpload(){
	document.getElementById("category_post_data").value = "*%*^Photo_upload";
	document.getElementById("template_post_data").value = "*%*^Photo_upload";
	document.getElementById("load_page_form").submit();	
}
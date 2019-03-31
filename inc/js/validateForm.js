
function validateForm(field_to_validate, return_as_obj, DOM_array){
	var field,
		password 	= "",
		email	 	= "",
		err 		= false;
		request_val = "",
		data_obj	= {}
		reg_test 	= new RegExpTest(),
		utils 	 	= new Utilities();
	
//	field_to_validate = document.getElementsByName("form_field");
	
	for(var i = 0, total = field_to_validate.length; i < total; i++){
		
		typeof DOM_array != "undefined" ? field = field_to_validate[i] : field = field_to_validate.item(i);
		switch(field.id){
			case "name_input": if(reg_test.name_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["name"] = field.value : request_val += "&name="+field.value;
									document.getElementById("name_input_label").className = "normal_text";
									document.getElementById("name_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("name_msg").innerHTML = "Please enter a valid name.";
									document.getElementById("name_input_label").className = "error_text";
								}
								
								break;
			
			case "lname_input": if(reg_test.name_test(field.value)  && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["lname"] = field.value : request_val += "&lname="+field.value;
									document.getElementById("lname_input_label").className = "normal_text";
									document.getElementById("lname_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("lname_msg").innerHTML = "Please enter a valid last name.";
									document.getElementById("lname_input_label").className = "error_text";
								}
								
								break;
								
			case "email_edit_input": if(reg_test.email_test(field.value) && field.isset){
									utils.ajax_server_path	= "../inc/userAccount.php";
									utils.sendReceiveToID(null, "check_email="+field.value,
										function(response){
											if(typeof response === "undefined"){
												err = err ||  true;					
												document.getElementById("email_msg").innerHTML = "Email already exists.";
												document.getElementById("email_edit_input_label").className = "error_text";	
										
											}
										}
									);
									
									typeof return_as_obj != "undefined" ? data_obj["email"] = field.value : request_val += "&email="+field.value;
									
									document.getElementById("email_edit_input_label").className = "normal_text";
									document.getElementById("email_msg").innerHTML = "";
								} else {
									err = err ||  true;
									document.getElementById("email_msg").innerHTML = "Please enter a valid e-mail address.";
									document.getElementById("email_edit_input_label").className = "error_text";
								}
								
								break;					
								
			case "email_input": if(reg_test.email_test(field.value) && field.isset){
									utils.ajax_server_path	= "../inc/userAccount.php";
									utils.sendReceiveToID(null, "check_email="+field.value,
										function(response){
											if(typeof response === "undefined"){
												err = err ||  true;					
												document.getElementById("email_msg").innerHTML = "Email already exists.";
												document.getElementById("email_input_label").className = "error_text";	
										
											}
										}
									);
									
									typeof return_as_obj != "undefined" ? data_obj["email"] = field.value : email = field.value;
									
									document.getElementById("email_input_label").className = "normal_text";
									document.getElementById("email_msg").innerHTML = "";
								} else {
									err = err ||  true;
									document.getElementById("email_msg").innerHTML = "Please enter a valid e-mail address.";
									document.getElementById("email_input_label").className = "error_text";
								}
								
								break;					
								
			case "confemail_input": if(reg_test.email_test(field.value) && field.value === email){
										typeof return_as_obj != "undefined" ? data_obj["email"] = field.value : request_val += "&email="+field.value;
										document.getElementById("confemail_input_label").className = "normal_text";
										document.getElementById("confemail_msg").innerHTML = "";
									} else {
										err = err ||  true;
										document.getElementById("confemail_msg").innerHTML = "Emails don't match.<br/> Please re-enter and<br/> confirm your email.";
										document.getElementById("confemail_input_label").className = "error_text";
									}
								
								break;
								
			case "forgot_pass_email": if(reg_test.email_test(field.value) && field.isset){
										typeof return_as_obj != "undefined" ? data_obj["email"] = field.value : request_val += "&email="+field.value;
										document.getElementById("forgot_pass_email_label").className = "normal_text";
										document.getElementById("forgot_pass_email_msg").innerHTML = "";
										
									} else {
										err = err ||  true;
										document.getElementById("forgot_pass_email_msg").innerHTML = "Please a enter valid e-mail address.";
										document.getElementById("forgot_pass_email_input_label").className = "error_text";
									}
									
								break;										
								
			case "email_login": if(reg_test.email_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["email"] = field.value : request_val += "&email="+field.value;
									document.getElementById("email_login_label").className = "normal_text";
									document.getElementById("email_login_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("email_login_msg").innerHTML = "Please enter a valid e-mail address.";
									document.getElementById("email_login_label").className = "error_text";
								}
								
								break;					
								
			case "paswd_input": if(reg_test.password_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["password"] = field.value : password = field.value;;
									document.getElementById("paswd_input_label").className = "normal_text";
									document.getElementById("paswd_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("paswd_msg").innerHTML = "Please enter minimum of 6 characters.";
									document.getElementById("paswd_input_label").className = "error_text";
								}
								
								break;
								
			case "old_paswd_input": if(reg_test.password_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["old_password"] = field.value : request_val += "&old_password="+field.value;
									document.getElementById("old_paswd_input_label").className = "normal_text";
									document.getElementById("old_paswd_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("old_paswd_msg").innerHTML = "Please enter minimum of 6 characters.";
									document.getElementById("old_paswd_input_label").className = "error_text";
								}
								
								break;					
								
			case "password_input": if(reg_test.password_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["password"] = field.value : request_val += "&password="+field.value;
									password = field.value;
									document.getElementById("password_input_label").className = "normal_text";
									document.getElementById("paswd_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("paswd_msg").innerHTML = "Please enter your password.";
									document.getElementById("password_input_label").className = "error_text";
								}
								
								break;			
								
			case "confpaswd_input": if(reg_test.password_test(field.value) && field.value === password){
									typeof return_as_obj != "undefined" ? data_obj["password"] = field.value : request_val += "&password="+field.value;
									document.getElementById("confpaswd_input_label").className = "normal_text";
									document.getElementById("confpaswd_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("confpaswd_msg").innerHTML = "Passwords don't match.<br/> Please re-enter and<br/> confirm your password.";
									document.getElementById("confpaswd_input_label").className = "error_text";
								}
								
								break;
								
			case "addr_input": if(reg_test.address_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["address1"] = field.value : request_val += "&address1="+field.value;
									document.getElementById("addr_input_label").className = "normal_text";
									document.getElementById("addr_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("addr_msg").innerHTML = "Please enter a valid address.";
									document.getElementById("addr_input_label").className = "error_text";
								}
								
								break;
								
			case "addr2_input": if(reg_test.address_test(field.value) || field.value ===""){
									typeof return_as_obj != "undefined" ? data_obj["address2"] = field.value : request_val += "&address2="+field.value;
									document.getElementById("addr2_input_label").className = "normal_text";
									document.getElementById("addr2_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("addr2_msg").innerHTML = "Please enter a valid address.";
									document.getElementById("addr2_input_label").className = "error_text";
								}
								
								break;
								
			case "city_input": if(reg_test.address_test(field.value) && field.isset){
									typeof return_as_obj != "undefined" ? data_obj["city"] = field.value : request_val += "&city="+field.value;
									document.getElementById("city_input_label").className = "normal_text";
									document.getElementById("city_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("city_msg").innerHTML = "Please enter a valid city name.";
									document.getElementById("city_input_label").className = "error_text";
								}
								
								break;
								
			case "postcode_input": if(reg_test.address_test(field.value) && field.isset){
									request_val += "&postcode="+field.value;
									typeof return_as_obj != "undefined" ? data_obj["postcode"] = field.value : request_val += "&postcode="+field.value;
									document.getElementById("postcode_input_label").className = "normal_text";
									document.getElementById("postcode_msg").innerHTML = "";
									
								} else {
									err = err ||  true;
									document.getElementById("postcode_msg").innerHTML = "Please enter a valid postal code.";
									document.getElementById("postcode_input_label").className = "error_text";
								}
								
								break;
								
			case "country_input": 	data_obj["country"] = field.value;
									request_val += "&country="+field.value;
			
								break;					
		} // end of switch
	} // end of for()
	
	if(typeof return_as_obj != "undefined"){
		data_obj["error"] = err;
		return 	data_obj;
	} else { 
		return {error: err, post_data: request_val};
	}
}

//------------------------------------------------------------------------------------------------

function validateForm2(field_to_validate, return_as_obj, DOM_array){
	var field,
		password 	= "",
		email	 	= "",
		err 		= false;
		request_val = "",
		data_obj	= {}
		reg_test 	= new RegExpTest();
	
//	field_to_validate = document.getElementsByName("form_field");
	
	for(var i = 0, total = field_to_validate.length; i < total; i++){
		
		typeof DOM_array != "undefined" ? field = field_to_validate[i] : field = field_to_validate.item(i);
		switch(field.id){
			case "name_input": if(reg_test.name_test(field.value) && (document.getElementById("name_isset").value == 1)){

									typeof return_as_obj != "undefined" ? data_obj["name"] = field.value : request_val += "&name="+field.value;
									document.getElementById("name_req").innerHTML = "";
									
								} else {
									// alert(document.getElementById("name_isset").value);
								//	alert("field validation error 1");
									err = err ||  true;
									document.getElementById("name_req").className = "required_red";
									document.getElementById("name_req").innerHTML = " *";
								}
								
								break;
			
			case "lname_input": if(reg_test.name_test(field.value)  && (document.getElementById("lname_isset").value == 1)){
									typeof return_as_obj != "undefined" ? data_obj["lname"] = field.value : request_val += "&lname="+field.value;
									document.getElementById("lname_req").innerHTML = "";
								} else {
								//	alert("field validation error 2");
									err = err ||  true;
									document.getElementById("lname_req").className = "required_red";
									document.getElementById("lname_req").innerHTML = " *";
								}
								
								break;
								
			case "email_login": if(reg_test.email_test(field.value) && (document.getElementById("email_isset").value == 1)){
									typeof return_as_obj != "undefined" ? data_obj["email"] = field.value : request_val += "&email="+field.value;
									document.getElementById("email_req").innerHTML = "";
								} else {
								//	alert("field validation error 3 : "+field.value+" : "+document.getElementById("email_isset").value);
									err = err ||  true;
									document.getElementById("email_req").className = "required_red";
									document.getElementById("email_req").innerHTML = " *";
								}
								
								break;					
								
			case "addr_input": if(reg_test.address_test(field.value) && (document.getElementById("addr_isset").value == 1)){
									typeof return_as_obj != "undefined" ? data_obj["address1"] = field.value : request_val += "&address1="+field.value;
									document.getElementById("addr_req").innerHTML = "";
								} else {
								//	alert("field validation error 4");
									err = err ||  true;
									document.getElementById("addr_req").className = "required_red";
									document.getElementById("addr_req").innerHTML = " *";
								}
								
								break;
								
			case "addr2_input": if(reg_test.address_test(field.value) || field.value ===""){
									typeof return_as_obj != "undefined" ? data_obj["address2"] = field.value : request_val += "&address2="+field.value;
									
								} else {
							//		alert("field validation error 5");
									err = err ||  true;
							//		document.getElementById("error_message_cell").innerHTML = "Please fill in all required fields.";
								}
								
								break;
								
			case "city_input": if(reg_test.address_test(field.value) && (document.getElementById("city_isset").value == 1)){
									typeof return_as_obj != "undefined" ? data_obj["city"] = field.value : request_val += "&city="+field.value;
									document.getElementById("city_req").innerHTML = "";
									
								} else {
							//		alert("field validation error 6");
									err = err ||  true;
									document.getElementById("city_req").className = "required_red";
									document.getElementById("city_req").innerHTML = " *";
								}
								
								break;
								
			case "postcode_input": if(reg_test.address_test(field.value) && (document.getElementById("postcode_isset").value == 1)){
									request_val += "&postcode="+field.value;
									typeof return_as_obj != "undefined" ? data_obj["postcode"] = field.value : request_val += "&postcode="+field.value;
									document.getElementById("postcode_req").innerHTML = "";
									
								} else {
							//		alert("field validation error 7");
									err = err ||  true;
									document.getElementById("postcode_req").className = "required_red";
									document.getElementById("postcode_req").innerHTML = " *";
								}
								
								break;
								
			case "country_input": 	data_obj["country"] = field.value;
									request_val += "&country="+field.value;
			
								break;					
		} // end of switch
	} // end of for()
	
	err === true ? document.getElementById("error_message_cell").innerHTML = "Please fill in all required fields." : document.getElementById("error_message_cell").innerHTML = "";	
	
	if(typeof return_as_obj != "undefined"){
		data_obj["error"] = err;
		return 	data_obj;
	} else { 
		return {error: err, post_data: request_val};
	}
}

//------------------------------------------------------------------------------------------------

function formFieldEffect(field_to_validate){
	for(var i = 0, total = field_to_validate.length; i < total; i +=1){
		
		if(typeof field_to_validate.item(i).isset == "undefined"){
			field_to_validate.item(i).isset = false;
		}
		
		field_to_validate.item(i).onfocus = function(){
			
			if(!this.isset){		// If value was not set clear the text field
				this.value = "";
			}
			
			if(this.id === "paswd_input" || this.id === "confpaswd_input" || this.id === "password_input" || this.id === "old_paswd_input"){		// If field is password change it type from text to password
				this.type = "password";	
			}
			
			label = document.getElementById(this.id+"_label");		//	Get the id of the field's label and make it visible
			label.style.visibility = "visible";
		}
		
		field_to_validate.item(i).onblur = function(){	
			if(this.value == ""){
				switch(this.id){
					case "name_input":		this.value = "Name";			break;
					case "lname_input":		this.value = "Last Name";		break;
					case "email_input":		this.value = "e-mail address";	break;
					case "email_edit_input":this.value = "e-mail address";	break;
					case "confemail_input":	this.value = "Confirm e-mail address";	break;
					case "email_login":		this.value = "e-mail address";	break;
					case "old_paswd_input":	this.value = "Old Password"; 
											this.type = "text";		
											break;
					case "paswd_input":		this.value = "Password"; 
											this.type = "text";		
											break;
					case "password_input":	this.value = "Password"; 
											this.type = "text";		
											break;						
					case "confpaswd_input":	this.value = "Confirm Password";
											this.type = "text";
											break;
					case "addr_input":		this.value = "Address";			break;
					case "addr2_input":		this.value = "Address 2";		break;
					case "city_input":		this.value = "City";			break;
					case "postcode_input":	this.value = "Postal Code";		break;
				}
				
				this.isset = false;		// The value was not set
			} else {
				this.isset = true;		// The value isset
			}
			label = document.getElementById(this.id+"_label");
			label.style.visibility = "hidden";
		}
//		alert("val:"+value+" Lab id:"+ field_to_validate.item(i).id+"_label");
	}
}

function formFieldEffect2(field_to_validate){
	for(var i = 0, total = field_to_validate.length; i < total; i +=1){
		
		if(typeof field_to_validate.item(i).isset == "undefined"){
			field_to_validate.item(i).isset = false;
		}
		
		field_to_validate.item(i).onfocus = function(){
			
			if(!this.isset){		// If value was not set clear the text field
				this.value = "";
			}
			
			if(this.id === "paswd_input" || this.id === "confpaswd_input" || this.id === "password_input" || this.id === "old_paswd_input"){		// If field is password change it type from text to password
				this.type = "password";	
			}
		}
		
		field_to_validate.item(i).onblur = function(){	
			var self = this;
				switch(this.id){
					case "name_input":		this.value == "" ?  ( function(){ /*self.value = "Name";*/ document.getElementById("name_isset").value = 0; }() ) : 
																( function(){ document.getElementById("name_isset").value = 1; self.isset = true; }() );
																break;
																
					case "lname_input":		this.value == "" ?  ( function(){ /*self.value = "Last Name";*/ document.getElementById("lname_isset").value = 0; }() ) : 
																( function(){ document.getElementById("lname_isset").value = 1; self.isset = true; }() );
																break;
																
					case "email_login":		this.value == "" ?  ( function(){ /*self.value = "e-mail address";*/ document.getElementById("email_isset").value = 0; }() ) : 
																( function(){ document.getElementById("email_isset").value = 1; self.isset = true; }() );
																break;
																
					case "addr_input":		this.value == "" ?  ( function(){ /*self.value = "Address";*/ document.getElementById("addr_isset").value = 0; }() ) : 
																( function(){ document.getElementById("addr_isset").value = 1; self.isset = true; }() );
																break;
																
					case "addr2_input":		this.value == "" ?  ( function(){ /*self.value = "Address 2";*/ document.getElementById("addr2_isset").value = 0; }() ) : 
																( function(){ document.getElementById("addr2_isset").value = 1; self.isset = true; }() );
																break;
																
					case "city_input":		this.value == "" ?  ( function(){ /*self.value = "City";*/ document.getElementById("city_isset").value = 0; }() ) : 
																( function(){ document.getElementById("city_isset").value = 1; self.isset = true; }() );
																break;
																
					case "postcode_input":	this.value == "" ?  ( function(){ /*self.value = "Postal Code";*/ document.getElementById("postcode_isset").value = 0; }() ) : 
																( function(){ document.getElementById("postcode_isset").value = 1; self.isset = true; }() );
																break;
													
					case "country_input":	document.getElementById("postcode_isset").value = 1;
											this.isset = true;
											break;
																															
				}
		}
	}
}
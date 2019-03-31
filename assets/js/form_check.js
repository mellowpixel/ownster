// JavaScript Document
$(document).ready(function() {
	
	// getSettings();
	
	$("#save_security_form").bind("click", saveChanges);
	// $("#save_contacts_form").bind("click", saveChanges);
	// $("#save_gallery_form").bind("click", saveChanges);
	$("input[type='text']").bind("change", checkSyntax);
	$("input[type='password']:not(#old_password_input)").bind("change", checkSyntax);
	
});

//-------------------------------------------------------------------------------------//
function getSettings(){
	var renderContacts = function(data){
							if(!checkIfError(data)){
								$("#street_input").val(data["settings_data"]["street"]);
								$("#postcode_input").val(data["settings_data"]["postcode"]);
								$("#city_input").val(data["settings_data"]["city"]);
								$("#email_input").val(data["settings_data"]["email"]);
								$("#tel_input").val(data["settings_data"]["tel"]);
								$("#fax_input").val(data["settings_data"]["fax"]);
								$("#cellular_input").val(data["settings_data"]["mobile"]);
								$("#img_num_input").val(data["settings_data"]["items_per_page"]);
							}
						};
						
	$.post("../../assets/php/settings-server/", { get_contacts : true }, renderContacts, "json");
}

//-------------------------------------------------------------------------------------//

function checkSyntax(){
	var
	SYNTAX_DATA		= {},
	$this			= $(this),
	regex_phone		= /[^0-9+()\s]/,
	regex_email		= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	regex_street	= /[^\w.,\s()]/,
	regex_city		= /[^a-zA-Z\s]/,
	regex_number	= /[\D]/,
	regex_login		= /[^\w@._-]/,
	regex_password	= /.{6,}/,
	
	street_error_msg	= "Please use only letters, numbers and ()",
	city_error_msg		= "Please use only letters. No numbers or other symbols",
	email_error_msg		= "Please use only letters, numbers or - _ . symbols. Make sure email format is as name@server.xxx",
	tel_error_msg		= "Please use only numbers and + () symbols.",
	only_numbers_msg	= "Please use numbers only.",
	login_error_msg		= "Please use only letters, numbers or '-' '_' '.' '@' symbols.",
	password_error_msg	= "Your password should contain 6 characters at least.",
	passwords_no_match_msg	= "Passwords do not match.",
	pass_confirm_msg	= "Please confirm your current password.",
	pass_repeat_msg		= "Please repeat new password.";
	
	SYNTAX_DATA.old_pass_data	= { $field_to_check : $("#old_password_input"), error_msg : pass_confirm_msg };
	SYNTAX_DATA.new_pass_data	= { $field_to_check : $("#new_password_input"), error_msg : password_error_msg };
	SYNTAX_DATA.rep_pass_data	= { $field_to_check : $("#repeat_password_input"), error_msg : pass_repeat_msg };
	
	SYNTAX_DATA.password		= { $field_to_check : $this, regex_pattern : regex_password, error_msg : password_error_msg, invert_regex_logic : true };
	SYNTAX_DATA.login			= { $field_to_check	: $this, regex_pattern : regex_login, error_msg : login_error_msg };
	SYNTAX_DATA.street			= { $field_to_check	: $this, regex_pattern : regex_street, error_msg : street_error_msg };
	SYNTAX_DATA.city			= { $field_to_check	: $this, regex_pattern : regex_city, error_msg : city_error_msg };
	SYNTAX_DATA.phone			= { $field_to_check	: $this, regex_pattern : regex_phone, error_msg : tel_error_msg };
	SYNTAX_DATA.email			= { $field_to_check	: $this, regex_pattern : regex_email, error_msg : email_error_msg, invert_regex_logic : true };
	SYNTAX_DATA.number			= { $field_to_check	: $this, regex_pattern : regex_number, error_msg : only_numbers_msg };	
	
	securityFieldsCheck = function(syntax_data_obj){
		
		checkFieldErrors( syntax_data_obj );
						  
		for(var i = 1, tot = arguments.length; i < tot; i += 1){
			if(typeof arguments[i] == "object"){
				if( arguments[i].$field_to_check.val().length <= 0 ){
					arguments[i].$field_to_check.addClass("error_input");
					outputErrors( arguments[i].$field_to_check, arguments[i].error_msg );
				}
			} else if(typeof arguments[i] == "function"){
				arguments[i]();
			}
		}
	};
	
	comparePass = function(){ // Compare new password to match.
		 if( $("#new_password_input").val() != $("#repeat_password_input").val() ){
			 outputErrors( $("#repeat_password_input"), passwords_no_match_msg );
		 }
	 };
	
	$(this).closest("table").find("button").text("Save").removeClass("saved");
	
	switch($this.attr("id")){
		case "street_input"		:	checkFieldErrors( SYNTAX_DATA.street);	break;
		case "postcode_input"	:	checkFieldErrors( SYNTAX_DATA.street);	break;
		case "city_input"		:	checkFieldErrors( SYNTAX_DATA.city);	break;
		case "email_input"		:	checkFieldErrors( SYNTAX_DATA.email);	break;
		case "tel_input"		:	checkFieldErrors( SYNTAX_DATA.phone);	break;
		case "fax_input"		:	checkFieldErrors( SYNTAX_DATA.phone);	break;
		case "cellular_input"	:	checkFieldErrors( SYNTAX_DATA.phone);	break;
		case "img_num_input"	:	checkFieldErrors( SYNTAX_DATA.number);	break;
		
		case "login_input"				:	securityFieldsCheck( SYNTAX_DATA.login, SYNTAX_DATA.old_pass_data );								break;
		case "new_password_input" 		:	securityFieldsCheck( SYNTAX_DATA.password, SYNTAX_DATA.old_pass_data, SYNTAX_DATA.rep_pass_data); 	break;
		case "old_password_input" 		:	checkFieldErrors( SYNTAX_DATA.password);															break;
		case "repeat_password_input"	:	securityFieldsCheck( SYNTAX_DATA.password, SYNTAX_DATA.old_pass_data, SYNTAX_DATA.new_pass_data, comparePass);	break;
	}
}

//-------------------------------------------------------------------------------------//
function checkFieldErrors( syntax_data_obj ){
	var
	$field_to_check 	= syntax_data_obj.$field_to_check,
	regex_pattern		= syntax_data_obj.regex_pattern,
	error_msg			= syntax_data_obj.error_msg,
	invert_regex_logic 	= syntax_data_obj.invert_regex_logic;
	
	if( regex_pattern.test( $field_to_check.val() )){
		(invert_regex_logic != undefined && invert_regex_logic == true) ? clearErrors( $field_to_check) : outputErrors($field_to_check, error_msg);
	} else {
		(invert_regex_logic != undefined && invert_regex_logic == true) ? outputErrors($field_to_check, error_msg) : clearErrors( $field_to_check);
	}

}

//-------------------------------------------------------------------------------------//
function outputErrors( $this_field, error_msg ){
	$this_field.closest("tr").addClass("error_field")
							.append("<td class='error_msg_container'>"+error_msg+"</td>");
	$this_field.closest("table").find("button").attr("disabled", "disabled");
}

//-------------------------------------------------------------------------------------//						
function clearErrors( $this_field){
	$this_field.closest("tr").removeClass("error_field").find(".error_msg_container").remove();
	$this_field.removeClass("error_input");
	$this_field.closest("table").find("button").removeAttr("disabled");
}
//-------------------------------------------------------------------------------------//
function saveChanges(){
	var 
	savedHandler = function(data, button_id){
		if(!checkIfError(data)){
			$(button_id).text("Saved").addClass("saved");
		}
	},
						
	saveSecurityForm = function(){
		$.post("../../assets/php/settings-server/", 
				{ change_security_settings : true,
				  login		: $("#login_input").val(),
				  old_pass	: $("#old_password_input").val(),
				  new_pass	: $("#new_password_input").val() 	},
										   
				function(data){ savedHandler(data, "#save_security_form"); },
		"json");
	}/*,
	saveContactsForm = function(){
		$.post("../inc/DatabaseServer.php", {	change_contacts : true,
												street		: $("#street_input").val(),
												postcode	: $("#postcode_input").val(),
												city		: $("#city_input").val(),
												email		: $("#email_input").val(),
												tel			: $("#tel_input").val(),
												fax			: $("#fax_input").val(),
												mobile		: $("#cellular_input").val() },
												
												function(data){ savedHandler(data, "#save_contacts_form"); },
		"json");	
	},
	
	saveGalleryForm = function(){
		$.post("../inc/DatabaseServer.php", { change_gallery_settings : $("#img_num_input").val() },
											function(data){
												savedHandler(data, "#save_gallery_form");
											},
		"json");	
	}*/
	//-----------------------------------------------------------------
	if($(".error_input").length <= 0 && $(".error_field").length <= 0){

		switch($(this).attr("id")){
			case "save_gallery_form"	: saveGalleryForm();	break;
			case "save_security_form"	: saveSecurityForm();	break;
			case "save_contacts_form"	: saveContactsForm();	break;
		}
	}
}

//-------------------------------------------------------------------------------------//
function checkIfError(data){
	if(data["error"]){
		alert(data["error_msg"]);
		return true;	
	} else {
		return false;	
	}
}
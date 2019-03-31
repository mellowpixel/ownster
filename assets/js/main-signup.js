$(document).ready(function(){
	$("signup-status-message").hide();
	$("#login-status-msg").hide();
});

//---------------------------------------------------------------------------------
// 
function submitSignupForm (formscope) {
	var formdata = compileFormData(formscope, "signupform");
	$.post("/inc/userAccount.php", { new_user: formdata }, signupResult, "json");
	// console.log(formdata)
}

//---------------------------------------------------------------------------------
// 
function submitLoginForm (formscope) {
	var formdata = compileFormData(formscope, "loginform");
	$.post("/inc/userAccount.php", { userLogin: formdata }, loginResult, "json");
}

//---------------------------------------------------------------------------------
// 
function loginResult (data) {
	if(!data.error){
		$("#login-form").hide();
		$("#login-status-msg").show()
			.find(".msg-title").html("Hello "+data.name+" "+data.lastname+" !").end()
			.find(".msg-body").html("You are now logged in. Feel free to access your account if you wish to change your details, check status of your order or reorder saved designs.").end()
			.find(".buttons-wrapper").html("<a href='/my-account/''><button>Go to my account</button></a>");
	}
}

//---------------------------------------------------------------------------------
// 
function compileFormData (formscope, form_name) {
	var formdata = {};
	// COPY FORM DATA ---------------------------------------------------------------------
	for(ff in formscope[form_name]){
		if( typeof formscope[form_name][ff] == "object" && 
			formscope[form_name][ff].hasOwnProperty("$modelValue") && 
			formscope[form_name][ff].hasOwnProperty("$name") &&
			typeof formscope[form_name][ff].$modelValue !== "undefined"){
			
			formdata[formscope[form_name][ff].$name] = formscope[form_name][ff].$modelValue;
		}
	}
	return formdata;
}

//---------------------------------------------------------------------------------
// 

function signupResult(data){
	if(!data.error){
		var address = JSON.parse(data.address),
			address_output = "";

		for(line in address){
			address_output += address[line]+"</br>";
		}

		$("#signup-form").hide();

		$("#signup-status-message").show()
			.find(".msg-title").text("You have successfuly created a new account "+data.name).end()
			.find(".msg-body").html("You have entered the following information about yourself:</br>"+
									"<p></br><b>"+data.name+"</b> "+data.lastname+"</br>"+address_output+"</b></p>").end()
			.find(".msg-footter").html("You are now logged in as <b>"+data.email+"</b> Feel free to access your account to change your details, check status of your order or reorder saved designs.");
	} else {

	}
}










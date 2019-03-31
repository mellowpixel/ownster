$(document).ready(function(){
	// htmlarea_settings = { toolbar: [] };

	$("label.star").mouseover( hoverIn)
					.click(function(){
						$(this).prop("class", "star").nextAll().prop("class", "star set").end()
						.prevAll().prop("class", "star");

						$("#rate-wrapper").data("rating", $("#"+$(this).prop("for")).val());
					});

	$("#stars-wrapper").mouseleave( hoverOut );
	$("#user-email-input").change(checkEmail);
	// $("#html-text-area").htmlarea(htmlarea_settings);
	$("#save-review-butt").click( saveReview );
});

function hoverIn(){
	/*	&#9733; full
    	&#9734; empty	*/
	$(this).html("&#9733;").nextAll().html("&#9734;");
	$(this).prevAll().html("&#9733;");
}

function hoverOut(){
	$(".star").not(".set").html("&#9733;");
	$("label.set").html("&#9734;");
}

//---------------------------------------------------------------------------------
// 
function saveReview(){
	var review = $("#html-text-area").val(),
		rating = $("#rate-wrapper").data("rating");
	if(typeof user_code != "undefined"){
		post_data = { save_review: user_code, text: review, rating: rating};
	} else {
		var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    	if(re.test($(this).val())){
			$("#save-review-butt").val();
			post_data = { save_review: $("#save-review-butt").val(), check_email:true , text: review, rating: rating};
		} else {
			$("#error-message").html("Please enter valid email address.");	
		}
	}
	$.post("/inc/ajaxServer.php", post_data, sayThankYou, "json");
}

//---------------------------------------------------------------------------------
// 

function checkEmail(){
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(re.test($(this).val())){
    	$("#error-message").html("");
    } else {
    	$("#error-message").html("Please enter valid email address.");
    }
}

//---------------------------------------------------------------------------------
// 

function sayThankYou(data){
	$("#review_edit_area").css("visibility", "hidden");
	$("#thanx_msg").css("display", "block");
}











// general-functions.js

//---------------------------------------------------------------------------------
// 

function signOut(){
	$.post("/inc/userAccount.php", { user_logout: true}, function(){ window.location = "/" });
}

$(".prev-page-butt").click(function(){
		var page = $(this).data("page") - 1 > 0 ? $(this).data("page") -1 : 1;
		window.location = "./?page="+page;
	});

$(".next-page-butt").click(function(){
	var page = $(this).data("page") + 1 <= $(this).data("tot_pages") ? $(this).data("page")+1 : $(this).data("tot_pages");
	window.location = "./?page="+page;
});
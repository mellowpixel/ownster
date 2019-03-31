$(document).ready(function(e) {
    var	root_path = "/manager/",
	main_links = [	/*{ name: "Настройки", path: root_path },*/
					{ name: "Продажи", path: root_path+"sales/"},
					{ name: "Анализ Посетителя", path: root_path+"customer_data/"},
					{ name: "Ваучеры", path: root_path+"vouchers/"},
					{ name: "Система Скидок", path: root_path+"discounts/"},
					{ name: "Отзывы", path: root_path+"client-reviews/"},
					{ name: "Футер", path: root_path+"footer/"},
					{ name: "Occasions", path: root_path+"occasions/"},
					{ name: "Продукты",	path: root_path+"products/"},
					{ name: "Добавить Продукт",	path: root_path+"add-product/"} ];

	createLinksList("header nav", "main_links", main_links);
	$("li:not(.active-page-tab)","header nav").bind("click", goToPage );

	$("header nav").prepend("<div id='session-controls-wrapper'><a href='"+root_path+"' id='settings-butt'>Настройки</a> | <a href='"+root_path+"logout.php' id='logout-butt'>Выйти</a></div>")

	$(".close_butt").click( function(){ $("#statuswrapper").hide() } );

	sendReviewInvitations();
});


//////////////////////////////////////////////////////////////////////////////////

function createLinksList(container_id, ul_id, list_map){
	var $container	= $(container_id),
		$ul		= $("<ul></ul>").attr("id", ul_id);
		$li 	= "";
		
	for(var i = 0, tot = list_map.length; i<tot; i+=1){
		$li = $("<li></li>").attr("id", list_map[i].id)
							.append($("<a>"+list_map[i].name+"</a>").attr("href", list_map[i].path));
							
		$ul.append($li);
	}

	$container.append($ul);
	
	$("a[href='" + location.pathname + "']").closest("li").addClass('active-page-tab');
}

//////////////////////////////////////////////////////////////////////////////////

function goToPage(){
	window.location = $(this).find("a").attr("href");
}

function sendReviewInvitations(){
	var timest = Math.round( new Date().getTime() / 1000 ),
		last_time_sent = localStorage.getItem("review_sent_timestamp");

	if( (timest - (24 * 3600)) >= last_time_sent ){
		$("#statuswrapper").css("visibility", "visible");
		$("#message").text("Идёт рассылка приглашений оставить отзыв о сайте.");
		$.post("/inc/ajaxServer.php", { sendReviewInvitations: true }, function(data){
			if(!data.error){
				if(typeof data.emails!= "undefined"){
					$("#details").append( $("<p class='status-ok'>").text("Total emails sent: "+data.emails.length))
					for( email in data.emails ){
						$("#details").append($("<em class='status-ok'>").text(data.emails[email]+", "));
					}
				}
				$("#message").text("Готово!").removeProp("class").addClass("status-ok");

				localStorage.setItem("review_sent_timestamp", timest);
			} else {
				alert(data.error_msg);
			}
		}, "json");
	} else {
		$("#statuswrapper").hide();
	}
}









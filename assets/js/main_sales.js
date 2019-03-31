$(document).ready(function(){
	$(".orde-folder-link").click(showFilesWindow);

	$(".review-status.received").click(showReviewWindow);

	$(".per-page-inp").ForceNumericOnly();
	$(".per-page-inp").change(function(){
		if($(this).val() <= 0){ $(this).val(1); }
		go2Page({ data: { self: $(".go-to-page-inp").first() } })
	})

	$(".prev-page-butt").click(function(){
		var page = $(this).data("page") - 1 > 0 ? $(this).data("page") -1 : 1;

		timeframe =  ($("input#timeframe").val() !== "all" && $("input#timeframe").val().length > 0) ? "&time="+$("input#timeframe").val() : "";
		window.location = "./?page="+page+"&perpage="+$(".per-page-inp").val()+timeframe;
	});
	$(".next-page-butt").click(function(){
		var page = $(this).data("page") + 1 <= $(this).data("tot_pages") ? $(this).data("page")+1 : $(this).data("tot_pages");
		timeframe =  ($("input#timeframe").val() !== "all" && $("input#timeframe").val().length > 0) ? "&time="+$("input#timeframe").val() : "";
		window.location = "./?page="+page+"&perpage="+$(".per-page-inp").val()+timeframe;
	});

	$(".go-to-page-inp").ForceNumericOnly();
	$(".go-to-page-inp").change(function(){ go2Page({ data: { page: $(this).val(), timeframe: $("input#timeframe").val() } }) });

	$("#today-butt").click( { timeframe: "today" }, timeRangeRecords);
	$("#month-butt").click( { timeframe: "month" }, timeRangeRecords);
	$("#year-butt").click( { timeframe: "year" }, timeRangeRecords);
	$("#allrecords-butt").click( { timeframe: undefined }, timeRangeRecords);
	$(".popup-cell").click( memoryOutputWindow );

	$("#send-review-invitation").click(function(){
		$.post("/inc/ajaxServer.php", { sendReviewInvitations: true }, function(data){
			if(!data.error){
				window.location = window.location.href;
			} else {
				alert(data.error_msg);
			}
		}, "json");
	});

	$( ".date-picker" ).datepicker()
					  .datepicker( "option", "dateFormat", "dd M yy");

	$( "#date-from" ).datepicker( "setDate", $("#date-keeper").data("datefrom"))
					.change( reloadNewDates );
	$( "#date-to" ).datepicker( "setDate", $("#date-keeper").data("dateto") )
					.change( reloadNewDates );

	$("#incomestat").find(".stat-value").html( "£"+$("#stats").data("income") );
	$("#printsstat").find(".stat-value").html( $("#stats").data("prints") );
	$("#ordersstat").find(".stat-value").html( $("#stats").data("orders") );
	$("#vouchersstat").find(".stat-value").html( $("#stats").data("numvauchers") );
	$("#webpaymentsstat").find(".stat-value").html( $("#stats").data("webpayments") );

	// echo "<input type='hidden' id='stats' data-income='$total_income' data-prints='$total_items' data-orders='$total_orders' data-numvauchers='$total_vauchers' data-webpayments='$total_website_paiments'

});

function reloadNewDates(){
	var timeframe = "range&fromtime="+$( "#date-from" ).datepicker("option", "dateFormat", "dd-M-yy").val()+"&totime="+$( "#date-to" ).datepicker("option", "dateFormat", "dd-M-yy").val();
	$("input#timeframe").val(timeframe);
	go2Page({ data: { self: $(".go-to-page-inp").first(), timeframe: timeframe, page: 1 } });
}

function memoryOutputWindow(){
	$("#popupwindow").css("display", "block")
		.find(".window-content").html($(this).data("output") ).end()
		.find(".close-butt").click(function(){ $(this).parent().css("display", "none") });
}

function showFilesWindow(){
	var item_id = $(this).data("item_id");
	$(".files-window."+item_id).css("display", "block")
			.find(".close-butt").click(function(){ $(this).parent().css("display", "none") });

	/*$("a.download-link").click(function(e){
		e.preventDefault();
		window.location.href = $(this).data("href");
	})*/
}

function showReviewWindow(){

	$(this).parent().find(".review-window").css("display", "block").find(".close-butt").click(function(){ $(this).parent().css("display", "none") });
}
//---------------------------------------------------------------------------------
// 

function go2Page(e){
	var self = e.data.self,
		page,
		timeframe = (typeof e.data.timeframe != "undefined") ? "&time="+e.data.timeframe : "";

	if(typeof e.data.page != "undefined"){
		page = e.data.page;
	} else {
		next_butt = $(".next-page-butt").first();
		if($(self).val() <= next_butt.data("tot_pages") && $(self).val() > 0){
			page = $(self).val();
		} else {
			if($(self).val() <= 0){ page = 1 }
			if($(self).val() > next_butt.data("tot_pages")){ page = next_butt.data("tot_pages") } 
		}
	}
	window.location = "./?page="+page+"&perpage="+$(".per-page-inp").val()+timeframe;
}

//---------------------------------------------------------------------------------
// 

function timeRangeRecords(e){
	var timeframe = e.data.timeframe;

	go2Page({ data: { self: $(".go-to-page-inp").first(), timeframe: timeframe, page: 1 } });
}

//---------------------------------------------------------------------------------
// 
// Numeric only control handler
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

$(document).ready(function(){

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

	//---------------------------------------------------------------------------------
	// ********************************************************************************

	$("input[type=checkbox]", ".details-wrapper").change(function(){
		$.post("/inc/ajaxServer.php", { changeReviewState: $(this).prop("checked"), order: $(this).data("orderid") }, "json")
	})
});

function reloadNewDates(){
	var timeframe = "range&fromtime="+$( "#date-from" ).datepicker("option", "dateFormat", "dd-M-yy").val()+"&totime="+$( "#date-to" ).datepicker("option", "dateFormat", "dd-M-yy").val();
	$("input#timeframe").val(timeframe);
	go2Page({ data: { self: $(".go-to-page-inp").first(), timeframe: timeframe, page: 1 } });
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
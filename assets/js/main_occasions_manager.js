$(document).ready(function(e){

	$("#save-changes-butt").click(saveTemplates2Occasions);
	bindEvents();

});

/*-----------------------------------------
-----------------------------------------*/

function saveTemplates2Occasions(){
	var data_to_save = [];
	$(".assign-occasion-select").each(function(){
		if($(this).val()){
			data_to_save.push({ cat_ids: $(this).val(), product_id: $(this).data("product_id"), template_id: $(this).data("template_id")})
		}
	})

	$.post("/assets/php/occasions_server/", { saveOccasionsData: data_to_save }, function(data){
		if(!data.error){
			alert("Изменения сохранены");
		} else {
			alert(data.error_msg);
		}
	}, "json");
}

/*
-----------------------------------------*/

function addNewOccasionCat(){
	if($("#new-occasion-input").val()){
		$.post("/assets/php/occasions_server/", { newOccasion: $("#new-occasion-input").val() }, rewriteOccasionsList, "json" );
	}
}

/*
-----------------------------------------*/
function updateOccasionsList(e){
	var occasion_id = $(this).closest("tr").data("occasion_id"),
		new_val = $(this).val(),
		postdata = {};


	postdata[e.data.funct] = occasion_id;
	postdata.new_val = new_val;

	if(new_val){
		$.post("/assets/php/occasions_server/", postdata, rewriteOccasionsList, "json" );
	}
}

/*
-----------------------------------------*/
function bindEvents(){
	$("#add-new-occasion-butt").click(addNewOccasionCat);
	$(".place-input").bind("change", { funct: "changeCategoryOrder" }, updateOccasionsList);
	$(".name-input").bind("change", { funct: "changeCategoryName" }, updateOccasionsList);
	$(".link-input").bind("change", { funct: "changeCategoryLink" }, updateOccasionsList);
}

/*
-----------------------------------------*/
function rewriteOccasionsList(data){
	if(!data.error){
		$("#occasions-list-table").empty();
		$("#occasions-list-table").html("<tr align='left'><th>ID</th><th>Order</th><th>Name</th><th colspan='2'>Actions</th></tr>");
	
		if(typeof data.occasions_data == "object"){
			for(var occ in data.occasions_data){
				$("<tr>").data("occasion_id", data.occasions_data[occ]["id"])
						 .append($("<td>").html(data.occasions_data[occ]["id"]))
						 .append($("<td>").html("<input type='text' class='place-input' maxlength='4' value='"+data.occasions_data[occ]["place"]+"'>"))
						 .append($("<td>").html("<input type='text' class='name-input' maxlength='120' value='"+data.occasions_data[occ]["name"]+"'>"))
						 .append($("<td>").html("<input type='text' class='link-input' value='"+data.occasions_data[occ]["link"]+"'>"))
						 .append($("<td>").html("<button class='delete-cat-name-butt'>X</button>"))
						 .appendTo("#occasions-list-table");
			}
		} else {
			$("#occasions-list-table").html("<tr><td><h3>No Occasions.</h3></td></tr>");
		}
		bindEvents();
	} else {
		alert(data.error_msg);
	}
}














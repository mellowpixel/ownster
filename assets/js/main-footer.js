$(document).ready(function() {

	$(".footer-link-li").click(loadLinkContent);
	$("#editing-page div#buttons button.edit-butt").click(editContent);
	$("#add-new-footer-link-butt").click(newFooterLink);

	$("#link-edit-wrapper input").change(function(){
		var self = this,
			id = $("#html-content").prop("data-linkid")

	  	$.post("/inc/ajaxServer.php", { save_link_name: id, new_link_name: $(this).val() },
	  		function(data){
	  			if(!data.error){
					$("li[data-footerid='"+id+"']").html( $(self).val() );
				}
	  		} )

	});

	$("#delete-link").click(function(){
		$.post("/inc/ajaxServer.php", { delete_footer_link: $("#html-content").prop("data-linkid") },
	  		function(data){
	  			if(!data.error){
					$("li[data-footerid='"+id+"']").remove();
					$("#html-content").empty();
					$("#link-edit-wrapper input").val("");
				}
	  		} )
	});
	
});

//---------------------------------------------------------------------------------
// 

function loadLinkContent(){
	var id = $(this).data("footerid"),
		self = this;

	$.post("/inc/ajaxServer.php", { getLinkContent: id }, function(data){
		if(!data.error){
			console.log(data);
			$("#html-content").html(data.content).prop("data-content", data.content).prop("data-linkid", id);
		}
	}, "json")

	// Change link's name ---------------------------------------------------------------------------------------

	$("#link-edit-wrapper input").removeProp("disabled").val($(this).text());

	// Delete Link ----------------------------------------------------------------------------------------------
}

//---------------------------------------------------------------------------------
// 

function editContent(){
	save_butt = {
		css : "save-description-butt",
        text: "Сохранить",
        action: function(btn) {
            // 'this' = jHtmlArea object
            // 'btn' = jQuery object that represents the <A> "anchor" tag for the Toolbar Button
            new_content = this.toHtmlString();
            id = $("#html-content").prop("data-linkid");
            $.post( "/inc/ajaxServer.php", { saveFooterContent: id, description: new_content }, function(data){
				if(!data.error){
					
					$("#html-content").html( new_content );
					 
				} else {
					alert(data.error_msg);
				}
			}, "json");
    	}
    }

    htmlarea_settings = { toolbar: [
								["html"], ["bold", "italic", "underline", "strikethrough", "|", "subscript", "superscript"],
								["increasefontsize", "decreasefontsize"],
								["orderedlist", "unorderedlist"],
								["justifyleft", "justifycenter", "justifyright"],
								["link", "unlink", "image", "horizontalrule"],
								["p","h1", "h2", "h3"], [save_butt]
							] };

	content = $("#html-content").prop("data-content");
	textarea = $("<textarea class='edit-article-textarea'>");
	$("#html-content").empty().append( textarea );
	textarea.htmlarea(htmlarea_settings)
			.htmlarea("html", content);
}

//---------------------------------------------------------------------------------
// 

function newFooterLink () {

	name_input = $("<input type='text' value='New Link'/>");
	new_link = $("<li>").addClass("footer-link-li")
			 			.append(name_input)
			 			.insertBefore($(this));

	name_input.change(function(){
		$.post("/inc/ajaxServer.php", { new_footer_item: $(this).val() }, function(data){
			if(!data.error){
				new_link.text(data.new_name).prop("data-footerid", data.id)
						.click(loadLinkContent);
			}

		}, "json")
	})
}




















// ------ ON DOCUMENT READY ----------------------------------------------------------------

$(document).ready(function(e){
	getProducts();	
});

//------------------------------------------------------------------------------------------
// Get Products from Database

function getProducts(){
	$.post(productserverpath, { get_product_data: "*" }, makeProductList, "json" );
}

//------------------------------------------------------------------------------------------
// Write List of products on to the page

function makeProductList(data){
	$p_list = $("<ul>").addClass("product-list");
	$p_list.appendTo("main");

	if(!data.error){
		for(p_data in data.product_data){
			product = { id: data.product_data[p_data].id,
						place: data.product_data[p_data].place,
						name: data.product_data[p_data].name,
						thumb: data.product_data[p_data].preview_thumb,
						price: data.product_data[p_data].price,
						checked: data.product_data[p_data].active,
						setup: data.product_data[p_data].productdata,
						description: data.product_data[p_data].description,
						specs: data.product_data[p_data].specs };

			product.checked = (product.checked == null || product.checked == 0) ? false : true;

			li = $("<li>").prop("data-id", product.id)
						  .prop("data-description", product.description)
						  .prop("data-specs", product.specs)
						  .prop("id", "product-panel"+product.id);
			$("<input type='text' class='product-place-input' maxlength='7' >").val( product.place ).bind("change", changePlace ).appendTo( li );
			$("<a class='product-id'>").text("#"+product.id).appendTo( li );
			$("<img>").prop( "src", "../.."+product.thumb ).appendTo($("<div class='thumbnail-container'>").click( { setup: product.setup }, editProduct).appendTo( li ));
			$("<input type='text' class='product-name-input' >").val( product.name ).bind("change", changeName ).appendTo( li );
			$("<input type='text' class='product-price-input' maxlength='8' >").val( product.price ).bind("change", changePrice ).appendTo( li );
			$("<input type='checkbox' class='product-active-checkbox' id='checkbox"+product.id+"' >").prop("checked", product.checked)
					.bind("change", productActiveMode ).appendTo( li );
			$("<label class='active-product-label' for='checkbox"+product.id+"'>").html("<span></span>Продукт активен.").appendTo( li );
			$("<button class='edit-description-butt'>").click( editProductDescription ).appendTo( li );
			$("<button class='edit-specs-butt'>").click( editProductSpecs ).appendTo( li );
			$("<button class='delete-product-butt'>").click( deleteProduct ).appendTo( li );

			li.appendTo($p_list);
		}
	}
	console.log(data)
	// p_data = JSON.parse( data.product_data );
	// console.log(p_data);
}

//---------------------------------------------------------------------------------
// EDIT PRODUCT SPECS DESCRIPTION used in Congratulations step

function editProductSpecs(id1, product_panel1){

	product_panel = $(this).parent();
	id = product_panel.prop("data-id");
	description = product_panel.prop( "data-specs" );

	if (typeof id == "undefined") {
		id = id1;
		product_panel = product_panel1;
	};

	$(".specs-editor-wrapper").remove();

	$("<div class='editor-wrapper specs'>").html( product_panel.prop( "data-specs" ) ).append(
		$("<button class='edit-butt big-green-button'>").text("Редактировать")
			.click({ id: id,
					 description: product_panel.prop( "data-specs" ),
					 post_trigger: "editSpecs",
					 dataset: "data-specs" }, loadEditor)
	).append($("<button class='close-butt big-green-button'>").text("Закрыть").click( function(){ $(this).closest("div.editor-wrapper").remove() } ))
	.appendTo("body");

}

//---------------------------------------------------------------------------------
// EDIT PRODUCT DESCRIPTION

function editProductDescription(id1, product_panel1){
	
	product_panel = $(this).parent();
	id = product_panel.prop("data-id");
	description = product_panel.prop( "data-description" );

	if (typeof id == "undefined") {
		id = id1;
		product_panel = product_panel1;
	};

	$(".editor-wrapper").remove();

	$("<div class='editor-wrapper description'>").html( product_panel.prop( "data-description" ) ).append($("<div class='buttons_wrapper'>").append(
		$("<button class='edit-butt big-green-button'>").text("Редактировать")
			.click({ id: id,
					 description: product_panel.prop( "data-description" ),
					 post_trigger: "editDescription",
					 dataset: "data-description" }, loadEditor)
	).append($("<button class='close-butt big-green-button'>").text("Закрыть").click( function(){ $(this).closest("div.editor-wrapper").remove() } )))
	.appendTo("body");

}

function loadEditor(e){
	var id = e.data.id,
		description = e.data.description;

	save_butt = {
		css : "save-description-butt",
        text: "Сохранить",
        action: function(btn) {
            // 'this' = jHtmlArea object
            // 'btn' = jQuery object that represents the <A> "anchor" tag for the Toolbar Button
            description = this.toHtmlString();
            post = {};
            post[e.data.post_trigger] = id;
            post.description = description;

            $.post( productserverpath, post, function(data){
				if(!data.error){
					$("#product-panel"+id).prop(e.data.dataset, description);
					switch(e.data.post_trigger){
						case "editDescription" : editProductDescription(id, $("#product-panel"+id));
												 break;
						case "editSpecs" : 		 editProductSpecs(id, $("#product-panel"+id));
												 break;
					}
					 
				} else {
					alert(data.error_msg);
				}
			}, "json");
    	}
    }

    threeColsLayoutFrame = {
    	css : "three-columns-layout-butt",
        text: "Вставить 3 секции.",
        action: function(){
        	this.pasteHTML("<div class='sections-wrapper'>"+
        						"<div class='product-img-wrapper'>Удалите текст и вставьте на его месте изображение.</div>"+
        						"<div class='product-description-wrapper'>Здесь место для описания.</div>"+
        						"<div class='product-actions-wrapper'>Оставьте эту зуну без изменений.</div>"+
        					"</div>");
        }
    }
	
	htmlarea_settings = { toolbar: [
								["html"], ["bold", "italic", "underline", "strikethrough", "|", "subscript", "superscript"],
								["increasefontsize", "decreasefontsize"],
								["orderedlist", "unorderedlist"],
								["justifyleft", "justifycenter", "justifyright"],
								["link", "unlink", "image", "horizontalrule"],
								["p","h1", "h2", "h3"], [threeColsLayoutFrame], [save_butt]
							] };

	textarea = $("<textarea class='edit-article-textarea'>");
	$(this).closest("div.editor-wrapper").empty().append( textarea );
	textarea.htmlarea(htmlarea_settings)
			.htmlarea("html", description);
}

//---------------------------------------------------------------------------------
// Delete product Function

function deleteProduct(){
	var product_panel = $(this).parent();
	id = product_panel.prop("data-id");
	if(confirm("Удалить продукт?")){
		$.post(productserverpath, { deleteProduct: id }, function(data){
			if(!data.error){
				product_panel.remove();
			} else {
				alert(data.error_msg);
			}
		}, "json");
	}
}

//---------------------------------------------------------------------------------
// Toggle active / inactive product

function productActiveMode(){
	var bool = $(this).prop("checked") ? 1 : 0;
	id = $(this).parent().prop("data-id");

	$.post( productserverpath, { toggleActive: id, active: bool }, function(data){
		if(!data.error){
			$(self).blur();
		} else {
			alert(data.error_msg);
		}
	}, "json");
}

//---------------------------------------------------------------------------------
// 

function changeName(){
	var self = this;
	id = $(this).parent().prop("data-id");
	new_name = $(this).val();
	$.post(productserverpath, { changeName: id, name: new_name }, function(data){
		if(!data.error){
			$(self).blur();
		} else {
			alert(data.error_msg);
		}
	}, "json");
}

//---------------------------------------------------------------------------------
// 

function changePlace(){
	var self = this;
	id = $(this).parent().prop("data-id");
	place = $(this).val();
	$.post(productserverpath, { changePlace: id, place: place }, function(data){
		if(!data.error){
			window.location = "./";
		} else {
			alert(data.error_msg);
		}
	}, "json");
}

//---------------------------------------------------------------------------------
// 

function changePrice(){
	var self = this;
	// $(self).blur();
	id = $(this).parent().prop("data-id");
	new_price = $(this).val();
	$.post(productserverpath, { changePrice: id, price: new_price }, function(data){
		if(!data.error){
			$(self).blur();
			$(self).val( data.price );
		} else {
			alert(data.error_msg);
		}
	}, "json");
}

//---------------------------------------------------------------------------------
// 

function editProduct(e){
	var setup = JSON.parse(e.data.setup);
	// console.log(setup)
	id = $(this).parent().prop("data-id");
	setup.db_id = id;
	$.sessionStorage.isSet("surface-data") && $.sessionStorage.remove("surface-data");
	$.sessionStorage.set("product", setup );
	window.location = "../add-product/";
}






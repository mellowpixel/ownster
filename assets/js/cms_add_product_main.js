
/*
	#product-name
	
	------------------ Поверхность
	#surface-name
	#add-surface-butt
	#change-surface-name-butt
	#select-surface
		
	#surface-width
	#surface-height

	------------------ Сетка
	#numcells-width
	#numcells-height

	name="grid-proportions-radio"
		value="proportional"
		value="square"
		value="custom"

	#grid-width
	#grid-height

	#active-cell-size
	#save-product-butt
*/

// ------ ON DOCUMENT READY ----------------------------------------------------------------

$(document).ready(function(e){
//	$("#workdesk-info").html($("html").prop("class"))
$("#draw-cells").button()
	$("aside.control-panel").height( $(window).height() - $("aside.control-panel").offset().top -40 )
	$(window).resize(function(){
		$("aside.control-panel").height( $(window).height() - $("aside.control-panel").offset().top -40 );
	})
	var spinner = $( ".spinner" ).spinner(),
		default_surf_id = null,
		default_surface_settings = { surface_name : "Front", 
									  /*width : 40,
									  height : 50,
									  grid_width : 48,
									  grid_height : 58,*/
									  numcells_w : 1,
									  numcells_h : 1,
									  grid_proportion : "custom"};


	p = new Product({ name : "No Name", img_width : 100, img_height : 100, scale : 30});
		
	// Load project from sessionStorage
	$.sessionStorage.isSet("product") && $.extend( p, $.sessionStorage.get("product") );
	// Set default values for the new product
	if($.sessionStorage.isSet("product")){
		default_surf_id = p.current_surface;
		// Toggle Checked prop for default surface checkbox
		$("#make-surface-default-check").prop("checked", p.current_surface == p.default_surface);
	} else {
		default_surf_id = p.addSurface( default_surface_settings );
		p.default_surface = p.primary_surface = default_surf_id;
	}
	workdesk = new WorkDesk({ product : p,
							  workdesk_container : "#work-desk",
							  working_area : ".working-area",
							  resolution_mode : "print"});

	toolbar  = new ToolbarCells({ product : p, workdesk : workdesk});
	menubar	 = new MainMenuBar( { product: p, workdesk: workdesk } );
	expand_panels = new ExpandablePanels();

	workdesk.settings.menubar = menubar;

	// Fill default values of the product into form fields
	$("#product-name").val(p.name);
	
	$("#product-width").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].img_width);
	$("#product-height").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].img_height);

	$("#surface-width").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].width);
	$("#surface-height").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].height);
	$("#numcells-width").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].grid.numcells_w);
	$("#numcells-height").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].grid.numcells_h);
	// Refresh list of surfaces available in the product
	selectmenueSurfacesRefresh( p );
	setRadioGridProportions( p.surfaces[default_surf_id].grid.proportion );
	$("#grid-width") .spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].grid.width);
	$("#grid-height").spinner({ min: 1 }).spinner("value", p.surfaces[default_surf_id].grid.height);
	$( "#scale_slider" ).slider({ range: "min", value: p.scale, min: 1, max: 100, slide: function(e, ui){ changeScale(e, ui, p) } });
    $( "#scale_value" ).val( $( "#scale_slider" ).slider( "value" )+" %" );

	// Bind events with form fields on value change
	$("#product-name").change(function(){ p.name = $(this).val(); })
	$("#add-surface-butt").click({ product : p}, addNewSurfaceToProduct);
	$("#change-surface-name-butt").click( { product : p }, changeSurfaceName);
	$("#select-surface").selectmenu({ change : function(){ switchSurface(p) } });
	$("#make-surface-default-check").change( { product: p }, changeDefaultSurface);

    $( "#side-icon-select" ).ddslick({  data: [{ text: "Внешний разворот",
											     value: "front-spread-icon",
											     selected: false,
											     imageSrc: "/assets/layout-img/spreads_outside_icon.png"
											    },
											    { text: "Внутренний разворот",
											      value: "back-spread-icon",
											      selected: false,
											      imageSrc: "/assets/layout-img/spreads_inside_icon.png"
											    }],

									    width: 240,
									    imagePosition: "left",
									    selectText: "Изображение переключателя сторон",
									    onSelected: function (data) {
									    	p.surfaces[p.current_surface].surface_icon_class = data.selectedData.value;
									    }
									});

	$("#product-width").spinner({ spin : function(e, ui){ changeProductSize(e, p, "width", ui); }});
	$("#product-height").spinner({ spin : function(e, ui){ changeProductSize(e, p, "height", ui); }});
	$("#product-width").change(function(e){ changeProductSize(e, p, "width"); });
	$("#product-height").change(function(e){ changeProductSize(e, p, "height"); });

	$("#surface-width").spinner({ max : p.surfaces[default_surf_id].img_width, spin : function(e, ui){ changeSurfaceSize(e, p, "width", ui); }});
	$("#surface-height").spinner({ max : p.surfaces[default_surf_id].img_height, spin : function(e, ui){ changeSurfaceSize(e, p, "height", ui); }});
	$("#surface-width").change(function(e){ changeSurfaceSize(e, p, "width"); });
	$("#surface-height").change(function(e){ changeSurfaceSize(e, p, "height"); });

	$("#numcells-width").spinner({ spin : function(e, ui){ changeNumCells(e, p, "horizontal", ui); }});
	$("#numcells-height").spinner({ spin : function(e, ui){ changeNumCells(e, p, "vertical", ui); }});
	$("#numcells-width").change(function(e){ changeNumCells(e, p, "horizontal"); });
	$("#numcells-height").change(function(e){ changeNumCells(e, p, "vertical"); });

	$("input[name='grid-proportions-radio']").change({ product : p, workdesk : workdesk }, changeGridProportionsType);
	
	$("#grid-width") .spinner({ spin : function(e, ui){ changeGridSize(e, p, "width", ui); } });
	$("#grid-height").spinner({ spin : function(e, ui){ changeGridSize(e, p, "height", ui); } });
	$("#grid-width").change(function(e){  changeGridSize(e, p, "width"); });
	$("#grid-height").change(function(e){  changeGridSize(e, p, "height"); });
	
	$("#active-cell-size").spinner({ spin : function(e, ui){ changeActiveCellSize( e, p, ui ) }});
	$("#active-cell-size").change(function(e){ changeActiveCellSize( e, p) });

	$("#save-product-butt").click( { product : p }, function(e){ 
		
		if(typeof workdesk.settings.files_stack !== "undefined" && workdesk.settings.files_stack.length >0){
			console.log("Save Button Condition A")
			addDemoLayerImgToStack(p);
			
			$("#files-stack").fileupload("add", { files: workdesk.settings.files_stack });
		} else {
			console.log("Save Button Condition B")
			addDemoLayerImgToStack(p, true);
			
			saveProduct(e);	
		}
		
	});

	$("#reset-button").click(function(){ 
		if(confirm("Сбросить все текущие настройки продукта?")){
			$.sessionStorage.remove("product");
			$.sessionStorage.remove("surace-data");
			$.sessionStorage.removeAll();
			window.location = "./";
		}
	});

	$("#dump").click(function(){ console.log(p) });
	// WORKDESK SETUP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	$("#product-surface-size-lock").button({ icons: { primary: "ui-icon-unlocked" }, text: false })
		.change({ product : p}, lockProportions);
	$("#surface-grid-size-lock").button({ icons: { primary: "ui-icon-unlocked" }, text: false })
		.change({ product : p}, lockProportions);

	$("#center-bounds").button({ icons : { primary:  "ui-icon-radio-on" }, text : false })
		.change(centerBoundsHandler);

	workdesk.refreshWorkDesk(default_surf_id);
	// Check for storred image data and render it if there is such
	workdesk.loadStoredImgData();
	// Preview Saved templates
	if(typeof p.templates != "undefined"){
		menubar.previewTemplates(p, { preview_container: "#layouts-preview-window", templates_obj: "templates" });
	}
	if(typeof p.graphic_templates != "undefined"){
		menubar.previewTemplates(p, { preview_container: "#graphic-templates-preview-window", templates_obj: "graphic_templates" });
		addTextFunctionsInit(p);
	}
	// Preview Optional Images
	workdesk.previewOptionalImages( workdesk.surface_img_preview_settings );
});

//---------------------------------------------------
function addNewSurfaceToProduct(e){
	var p = e.data.product,
		new_surf_id = p.addSurface( { surface_name : 	$("#surface-name").val(),
									  width : 			$("#surface-width").spinner("value"),
									  height : 			$("#surface-height").spinner("value"),
									  numcells_w : 		$("#numcells-width").spinner("value"),
									  numcells_h : 		$("#numcells-height").spinner("value"),
									  img_width	 : 		$("#product-width").spinner("value"),
									  img_height : 		$("#product-height").spinner("value"),
									  grid_width : 		$("#grid-width").spinner("value"),
									  grid_height : 	$("#grid-height").spinner("value"),
									  grid_proportion : checkedProportion()
									});

	selectmenueSurfacesRefresh( p, new_surf_id );
	p.current_surface = surfID();
	workdesk.sessionStorageSaveProduct();
}

//---------------------------------------------------------------------------------

function addDemoLayerImgToStack(p, upload){
	var num_files = 0
	if(typeof p.graphic_templates!= "undefined"){
		for(var s in p.graphic_templates){
			for(var grt in p.graphic_templates[s]){
				if(typeof p.graphic_templates[s][grt].demo_layer!= "undefined" && typeof p.graphic_templates[s][grt].demo_layer.file != "undefined"){
					
					workdesk.settings.files_stack.push( p.graphic_templates[s][grt].demo_layer.file );
					delete p.graphic_templates[s][grt].demo_layer.file;
					num_files += 1;
				}

				if(typeof p.graphic_templates[s][grt].preview_thumb != "undefined" && typeof p.graphic_templates[s][grt].preview_thumb.file != "undefined"){	
					workdesk.settings.files_stack.push( p.graphic_templates[s][grt].preview_thumb.file );
					delete p.graphic_templates[s][grt].preview_thumb.file;
					if(typeof p.graphic_templates[s][grt].preview_thumb.url != "undefined"){
						delete p.graphic_templates[s][grt].preview_thumb.url;		
					}
					num_files += 1;
				}

				if(typeof p.graphic_templates[s][grt].product_preview != "undefined" && typeof p.graphic_templates[s][grt].product_preview.file != "undefined"){	
					workdesk.settings.files_stack.push( p.graphic_templates[s][grt].product_preview.file );
					delete p.graphic_templates[s][grt].product_preview.file;
					if(typeof p.graphic_templates[s][grt].product_preview.url != "undefined"){
						delete p.graphic_templates[s][grt].product_preview.url;		
					}
					num_files += 1;
				}
			}
		}
		if(upload && num_files >0){
			console.log("File stack", workdesk.settings.files_stack);
			$("#files-stack").fileupload("add", { files: workdesk.settings.files_stack });
		}
	}
}

//--------------
function changeSurfaceName(e){
	var p = e.data.product,
		surface_id = surfID();
	p.surfaces[surface_id].surface_name = $("#surface-name").val();
	$("option[value='"+surface_id+"']","#select-surface").html($("#surface-name").val());
	$("#select-surface").selectmenu("refresh");
	workdesk.sessionStorageSaveProduct();
}

//----------------------------------------------------------------------------------------
function changeDefaultSurface(e){
	var p = e.data.product;

	p.default_surface = $(this).prop("checked") ? p.current_surface
												: p.primary_surface;
	console.log(p.default_surface);
}
//----------------------------------------------------------------------------------------
function switchSurface(product){
	var surf_id = surfID();

	$("#surface-name").val(product.surfaces[surf_id].surface_name)
	product.current_surface = surf_id
	updateSpinners(product, surf_id);	
	// Switch Radio Proportions
	setRadioGridProportions( product.surfaces[surf_id].grid.proportion );
	
	// If there is saved image in workdesk.surface_data[surf_id] then load it
	if(typeof workdesk.surface_data[surf_id] !== "undefined"){
		workdesk.renderImage(workdesk.surface_data[surf_id].uri);
		typeof workdesk.surface_data[surf_id].mask !== "undefined" ? workdesk.applyProductMask(workdesk.surface_data[surf_id].mask.mask_uri)
																 : $("#product-mask-bounds").remove();																 
	} else{
		typeof product.surfaces[surf_id].imgurl !== "undefined" && workdesk.renderImage(product.surfaces[surf_id].imgurl);
		typeof product.surfaces[surf_id].maskurl !== "undefined" ? workdesk.applyProductMask(product.surfaces[surf_id].maskurl)
																 : $("#product-mask-bounds").remove();
	}
	workdesk.previewOptionalImages( workdesk.surface_img_preview_settings );
	// Toggle Checked prop for default surface checkbox
	$("#make-surface-default-check").prop("checked", surf_id == product.default_surface);
	// Redraw cells on the grid
	workdesk.refreshNumCells();
	// Preview Saved templates
	if(typeof product.templates != "undefined"){
		menubar.previewTemplates(product, { preview_container: "#layouts-preview-window", templates_obj: "templates" });
	}
	// Preview Graphic templates
	if(typeof product.graphic_templates != "undefined"){
		menubar.previewTemplates(product, { preview_container: "#graphic-templates-preview-window", templates_obj: "graphic_templates" });
	}

	ddSelectValue($("#side-icon-select"), product.surfaces[surf_id].surface_icon_class);
}

function ddSelectValue(ddslickObject, value){
	//#aSelectBox is the id of ddSlick selectbox
	$(ddslickObject).find("li").each(function( index ) {
	  //traverse all the options and get the value of current item
	  var curValue = $( this ).find('.dd-option-value').val();
	  //check if the value is matching with the searching value
	  if(curValue == value)
	  {	
	      //if found then use the current index number to make selected    
	      ddslickObject.ddslick('select', { index: $(this).index()});
	  }
	});
}

function updateSpinners(product, surf_id){

	$("#product-width").spinner("value", product.surfaces[surf_id].img_width);
	$("#product-height").spinner("value", product.surfaces[surf_id].img_height);
	$("#surface-width").spinner("value", product.surfaces[surf_id].width).spinner({ max : product.surfaces[surf_id].img_width });
	$("#surface-height").spinner("value", product.surfaces[surf_id].height).spinner({ max : product.surfaces[surf_id].img_height });
	$("#numcells-width").spinner("value", product.surfaces[surf_id].grid.numcells_w);
	$("#numcells-height").spinner("value", product.surfaces[surf_id].grid.numcells_h);
	$("#grid-width").spinner("value", product.surfaces[surf_id].grid.width);
	$("#grid-height").spinner("value", product.surfaces[surf_id].grid.height);
}

//-----------------------------------------------------------------------------
function lockProportions(e){
	var p = e.data.product,
		surf_id = surfID();
	if(this.checked){
		$(this).button({ icons : { primary: "ui-icon-locked" } });

		switch($(this).prop("id")){
			// Compute size ratio. Product Size to Printable Surface Size
			case "product-surface-size-lock" : p.surfaces[surf_id].product_surf_scale.w_scale = p.surfaces[surf_id].img_width/p.surfaces[surf_id].width;
											   p.surfaces[surf_id].product_surf_scale.h_scale = p.surfaces[surf_id].img_height/p.surfaces[surf_id].height;
											   p.surfaces[surf_id].product_surf_scale.constraint = true;
											   break;
			// Compute size ratio. Printable Surface Size to Grid size
			case "surface-grid-size-lock"	:  p.surfaces[surf_id].surf_grid_scale.w_scale = p.surfaces[surf_id].width / p.surfaces[surf_id].grid.width;
											   p.surfaces[surf_id].surf_grid_scale.h_scale = p.surfaces[surf_id].height / p.surfaces[surf_id].grid.height;
											   p.surfaces[surf_id].surf_grid_scale.constraint = true;
											   break;
		}

	} else {
		$(this).button({ icons : { primary: "ui-icon-unlocked" } });
		switch($(this).prop("id")){
			case "product-surface-size-lock" :  p.surfaces[surf_id].product_surf_scale.constraint = false; break;
			case "surface-grid-size-lock"	:  p.surfaces[surf_id].surf_grid_scale.constraint = false; break;
		}
	}
	workdesk.sessionStorageSaveProduct();
}

//----------------------------------------------------------------------------
function centerBoundsHandler(){
	this.checked ? $(this).button( { icons : { primary:  "ui-icon-radio-on" } })
				 : $(this).button( { icons : { primary:  "ui-icon-radio-off" } }); 

	workdesk.refreshWorkDesk(surfID());
}

//---------------------------------------------------------------------------------
function changeProductSize(e, product, dimension, ui){
	switch(e.type){
		case "spin" :  product.surfaces[surfID()]["img_"+dimension] = ui.value; break;
		case "change" :  product.surfaces[surfID()]["img_"+dimension] = $(e.target).val(); break;
	}
	
	constrainSizeChange(product, dimension, "product to surface");
	constrainSizeChange(product, dimension, "surface to grid");

	// Refresh Boundaries
	workdesk.refreshWorkDesk(surfID());	
//	workdesk.adjustGridSizeToProportion(surfID(), dimension);
	updateSpinners(product, surfID());
}

//---------------------------------------------------------------------------------
function changeSurfaceSize(e, product, dimension, ui){
	
	switch(e.type){
		case "spin" :  product.surfaces[surfID()][dimension] = ui.value; break;
		case "change" : if( $(e.target).val() <= product.surfaces[surfID()]["img_"+dimension] || product.surfaces[surfID()].product_surf_scale.constraint){
							product.surfaces[surfID()][dimension] = $(e.target).val();
						} else {
							alert("Размер печатной поверхности не должен привышать размер продукта.");
						}; break;
	}

	constrainSizeChange(product, dimension, "surface to grid");
	constrainSizeChange(product, dimension, "surface to product");

	// Refresh Boundaries
	//	workdesk.refreshWorkDesk(surfID());
	
	workdesk.adjustGridSizeToProportion(surfID(), dimension);
	updateSpinners(product, surfID());
}

//--------------------------------------------------------------------------------
function changeGridSize(e, product, dimension, ui){
	
	switch(e.type){
		case "spin" :   product.surfaces[surfID()].grid[dimension] = ui.value; break;
		case "change" :  product.surfaces[surfID()].grid[dimension] = $(e.target).val(); break;
	}

	constrainSizeChange(product, dimension, "grid to surface");
	constrainSizeChange(product, dimension, "surface to product");
	// Refresh Boundaries
//	workdesk.refreshWorkDesk(surfID());

	workdesk.adjustGridSizeToProportion(surfID(), dimension, "invert dimension");
	updateSpinners(product, surfID());
}

//---------------------------------------------------------------------------------
function constrainSizeChange(product, dimension, options){
	switch(dimension){
		case "width" : dim_scale = "w_scale"; break;
		case "height" : dim_scale = "h_scale"; break;
	}
	switch(options){
		case "product to surface" : if (product.surfaces[surfID()].product_surf_scale.constraint){
										product.surfaces[surfID()][dimension] = product.surfaces[surfID()]["img_"+dimension] / product.surfaces[surfID()].product_surf_scale[dim_scale];
									}break;
		case "surface to product" : if (product.surfaces[surfID()].product_surf_scale.constraint){
										product.surfaces[surfID()]["img_"+dimension] = product.surfaces[surfID()][dimension] * product.surfaces[surfID()].product_surf_scale[dim_scale];
									}break;
		case "surface to grid" : 	if (product.surfaces[surfID()].surf_grid_scale.constraint){
										product.surfaces[surfID()].grid[dimension] = product.surfaces[surfID()][dimension] / product.surfaces[surfID()].surf_grid_scale[dim_scale];
									}	break;
		case "grid to surface" : 	if (product.surfaces[surfID()].surf_grid_scale.constraint){
										product.surfaces[surfID()][dimension] = product.surfaces[surfID()].grid[dimension] * product.surfaces[surfID()].surf_grid_scale[dim_scale];
									} break;

	}
	workdesk.sessionStorageSaveProduct();
}

//-------------------------------------------------------------------------------
function changeGridProportionsType(e){
	var p = e.data.product;
	p.surfaces[surfID()].grid.proportion = checkedProportion();
	workdesk.adjustGridSizeToProportion(surfID());
	updateSpinners(p, surfID());
}

//-------------------------------------------------------------------------------
function changeScale(event, ui, product){
	$( "#scale_value" ).val( ui.value+"%" );
	product.scale = ui.value;

	// Refresh Boundaries
	workdesk.refreshWorkDesk(surfID());
}

//-------------------------------------------------------------------------------
function changeNumCells(e, p, orientation, ui){

	var assignValue = function(val){
			switch(orientation){
				case "horizontal" : p.surfaces[surfID()].grid.numcells_w = val; break;
				case "vertical"   : p.surfaces[surfID()].grid.numcells_h = val; break;
			}
		}

	switch(e.type){
		case "spin" : assignValue(ui.value); break;
		case "change" : assignValue($(e.target).val()); break;

	}

	workdesk.refreshNumCells();
	workdesk.removeUnusedCells();
	workdesk.sessionStorageSaveProduct();
}

//-------------------------------------------------------------------------------
function changeActiveCellSize( e, p, ui ){

}

//-------------- Add <Option> to selectmenue ------------------------------------
function selectmenueSurfacesRefresh( p, surface_id_checked ){
	var surfaces = p.surfaces,
		cur_surf = p.current_surface,
		$select_surf = $("#select-surface");

	$("option", $select_surf).remove();

	for(surf in surfaces){
		opt = $("<option>");
		name = surfaces[surf].surface_name;
		if (surf === p.current_surface) { opt.prop("selected", true) };
		$select_surf.append( opt.html(name).val(surf) )
	}

	if(typeof surface_id_checked!= "undefined"){
		$("[value='"+surface_id_checked+"']", $select_surf).prop("selected", true);
	}

	$select_surf.selectmenu().selectmenu("refresh")
}

//-------------- Set Radio Grid Proportions -------------------------------------
function setRadioGridProportions (value) {
	$("input[name='grid-proportions-radio'][value='"+value+"']").prop("checked", true);

}

/*
---------------------------------------------------------------------------------*/

function makeTextInputs(elms_set_class, active_grtempl_obj){
	var maxsym = "15",
		align_l = "",
		align_c = "",
		align_r = "";

	$textinput = $("<input type='text' class='text-input-box' maxlength='15'/>").toggleClass(elms_set_class).toggleClass("not-filled");
	$deletebutt = $("<a class='delete-text-button'>✕</a>").toggleClass(elms_set_class);
	
	if(typeof active_grtempl_obj.text_stack[elms_set_class].text!= "undefined"){
		$textinput.val(active_grtempl_obj.text_stack[elms_set_class].text);
	}

	$deletebutt.click(function(){
		var thistextsystemid = $(this).prop("class").split(" ")[1];
		$(".onstage-text."+thistextsystemid ).remove();
		$(this).closest(".text-input-set-wrapper").remove();
		delete active_grtempl_obj.text_stack[thistextsystemid];
		// console.log("Deliting: ", thistextsystemid, "text stack",active_grtempl_obj.text_stack)
	})

	$textinput
		.focus(function(){
			var thistextsystemid = $(this).prop("class").split(" ")[1],
				sizeindx = $(".onstage-text."+thistextsystemid).data("size-index"),
				fontindx = $(".onstage-text."+thistextsystemid).data("font-index"),
				textcolor = $(".onstage-text."+thistextsystemid).data("text-color");

			$( ".onstage-text."+thistextsystemid ).toggleClass("focused-text");
			$("#texts-layer").data("active-text", thistextsystemid );
			// Switch to selected font and font size in select boxes
			$("#font-family-select").ddslick('select', { index: fontindx });
			$("#font-size-select").ddslick('select', { index: sizeindx });
			$('#colorSelector').data("text-color", textcolor)
								.spectrum("set", textcolor);
		})
		.blur(function(){
			$(".onstage-text."+$(this).prop("class").split(" ")[1]).removeClass("focused-text");
		})
		.keyup(function(){
			var thistextsystemid = $(this).prop("class").split(" ")[1];
				// s = p.default_surface;
			$onsttxt = $(".onstage-text."+thistextsystemid);
			$onsttxt.text($(this).val());
			active_grtempl_obj.text_stack[thistextsystemid].text = $(this).val();
			switch(active_grtempl_obj.text_stack[thistextsystemid].textalign){
				case "left": $onsttxt.css("margin-left","0px"); break;
				case "center": $onsttxt.css("margin-left", (($onsttxt.width()/2)* -1) / ($onsttxt.parent().width() / 100)+"%"); break;
				case "right": $onsttxt.css("margin-left", ($onsttxt.width()* -1) / ($onsttxt.parent().width() / 100)+"%"); break;
			}
		});

	
	if(typeof active_grtempl_obj.text_stack[elms_set_class].maxsym != "undefined"){
		maxsym = active_grtempl_obj.text_stack[elms_set_class].maxsym;	
	}

	if(typeof active_grtempl_obj.text_stack[elms_set_class].textalign!= "undefined"){
		switch(active_grtempl_obj.text_stack[elms_set_class].textalign){
			case "left": align_l = "checked='checked'"; break;
			case "center": align_c = "checked='checked'"; break;
			case "right": align_r = "checked='checked'"; break;
		}
	} else {
		align_l = "checked='checked'";
	}
	// console.log("Aligning:")
	$("#text-inputs-wrapper").append(
		$("<div class='text-input-set-wrapper'>").data("text-set-id", elms_set_class).toggleClass(elms_set_class)
			.append(
				$("<div class='text-input-container'>").append($textinput).append($deletebutt))
			.append(
				"<div class='text-property-tools-wrapper'>"+
					"Макс Бук. <input class='max-symbols-inp' type='text' value='"+maxsym+"' maxlength='3'/>"+
					"<label>L </label><input type='radio' class='text-align-radio-butt' name='radio-text-align"+elms_set_class+"' value='left' "+align_l+">"+
					"<label> C </label><input type='radio' class='text-align-radio-butt' name='radio-text-align"+elms_set_class+"' value='center' "+align_c+">"+
					"<label> R </label><input type='radio' class='text-align-radio-butt' name='radio-text-align"+elms_set_class+"' value='right' "+align_r+">"+
				"</div>")
			.append(
				"<div>"+
					"<label>Поворот: </label><input type='text' class='text-rotation-input' maxlength='3'/> ˚"+
				"</div>")
	);
	$textinput.focus();

	$(".max-symbols-inp").unbind("change").bind("change", function(){
		var thistextsystemid = $(this).closest(".text-input-set-wrapper").data("text-set-id");
		if($(this).val()){
			active_grtempl_obj.text_stack[thistextsystemid].maxsym = $(this).val();
			$(".text-input-box."+thistextsystemid).prop("maxlength", $(this).val());
		}
	}).ForceNumericOnly();

	$(".text-rotation-input").unbind("change").bind("change", function(){
		var thistextsystemid = $(this).closest(".text-input-set-wrapper").data("text-set-id"),
			degree = 0;
		if($(this).val()){
			degree = $(this).val();
			$onsttxt = $(".onstage-text."+thistextsystemid);
			active_grtempl_obj.text_stack[thistextsystemid].rotation = $(this).val();
			console.log(active_grtempl_obj.text_stack[thistextsystemid].textalign);
			$onsttxt.css({ "-ms-transform-origin": active_grtempl_obj.text_stack[thistextsystemid].textalign,
							"-webkit-transform-origin": active_grtempl_obj.text_stack[thistextsystemid].textalign,
						   "transform-origin": active_grtempl_obj.text_stack[thistextsystemid].textalign,
						   "-ms-transform": "rotate("+degree+"deg)",
						   "-webkit-transform": "rotate("+degree+"deg)",
						   "transform": "rotate("+degree+"deg)"});
		}
	}).ForceNumericOnly();

	$(".text-align-radio-butt").unbind("click").bind("click", function(){
		var thistextsystemid = $(this).closest(".text-input-set-wrapper").data("text-set-id");
		active_grtempl_obj.text_stack[thistextsystemid].textalign = $(this).val();
		
		$onsttxt = $(".onstage-text."+thistextsystemid);
		switch(active_grtempl_obj.text_stack[thistextsystemid].textalign){
			case "left": $onsttxt.css("margin-left","0px"); break;
			case "center": $onsttxt.css("margin-left", (($onsttxt.width()/2)* -1) / ($onsttxt.parent().width() / 100)+"%"); break;
			case "right": $onsttxt.css("margin-left", ($onsttxt.width()* -1) / ($onsttxt.parent().width() / 100)+"%"); break;
		}

		$onsttxt.css({	"-ms-transform-origin": active_grtempl_obj.text_stack[thistextsystemid].textalign,
						"-webkit-transform-origin": active_grtempl_obj.text_stack[thistextsystemid].textalign,
						"transform-origin": active_grtempl_obj.text_stack[thistextsystemid].textalign });
	})
}

/*
---------------------------------------------------------------------------------*/

function addTextFunctionsInit(p, menubar){
	// Color Picker Settings --------------
	// var postfix = isMobile() ? "-mobile" : "-web";
	var newText = function(){
			var elms_set_class = "text-set"+Math.floor((Math.random() * 1000000000) + 1),
				ddSlickFontFamData = $("#font-family-select").data("ddslick"),
				ddSlickFontSizData = $("#font-size-select").data("ddslick"),
				fontfamily = ddSlickFontFamData.selectedData.value,
				fontsize = ddSlickFontSizData.selectedData.value,
				fsize_ratio_to_textslayer = 1,
				textcolor = $('#colorSelector').data("text-color");

			if (typeof p.graphic_templates !== "undefined") {
				var act_templ_id = p.graphic_templates.default_template,
					active_grtempl_obj = p.graphic_templates[p.current_surface][act_templ_id];

				if ( typeof active_grtempl_obj.text_stack == "undefined" ){
					active_grtempl_obj.text_stack = {};
				}

				fsize_ratio_to_textslayer = $("#texts-layer").width() / fontsize;
				active_grtempl_obj.text_stack[elms_set_class] = { position: { top: "10%", left: "10%", top_percents: 10, left_percents: 10 },
															 		tcolor: textcolor,
																	fsize: fontsize,
																	fsize_ratio_to_textslayer: fsize_ratio_to_textslayer,
																	ffamily: fontfamily,
																	text: "",
																	maxsym: 15,
																	textalign: "left",
																	rotate: 0,
																	selected_index: { sindex: 0, findex: 0 } }

				workdesk.info("New Text Made. \ntext_stack["+elms_set_class+"] \nSize: "+fontsize+"px \n#texts-layer to Font Size Ratio: "+fsize_ratio_to_textslayer+"\n");

				renderTextLayer( p );
			}
		}
	//*******************************************
	$("#colorSelector")
		.data("text-color", '#000000')
		.spectrum({
			chooseText: "Choose",
			showInput: true,
			change: function(color) {
			    var thistextsystemid = $("#texts-layer").data("active-text"),
			    	s = p.default_surface;
				$('#colorSelector').data("text-color", color.toHexString());
		    	if( typeof thistextsystemid !== "undefined"){
		    		$(".onstage-text."+thistextsystemid)
		    			.css("color", color.toHexString() )	
		    			.data("text-color", color.toHexString());

		    		if (typeof p.graphic_templates !== "undefined") {
						var act_templ_id = p.graphic_templates.default_template;
						console.log(p.graphic_templates[p.current_surface][act_templ_id])
						p.graphic_templates[p.current_surface][act_templ_id].text_stack[thistextsystemid].tcolor = color.toHexString();
		    		}
		    	}
			},

		    showPalette: true,
		    palette: [
		        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
		        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
		        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
		        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
		        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
		        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
		        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
		        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
		    ]
		});

	// Font Family Select Settings -----------------
	$("#font-family-select").ddslick({
		width: "100%",
	    selectText: "Select the Font",
	    onSelected: function (data) {
	    	var thistextsystemid = $("#texts-layer").data("active-text");
	    		// s = p.default_surface;
	    	if( typeof thistextsystemid !== "undefined"){
	    		$(".onstage-text."+thistextsystemid)
	    			.css("font-family", data.selectedData.value )
	    			.data("font-family", data.selectedData.value)
	    			.data("font-index", data.selectedIndex);

	    		if (typeof p.graphic_templates !== "undefined") {
					var act_templ_id = p.graphic_templates.default_template;
					p.graphic_templates[p.current_surface][act_templ_id].text_stack[thistextsystemid].ffamily = data.selectedData.value;
					p.graphic_templates[p.current_surface][act_templ_id].text_stack[thistextsystemid].selected_index.findex = data.selectedIndex;
				}
	    	}
	    }
	});

	// Font Size Select Settings ------------------
	$("#font-size-select").ddslick({
		width: "100%",
	    selectText: "Select the Font Size",
	    onSelected: function (data) {
	    	var thistextsystemid = $("#texts-layer").data("active-text");
	    		// s = p.default_surface;
	    	if( typeof thistextsystemid !== "undefined"){
	    		$(".onstage-text."+thistextsystemid)
	    			.css("font-size", data.selectedData.value+"px" )
	    			.data("font-size", data.selectedData.value )	
	    			.data("size-index", data.selectedIndex);

	    		if (typeof p.graphic_templates !== "undefined") {
					var act_templ_id = p.graphic_templates.default_template,
						fsize_ratio_to_textslayer = $("#texts-layer").width() / data.selectedData.value;

					p.graphic_templates[p.current_surface][act_templ_id].text_stack[thistextsystemid].fsize = data.selectedData.value;
					p.graphic_templates[p.current_surface][act_templ_id].text_stack[thistextsystemid].fsize_ratio_to_textslayer = fsize_ratio_to_textslayer;
					p.graphic_templates[p.current_surface][act_templ_id].text_stack[thistextsystemid].selected_index.sindx = data.selectedIndex;
				}
	    	}
	    }
	});

	// Add New Text button handler

	$(".add-new-text-butt").unbind("click").bind("click", newText);
	// Load fonts from google
	loadGoogleFonts();
	if($(".not-filled").length == 0){
		// newText(); 
	}
}

//---------------------------------------------------------------------------------
// SHOW / HIDE TEXT LAYER

function renderTextLayer(p){
	var s = p.current_surface,
		txt_layer_w = $("#texts-layer").width(),
		fsize = false;

	if (typeof p.graphic_templates !== "undefined" && $(".template-prewiew-thumb.active").length >0 ) {
		var act_templ_id = p.graphic_templates.default_template;

		if ( typeof p.graphic_templates[p.current_surface][act_templ_id].text_stack !== "undefined" ) {
			var text_stack = p.graphic_templates[p.current_surface][act_templ_id].text_stack;
			
			$(".onstage-text").remove();
			$("#text-inputs-wrapper").empty();

			for( txt in text_stack ){
				if(typeof text_stack[txt].fsize_ratio_to_textslayer == "undefined"){
					text_stack[txt].fsize_ratio_to_textslayer = txt_layer_w / text_stack[txt].fsize;
					$("#workdesk-info").empty();
					workdesk.info("New property text_stack["+txt+"].fsize_ratio_to_textslayer = "+text_stack[txt].fsize_ratio_to_textslayer+
											 "<br>Texts Layer Width: "+txt_layer_w+
											 "<br>Font Size: "+text_stack[txt].fsize+
											 "<br>Top: "+text_stack[txt].position.top+
											 "<br>Left: "+text_stack[txt].position.left);
				}

				fsize = txt_layer_w / text_stack[txt].fsize_ratio_to_textslayer+"px";

				workdesk.info("Rendering Txt Set: "+txt+"</br>"+
							"Text: "+text_stack[txt].text+"</br>"+
							"Font Size: "+fsize+
							"<br>Top: "+text_stack[txt].position.top+
							"<br>Left: "+text_stack[txt].position.left);

				$onstagetext = $("<div class='onstage-text'>")
					.css({  "font-family": text_stack[txt].ffamily,
							"font-size": fsize,
							"display": "inline-block",
							"-ms-transform": "rotate("+text_stack[txt].rotation+"deg)",
							"-webkit-transform": "rotate("+text_stack[txt].rotation+"deg)",
							"transform": "rotate("+text_stack[txt].rotation+"deg)",
							"-ms-transform-origin": text_stack[txt].textalign,
							"-webkit-transform-origin": text_stack[txt].textalign,
							"transform-origin": text_stack[txt].textalign,
							"line-height":"0%",
							"color": text_stack[txt].tcolor,
							"top": text_stack[txt].position.top,
							"left": text_stack[txt].position.left,
							"cursor":"move" })

					.toggleClass(txt)
					.data("identifier-class", txt)
					.data("font-family", text_stack[txt].ffamily)
					.data("font-size", text_stack[txt].fsize)
					.data("text-color", text_stack[txt].tcolor)
					.text( text_stack[txt].text )
					.click(function(){ $(".text-input-box."+$(this).data("identifier-class")).focus();})
					.draggable({
						containment: "#texts-layer",
						scroll: false,
						cursor: "move",
						create: function(){
							$(this).css({
								position: "absolute",
								top: text_stack[txt].position.top,
								left: text_stack[txt].position.left,
								"pointer-events":"auto",
							})
						},

						drag: function(e, ui){},
						// #template-grid
						stop: function(e, ui){						
							var thistextsystemid = $(this).prop("class").split(" ")[1],
								$onsttxt = $(".onstage-text."+thistextsystemid),
								Xperc_pos = ui.position.left / ($onsttxt.parent().width() / 100),
								Yperc_pos = ui.position.top / ($onsttxt.parent().height() / 100);

							$onsttxt.css({ top: Yperc_pos+"%", left: Xperc_pos+"%" })
							text_stack[thistextsystemid].position.top = Yperc_pos+"%";
							text_stack[thistextsystemid].position.left = Xperc_pos+"%";
							text_stack[thistextsystemid].position.top_percents = Yperc_pos;
							text_stack[thistextsystemid].position.left_percents = Xperc_pos;
							p.surfaces[s].text_layer_web_width = $("#texts-layer").width();
							text_stack[thistextsystemid].fs
						}

					});
				$("#texts-layer").append( $onstagetext );

				// Allign text
				switch(text_stack[txt].textalign){
					case "center": $onstagetext.css("margin-left", (($onstagetext.width()/2)* -1) / ($onstagetext.parent().width() / 100)+"%"); break;
					case "right": $onstagetext.css("margin-left", ($onstagetext.width() * -1) / ($onstagetext.parent().width() / 100)+"%"); break;
				}
				switch(text_stack[txt].textalign){
					case "center": $onstagetext.css("margin-left", (($onstagetext.width()/2)* -1) / ($onstagetext.parent().width() / 100)+"%"); break;
					case "right": $onstagetext.css("margin-left", ($onstagetext.width() * -1) / ($onstagetext.parent().width() / 100)+"%"); break;
				}

				makeTextInputs(txt, p.graphic_templates[p.current_surface][act_templ_id]);

			}
		} else {
			$("#texts-layer").empty();
		}
	}
}
//---------------------------------------------------------------------------------

function loadGoogleFonts(){
	var wf = document.createElement('script');
	WebFontConfig = {
	    google: { families: [ 'Abel::latin', 'Comfortaa::latin', 'Cookie::latin', 'Astloch::latin', 'Kaushan+Script::latin', 'IM+Fell+English+SC::latin', 'Nosifer::latin', 'Alfa+Slab+One::latin', 'Ubuntu+Mono::latin', 'Trade+Winds::latin', 'Codystar::latin', 'Stalemate::latin', 'Poiret+One::latin', 'Henny+Penny::latin', 'Quicksand::latin', 'Petit+Formal+Script::latin', 'Lobster::latin', 'Fugaz+One::latin', 'Shadows+Into+Light::latin', 'Josefin+Slab::latin', 'Frijole::latin', 'Fredoka+One::latin', 'Gloria+Hallelujah::latin', 'UnifrakturCook:700:latin', 'Tangerine::latin', 'Monofett::latin', 'Monoton::latin', 'Pacifico::latin', 'Spirax::latin', 'UnifrakturMaguntia::latin', 'Creepster::latin', 'Maven+Pro::latin', 'Amatic+SC::latin', 'Dancing+Script::latin', 'Pirata+One::latin', 'Play::latin', 'Audiowide::latin', 'Open+Sans+Condensed:300:latin', 'Kranky::latin', 'Black+Ops+One::latin', 'Indie+Flower::latin', 'Sancreek::latin', 'Press+Start+2P::latin', 'Abril+Fatface::latin', 'Jacques+Francois+Shadow::latin', 'Ribeye+Marrow::latin', 'Playball::latin', 'Roboto+Slab::latin' ] }
	}
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}


//-------------------------------------------------------------------------------
// SAVE PRODUCT FUNCTION

function saveProduct(e){
	var p = e.data.product;

		console.log(p);
		product_json_data = JSON.stringify( p ),
		post_data = { saveProduct: product_json_data,
					  product_id: p.db_id,
					  product_name: p.name,
					  product_thumb: p.surfaces[p.default_surface].thumburl
					};
		// console.log(post_data);
	$.post( productserverpath, post_data, function(data){
		if(!data.error){
			workdesk.info("Product Saved. Product ID: "+data.product_id, "productsaved");
			// Assign DataBase ID to the product
			p.db_id = data.product_id;
			workdesk.sessionStorageSaveProduct();
		} else {
			workdesk.info("Error! "+data.error_msg, "error productsave");
			console.log(data);
		}
	} ,"json" );
}

//------------------------------------------------------------------------------

window.dataURItoBlob = function(dataURI, dataTYPE){
    var binary = atob(dataURI.split(',')[1]), array = [];
    for(var i = 0; i < binary.length; i++){
    	array.push(binary.charCodeAt(i));	
    } 
    return new Blob([new Uint8Array(array)], {type: dataTYPE});
}

//--------------------------------
function checkedProportion(){
	return $("input[name='grid-proportions-radio']:checked").val();
}
//--------------------------------
function surfID(){
	return $("#select-surface").val();
}
//-- isset -------
function isset(a){
	return typeof a != "undefined"
}

//---------------------------------------------------------------------------------
// 
// Numeric only control handler
jQuery.fn.ForceNumericOnly = function(){
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




// Проблема в IE9 с загрузкой превьюшек загружаемых картинок. FileAPI не поддерживаетя.
// Нужен полифил для File API типа jQuery FileAPI
// Проблемные функции:
// WorkDesk.prototype.coverImgFileHandler
// Зделать проверку на поддержку функций


function WorkDesk(sett){
	var self = this;
	this.settings = { product : undefined,
					  workdesk_container : undefined,
					  working_area 		 : undefined,
					  resolution_mode	 : "screen",
					  img_css : { position: "absolute"/*,
								 left: "50%",
								 top: "50%"*/	},
					 surf_css : { position: "absolute"/*,
								  left: "50%",
								  top: "50%"*/	},
					 grid_css : { position: "relative"/*,
								  left: "50%",
								  top: "50%"*/	},
					 product_mask_css: { position: "absolute" },

					 texts_layer_css : { position: "absolute" },

					 files_stack: []

					};

	this.graphic_layer_preview_settings = { stack_object: "graphic_templates",
											file_info: "graphic_layer_image",
											container: "#graphic-templates-preview-window",
											render_function: "renderGraphicLayer" };

	this.demo_layer_preview_settings = { }

	this.surface_img_preview_settings = { stack_object: "optional_images",
											file_info: "optional_image",
											container: "#optional-surf-preview-window",
											render_function: "renderImage" };

	this.graphic_template_data = {};
	this.demo_layer_data = {};

	if(typeof sett!= "undefined"){
		$.extend(true, this.settings, sett);
	}

	this.p = this.settings.product;
	// this.grid = this.settings.product.surfaces[this.settings.product.current_surface].grid;
	this.product_image_bounds = $("<div>").attr("id", "product-image-bounds").css(this.settings.img_css);
	this.product_image_bounds.html("<h2 class='dragndrop-title'>Перетяните Фотографию Продукта Сюда</h2>")
	this.surf_bounds = $("<div>").attr("id", "product-surface-bounds").css(this.settings.surf_css);
	this.demo_layer  = $("<div>").attr("id", "demo-img-layer").css(this.settings.surf_css);
	this.layout_grid = $("<div>").attr("id", "layaout-grid").css(this.settings.grid_css);
	this.texts_layer = $("<div>").attr("id", "texts-layer").css(this.settings.texts_layer_css);
	// this.graphic_layer = $("<div>").attr("id", "graphic-layer").css(this.settings.surf_css);
	this.surface_data = {};
	this.add_opt_img_handler_function = false;
	// used to increment number of current optional images set. Value changes in addOptionalImageToSurface

	// Append Boundaries to the work desk --------------------------------------------------------
	$(this.settings.workdesk_container).append(this.product_image_bounds
														.append(this.surf_bounds)
														.append(this.layout_grid)
														.append(this.texts_layer));

	// Add events to boundaries ------------------------------------------------------------------
	this.surf_bounds.resizable({ handles: "all", containment : "parent",
								 resize : function(event, ui){ self.surfBoundsResizeHandler(event, ui, self.settings.product) } });
	this.layout_grid.resizable({ handles: "all",
								 resize : function(event, ui){ self.gridBoundsResizeHandler(event, ui, self.settings.product) } });
	this.demo_layer.resizable({ handles: "all", containment : "parent",
								 resize : function(event, ui){ self.demoLayerResizeHandler(event, ui, self.settings.product) } });
	/*this.graphic_layer.resizable({ handles: "all",
								 resize : function(event, ui){ self.surfBoundsResizeHandler(event, ui, self.settings.product) } });*/

	// Add Drag'n Drop events
	this.product_image_bounds.bind("dragenter", this.productImgOnDragenter);
	this.product_image_bounds.bind("dragover", this.productImgOnDragover);
	this.product_image_bounds.bind("drop", { self : this, product : this.settings.product }, this.productImgOnDrop);

	// Desk events ------------------------------------------------------------------
	$(this.settings.workdesk_container).dblclick(this.emptyClick);
	$(this.settings.working_area).dblclick(this.emptyClick);

	// Load saved cells --------------------------------------------------------------
	this.refreshNumCells();
	this.fileUploadInitiate();
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.sessionStorageSaveProduct = function(){
	//console.log(this.settings.product);
	$.sessionStorage.set("product", this.settings.product);
	//console.log($.sessionStorage.get("product"))
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.surfBoundsResizeHandler = function(event, ui, product){
	var p = product,
		print_w = ui.size.width/(p.scale/100),
		print_h = ui.size.height/(p.scale/100),
		surf_width = this.convert(print_w, "to mm print"),
		surf_height = this.convert(print_h, "to mm print");

		p.surfaces[p.current_surface].width = surf_width;
		p.surfaces[p.current_surface].height = surf_height;
		p.surfaces[p.current_surface].x = ui.position.left;
		p.surfaces[p.current_surface].y = ui.position.top;
		updateSpinners(p, p.current_surface);

	$("#workdesk-info").html("<lh><b>Разрешение печатной поверхности:</b></lh>"+
								"<li class='screen_res_inf'>Экран (72 DPI): <b>"+ui.size.width+"x"+ui.size.height+" px</b>; </li>"+
								"<li class='print_res_inf'>Печать (300 DPI): <b>"+Math.round(print_w)+"x"+Math.round(print_h)+" px</b>; </li>"+
								"<li class='metric_size_inf'>Размер: <b>"+surf_width+"x"+surf_height+" mm</b></li>"/*+
								"<li>x "+ui.position.left+"y"+ui.position.top+"</li>"*/ );

	constrainSizeChange(product, "width", "surface to grid");
	constrainSizeChange(product, "height", "surface to grid");
	constrainSizeChange(product, "width", "surface to product");
	constrainSizeChange(product, "height", "surface to product");

	this.adjustGridSizeToProportion(p.current_surface);
	// this.refreshWorkDesk(p.current_surface);
}

WorkDesk.prototype.updateTextsSizeData = function(p) {
	var act_templ_id = p.graphic_templates.default_template,
		fsize_ratio_to_textslayer = 0,
		txtlayer_w = $("#texts-layer").width();

	if(typeof p.graphic_templates!= "undefined" && 
	   typeof p.graphic_templates[p.current_surface][act_templ_id].text_stack != "undefined"){
		
		for(var txt in p.graphic_templates[p.current_surface][act_templ_id].text_stack)	{

			$("#workdesk-info").html("> Text Css font size: "+(txtlayer_w / p.graphic_templates[p.current_surface][act_templ_id].text_stack[txt].fsize_ratio_to_textslayer)+"px<br>"+
					  "Texts Layer Width: "+txtlayer_w+
					  "<br>Ratio: "+p.graphic_templates[p.current_surface][act_templ_id].text_stack[txt].fsize_ratio_to_textslayer);
			$(".onstage-text."+txt).css({ "font-size": (txtlayer_w / p.graphic_templates[p.current_surface][act_templ_id].text_stack[txt].fsize_ratio_to_textslayer)+"px"});
		}
	}
}
//-----------------------------------------------------------------------------------
WorkDesk.prototype.gridBoundsResizeHandler = function(event, ui, product){
	var p = product,
		print_w = ui.size.width/(p.scale/100),
		print_h = ui.size.height/(p.scale/100),
		grid_width = this.convert(print_w, "to mm print"),
		grid_height = this.convert(print_h, "to mm print");

		p.surfaces[p.current_surface].grid.width = grid_width;
		p.surfaces[p.current_surface].grid.height = grid_height;
		p.surfaces[p.current_surface].grid.x = ui.position.left;
		p.surfaces[p.current_surface].grid.y = ui.position.top;
		updateSpinners(p, p.current_surface);
		/*this.texts_layer.css({
			"width": grid_width,
			"height": grid_height,
			"top": ui.position.top+"px",
			"left": ui.position.left+"px"
		})*/
	
	this.updateTextsSizeData(p);

	constrainSizeChange(product, "width", "grid to surface");
	constrainSizeChange(product, "height", "grid to surface");
	constrainSizeChange(product, "width", "surface to product");
	constrainSizeChange(product, "height", "surface to product");

	/*$("#workdesk-info").html("Resolution:<br/>"+
								"screen: "+ui.size.width+"x"+ui.size.height+" px<br/>"+
								"print: "+Math.round(print_w)+"x"+Math.round(print_h)+" px"+
								"<p>Size: "+surf_width+"x"+surf_height+" mm</p>"+
								"<p>Координаты: x "+ui.position.left+" y"+ui.position.top+"<br/>"+
								"Начальные: x "+ui.originalPosition.left+" y"+ui.originalPosition.top+"</p>"
								);*/
	this.adjustGridSizeToProportion(p.current_surface);
}

//-----------------------------------------------------------------------------------

WorkDesk.prototype.maskBoundsResizeHandler = function(event, ui, product){
	var p = product;
		p.surfaces[p.current_surface].surfacemask.width = ui.size.width;
		p.surfaces[p.current_surface].surfacemask.height = ui.size.height;
		p.surfaces[p.current_surface].surfacemask.x = ui.position.left;
		p.surfaces[p.current_surface].surfacemask.y = ui.position.top;
		this.refreshWorkDesk( p.current_surface )
}

//-----------------------------------------------------------------------------------

WorkDesk.prototype.demoLayerResizeHandler = function(event, ui, product){
	var p = product;
		p.surfaces[p.current_surface].demo_layer.width = ui.size.width;
		p.surfaces[p.current_surface].demo_layer.height = ui.size.height;
		p.surfaces[p.current_surface].demo_layer.x = ui.position.left;
		p.surfaces[p.current_surface].demo_layer.y = ui.position.top;
		this.refreshWorkDesk( p.current_surface )
}

//-----------------------------------------------------------------------------------

WorkDesk.prototype.productImgOnDragenter = function(e){
	e.stopPropagation();
	e.preventDefault();
}
//-----------------------------------------------------------------------------------
WorkDesk.prototype.productImgOnDragover = function(e){
	e.stopPropagation();
	e.preventDefault();
}
//-----------------------------------------------------------------------------------
// DRAG AND DROP EVENT HANDLER

WorkDesk.prototype.productImgOnDrop = function(e){
	e.stopPropagation();
	e.preventDefault();

	var data = e.originalEvent.dataTransfer,
	file = data.files,
	self = e.data.self;

	self.handleCoverImgFile(file[0]);
		
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.loadStoredImgData = function(){
	var p = this.settings.product,
		b = null,
		self = this
		convertURI2BlobAddData = function(uri, filename, surface_id, opt_file_args_obj){
			b = dataURItoBlob( uri, "image/jpeg" );
			b.name = filename;
			b.surface_id = surface_id;
			if(typeof opt_file_args_obj!= "undefined"){
				$.extend(b, opt_file_args_obj);	
			}
			self.settings.files_stack.push(b);
		};

	if($.sessionStorage.isSet("surface-data")){

		img_data = $.sessionStorage.get("surface-data");
		this.surface_data = img_data;
		this.renderImage(img_data[p.current_surface].uri);	
		
		for(data in img_data){
			if( typeof img_data[data].mask !== "undefined"){
				convertURI2BlobAddData( img_data[data].mask.mask_uri,
										img_data[data].mask.filename,
										data,
										{ mask: true});
			}

			if( typeof img_data[p.current_surface].optional_images !== "undefined"){
				for(set in img_data[data].optional_images){
					convertURI2BlobAddData( img_data[data].optional_images[set].uri,
											img_data[data].optional_images[set].filename,
											data,
											{ optional_image: true});
				}
			}

			convertURI2BlobAddData( img_data[data].uri, img_data[data].filename, data);
		}

		typeof img_data[p.current_surface].mask !== "undefined" && this.applyProductMask(img_data[p.current_surface].mask.mask_uri);
		this.previewOptionalImages(this.surface_img_preview_settings);
	} else {
		console.log(p.surfaces)
		typeof p.surfaces[p.current_surface].imgurl !== "undefined" && this.renderImage(p.surfaces[p.current_surface].imgurl);
		typeof p.surfaces[p.current_surface].maskurl !== "undefined" && this.applyProductMask(p.surfaces[p.current_surface].maskurl);
	}
}

//------------------------------------------------------------------------------------
WorkDesk.prototype.handleCoverImgFile = function(file){

	window.FileReader  	? this.handleImgFile(file)
						: this.handlImgFileNoFileAPI(file);
}

WorkDesk.prototype.handleMaskFile = function(file){
	window.FileReader  	? this.handleProductMaskImg(file)
						: this.handlMaskFileNoFileAPI(file);
}
//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.handleOptioanlImge = function(e){
	var file = $("#optional-product-img-file-inp")[0].files[0],
		reader = new FileReader(),
		self = this,
		handler_function = this.add_opt_img_handler_function;

	reader.readAsDataURL(file);
	reader.onload = function(e){ 
		var preview_settings = { file: file, uri: e.target.result };

		switch(handler_function){

			case "optional surface view" :  $.extend(preview_settings, self.surface_img_preview_settings);
											check_variable = "make_new_optional_img_set";
											preview_uploaded_imgs_func = "previewOptionalImages";
											save_to_stack_now = true;
											break;

			case "graphic layer" :  $.extend( preview_settings, self.graphic_layer_preview_settings );
									$.extend( self.graphic_template_data, { file: file, uri: e.target.result });
									save_to_stack_now = false;
									break;
		}

		self[preview_settings.render_function]( e.target.result );
		// Save optional images to the current surface stack object and to upload queue
		save_to_stack_now && self.saveToStack(preview_settings);
 	};
}

/*
------------------------------------------------------------------------------------*/
WorkDesk.prototype.handleDemoLayerImge = function(e){
	var file = $("#demo-layer-img-file-inp")[0].files[0],
		reader = new FileReader(),
		self = this,
		p = this.settings.product;

	if(typeof p.graphic_templates != "undefined" && typeof p.graphic_templates.default_template != "undefined" ){
		var act_templ_id = p.graphic_templates.default_template;

		reader.readAsDataURL(file);
		reader.onload = function(e){
			// var preview_settings = { file: file, uri: e.target.result };

			if(typeof p.graphic_templates[p.current_surface][act_templ_id].demo_layer != "undefined"){
				p.graphic_templates[p.current_surface][act_templ_id].demo_layer.file = file;
				p.graphic_templates[p.current_surface][act_templ_id].demo_layer.url = e.target.result;
				p.graphic_templates[p.current_surface][act_templ_id].demo_layer.file.demo_layer_image = { surface_id: p.current_surface, template_id: act_templ_id };
			} else {
				p.graphic_templates[p.current_surface][act_templ_id].demo_layer = { file: file, url: e.target.result };
				p.graphic_templates[p.current_surface][act_templ_id].demo_layer.file.demo_layer_image = { surface_id: p.current_surface, template_id: act_templ_id };
			}

			self.renderDemoLayer( e.target.result );
	 	};	
	} else {
		alert("Сперва выберите графический шаблон.")
	}
}

//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.handlePreviewGraphTemplateImge = function(e){
	var file = $("#graph-template-preview-img-file-inp")[0].files[0],
		reader = new FileReader(),
		self = this,
		p = this.settings.product;

	if(typeof p.graphic_templates != "undefined" && typeof p.graphic_templates.default_template != "undefined" ){
		var act_templ_id = p.graphic_templates.default_template;

		reader.readAsDataURL(file);
		reader.onload = function(e){

			if(typeof p.graphic_templates[p.current_surface][act_templ_id].preview_thumb != "undefined"){
				p.graphic_templates[p.current_surface][act_templ_id].preview_thumb.file = file;
				p.graphic_templates[p.current_surface][act_templ_id].preview_thumb.url = e.target.result;
				p.graphic_templates[p.current_surface][act_templ_id].preview_thumb.file.preview_thumb_image = { surface_id: p.current_surface, template_id: act_templ_id };
			} else {
				p.graphic_templates[p.current_surface][act_templ_id].preview_thumb = { file: file, url: e.target.result };
				p.graphic_templates[p.current_surface][act_templ_id].preview_thumb.file.preview_thumb_image = { surface_id: p.current_surface, template_id: act_templ_id };
			}

			self.settings.menubar.previewTemplates(p, { p: self.settings.product,
														self: self,
														templates_obj: "graphic_templates",
														preview_container: "#graphic-templates-preview-window",
														add_opt_template_data: self.graphic_template_data });
	 	};	
	} else {
		alert("Сперва выберите графический шаблон.")
	}
}

//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.handleProductPreviewImge = function(e){
	var file = $("#product-preview-img-file-inp")[0].files[0],
		reader = new FileReader(),
		self = this,
		p = this.settings.product;

	if(typeof p.graphic_templates != "undefined" && typeof p.graphic_templates.default_template != "undefined" ){
		var act_templ_id = p.graphic_templates.default_template;

		reader.readAsDataURL(file);
		reader.onload = function(e){

			if(typeof p.graphic_templates[p.current_surface][act_templ_id].product_preview != "undefined"){
				p.graphic_templates[p.current_surface][act_templ_id].product_preview.file = file;
				p.graphic_templates[p.current_surface][act_templ_id].product_preview.url = e.target.result;
				p.graphic_templates[p.current_surface][act_templ_id].product_preview.file.product_preview_image = { surface_id: p.current_surface, template_id: act_templ_id };
			} else {
				p.graphic_templates[p.current_surface][act_templ_id].product_preview = { file: file, url: e.target.result };
				p.graphic_templates[p.current_surface][act_templ_id].product_preview.file.product_preview_image = { surface_id: p.current_surface, template_id: act_templ_id };
			}

			self.settings.menubar.previewTemplates(p, { p: self.settings.product,
														self: self,
														templates_obj: "graphic_templates",
														preview_container: "#graphic-templates-preview-window",
														add_opt_template_data: self.graphic_template_data });
	 	};	
	} else {
		alert("Сперва выберите графический шаблон.")
	}
}

//---------------------------------------------------------------------------------
// 
WorkDesk.prototype.saveToStack = function(settings) {
	var p = this.settings.product,
		num_sets;
	// If Current Surface object doesn't exist - make it
	if (typeof this.surface_data[p.current_surface] == "undefined"){
		this.surface_data[p.current_surface] = {};
	}
	// Make a Stack Object to stack
	if( typeof this.surface_data[p.current_surface][settings.stack_object] == "undefined"){
		this.surface_data[p.current_surface][settings.stack_object] = {};
	}
	// Check where to save data. Overwrite existing images set or create a new one
	num_sets = this[check_variable] ? Object.keys( this.surface_data[p.current_surface][settings.stack_object] ).length+1
									: Object.keys( this.surface_data[p.current_surface][settings.stack_object] ).length;	
	// Save data in .optional_images.set#n
	this.surface_data[p.current_surface][settings.stack_object]["set"+num_sets] = { uri: settings.uri, filename: settings.file.name };
	this[settings.check_variable] = false;
    // Add file to the Files Stack
    settings.file.surface_id = p.current_surface;
    settings.file[settings.file_info] = true;
	this.settings.files_stack.push(settings.file);
	// Preview saved in preview panel
	this[preview_uploaded_imgs_func](settings);
};

//---------------------------------------------------------------------------------
// 
/*
container: #optional-surf-preview-window
render_function: renderImage
*/

/*
$("<input class='template_id_input' type='text' value='"+t+"' >").appendTo($thumbnail)
			.bind("change", { p: this.settings.product, self: this, settings: settings }, changeTemplateID);
		
template_name = (typeof ts[t].template_name!= "undefined") ? ts[t].template_name : "";

$("<input class='template_name_input' type='text' value='"+template_name+"' >").appendTo($thumbnail)
		.bind("change", { p: this.settings.product, self: this, settings: settings }, changeTemplateName);	

changeTemplateID = function(e){
	var p = e.data.p,
		self = e.data.self,
		templ_id = $(this).parent().prop("data-templ_id");
	if($(this).val()){

		p[e.data.settings.templates_obj][p.current_surface][$(this).val()] = p[e.data.settings.templates_obj][p.current_surface][templ_id];
		delete p[e.data.settings.templates_obj][p.current_surface][templ_id];
		self.previewTemplates(p, e.data.settings);
	}
},
changeTemplateName = function(e){
	var p = e.data.p,
		self = e.data.self,
		templ_id = $(this).parent().prop("data-templ_id");
	if($(this).val()){

		p[e.data.settings.templates_obj][p.current_surface][templ_id].template_name = $(this).val();
		self.previewTemplates(p, e.data.settings);
	}
};
*/
WorkDesk.prototype.previewOptionalImages = function(data){
	var surf = this.p.current_surface,
		self = this,

		changeOptImgID = function(e){
			var p = self.p,
				templ_id = e.data.id;

			if($(this).val()){
				p.surfaces[surf][data.stack_object][$(this).val()] = p.surfaces[surf][data.stack_object][templ_id];
				delete p.surfaces[surf][data.stack_object][templ_id];
				self.previewOptionalImages(self.surface_img_preview_settings);
			}
		},

		changeOptImgName = function(e){
			var p = self.p,
				templ_id = e.data.id;

			if($(this).val()){
				p.surfaces[surf][data.stack_object][templ_id].template_name = $(this).val();
				self.previewOptionalImages(self.surface_img_preview_settings);
			}
		},

		makeThumbs = function(p, image_src, img_id, saved_on_server, add_url_to_data_set){
			thumb = $("<div class='optional_image_thumbnail'>")
						.prop("data-thumbid", img_id)
						.prop("data-savedonserver", saved_on_server)
						.append($("<button>").addClass("delete-template-butt"))
						.append($("<img class='opt-img-thumb'>").prop("src", image_src))
						.appendTo(data.container+" .inner-window");

			if(typeof add_url_to_data_set!= "undefined" && add_url_to_data_set ){
				thumb.prop("data-imgurl", image_src);
			}

			$("<input class='optimg_id_input' type='text' value='"+img_id+"' >").appendTo(thumb)
				.bind("change", { id: img_id }, changeOptImgID);
		
			if(typeof p.surfaces[surf][data.stack_object] != "undefined"
				&& typeof p.surfaces[surf][data.stack_object][img_id] != "undefined"
				&& typeof p.surfaces[surf][data.stack_object][img_id].template_name!= "undefined"){

				template_name = p.surfaces[surf][data.stack_object][img_id].template_name;
			} else {
				template_name = "";
			}
																											 
			$("<input class='optimg_name_input' type='text' value='"+template_name+"' >").appendTo(thumb)
				.bind("change", { id: img_id }, changeOptImgName);

			// self.settings.menubar.previewTemplates(
		};

	$(data.container+" .inner-window").empty();

	// First load images stored in surface_data (New images)
	if(typeof this.surface_data[surf] != "undefined" && typeof this.surface_data[surf][data.stack_object] != "undefined"){
		for(d in this.surface_data[surf][data.stack_object]){
				makeThumbs( this.p, 
							this.surface_data[surf][data.stack_object][d].uri,
							d, false);
		}
	}
	// Then save old images saved on the server.
	if(typeof this.p.surfaces[surf][data.stack_object] != "undefined"){
		for(d in this.p.surfaces[surf][data.stack_object]){
				makeThumbs( this.p,
							this.p.surfaces[surf][data.stack_object][d].imgurl, 
							d, true, true);
		}
	}

	// Delete thumbnail event
	$(".optional_image_thumbnail button.delete-template-butt").click(function(){
		if($(this).closest(".optional_image_thumbnail").prop("data-savedonserver")){
			if(confirm("Удалить сохранённую картинку? Файл будет удалён с сервера.\n Не забудьте сохранить продукт после удаления.")){
				delete self.p.surfaces[surf][data.stack_object][ $(this).closest(".optional_image_thumbnail").prop("data-thumbid") ];
				$.post( productserverpath, { deleteOptImg: $(this).closest(".optional_image_thumbnail").prop("data-imgurl") },
						function(d){
							if(d.error){
								alert(d.error_msg);
							}
						}, "json")
			}
		} else {
			delete self.surface_data[surf][data.stack_object][ $(this).closest(".optional_image_thumbnail").prop("data-thumbid") ];	
		}
		$(this).closest(".optional_image_thumbnail").remove();

	});
	// Switch main product image to the optional. event
	$(".optional_image_thumbnail").click(function(){

		self[data.render_function]( $(this).find("img").prop("src") );

	});
}

//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.handleOptionalMask = function(){

}

//************************************************************************************
// FileReader NOT SUPPORTED IN IE < 10 
//************************************************************************************

WorkDesk.prototype.handleImgFile = function(file){
	var reader = new FileReader(),
		p = this.settings.product,
		self = this;

	reader.readAsDataURL(file);
	reader.onload = function(e){ 

		self.renderImage( e.target.result );
		//Save image data to a workdesk variable
		
		if(typeof self.surface_data[p.current_surface] == "undefined"){
			self.surface_data[p.current_surface] = {};
		}

		$.extend(self.surface_data[p.current_surface], { uri: e.target.result, filename: file.name } )
		//Save image data in a sessionStorage
		try {
            $.sessionStorage.set("surface-data", self.surface_data);
        }
        catch (e) {
            self.info("Storage failed:<br/>Maximum Total size of files is 5Mb<br/>" + e, "error storage");
        }

        // Add file to the Files Stack
        file.surface_id = p.current_surface;
		self.settings.files_stack.push(file);
	 };
}
//------------------------------------------------------------------------------------
WorkDesk.prototype.handleProductMaskImg = function(file){
	var reader = new FileReader(),
		p = this.settings.product,
		self = this;

	reader.readAsDataURL(file);
	reader.onload = function(e){ 

		self.applyProductMask( e.target.result );
		//Save mask image data to a workdesk variable
		if(typeof self.surface_data[p.current_surface] == "undefined"){
			self.surface_data[p.current_surface] = {};
		}
		$.extend( self.surface_data[p.current_surface], { mask: { mask_uri: e.target.result, filename: file.name } })
		//Save mask image data in a sessionStorage
		try {
            $.sessionStorage.set("surface-data", self.surface_data);
        }
        catch (e) {
            self.info("Storage failed:<br/>Maximum Total size of files is 5Mb<br/>" + e, "error storage");
        }

        // Add file to the Files Stack
        file.surface_id = p.current_surface;
        file.mask = true;
		self.settings.files_stack.push(file);
	 };
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.renderImage = function( dataURL ){
	$img = $("<img>").prop("id", "product-img");
	$("#product-img", this.product_image_bounds).remove();
	this.product_image_bounds.append( $img );
	this.img = $img;
	$img.prop("src", dataURL);
	this.info("Product Image url: "+decodeURI(dataURL));
	this.refreshWorkDesk(this.settings.product.current_surface);
}

//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.renderGraphicLayer = function(dataURL){
	$img = $("<img>").prop("id", "graphic-layer-image");
	$("#graphic-layer-image", this.surf_bounds).remove();
	this.surf_bounds.append( $img );
	this.graphic_layer_img = $img;
	this.info("Graphic Layer Mask: "+decodeURI(dataURL));
	$img.prop("src", dataURL)
		.width(this.surf_bounds.width())
		.height(this.surf_bounds.height());
	this.refreshWorkDesk(this.settings.product.current_surface);
}

//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.renderDemoLayer = function(dataURL){
	$img = $("<img>").prop("id", "demo-layer-image");
	$("#demo-layer-image", this.surf_bounds).remove();
	$("#demo-img-layer").remove();

	this.product_image_bounds.append(this.demo_layer);
	this.demo_layer.append( $img );
	this.demo_layer.css({ top: "0px", left: "0px" })
	this.demo_layer_img = $img;

	this.p.surfaces[p.current_surface].demo_layer = {	width: this.surf_bounds.width(),
														height: this.surf_bounds.height(),
														x: 0,
														y: 0 };
	// alert("rendering", dataURL)
	this.info("Demo Layer URL: "+decodeURI(dataURL));
	$img.prop("src", dataURL)
		.width(this.surf_bounds.width())
		.height(this.surf_bounds.height());
	this.refreshWorkDesk(this.settings.product.current_surface);
}

//---------------------------------------------------------------------------------
// 

WorkDesk.prototype.addOptionalImageToSurface = function(e){
	// alert(e.data.handler_function)
	e.data.workdesk.add_opt_img_handler_function = e.data.handler_function;
	$("#add-optional-images-window").css( { visibility: "visible" } );
	$("#add-optional-images-window button.delete-template-butt").click(function(){
		$("#add-optional-images-window").css( { visibility: "hidden" } );
		$("#optional-product-img-file-inp").unbind("onchange");
	})
	switch(e.data.handler_function){
		case "optional surface view" : e.data.workdesk.make_new_optional_img_set = true; break;
		case "graphic layer" :  e.data.workdesk.make_new_graphic_templates = true; break;
	}
}

//-----------------------------------------------------------------------------------

WorkDesk.prototype.applyProductMask = function( dataURL ){
	var p = this.settings.product,
		self = this;

	if($("#product-mask-bounds").length === 0){
		this.product_mask_bounds = $("<div>").prop("id", "product-mask-bounds").css(this.settings.product_mask_css);
		this.product_image_bounds.append(this.product_mask_bounds);
	}
	// If no surface mask then make one and give it initial values.
	if( typeof p.surfaces[p.current_surface].surfacemask === "undefined"){
		p.surfaces[p.current_surface].surfacemask = {	width: this.product_image_bounds.width(),
														height: this.product_image_bounds.height(),
														x: 0,
														y: 0 };
	}

	// Add events to boundaries ------------------------------------------------------------------
	this.product_mask_bounds
			.resizable({ handles: "all",
						 resize : function(event, ui){ self.maskBoundsResizeHandler(event, ui, self.settings.product) } 
			});

	$mask = $("<img>").prop("id", "product-mask-img");
	$("#product-mask-img", this.product_mask_bounds).remove();
	this.product_mask_bounds.append( $mask );
	$mask.prop("src", dataURL);
	this.info("Product Mask URL: "+decodeURI(dataURL));
	this.refreshWorkDesk(this.settings.product.current_surface);
}

//***********************************************************************************
// IE9- File API Not supported. Process file old way function
//***********************************************************************************

WorkDesk.prototype.handlImgFileNoFileAPI = function(file){
	$("#workdesk-info").html("The Browser doesn't support FileAPI");

	// Convert Image to DataURI. Works for IE9+
	var getBase64Image = function(img) {
	    // Create an empty canvas element
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    // Get the data-URL formatted image
	    // Firefox supports PNG and JPEG. You could check img.src to guess the
	    // original format, but be aware the using "image/jpg" will re-encode the image.
	    var dataURL = canvas.toDataURL("image/png");

	    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	},

	img_data = getBase64Image(file);
}
//------------------------------------------------------------------------------------
WorkDesk.prototype.handlMaskFileNoFileAPI = function(file){
	$("#workdesk-info").html("The Browser doesn't support FileAPI");

	// Convert Image to DataURI. Works for IE9+
	var getBase64Image = function(img) {
	    // Create an empty canvas element
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    // Get the data-URL formatted image
	    // Firefox supports PNG and JPEG. You could check img.src to guess the
	    // original format, but be aware the using "image/jpg" will re-encode the image.
	    var dataURL = canvas.toDataURL("image/png");

	    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	},

	img_data = getBase64Image(file);
}
//***********************************************************************************
WorkDesk.prototype.fileUploadInitiate = function(){
	var self = this,
		fi = 0,
		len = 0,
		current_surf_id = null,
		extra_data_type,
		graph_templ_path = {};
		
	$("#files-stack").fileupload({
        dataType: 'json',
        url : window.rootpath+"assets/php/upload_server/",
        sequentialUploads: true,

        send: function(e, data){
        	
        		current_surf_id = data.files[0].surface_id;
        		if(typeof data.files[0].mask !== "undefined"){ extra_data_type = "mask" } 
        		if(typeof data.files[0].optional_image !== "undefined"){ extra_data_type = "optional image" }
        		if(typeof data.files[0].graphic_layer_image !== "undefined"){ 
        			extra_data_type = "graphic template image"; 
        			graph_templ_path = data.files[0].graphic_layer_image;
        		}
        		if(typeof data.files[0].demo_layer_image !== "undefined"){ 
        			extra_data_type = "demo layer image"; 
        			demo_layer_path = data.files[0].demo_layer_image;
        		}
        		if(typeof data.files[0].preview_thumb_image !== "undefined"){ 
        			extra_data_type = "template preview image"; 
        			preview_thumb_path = data.files[0].preview_thumb_image;
        			// console.log("File -> ",data.files[0])
        		}
        		if(typeof data.files[0].product_preview_image !== "undefined"){ 
        			extra_data_type = "product preview image"; 
        			product_preview_thumb_path = data.files[0].product_preview_image;
        			
        			// console.log("File -> ",data.files[0])
        		}
        },

        done: function(e, data){
        	console.log("Done Sending: ", extra_data_type)
        	switch(extra_data_type){
				case "mask" : self.p.surfaces[current_surf_id].maskurl = data.result.files[0].url; break;
				case "optional image" : if( typeof self.p.surfaces[current_surf_id].optional_images == "undefined"){
											self.p.surfaces[current_surf_id].optional_images = {};
										};
										len = Object.keys( self.p.surfaces[current_surf_id].optional_images ).length
										self.p.surfaces[current_surf_id].optional_images["optional_img"+len] = { imgurl: data.result.files[0].url, thumburl: data.result.files[0].thumbnailUrl };
										break;

				case "graphic template image" : self.p.graphic_templates[graph_templ_path.surface_id][graph_templ_path.template_id].uri = data.result.files[0].url;
												self.p.graphic_templates[graph_templ_path.surface_id][graph_templ_path.template_id].thumburl = data.result.files[0].thumbnailUrl;
												break;

				case "demo layer image": self.p.graphic_templates[demo_layer_path.surface_id][demo_layer_path.template_id].demo_layer.url = data.result.files[0].url;
										 break;

				case "template preview image": self.p.graphic_templates[preview_thumb_path.surface_id][preview_thumb_path.template_id].preview_thumb.url = data.result.files[0].url;
										 break;

				case "product preview image": self.p.graphic_templates[product_preview_thumb_path.surface_id][product_preview_thumb_path.template_id].product_preview.url = data.result.files[0].url;
											console.log("NEW URL: ",data.result.files[0].url);
										 break;

				default : 	if(typeof self.p.surfaces[current_surf_id] != "undefined"){
								self.p.surfaces[current_surf_id].imgurl = data.result.files[0].url;
								self.p.surfaces[current_surf_id].thumburl = data.result.files[0].thumbnailUrl;
							} break;
			}

        	self.info( "File "+data.files[0].name+" successfully uploaded.", "upload-status-done"+fi);
        	fi++;
        },

        progress: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        // self.info()
	        self.info( "Uploading "+data.files[0].name+" "+progress+"%", "upload-status-progress"+fi)
	    },

	    // If all files (this.surface_data.length) have ben uploaded, saveProduct
		stop: function(e, data){
			self.settings.files_stack = [];
			saveProduct({ data: { product: self.p }});
		}

    })
}

//***********************************************************************************
//-----------------------------------------------------------------------------------
WorkDesk.prototype.refreshProductImg = function(){
	var p = this.settings.product;
		
	this.img.css({ width : p.surfaces[p.current_surface].print_w+"px" });
}

//-----------------------------------------------------------------------------------
// CREATE CELLS INSIDE THE GRID

WorkDesk.prototype.refreshNumCells = function(){
	var p = this.settings.product,
		grid = p.surfaces[ p.current_surface ].grid,
		c_storage = grid.cells;

	$(".cell").remove();
	this.splitCell({	celltosplit: this.layout_grid,
						cell_id : "",
						width: this.convert(grid.width, "to pix print"),
						height: this.convert(grid.height, "to pix print"),
						scale: this.p.scale,
						h_numcells: grid.numcells_w,
						v_numcells: grid.numcells_h		});

	for(celldata in c_storage){
		d = c_storage[ celldata ];

		if(d.splitcell){
			this.splitCell({	/*celltosplit: this.layout_grid,*/
								cell_id : celldata,
								width: d.w,
								height: d.h,
								scale: this.p.scale,
								h_numcells: d.h_numcells,
								v_numcells: d.v_numcells

			})
		}
	}

	// Refresh Boundaries
	this.refreshWorkDesk(p.current_surface);
}

//----------------------------------------------------------------------------------
// REDRAW GRID ON RESIZE, SCALE CHANGE, SIZE CHANGE

WorkDesk.prototype.redrawGrid = function(){
	var p = this.settings.product,
		grid = p.surfaces[ p.current_surface ].grid,
		c_storage = grid.cells,
		cell_w = 0, cell_h = 0,
		cell_x = 0, cell_y = 0,
		grid_w = this.convert(grid.width, "to pix print"),
		grid_h = this.convert(grid.height, "to pix print");

	// console.log(grid)

	for(celldata in c_storage){
		// console.log(cell_w+"\n"+cell_h)
		d = c_storage[ celldata ];

		grid.cells[celldata].x = cell_x = grid_w / d.x_ratio;
		grid.cells[celldata].y = cell_y = grid_h / d.y_ratio;
		grid.cells[celldata].w = cell_w = grid_w / d.w_ratio;
		grid.cells[celldata].h = cell_h = grid_h / d.h_ratio;

		cell_w *= p.scale/100;
		cell_h *= p.scale/100;
		cell_x *= p.scale/100; 
		cell_y *= p.scale/100;


		if(grid.cells[celldata].uploadable){
			$("#"+celldata).addClass("uploadable");

		}
		if(grid.cells[celldata].selected){
			$("#"+celldata).addClass("selected");
		}

		// console.log(grid_w / (grid_w / d.w_ratio))
		$("#"+celldata)
			.css({	width : cell_w+"px",
					height : cell_h+"px",
					top : cell_y+"px",
					left : cell_x+"px" })
	}
	// console.log("Redrawing")
}

//----------------------------------------------------------------------------------
WorkDesk.prototype.splitCell = function(cell_data){
	var scale = cell_data.scale/100,

		cell_w = (cell_data.width * scale) / cell_data.h_numcells,
		cell_h = (cell_data.height * scale) / cell_data.v_numcells,
	
		x0	   = 0,
		y0	   = 0,
		cell_x = x0,
		cell_y = y0,
		new_cell_id = "",
		// new_ids_array = [],
		p = this.settings.product,
		grid = p.surfaces[p.current_surface].grid,

		grid_w = this.convert(grid.width, "to pix print") * scale,
		grid_h = this.convert(grid.height, "to pix print") * scale,
		
		x_ratio = 1,
		y_ratio = 1;
	// Save number of cells inside the main cell
	if(typeof grid.cells[cell_data.cell_id]!= "undefined"){
		grid.cells[cell_data.cell_id].h_numcells = cell_data.h_numcells;
		grid.cells[cell_data.cell_id].v_numcells = cell_data.v_numcells;
	 	x0 = grid.cells[cell_data.cell_id].x * scale;
	 	y0 = grid.cells[cell_data.cell_id].y * scale;
	 	cell_x = x0;
	 	cell_y = y0;
	}

	for (var iy = 1; iy <= cell_data.v_numcells; iy+=1) {
		for (var ix = 1; ix <= cell_data.h_numcells; ix+=1 ) {
			
			new_cell_id = cell_data.cell_id+"h"+ix+"v"+iy;

			new_cell = $("<div>").addClass("cell has-hover").prop("id", new_cell_id )
								 .css({ width : cell_w+"px",
										height : cell_h+"px",
										top : cell_y+"px",
										left : cell_x+"px" })			
			
			this.layout_grid.append( new_cell );
			this.cellData({  cell: new_cell, id: new_cell_id,
							 // Measurements are in print resoulution
							 props: {	x: cell_x / scale,
							 			y: cell_y / scale,
							 			w: cell_w / scale,
							 			h: cell_h / scale,
							 			w_ratio: grid_w / cell_w,
							 			h_ratio: grid_h / cell_h,
							 			x_ratio: grid_w / cell_x,
							 			y_ratio: grid_h / cell_y  } 
						});

			new_cell.bind( "click", { product : p }, this.selectCell );

			cell_x += cell_w;

		};
		cell_y+= cell_h;
		cell_x = x0;
	}

	this.sessionStorageSaveProduct();
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.onOverDrawingZone = function(e){
	var self = e.data.self;
	
	$(".cell").unbind("click");
}

//-----------------------------------------------------------------------------------
// Triggered from cells-toolbar.js, function: ToolbarCells.prototype.draw_cellHandle 

WorkDesk.prototype.bindCellDrawingEvents = function(){
	// Grid Events ------------------------------------------------------------------
	this.layout_grid.unbind( "mouseover").bind( "mouseover", { self: this }, this.onOverDrawingZone )
					.unbind( "mousedown").bind( "mousedown", { self: this }, this.startCellDrawing )
					.unbind( "mouseup").bind( "mouseup", { self: this }, this.doneCellDrawing )
					.css("cursor", "crosshair");

	$(".cell").removeClass("has-hover");
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.removeOverDrawingZone = function(){
	this.layout_grid.unbind("mouseover")
					.unbind("mousedown")
					.unbind( "mouseup")
					.css("cursor", "auto");

	$(".cell").bind("click", { product: this.settings.product }, this.selectCell )
			  .addClass("has-hover");
}

//-----------------------------------------------------------------------------------

WorkDesk.prototype.startCellDrawing = function(e){
	var wd = e.data.self,
		parent_offset = wd.layout_grid.offset(),
		x0 = e.pageX - parent_offset.left,
		y0 = e.pageY - parent_offset.top;

	$cell_ghost = $("<div>").addClass("cell-ghost")
							.css({ top: y0+"px", left: x0+"px" })
							.appendTo(wd.layout_grid);

	wd.last_drawn_cell = $cell_ghost;

	// wd.last_cell_data = { x0: x0, y0: y0};
	wd.last_cell

	wd.layout_grid.bind("mousemove", function(em){
		var x1 = em.pageX - parent_offset.left,
			y1 = em.pageY - parent_offset.top;

		$cell_ghost.width(x1 - x0);
		$cell_ghost.height(y1 - y0);
	})

	// this - layout_grid
	// wd.layout_grid.bind("mouseup", { cell_data: {}, wd: wd }, this.drawCell )

}

//-----------------------------------------------------------------------------------

WorkDesk.prototype.doneCellDrawing = function(e){
	var wd = e.data.self;
		p = wd.settings.product,
		scale = p.scale/100,
		grid = p.surfaces[p.current_surface].grid,

		grid_w = wd.convert(grid.width, "to pix print") * scale,
		grid_h = wd.convert(grid.height, "to pix print") * scale,
		new_cell_id = "drawn-cell" + $(".cell").length,
		$new_cell = wd.last_drawn_cell;
	
	cell_coord = $new_cell.position();
	wd.layout_grid.unbind("mousemove");
	$new_cell.removeClass("cell-ghost").addClass("cell has-hover drawn").prop("id", new_cell_id );

	wd.cellData({  cell: $new_cell, id: new_cell_id,
							 // Measurements are in print resoulution
							 props: {	x: cell_coord.left / scale,
							 			y: cell_coord.top / scale,
							 			w: $new_cell.width() / scale,
							 			h: $new_cell.height() / scale,
							 			w_ratio: grid_w / $new_cell.width(),
							 			h_ratio: grid_h / $new_cell.height(),
							 			x_ratio: grid_w / cell_coord.left,
							 			y_ratio: grid_h / cell_coord.top  }});

	$new_cell.css("position", "absolute");

	$new_cell.click( { product : p }, wd.selectCell )
			 .draggable({
						containment: wd.layout_grid,
						scroll: false,
						cursor: "move",
						create: function(){},
						drag: function(e, ui){},
			
						stop: function(e, ui){
								var c_id = $(this).prop("id");

								grid.cells[c_id].x = ui.position.left / scale,
								grid.cells[c_id].y = ui.position.top / scale,
								grid.cells[c_id].x_ratio = grid_w / ui.position.left,
								grid.cells[c_id].y_ratio = grid_h / ui.position.top;
						}

					})
			 .resizable({ handles: "all",
			 			  containment: wd.layout_grid,
						  stop : function(event, ui){
						  			var c_id = $(this).prop("id");
						  			console.log(c_id)
						  			grid.cells[c_id].w = ui.size.width / scale; 
						  			grid.cells[c_id].h = ui.size.height / scale;
						  			grid.cells[c_id].w_ratio = grid_w / ui.size.width;
						  			grid.cells[c_id].h_ratio = grid_h / ui.size.height;
						  			grid.cells[c_id].x = ui.position.left / scale,
									grid.cells[c_id].y = ui.position.top / scale,
									grid.cells[c_id].x_ratio = grid_w / ui.position.left,
									grid.cells[c_id].y_ratio = grid_h / ui.position.top;
						  } 
						});

	wd.sessionStorageSaveProduct();
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.cellData = function(cell_data){
	var p = this.settings.product,
		grid = p.surfaces[p.current_surface].grid,
		c_data = {};

	$.extend( c_data, cell_data );

	c_data.cell.data("id", c_data.id);		
	
	//Check if object to store cell data exists
	if(typeof grid.cells[c_data.id] == "undefined"){
		// Create new object to store cell data.
		grid.cells[c_data.id]= {};
	}
	// Add data to the cell object
	for(prop in c_data.props){
		grid.cells[c_data.id][prop] = c_data.props[prop];
	}
	// console.log(grid.cells[c_data.id]);
}
//-----------------------------------------------------------------------------------
WorkDesk.prototype.selectCell = function(e){
	/*var p = e.data.product,
		grid = p.surfaces[p.current_surface].grid;*/
	$(this).toggleClass("selected");
	//grid.cells[ $(this).data("id") ].state = { selected : true };
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.removeUnusedCells = function(){
	var grid = this.settings.product.surfaces[this.settings.product.current_surface].grid,
		cellsonstage = [];

	$(".cell, .splitcell").each(function(){
		cellsonstage.push($(this).prop("id"));
	})
	// REMOVE UNUSED CELLS FROM CELLS DATA STORAGE
	for(cell_obj in grid.cells){
		if( cellsonstage.indexOf(cell_obj) < 0){
			delete grid.cells[cell_obj];
		}
	}
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.emptyClick = function(e){
	$(".cell.selected").removeClass("selected");
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.refreshWorkDesk = function(surface){
	var p = this.settings.product,
		img_width = p.surfaces[surface].img_width,
		img_height = p.surfaces[surface].img_height,
		scale = p.scale/100;
		pixmode = this.settings.resolution_mode;

		product_img_width = this.convert(img_width * scale, "to pix "+pixmode);
		product_img_height = this.convert(img_height * scale, "to pix "+pixmode);
		surface_width = this.convert(p.surfaces[surface].width * scale, "to pix "+pixmode);
		surface_height = this.convert(p.surfaces[surface].height * scale, "to pix "+pixmode);
		grid_width = this.convert(p.surfaces[surface].grid.width * scale, "to pix "+pixmode);
		grid_height = this.convert(p.surfaces[surface].grid.height * scale, "to pix "+pixmode);

		if( typeof p.surfaces[surface].surfacemask !== "undefined" ){
			mask_width = p.surfaces[surface].surfacemask.width;
			mask_height = p.surfaces[surface].surfacemask.height;
		}

		p.surfaces[surface].print_w = this.convert(img_width * scale, "to pix print");
		p.surfaces[surface].print_h = this.convert(img_height * scale, "to pix print");
		p.surfaces[surface].screen_w = this.convert(img_width * scale, "to pix screen");
		p.surfaces[surface].screen_h = this.convert(img_height * scale, "to pix screen");

	this.product_image_bounds.css(this.imgCSS(product_img_width, product_img_height));
	this.surf_bounds.css(this.surfCSS(surface_width, surface_height));
	this.layout_grid.css(this.gridCSS(grid_width, grid_height));
	this.texts_layer.css(this.gridCSS(grid_width, grid_height));
	this.demo_layer.css(this.gridCSS(grid_width, grid_height));

	if(typeof this.graphic_layer_img !== "undefined"){
		this.graphic_layer_img.width(this.surf_bounds.width()).height(this.surf_bounds.height());
	}

	if(typeof this.product_mask_bounds !== "undefined" && typeof p.surfaces[surface].surfacemask !== "undefined"){
		this.product_mask_bounds.css(this.surfaceMaskCSS( mask_width, mask_height ));
		this.product_mask_bounds.find("img").width( mask_width )
											.height( mask_height );
	}

	if(typeof this.demo_layer_img !== "undefined"){

		// this.demo_layer.css(this.surfaceMaskCSS( mask_width, mask_height ));
		this.demo_layer.find("img").width( this.demo_layer.width() )
									.height( this.demo_layer.height() );
	}

	if(typeof this.img != "undefined"){ this.refreshProductImg(); }

	this.redrawGrid();
	this.sessionStorageSaveProduct();
	/*
	this.layout_grid.css(this.cssSize(grid_width, grid_height));*/
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.adjustGridSizeToProportion = function(surface, dimension){
	var p = this.settings.product,
		surf_width = p.surfaces[surface].width,
		surf_height = p.surfaces[surface].height,
		
		proportion 	= p.surfaces[surface].grid.proportion,
		ratio	= false,
		greatest_side = 0,

		// Function calculates ratio of product's surface sides
		// and chage grid size accordingly
		setSize2Ratio = function(swidth, sheight){
			var greatestval = 0;
			ratio = typeof arguments[2] !== "undefined" ? arguments[2] : swidth/sheight;

			switch(dimension){
				case "width" : p.surfaces[surface].grid.width = p.surfaces[surface].grid.height * ratio; break;
				case "height": p.surfaces[surface].grid.height = p.surfaces[surface].grid.width / ratio; break;

				default		 : greatestval = Math.max(p.surfaces[surface].grid.height, p.surfaces[surface].grid.width);
								if(greatestval === p.surfaces[surface].grid.height){
									
									p.surfaces[surface].grid.width = p.surfaces[surface].grid.height * ratio;
								} else {
									p.surfaces[surface].grid.height = p.surfaces[surface].grid.width / ratio;
								}
								 break;
			}			
			p.surfaces[surface].ratio = ratio;
		};
		
		if(arguments[2] === "invert dimension"){
			switch(dimension){
				case "width" : dimension = "height"; break;
				case "height": dimension = "width"; break;
			}
		}
		switch(proportion){
			case "proportional" : setSize2Ratio(surf_width, surf_height); break;
			case "square" : setSize2Ratio(surf_width, surf_height, 1); break;
			case "custom" : ratio = false; break;
		}
	this.refreshWorkDesk(surface);
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.imgCSS = function(width, height){
	var parent_w = $(this.product_image_bounds.parent()).width(),
		parent_h = $(this.product_image_bounds.parent()).height(),
		center = { x : parent_w/2, y : parent_h/2 },
		pos_l = center.x - width/2,
		pos_t = center.y - height/2;
		$("workdesk-info").html(pos_l+" - "+pos_t)
	return { width  : width+"px", 
		 	 height : height+"px",
		 	 left 	: pos_l+"px",
		 	 top 	: pos_t+"px"	}
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.surfaceMaskCSS = function(width, height){
	var p = this.settings.product,
		pos = this.centeredElmCoord( { obj : this.product_mask_bounds,
									   width : width,
									   height : height,
									   data_store : p.surfaces[p.current_surface].surfacemask });

	return { width  : width+"px", 
		 	 height : height+"px",
		 	 left 	: pos.left+"px",
		 	 top 	: pos.top+"px"	}
}
//-----------------------------------------------------------------------------------
WorkDesk.prototype.surfCSS = function(width, height){
	var p = this.settings.product,
		pos = this.centeredElmCoord( { obj : this.surf_bounds,
									   width : width,
									   height : height,
									   data_store : p.surfaces[p.current_surface] });

	return { width  : width+"px", 
		 	 height : height+"px",
		 	 left 	: pos.left+"px",
		 	 top 	: pos.top+"px"	}
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.gridCSS = function(width, height){
	var p = this.settings.product,
		pos = this.centeredElmCoord( { obj : this.layout_grid,
									   width : width,
									   height : height,
									   data_store : p.surfaces[p.current_surface].grid });

	return { width  : width+"px", 
		 	 height : height+"px",
		 	 left 	: pos_l+"px",
		 	 top 	: pos_t+"px"	}
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.centeredElmCoord = function(element){
	
	var p = this.settings.product;
	
	if($("#center-bounds:checked").length > 0){
		parent_w = $(element.obj.parent()).width(),
		parent_h = $(element.obj.parent()).height(),
		center = { x : parent_w/2, y : parent_h/2 },
		pos_l = center.x - element.width/2,
		pos_t = center.y - element.height/2;

		element.data_store.x = (parent_w - element.width) / 2;
		element.data_store.y = (parent_h - element.height) / 2;
	} else {
		pos_l = element.data_store.x;
		pos_t = element.data_store.y;
	}

	return { top : pos_t, left : pos_l };
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.dumpProduct = function(){
	var jsonstr = JSON.stringify(this.settings.product),
		jsonobj = JSON.parse(jsonstr);
	console.log( jsonstr );
	console.log( jsonobj );
	console.log(this.settings.product);
}

//-----------------------------------------------------------------------------------
WorkDesk.prototype.convert = function(val, toval){
	var mmppix_print = 25.4/300,
		pixpmm_print = 300/25.4,
		mmppix_screen = 25.4/72,
		pixpmm_screen = 72/25.4,
		result = null;

	switch(toval){
		case "to pix print" : result = val*pixpmm_print; break;
		case "to mm print" : result = val*mmppix_print; break;
		case "to pix screen" : result = val*pixpmm_screen; break;
		case "to mm screen" : result = val*mmppix_screen; break;
	}
	return Math.round(result);
}

//----------------------------------------------------------------------------------
WorkDesk.prototype.info = function(info, liclass){
	$("."+liclass, "#workdesk-info").length >0  ? $("."+liclass).html(info)
							 					: $("<li>").addClass(liclass).html(info).appendTo("#workdesk-info");
		
}







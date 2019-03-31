

function MainMenuBar(settings){
	var self = this;
	this.settings = { };
	
	$("body").click(function(e) {
      if($(e.target).prop("class") != 'main-toolbar-butt' && $(e.target).prop("class") != 'main-toolbar-butt active'){
      	// alert($(e.target).prop("class"));
         self.closeMenu();
      }      
    });
	$.extend(this.settings, settings);

	$(".main-toolbar-butt").click(this.openMenu).children().click(function(e){ e.stopPropagation() });
	$(".popupmenu li").click(function(){ $(".main-toolbar-butt").blur() });
	$(".main-toolbar-butt").blur(this.closeMenu);
	// BUTTONS EVENTS------------------------------------------------------------------------------------------

	$("#save-template-butt").click( { p: this.settings.product, 
									  self: self,
									  templates_obj: "templates",
									  preview_container:"#layouts-preview-window" }, 
									  this.saveTemplate );

	$("#save-graphic-template-butt").click( { p: this.settings.product,
											  self: self,
											  templates_obj: "graphic_templates",
											  preview_container: "#graphic-templates-preview-window",
											  add_opt_template_data: this.settings.workdesk.graphic_template_data },
											  this.saveGraphicTemplate);

	$("#new-template-butt").click( { p: this.settings.product, self: this }, this.resetGrid);
	$("#surface-option-view").click( { workdesk: this.settings.workdesk, handler_function: "optional surface view" }, this.settings.workdesk.addOptionalImageToSurface );
	$("#add-graphic-layer").click( { workdesk: this.settings.workdesk, handler_function: "graphic layer" }, this.settings.workdesk.addOptionalImageToSurface );
	
}

//*************************************************************************************************************
// BUTTONS EVENT HANDLERS

//----------------------------------------------------------------------------------------
// 

MainMenuBar.prototype.saveTemplate = function(e){
	var p = e.data.p,
		templates_obj = e.data.templates_obj, // [templates_obj] = templates, graphic_templates
		num_templates = 0
		current_temlate_obj = {};

	if(typeof p[templates_obj] == "undefined"){
		p[templates_obj] = {};
		p[templates_obj][p.current_surface] = {};
	} else {
		if(typeof p[templates_obj][p.current_surface] =="undefined"){
			p[templates_obj][p.current_surface] = {};
		}
		num_templates = Object.keys( p[templates_obj][p.current_surface] ).length+1;
	}

	current_temlate_obj = (typeof e.data.add_opt_template_data !== "undefined") ? e.data.add_opt_template_data : {};
	p[templates_obj][p.current_surface]["template"+num_templates] = $.extend( true, {}, p.surfaces[p.current_surface].grid);
	$.extend( p[templates_obj][p.current_surface]["template"+num_templates], current_temlate_obj );
	// Save temlate path to save image url in it after image is uploadad
	if( typeof e.data.add_opt_template_data !== "undefined" && typeof e.data.add_opt_template_data.file !== "undefined"){
		e.data.add_opt_template_data.file.graphic_layer_image = { surface_id: p.current_surface, template_id: "template"+num_templates };
	}

	// e.data.self.settings.workdesk.sessionStorageSaveProduct();

	e.data.self.previewTemplates(p, e.data);
}

//---------------------------------------------------------------------------------
// 

MainMenuBar.prototype.saveGraphicTemplate = function(e) {
	var p = e.data.p;

	e.data.self.saveTemplate({ data: e.data });
	e.data.add_opt_template_data.file.surface_id = p.current_surface;
    // e.data.add_opt_template_data.file.graphic_layer_image = true;
	e.data.self.settings.workdesk.settings.files_stack.push( e.data.add_opt_template_data.file );
};

//---------------------------------------------------------------------------------
// 

MainMenuBar.prototype.resetGrid = function(e){
	var p = e.data.p;
	p.surfaces[p.current_surface].grid.cells = {};
	p.surfaces[p.current_surface].grid.numcells_w = 1;
	p.surfaces[p.current_surface].grid.numcells_h = 1;
	e.data.self.settings.workdesk.refreshNumCells();
	updateSpinners(p, p.current_surface);
}

//----------------------------------------------------------------------------------------
// 
MainMenuBar.prototype.previewTemplates = function(p, settings){
	var ts = p[settings.templates_obj][p.current_surface],
		max_size = 210, // The size of the greatest side of the template's thumbnail
		ratio = 1, // Width to Height
		gr_w, // Original grid width
		gr_h, // Original grid height
		t_w,  // calculated template thumbnail width
		t_h,  // calculated template thumbnail height
		w_scale,
		h_scale,
		side_id = p.current_surface,
		self = this,

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

	// Clear Window befor filling it with new templates
	$(".inner-window",settings.preview_container).find("*").remove();

	// Loop through templates
	for(t in ts){ 
		gr_w = this.settings.workdesk.convert( ts[t].width, "to pix print" );
		gr_h = this.settings.workdesk.convert( ts[t].height, "to pix print" );
		ratio =  gr_w / gr_h;
		
		// Determin the greatest side
		if(gr_w > gr_h){
			t_w = max_size;
			t_h = t_w / ratio;

		} else {
			t_h = max_size;
			t_w = t_h * ratio;
		}

		w_scale = gr_w / t_w;
		h_scale = gr_h / t_h;

		grid_css = { width: t_w+"px",
					 height: t_h+"px"  };

		$thumbnail = $("<div>").addClass("template-prewiew-thumb").toggleClass(t).prop("data-templ_id", t).css( grid_css );
		cell_css = {};

		for(c in ts[t].cells ){
			if(typeof ts[t].cells[c].uploadable != "undefined" &&  ts[t].cells[c].uploadable == true){
				c_w = ts[t].cells[c].w / w_scale;
				c_h = ts[t].cells[c].h / h_scale;
				c_x = ts[t].cells[c].x / w_scale;
				c_y = ts[t].cells[c].y / h_scale;

				cell_css = { width:  c_w+"px",
							 height: c_h+"px",
							 top: 	 c_y+"px",
							 left: 	 c_x+"px"  };

				if(typeof ts[t].cells[c].rotation != "undefined"){
					
					$.extend(cell_css, { "-ms-transform-origin": "50% 50%",
										 "-webkit-transform-origin": "50% 50%",
										 "transform-origin": "50% 50%",
										 "-ms-transform": "rotate("+ts[t].cells[c].rotation+"deg)",
										 "-webkit-transform": "rotate("+ts[t].cells[c].rotation+"deg)",
										 "transform": "rotate("+ts[t].cells[c].rotation+"deg)"} );
				}
				
				$("<div>").addClass("preview-cell").css( cell_css ).appendTo( $thumbnail );
			}
		}


		if(typeof ts[t].thumburl !== "undefined"){
			$img = $("<img>").prop("src", ts[t].thumburl).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
		} else{
			if(typeof ts[t].uri !== "undefined"){
				$img = $("<img>").prop("src", ts[t].uri).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
			}
		}

		if(typeof ts[t].preview_thumb !== "undefined" && typeof ts[t].preview_thumb.url != "undefined" ){
			$img = $("<img>").prop("src", ts[t].preview_thumb.url).addClass("grTempl-preview-thumb-img").appendTo($thumbnail);
		}

		if(typeof ts[t].product_preview !== "undefined" && typeof ts[t].product_preview.url != "undefined" ){
			$img = $("<img>").prop("src", ts[t].product_preview.url).addClass("product-preview-thumb-img").appendTo($thumbnail);
		}

		$("<button>").addClass("delete-template-butt").text("x").appendTo($thumbnail);

		$("<input class='template_id_input' type='text' value='"+t+"' >").appendTo($thumbnail)
			.bind("change", { p: this.settings.product, self: this, settings: settings }, changeTemplateID);

		
		template_name = (typeof ts[t].template_name!= "undefined") ? ts[t].template_name : "";

		$("<input class='template_name_input' type='text' value='"+template_name+"' >").appendTo($thumbnail)
				.bind("change", { p: this.settings.product, self: this, settings: settings }, changeTemplateName);	
		

		$(".inner-window", settings.preview_container).append( $thumbnail );
		$thumbnail.click(function(){
			var t_id = $(this).prop("data-templ_id")
			p[settings.templates_obj].default_template = t_id;
			$(".template-prewiew-thumb").removeClass("active");
			$(this).addClass("active");

			console.log(p[settings.templates_obj][p.current_surface])
			self.settings.workdesk.renderGraphicLayer(p[settings.templates_obj][p.current_surface][t_id].uri);

			if(settings.templates_obj == "graphic_templates"){
				renderTextLayer(p);
			} else {
				$("#texts-layer").empty();
			}
		})
	}
	//p.graphic_templates
	$(".template-prewiew-thumb button.delete-template-butt").click({ p: this.settings.product, self: this, settings: settings }, this.deleteTemplate);
}

//----------------------------------------------------------------------------------------
// 

MainMenuBar.prototype.deleteTemplate = function(e){
	var p = e.data.p,
		self = e.data.self,
		templ_id = $(this).parent().prop("data-templ_id");
	delete p[e.data.settings.templates_obj][p.current_surface][templ_id];

	self.settings.workdesk.sessionStorageSaveProduct();
	self.previewTemplates(p, e.data.settings);
}

//----------------------------------------------------------------------------------------
// 

MainMenuBar.prototype.openMenu = function(e){
		$(".main-toolbar-butt").removeClass("active");
		$(this).addClass("active");
		$(".popupmenu").css("visibility", "hidden")
		$("."+$(this).data("menu")+".popupmenu").css("visibility", "visible");
}

//----------------------------------------------------------------------------------------
// 

MainMenuBar.prototype.closeMenu = function(){
	$(".popupmenu").css("visibility", "hidden");	
}








// ------ ON DOCUMENT READY ----------------------------------------------------------------
$(document)
.bind("pagebeforechange", function( event, ui ){
    	event.preventDefault(); // PREVENT JQUERY MOBILE FROM PAGE RELOAD
    })
// .click(function(e){ alert( $("<div>").append($(e.target).clone()).html() ) })
.ready(function(e){
	$(window).resize(function(){
		responsiveSetup();
		if(typeof product.graphic_templates!= "undefined"){
			updateTextsSizeData(product);	
		}
	})



	window.utils = new MPixelsUtils();
	window.cell_setup = {};
	product = { layout_data: {}, canvas_data: {} };
	window.userfiles = new FilesHandler( { preview_container: $(".socnet-thumbs-container:visible"), p: product } );
	window.ownster_scroll_bar = new OwnsterScrollBar({ scroll_container: "#lyouts-page-wrapp",
										scrolled_page: ".page",
										scrollbar_settings: { params: {class: "scroll-bar"}},
										scroll_bar_slider: { params: { class: "scroll-bar-slider" }}
									});
	var
	updateTextsSizeData = function(p) {

		var act_templ_id = p.graphic_templates.default_template,
			fsize_ratio_to_textslayer = 0,
			txtlayer_w = $("#texts-layer").width(),
			s = p.default_surface;

		if(typeof p.surfaces[s].premade_text_stack!= "undefined"){
			for(var txt in p.surfaces[s].premade_text_stack){
				$(".premade-text."+txt).css({ "font-size": (txtlayer_w / p.surfaces[s].premade_text_stack[txt].fsize_ratio_to_textslayer)+"px"});
			}
		}
	}

	ownster_scroll_bar.makeScrollBar();

	loadProduct( product );
	// Files Selected event
	$("#user-files-inp").change( function(e){
		userfiles.handleFiles(this.files[0]);
	})

	userfiles.onImageReady = function(dataURL, file_id){
		loadImage2Cell( { image_source: dataURL, p: product, file_id: file_id } );
	}
	// Image thumbnails ready event
	userfiles.onFilesReady = function(){
		switchStep("edit pictures", product);
		// makeThumbsDraggable(".img_preview_container");
	};
	
	// Facebook button
	$(".upload-method-butt.fb-upload").click( function(){ switchStep("facebook page"); } );

	// Instagram
	// $(".upload-method-butt.insta-upload").click({p: product}, instagramHandler );

	$(".layout-butt").click(function(){ 
		switchStep("layout page", product);  
	});
	
	$(".styles-butt").click(function(){ 
		switchStep("styles page", product);
	});

	$(".texts-tab").bind("click", function(){ 
		switchStep("add texts", product);
	});

	$(".upload-tab").click(function(){ 
		switchStep("edit pictures", product);  
	});
	
	$(".cancel-button").click( { direction: "cancel", p: product }, changeStep);

	$(".back-button").click( { direction: "back", p: product }, changeStep);
	
	$(".next-button").click( { direction: "next", p: product }, changeStep);
	
	$(".cancel-close-butt").click(function(){
		$(".popup-window").removeClass("fadein").css({ display: "none" });					
	});

	$("#upload-butt").click(function(){
		switchMenu("upload", product);
	});

	$(".rotate-butt").click(function(){
		switchMenu("rotate", product);
	});
			
	$(".move-butt").click(function(){
		switchMenu("move", product);
	});
			
	$(".zoom-butt").click(function(){
		switchMenu("zoom", product);
	});

	$(".text-butt").click(function(){
		switchMenu("text", product);
	});

	$(".sides-switch-butt").click(switchSide);

	$(".logo-wrapper").click(function(){ window.location = "/"; })

	if(!window.Blob){
		alert("You are using an outdated browser, which doesn't support some of the technologies used in our website. Please upgrade to the latest version for the best Ownster experience.")
	}

	// switchStep("edit pictures", product);
	// switchMenu("text");
	
	
	if(typeof product.product_data.prelode_template_id!= "undefined"){
		if(isMobile()){
			loadGoogleFonts(function(){ switchStep("select layout", product); });
		} else {
			loadGoogleFonts(function(){ switchStep("styles page", product); });
		}
	} else {
		
		loadGoogleFonts(function(){});

		if( $("#mobile-style-detector:visible").length > 0 ){
			switchStep("select layout", product);
		} else {
			switchStep("layout page", product);
		}
	}
	

	responsiveSetup();
	// switchStep("upload photos", product);
	// switchStep("save product", product);
	// switchMenu("first upload menu");

	// addTextFunctionsInit(product);
});

/*
------------------------------------------------------------------------------------*/
function toggleActiveTab(id){
	$(".active-tab").removeClass("active-tab");
	$(id).closest("td").addClass("active-tab");
}

/* Change Current Step
------------------------------------------------------------------------------------ */

function changeStep(e){
	var direction = e.data.direction,
		c_step = $(".back-next-butt-wrapper").data( "current_step" ),
		prev_step = $(".back-next-butt-wrapper").data( "previous_step");
		p = e.data.p,
		this_butt = this;

	// console.log("Change To:",$(".back-next-butt-wrapper").data( "current_step" ))
	
	switch(direction){
		case "back":

			switch(c_step){
				case "select layout": window.location = "/personalised-gifts/"; 
				break;

				case "layout page": if( $("#mobile-style-detector:visible").length > 0 ){
										switchStep("select layout", p);										
									} else {
										window.location = "/personalised-gifts/";
									}
				break;

				case "styles page": if( $("#mobile-style-detector:visible").length > 0 ){
										switchStep("select layout", p);										
									} else {
										window.location = "/personalised-gifts/";
									}
				break;

				case "upload photos": 	switchStep(prev_step, p);
										// console.log("Back here");
										break;
										// switchStep("layout page", p); 
										// changeProductLayout({ data: { p : product, templates_obj: "templates" } }, product.current_template); 
				break;
				case "edit pictures": switchStep(prev_step, p); break;
				// case "socnet page": switchStep("edit pictures", p); break;
				case "select color insert or save": switchStep("edit pictures", p); break;

				case "presave preview": 
					if($(".options-container").data("side_name") !== undefined){
						switchStep("select color insert or save", p); 
					} else {
						switchStep("edit pictures", p); 
					}
				break;

				case "add texts": switchStep("layout page"); break;

				case "edit premade text": switchStep("styles page", p); break;
			}
		break;
		
		case "next":

			recordStepsMap(c_step);
			switch(c_step){
				case "select layout": 
					if($(".back-next-butt-wrapper").data( "layout_selected" ) == "selected"){ 
						switchStep("upload photos", p);
					}
				break;
				
				case "styles page": 
					if($(".back-next-butt-wrapper").data( "graphic_selected" ) == "selected"){ 
						switchStep("upload photos", p);
					}
				break;

				case "layout page": switchStep("upload photos", p);
				break;

				case "edit pictures": 
					
					if(isMobile() && 
						typeof p.surfaces[p.default_surface].grid.text_stack != "undefined" &&
						$(".text-input-box").length > $(".filled-input").length ){
						
						switchStep("edit premade text", p);
						
					} else {
						if($(".image-filled").length == Object.keys(p.layout_data[ p.default_surface ].cells).length){
							switchStep("select color insert or save", p); 
						} else {
							$(".popup-window.empty-cells").css({ display: "block" })
								  .addClass("fadein");
							$("#proceed-butt").unbind("click").bind("click", function(){
								switchStep("select color insert or save", p);
								$(".popup-window.empty-cells").removeClass("fadeout").css({ display: "none" });
							})
						}
					}

				break;

				case "add texts":
					// console.log("Cells", p.layout_data[ p.default_surface ].cells)
					if($(".image-filled").length == Object.keys(p.layout_data[ p.default_surface ].cells).length){
						switchStep("select color insert or save", p); 
					} else {
						$(".popup-window.empty-cells").css({ display: "block" })
							  .addClass("fadein");
						$("#proceed-butt").unbind("click").bind("click", function(){
							switchStep("select color insert or save", p);
							$(".popup-window.empty-cells").removeClass("fadeout").css({ display: "none" });
						})
					}
				break;

				case "edit premade text":
					// console.log("Cells", p.layout_data[ p.default_surface ].cells)
					if($(".image-filled").length == Object.keys(p.layout_data[ p.default_surface ].cells).length){
						switchStep("select color insert or save", p); 
					} else {
						$(".popup-window.empty-cells").css({ display: "block" })
							  .addClass("fadein");
						$("#proceed-butt").unbind("click").bind("click", function(){
							switchStep("select color insert or save", p);
							$(".popup-window.empty-cells").removeClass("fadeout").css({ display: "none" });
						})
					}
				break;

				case "select color insert or save": 

					if($("img",".options-container").length > 0){
						if($(".options-container").data("isset") == true){
							switchStep("presave preview", p);	
						} else {
							$(".popup-window.color-inset").css({ display: "block" }).addClass("fadein");
						}
					} else {
						switchStep("save product", p);
					}

				break;
					
				case "presave preview":
					switchStep("save product", p);
				break;
				case "save product":
					switchStep("save product", p);
				break;
			}
		break;

		case "cancel":
			switch($(this_butt).data( "current_step" )) {
				case "select layout-templates": 
					switchStep("select layout", p);
					if($(".back-next-butt-wrapper").data( "layout_selected" ) == "selected"){ 
						$(".user-focus").hide();
					}
				break;
				case "select graphic-templates": 
					switchStep("select layout", p);
					if($(".back-next-butt-wrapper").data( "layout_selected" ) == "selected"){ 
						$(".user-focus").hide();
					}
				break;
				case "upload page":
					switchStep("edit pictures", p);
				break;

				case "socnet page":
					
					if( $(".selected_cell").hasClass("image-filled") ){
						switchStep("edit pictures", p);
					} else {
						switchStep("edit pictures", p);
						switchMenu("first upload menu");
					}
					// switchStep("edit pictures", p);

				break;
			}
		break;

	}
}

/* switchStep Function
------------------------------------------------------------------------------------ */
function switchStep(step, p){
	var content_class = isMobile() ? ".mobile-content":
									 ".web-content";

	$(".toolset").css("display", "none");
	$(".subset").css("display", "none");
	$(".page").css("visibility", "hidden");
	$(".user-message").hide();
	$(".user-focus").hide();
	$(".scroll-bar").hide();
	$("#lyouts-page-wrapp").hide();
	$(".tabs-wrapper").hide();
	

	recordStepsMap(step);
	// alert(step)
	switch(step){
		case "select layout":
			// Show user message
			if(typeof product.product_data.prelode_template_id!= "undefined"){
				changeProductLayout({ data: { p : product, templates_obj: "graphic_templates" } }, product.product_data.prelode_template_id);
			} else {
				$(".user-message").show().find("p")
					.text("PLEASE SELECT YOUR LAYOUT")// .text("PLEASE SELECT YOUR LAYOUT OR GRAPHIC STYLE")
					.end()
					.find("h2")
					.text("PLEASE SELECT YOUR LAYOUT");// .text("PLEASE SELECT YOUR LAYOUT OR GRAPHIC STYLE");

				// $(".select-layout-butt-wrapper").css("display", "block");
				$(".click-cell-tips ").css("display", "none");

				
			}

			$(".cell").unbind("click");
			$(".cell").removeClass("selected_cell");
			$(".cell-helper").removeClass("selected_cell_helper");
			$(".toolset.product-title").css("display", "table-row");
			// $("#texts-layer").hide();
			

			if(isMobile()){
				if(typeof product.product_data.prelode_template_id == "undefined"){
					$(".user-focus").show();
					$("#bottom-panel").show();
				} else {
					$(".user-message").show().find("h2").text("Click NEXT to continue").toggleClass("blink").end()
									.find("p").text("Click NEXT to continue").toggleClass("blink");
					$(".user-focus").hide();
				}
				// change Menue to layout
				$(".toolset.layout").css("display", "table-row");

				if($(".back-next-butt-wrapper").data( "layout_selected") == "selected"
					|| $(".back-next-butt-wrapper").data( "graphic_selected") == "selected"){

					$(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
					$(".cell-helper").removeClass("seek-n-hide");
				}
			}

		break;
		/* Layouts fullscreen page ----------------*/
		case "layout page":
			// $(".cell").unbind("click").bind("click", function(e){ alert("A"); })
			$(".cell").unbind("click");
			$(".cell").removeClass("selected_cell");
			$(".cell-helper").removeClass("selected_cell_helper");
			$(".layout-templates").css("visibility", "visible");
			$(".toolset.product-title").css("display", "table-row");

			showPageWithTabs(".layout-butt");
			toggleScrollBar(".layout-templates:visible");

			if(!isMobile()){
				$(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
				$(".cell-helper").removeClass("seek-n-hide");
			}
		break;
		/* ---------- Graphics fullscreen page ----------------*/
		case "styles page":
			$(".cell").unbind("click");
			$(".cell").removeClass("selected_cell");
			$(".cell-helper").removeClass("selected_cell_helper");
			$(".toolset.product-title").css("display", "table-row");
			
			if(typeof product.product_data.prelode_template_id!= "undefined"){

				changeProductLayout({ data: { p : product, templates_obj: "graphic_templates" } }, product.product_data.prelode_template_id);
			}
			
			if(!isMobile()){
				$(".graphic-templates").css("visibility", "visible");
				showPageWithTabs(".styles-butt");
				toggleScrollBar(".graphic-templates:visible");
				$(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
			} else {
				$(".graphic-templates").css("visibility", "visible");
				$(".cell").unbind("click").bind("click", selectCell);
				// $(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
			}

			
		break;
		
		/* ----------- Offer to upload photos  ----------------*/
		case "upload photos":
			// $("#lyouts-page-wrapp").show();
			// $(".cell").unbind("click").bind("click", selectCell);

			$(".user-message").show().find("p")
				.text("Click an empty cell to upload your photo.")
				.end()
				.find("h2")
				.text("Click an empty cell to upload your photo.")
				.removeClass("blink")
				.css("margin-top", "40%");
			
			$(".cell-upload-hint").css("display", "block");
			$(".back-next-butt-wrapper.web").find(".arrow-right").css("display", "none");
			$(".back-next-butt-wrapper.web").find(".next-button").removeClass("blink");

			$(".select-layout-butt-wrapper").css("display", "none");
			$(".click-cell-tips ").css("display", "block");
			
			$(".toolset.product-title").css("display", "table-row");
			
			if(isMobile()){
				$(".user-focus").show();
				$(".cell").unbind("click").bind("click", selectCell);
				/*$(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
				$(".cell-helper").removeClass("seek-n-hide");*/
			}

			$("#transparent-popup-back").css("z-index", "0");

			if($(".image-filled").length > 0){
				switchStep("edit pictures");
			} else {
				$("#bottom-panel").hide();
			}

		break;

		case "facebook page": 
			$("#lyouts-page-wrapp").show().css("top", "65px");
			$(".user-files-preview-wrapper").css("visibility", "visible")
															  .find(".socnet-thumbs-container").find("*").remove();
			facebookHandler();

		break;

		case "edit pictures":
			$(".cell").unbind("click");
			$(".cell").bind("click", selectCell);
			$(".back-next-butt-wrapper.web").find(".arrow-right").css("display", "none");
			$(".back-next-butt-wrapper.web").find(".next-button").removeClass("blink");
			// $(".cell-upload-hint").css("display", "block");
			$(".next-button").text("Next →");
			$("#grid-helper-frame").show();
			$("#texts-layer").show();

			if($(".selected_cell").length == 0){
				selectCell.call($(".cell").first());
				// $(".toolset").css("display", "none");
			}
			
			if($(".selected_cell").hasClass("image-filled")){
				$(".toolset.workdesk").css("display", "table-row");
			}

			if(isMobile()){
				$(".upload-page-wrapper").css("visibility", "hidden");
				$("#bottom-panel").show();
				$("#grid-helper-frame").show();
				$(".next-button").text("Next →");	

				if( $("#bottom-panel").data("current_subset") == null ){
					$(".toolset.workdesk").css("display", "table-row");
				} else {
					var c_subset = $("#bottom-panel").data("current_subset");
					$(".subset."+c_subset).css("display", "table-row");
				}

			} else {
				showPageWithTabs(".upload-tab");
				$(".upload-page-wrapper").css("visibility", "visible");
				// $(".toolset.workdesk").css("display", "table-row");
				$("#bottom-panel").hide();
				toggleScrollBar(".upload-page-wrapper:visible");
			}
			
			$(".color-inset-preview-img").remove();		

		break;

		case "add texts":
			showPageWithTabs(".texts-tab");
			$("#font-atributes-wrapper-web").css("display", "block");
			$(".add-new-text-butt").css("display", "block");

			$(".text-tools-wrapper").css("visibility", "visible");
			addTextFunctionsInit(p);
			toggleScrollBar(".text-tools-wrapper:visible");
		break;

		case "edit premade text":

			if(!isMobile()){
				
				showPageWithTabs(".texts-tab");
				$(".text-tools-wrapper").css("visibility", "visible");
				$("#font-atributes-wrapper-web").css("display", "none");
				$(".add-new-text-butt").css("display", "none");
				toggleScrollBar(".text-tools-wrapper:visible");
				$(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });

			} else {
				$(".text-tools-wrapper").css("visibility", "visible");
				$("#font-atributes-wrapper-mobile").css("display", "none");
				$(".cell").unbind("click").bind("click", selectCell);

				$(".texts-container:visible").append(
					$("<div class='done-butt-wrapper'>").html(
						"<span class='full-width'><button class='done-button' data-current_step='edit premade text'>Done</button></span>"
					)
				)

				$(".done-button").click(function(){ $(this).closest(".page").hide(); switchStep("edit pictures"); });
			}
		break;

		case "select color insert or save":
			$(".cell").unbind("click");
			$(".cell").removeClass("selected_cell");
			$(".cell-helper").removeClass("selected_cell_helper");
			$(".back-next-butt-wrapper.web").find(".arrow-right").css("display", "none");
			$(".back-next-butt-wrapper.web").find(".next-button").removeClass("blink");

			$("#grid-helper-frame").hide();
			if(typeof p.current_templ_type!= "undefined"){
				switch(p.current_templ_type) {
					case "templates":
						$("img", ".options-container").each( function(){
							if($(this).data("template_name") == "White Insert"){
								$(this).hide();
							}
						});
					break;

					case "graphic_templates":
						$(".options-container img").show();
					break;
				}			
			}

			if($(".options-container").data("side_name") !== undefined){
				
				$(".next-button").text("Next →");
				if(!isMobile()){ $("#lyouts-page-wrapp").show().css("top", "2px"); }
				$(".optional-surface").css("visibility", "visible");
				$(".toolset.product-title").css("display", "table-row");
				toggleScrollBar(".optional-surface:visible");
				
			} else {
				if(!isMobile()){ $("#lyouts-page-wrapp").show().css("top", "2px"); }
				$(".optional-surface").css("visibility", "visible");
				switchStep("presave preview");
			}
		break;

		case "presave preview":
			$(".cell").unbind("click");
			$("#presave-page").css("visibility", "visible");
			$("#bottom-panel").hide();
			$("#grid-helper-frame").hide();
			$(".next-button").text("Save");
			$(".back-next-butt-wrapper.web").find(".arrow-right").css("display", "block");
			$(".back-next-butt-wrapper.web").find(".next-button").toggleClass("blink");
		
			$(".optional-surface").css("visibility", "hidden");
			if($(".options-container").data("side_name") !== undefined){
				$(".toolset.sides-switch").css("display", "table-row");
				$("#side-inside-switch").addClass("activesideswitch");
			}
		break;

		case "save product":
			$(".work-desk").hide();
			$("#left-column").hide();
			$("#tools-panel-wrapper").hide();
			$(".back-next-butt-wrapper").hide();
			$(".user-message").hide();

			$(".upload-progress-page").css("visibility", "visible").height($("#left-column").height()).toggleClass("fadein");
			saveProduct(p);
		break;
	}
}

/*
---------------------------------------------------------------*/

function recordStepsMap(step){
	if(step != "edit premade text" && 
	   step != "add texts" &&
	   $(".back-next-butt-wrapper").data( "current_step" ) != "upload photos" &&
	   $(".back-next-butt-wrapper").data( "current_step" ) != step){

		$(".back-next-butt-wrapper").data( "previous_step", $(".back-next-butt-wrapper").data( "current_step" ) )
								.data( "current_step", step );
	} else {
		$(".back-next-butt-wrapper").data( "current_step", step );
	}
}

/*
---------------------------------------------------------------*/

function switchMenu(menue, p){
	var $selected_cell = $( ".selected_cell" ),
		c_id = $selected_cell.prop("data-id");

	$(".subset").css("display", "none");
	$(".toolset").css("display", "none");
	/*$("main").unbind("vmousemove")
			 .unbind("touchstart");*/

	switch(menue){
		/* -------- Layouts and Graphics fullscreen page ---------*/
		case "first upload menu":
			var c_step = $(".back-next-butt-wrapper").data( "current_step");
			if( c_step == "upload photos" || c_step == "edit pictures" || c_step == "styles page" ){
				if($(".image-filled").length == 0){
					$("#lyouts-page-wrapp").show().css("top", "2px");
				}
				$(".upload-page-wrapper").css("visibility", "visible");
			}

			$(".toolset.product-title").css("display", "table-row");
		break;

		/*--------- Facebook and Instagram files preview page (fullscreen) ------------*/
		case "files preview menu": 
			$(".user-files-preview-wrapper").css("visibility", "visible");
		break;

		case "upload": 
			$(".subset.upload").css("display", "table-row"); 
			$("#bottom-panel").data("current_subset", "upload");
		break;

		case "rotate": 
			$(".subset.rotate").css("display", "table-row");
			$(".rotate-left-butt").bind("click", function(e){ p.canvas_data[c_id].rotate(-90) });
			$(".rotate-right-butt").bind("click", function(e){ p.canvas_data[c_id].rotate(90) });
		break;
		
		case "move":
			$(".subset.move").css("display", "table-row");

			if(isMobile()){
				$("main").bind("touchstart", function(e){ p.canvas_data[c_id].touchImgHandler(e) })
					 	 .bind("vmousemove", function(e1){ p.canvas_data[c_id].moveImgHandler(e1, $(".selected_cell")) })
			} else {
				$("#product-wrapper")
					.bind("mousedown", function(e){
						$(".cell").unbind("click");
						p.canvas_data[c_id].clickImgHandler(e);
						$(this).bind("mousemove", function(e1){ p.canvas_data[c_id].moveImgHandler(e1, $(".selected_cell")) })
					})
					.bind("mouseup", function(e){ 
						$(this).unbind("mousemove");
						// $(".cell").bind("click", selectCell);
					});
			}
		break;

		case "zoom": 
			$(".subset.zoom").css("display", "table-row");
			$(".zoomin-butt").bind("click", function(e){ p.canvas_data[c_id].zoom(0.025); });
			$(".zoomout-butt").bind("click", function(e){ p.canvas_data[c_id].zoom(-0.025); });
		break;

		case "text": 
			$(".subset.text").css("display", "table-row");
			$(".text-tools-wrapper").css("visibility", "visible");
			addTextFunctionsInit(p);
			toggleScrollBar(".text-tools-wrapper:visible");
			// $(".add-new-text-butt").bind("click",)
		break;
	}

	$(".done-butt").bind("click", function(){ 
		var c_step = $(".back-next-butt-wrapper").data( "current_step"); 
		$("#bottom-panel").data( "current_subset", null );
		unbindEvents();
		switchStep(c_step);
	});
}

/*
--------------------------------------------------------------------------*/
function showPageWithTabs(active_tab){
	toggleActiveTab(active_tab);
	$("#lyouts-page-wrapp").show().css("top", "65px");
	$(".tabs-wrapper").show();

	if(active_tab == ".texts-tab" || active_tab == ".upload-tab"){
		$(".layouts-tabs-set").css("display", "none");
		$(".upload-texts-tabs-set").css("display", "table-row");
	}

	if(active_tab == ".styles-butt" || active_tab == ".layout-butt"){
		$(".layouts-tabs-set").css("display", "table-row");
		$(".upload-texts-tabs-set").css("display", "none");
	}
}
/*
--------------------------------------------------------------------------*/

function unbindEvents(){
	$("main").unbind("vmousemove").unbind("touchstart");
	$(".rotate-left-butt").unbind("click")
	$(".rotate-right-butt").unbind("click");
	$(".zoomin-butt").unbind("click");
	$(".zoomout-butt").unbind("click");
	$(".add-new-text-butt").unbind("click");
	$("#product-wrapper").unbind("mousedown")
						 .unbind("mousemove")
						 .unbind("mouseup");
}

function toggleScrollBar(page_id){
	var offset = $(page_id).find(".scroll_detector").position();
	
	// console.log("Caller Function:",arguments.callee.caller.name, page_id, "Offset",offset,"Layouts page wrapp:", $("#lyouts-page-wrapp").height(), "layout-templates height:", $(".layout-templates:visible").height());

	$("#lyouts-page-wrapp").unbind('mousewheel');
	
	if(typeof offset !== "undefined"){
		// console.log("Left Window Height: ",$("#lyouts-page-wrapp").height(), "\nPage: ", page_id, "\nPage Height:",$(page_id).height(), "\nScroll Detector Offset: ", offset)

		if( offset.top > $("#lyouts-page-wrapp").height()){
			$(page_id).height(offset.top);
		}

		if(typeof page_id == "undefined" && typeof window.ownster_scroll_bar.settings.scrolled_page !== "undefined"){
			page_id = ownster_scroll_bar.settings.scrolled_page;
		}

		if(typeof offset !== "undefined" && offset.top > $("#lyouts-page-wrapp").height()){
			$(page_id).css("padding-right", "10px");
			$(".scroll-bar").show();
			window.ownster_scroll_bar.settings.scrolled_page = page_id;
			window.ownster_scroll_bar.resizeScroll();
			window.ownster_scroll_bar.settings.scrolled_page_position = 0;

			$("#lyouts-page-wrapp").bind('mousewheel', function(event){
				
				var saved_offset = window.ownster_scroll_bar.settings.scrolled_page_position,
					new_offset = saved_offset + (event.deltaY * event.deltaFactor),
					page_h_difference = $(page_id).height() - $("#lyouts-page-wrapp").height(),
					scroll2page_ratio = $(page_id).height() / window.ownster_scroll_bar.$scroll_bar_slider.height();

				// console.log((new_offset <= 0 && new_offset >= page_h_difference *-1), "new Offset: "+new_offset, "Height Difference: "+page_h_difference *-1);

				if((saved_offset + event.deltaY) <= 0 && new_offset >= page_h_difference *-1){

				    $(page_id).css( "margin-top", new_offset+"px");
				    window.ownster_scroll_bar.$scroll_bar_slider.css({top: (-1*new_offset / scroll2page_ratio)+"px"})
							   				 .data("saved_position", (-1*new_offset / scroll2page_ratio));

					window.ownster_scroll_bar.settings.scrolled_page_position = new_offset;
				}	
			})
		} else {
			$(".scroll-bar").hide();
			$(page_id).css("padding-right", "0px");
		}
	}
}
/*
----------------------------- */
function moveImage(e, active_canvas){			// Trigger mouse events when clicked on canvas
 	var savedY = e.pageY,				// These variables used to determine the direction of the cursor on canvas
		savedX = e.pageX,
		totalRotation = 0,
		totalVflip = 0,
		totalHflip = 0,
		localPosition,					// Object that holds element's local cursor postion 
		scale_ratio;				// Cursor position ratio. CSS style.width to image width
		
	scale_ratio  = active_canvas.width / active_canvas.style_width,
			
	window.onmousemove = function(epos){
		active_canvas.move((epos.pageX-savedX) * scale_ratio, (epos.pageY-savedY) * scale_ratio);
		savedX = epos.pageX;	// Save position of the previous pixel to determine the direction of cursor
		savedY = epos.pageY;
		window.onmouseup = function(){
			window.onmousemove = null;
		}
	}																																			 
 }

/*
----------------------------------------------------------------------------------------*/

function premadeTextFunctions(p){
	// loadGoogleFonts();
	if( typeof p.surfaces[p.default_surface].grid.text_stack != "undefined" ){
		renderPremadeTexts(p, p.surfaces[p.default_surface].grid.text_stack, false);
	}
}

/*
----------------------------------------------------------------------------------------*/

function addTextFunctionsInit(p){
	// Color Picker Settings --------------
	var postfix = isMobile() ? "-mobile" : "-web";
	var newText = function(){
			var elms_set_class = "text-set"+Math.floor((Math.random() * 1000000000) + 1), // Random className +1
				ddSlickFontFamData = $("#font-family-select"+postfix).data("ddslick"),
				ddSlickFontSizData = $("#font-size-select"+postfix).data("ddslick"),
				fontfamily = ddSlickFontFamData.selectedData.value,
				fontsize = ddSlickFontSizData.selectedData.value,
				textcolor = $('#colorSelector'+postfix).data("text-color"),
				s = p.default_surface;
			if ( typeof p.surfaces[s].text_stack == "undefined" ){
				p.surfaces[s].text_stack = {};
			}

			p.surfaces[s].text_stack[elms_set_class] = { position: { top: "10%", left: "10%", top_percents: 10, left_percents: 10 },
														 tcolor: textcolor,
														 fsize: fontsize,
														 ffamily: fontfamily,
														 text: "",
														 selected_index: { sindex: 0, findex: 0 } }

			$textinput = $("<input type='text' class='text-input-box'/>").toggleClass(elms_set_class).toggleClass("not-filled");
			$deletebutt = $("<a class='delete-text-button'>✕</a>").toggleClass(elms_set_class);

			renderTextLayer( p );

			$deletebutt.click(function(){
				var thistextsystemid = $(this).prop("class").split(" ")[1];
				$(".onstage-text."+thistextsystemid ).remove();
				$(this).parent().remove();
				delete p.surfaces[s].text_stack[thistextsystemid];
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
					$("#font-family-select"+postfix).ddslick('select', { index: fontindx });
					$("#font-size-select"+postfix).ddslick('select', { index: sizeindx });
					$('#colorSelector'+postfix).data("text-color", textcolor)
										.spectrum("set", textcolor);
				})
				.blur(function(){
					$(".onstage-text."+$(this).prop("class").split(" ")[1]).removeClass("focused-text");
				})
				.keyup(function(){
					var thistextsystemid = $(this).prop("class").split(" ")[1];
						s = p.default_surface;
					$(".onstage-text."+thistextsystemid).text($(this).val());
					p.surfaces[s].text_stack[thistextsystemid].text = $(this).val();
				});

			$("#text-inputs-wrapper"+postfix).append(
				$("<div class='text-input-container'>").append($textinput).append($deletebutt)
			);
			$textinput.focus();
		}
	//*******************************************
	$("#colorSelector"+postfix)
		.data("text-color", '#000000')
		.spectrum({
			chooseText: "Choose",
			change: function(color) {
			    var thistextsystemid = $("#texts-layer").data("active-text"),
			    	s = p.default_surface;
				$('#colorSelector'+postfix).data("text-color", color.toHexString());
		    	if( typeof thistextsystemid !== "undefined"){
		    		$(".onstage-text."+thistextsystemid)
		    			.css("color", color.toHexString() )	
		    			.data("text-color", color.toHexString());
		    		p.surfaces[s].text_stack[thistextsystemid].tcolor = color.toHexString();
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
	$("#font-family-select"+postfix).ddslick({
		width: "100%",
	    selectText: "Select the Font",
	    onSelected: function (data) {
	    	var thistextsystemid = $("#texts-layer").data("active-text"),
	    		s = p.default_surface;
	    	if( typeof thistextsystemid !== "undefined"){
	    		$(".onstage-text."+thistextsystemid)
	    			.css("font-family", data.selectedData.value )
	    			.data("font-family", data.selectedData.value)
	    			.data("font-index", data.selectedIndex);

	    		p.surfaces[s].text_stack[thistextsystemid].ffamily = data.selectedData.value;
				p.surfaces[s].text_stack[thistextsystemid].selected_index.findex = data.selectedIndex;
	    	}
	    }
	});

	// Font Size Select Settings ------------------
	$("#font-size-select"+postfix).ddslick({
		width: "100%",
	    selectText: "Select the Font Size",
	    onSelected: function (data) {
	    	var thistextsystemid = $("#texts-layer").data("active-text"),
	    		s = p.default_surface;
	    	if( typeof thistextsystemid !== "undefined"){
	    		$(".onstage-text."+thistextsystemid)
	    			.css("font-size", data.selectedData.value+"px" )
	    			.data("font-size", data.selectedData.value )	
	    			.data("size-index", data.selectedIndex);
	    		p.surfaces[s].text_stack[thistextsystemid].fsize = data.selectedData.value;
	    		p.surfaces[s].text_stack[thistextsystemid].selected_index.sindx = data.selectedIndex;
	    	}
	    }
	});

	// Add New Text button handler

	$(".add-new-text-butt").unbind("click").bind("click", newText);
	// Load fonts from google
	loadGoogleFonts();
	if($(".not-filled").length == 0){
		newText(); 
	}
}
//---------------------------------------------------------------------------------

function loadGoogleFonts(fun){
	var wf = document.createElement('script');
	WebFontConfig = {
	  google: { families: [ 'Abel::latin', 'Comfortaa::latin', 'Cookie::latin', 'Astloch::latin', 'Kaushan+Script::latin', 'IM+Fell+English+SC::latin', 'Nosifer::latin', 'Alfa+Slab+One::latin', 'Ubuntu+Mono::latin', 'Trade+Winds::latin', 'Codystar::latin', 'Stalemate::latin', 'Poiret+One::latin', 'Henny+Penny::latin', 'Quicksand::latin', 'Petit+Formal+Script::latin', 'Lobster::latin', 'Fugaz+One::latin', 'Shadows+Into+Light::latin', 'Josefin+Slab::latin', 'Frijole::latin', 'Fredoka+One::latin', 'Gloria+Hallelujah::latin', 'UnifrakturCook:700:latin', 'Tangerine::latin', 'Monofett::latin', 'Monoton::latin', 'Pacifico::latin', 'Spirax::latin', 'UnifrakturMaguntia::latin', 'Creepster::latin', 'Maven+Pro::latin', 'Amatic+SC::latin', 'Dancing+Script::latin', 'Pirata+One::latin', 'Play::latin', 'Audiowide::latin', 'Open+Sans+Condensed:300:latin', 'Kranky::latin', 'Black+Ops+One::latin', 'Indie+Flower::latin', 'Sancreek::latin', 'Press+Start+2P::latin', 'Abril+Fatface::latin', 'Jacques+Francois+Shadow::latin', 'Ribeye+Marrow::latin', 'Playball::latin', 'Roboto+Slab::latin' ] },
	  loading: function() { },
	  active: function(){
	  	if(typeof fun == "function"){
	  		fun();
	  	}
	  },
	  inactive: function() {},
	  fontloading: function(familyName, fvd) {},
	  fontactive: function(familyName, fvd) { },
	  fontinactive: function(familyName, fvd) {}
	}
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}

//---------------------------------------------------------------------------------
function showHint(hint){
	$(".popup-hint:visible").hide();
	// $(".popup-hint").removeClass("showup");
	$(".popup-hint."+hint).show();
	$(".popup-hint."+hint).toggleClass("showup")
}

function hideHint(hint){
	if(typeof hint !== "undefined"){
		$(".popup-hint").removeClass("showup");
		$(".popup-hint."+hint).hide();
	} else {
		$(".popup-hint").removeClass("showup");	
		$(".popup-hint:visible").hide();
	}
}
//---------------------------------------------------------------------------------
// 

function reloadFBAfterLogin(){
	$(".fb-login-wrapper").css("display", "none");
	
	if( $(".selected_cell").hasClass("image-filled") ){
		switchStep("edit pictures");
	} else {
		switchStep("edit pictures");
		switchMenu("first upload menu");
	}
	// switchStep("facebook page");
	// switchStep('facebook page');
}

/*
---------------------------------------------------------------------------------*/
function facebookHandler(){
	FB.getLoginStatus(function(response) {
  		if(response.status == "connected"){
			// Logged in
			$(".fb-login-wrapper").css("display", "none");
			FB.api('/me/?fields=albums{ name, picture }', function(response) {
				if(response && !response.error){
					loadFBAlbums(response);
					window.albums_response = response;
				}
				
			});
		} else {
			$(".fb-login-wrapper").css("display", "block");
			/*FB.login(function (response) {
				if (response.authResponse) {
					facebookHandler();
				} else {
					// Login canceled
				}
			}, {scope:'user_photos'});*/
		}
	}, true);
}

function loadFBAlbums(r){
	$(".back-to-fb-album-butt-wrapper").css("display", "none")
	if(typeof r.albums !== "undefined"){
		for( a in r.albums.data){
			
			$img = $("<img>").prop("src", r.albums.data[a].picture.data.url);
			
			$("<figure>").addClass("fb-album-thumbnail")
					  .prop("data-id", r.albums.data[a].id )
					  .append( $("<div>").addClass("fb-album-cover-image-container").append($img))
					  .append( $("<figcaption>").text( r.albums.data[a].name ) )
					  .click( { albumid: r.albums.data[a].id }, openAlbum)
			.appendTo(".socnet-thumbs-container")
			
			// arrange image center inside its container
			$img.on("load", imgArangeCenter);
		}
	}
}

//--------------------------------------------------

function openAlbum(e){
	var albid = e.data.albumid;
	
	$(".user-files-preview-wrapper:visible").css("margin-top", "0px");
	$(".back-to-fb-album-butt-wrapper").css("display", "block").unbind("click").bind("click", function(){ switchStep("facebook page");});
	FB.api("/"+albid+"/photos/?fields=source", function(r){
		$(".socnet-thumbs-container").find("*").remove()
		for(p in r.data){
			userfiles.renderImage(r.data[p].source, r.data[p].id, "fb", onImgClickHandler, function(){ toggleScrollBar(".user-files-preview-wrapper:visible"); })
			// console.log(r.data[p].source, r.data[p].id, "fb")	
		}
		// userfiles.onFilesReady();
		/*$("#upload-hints").show().text("Back to albums.")
						  .click( function(){
						  	 loadFBAlbums( albums_response );
						  	 $(this).hide();
						  } )*/
	})
}

function onImgClickHandler (e) {
	var src = $(this).prop("src"),
		file_id = $(this).parent().prop("id"),

		// Downloads FB and Instagram images to our server
  		downloadFile = function(postdata, $thumbimg){
  			// var cell_msg = $("<em class='cell-loading-msg'>Loading...</em>");
  			// $("#cellhelper"+c_id).append(cell_msg);
  			// $(self).append(cell_msg);
  			$.post("../assets/php/instagram_server/index.php", postdata, function(respond){
				if(!respond.error){
					$thumbimg.prop("src", respond.imgurl).prop("data-source", "server");
					// cell_msg.remove();
					loadImage2Cell( { image_source: respond.imgurl, p: userfiles.settings.p, file_id: file_id } );
					// loadDroppedImg2Cell( $("<img>").prop("src", respond.imgurl) );
				}
			}, "json");
  		};

  	if($(this).closest(".user-files-preview-wrapper").hasClass("mobile")){
  		switchStep("edit pictures");
  	}

	switch($(this).prop("data-source")){
  		case "fb" 	: downloadFile({ download_FB_file: src }, $(this)); break;
  		case "insta": downloadFile({ download_single_file: src }, $(this)); break;
  		// default : loadDroppedImg2Cell( $("<img>").prop("src", $("img", ui.draggable ).prop("src")) ); break;
  	}
}
//---------------------------------------------------------------------------------
// 
function instagramHandler(e){
	var user_images,
		next_max_id=false,
		// Get Images data from authenticated acount
		getImagesData = function (response){
			$("#upload-buttons-wrapper-vertical").hide();
			$("#upload-buttons-wrapper").css("visibility", "visible");
			user_images = response.data;
			next_max_id = response.pagination.next_max_id || next_max_id;
			renderInstaImages(".socnet-thumbs-container");
		},

		// Render images in container.
		renderInstaImages = function(container){
			$(container).find("*").remove();
			for(img in user_images){
				if(typeof user_images!= "undefined" && typeof user_images[img]!= "undefined"){
					// Save file name to instagram files array. Used when saving design.
					// layout_data.instagram_files.push(user_images[img].images.standard_resolution.url);

					userfiles.renderImage(user_images[img].images.standard_resolution.url, user_images[img].id, "insta")
				}
			}
			//---------- Add next and previous button 
			$next_butt = $("<button id='instagram-next-butt'>").text("next ->");
			$prev_butt = $("<button id='instagram-next-butt'>").text("<- previous");
			$("<div id='instagram-next-prev-buttons-wrapper'>")
				.append($prev_butt).append($next_butt)
				.appendTo(userfiles.settings.preview_container);

			$next_butt.click(function(){
				next_max_id && API.user.self.media({ max_id: next_max_id }, getImagesData);
			});
			$prev_butt.click(function(){
				next_max_id && API.user.self.media({ min_id: next_max_id }, getImagesData);
			});
			//----------
			userfiles.onFilesReady();
		};

	/*layout_data = e.data.p.layout_data[sideID()],
	layout_data.instagram_files = [];*/
	//------ Plugin Initialization ---------------------------------
	API = Instajam.init({
	    clientId: 'a6d8e22917604c61b4f2e35b46e21a22',
	    redirectUri: 'http://ownster.co.uk/personalize/',
	    scope: ['basic', 'comments']
	});

	//------- Authenticate ------------------------------------------
	if(API.authenticated){

		// User profile data
		/*API.user.self.profile(function(response) {
		    $("main").append("<h2>Hello "+response.data.full_name+"!</h2");
		});*/
		
		// Get User's Media
		API.user.self.media(getImagesData);
	} else {
		// If not authenticated redirect user to Instagram Login Page
		window.location = API.authUrl;
	}
}

//--------------------------------------------------

function imgArangeCenter(){
	var im_h = $(this).height(),
		im_w = $(this).width(),
		pr_w = $(this).parent().width(),
		pr_h = $(this).parent().height();

	// Determin the greatest side and resize to the small side equels its container size (Square shape)
	if(im_h > im_w){
		$(this).css({ width: +$(this).parent().height()+"px"});
		$(this).css({ "margin-top": ((pr_h/2) - ($(this).height()/2))+"px" });
	} else {
		$(this).css({ height: +$(this).parent().width()+"px" });
		$(this).css({ "margin-left": ((pr_w/2) - ($(this).width()/2))+"px" });
	}
	toggleScrollBar(".user-files-preview-wrapper:visible");
}

//--------------------------------------------------
function previewTemplates(data, p, settings){
	$.extend( p, JSON.parse( data.productdata ));
	var ts = p[settings.templates_obj][p.current_surface],
		max_size = $(settings.preview_container).width() * 0.45, // The size of the greatest side of the template's thumbnail
		ratio = 1, // Width to Height
		gr_w, // Original grid width
		gr_h, // Original grid height
		t_w,  // calculated template thumbnail width
		t_h,  // calculated template thumbnail height
		w_scale,
		h_scale,
		container_w = $(settings.preview_container).width(),
		container_h = $(settings.preview_container).height(),
		photo_size,
		side_id = p.current_surface;

	// Clear Window befor filling it with new templates
	$(settings.preview_container).find("*").remove();

	// Loop through templates
	for(t in ts){ 
		gr_w = convertUnits( ts[t].width, "to pix print" );
		gr_h = convertUnits( ts[t].height, "to pix print" );
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

		grid_css = { width: (t_w / (container_w / 100))+"%",
					 height: (t_h / (container_h / 100))+"%",
					 /*"margin-left": (((container_w - t_w)/2) / (container_w / 100))+"%"*/  };

		$thumbnail = $("<div>").addClass("template-prewiew-thumb "+t).prop("data-templ_id", t).data("wh_ratio", t_w / t_h).css( grid_css );
		cell_css = {};

		for(c in ts[t].cells ){
			if(typeof ts[t].cells[c].uploadable != "undefined" &&
					  ts[t].cells[c].uploadable == true &&
					  typeof ts[t].thumburl == "undefined" &&
					  typeof ts[t].uri == "undefined" &&
					  typeof ts[t].preview_thumb == "undefined"){

				c_w = ts[t].cells[c].w / w_scale;
				c_h = ts[t].cells[c].h / h_scale;
				c_x = ts[t].cells[c].x / w_scale;
				c_y = ts[t].cells[c].y / h_scale;

				cell_css = { width:  (c_w / (t_w / 100))+"%",
							 height: (c_h / (t_h / 100))+"%",
							 top: 	 (c_y / (t_h / 100))+"%",
							 left: 	 (c_x / (t_w / 100))+"%"  };
				
				if(typeof ts[t].cells[c].rotation != "undefined"){	
					$.extend(cell_css, { "-ms-transform-origin": "50% 50%",
										 "-webkit-transform-origin": "50% 50%",
										 "transform-origin": "50% 50%",
										 "-ms-transform": "rotate("+ts[t].cells[c].rotation+"deg)",
										 "-webkit-transform": "rotate("+ts[t].cells[c].rotation+"deg)",
										 "transform": "rotate("+ts[t].cells[c].rotation+"deg)"} );
				}

				photo_size = c_w < c_h ? c_w : c_h;

				$("<div>").addClass("preview-cell")
					.css( cell_css )
					.append($("<div class='photo-icon'>").css("height", (photo_size / (c_h / 100))+"%").css("width", (photo_size / (c_w / 100))+"%").css("margin-top", ((( c_h-photo_size )/2) / (c_h / 100))+"%" ))
					.appendTo( $thumbnail );
			}
		}


		if(typeof ts[t].preview_thumb != "undefined" && typeof ts[t].preview_thumb.url != "undefined"){
			$img = $("<img>").prop("src", ts[t].preview_thumb.url).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
			$thumbnail.toggleClass("graphic-templ");
		} else {
			if(typeof ts[t].thumburl !== "undefined"){
				$img = $("<img>").prop("src", ts[t].thumburl).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
				$thumbnail.toggleClass("graphic-templ");
			} else{
				if(typeof ts[t].uri !== "undefined"){
					$img = $("<img>").prop("src", ts[t].uri).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
					$thumbnail.toggleClass("graphic-templ");
				}
			}
		}

		$(settings.preview_container).append( $thumbnail );
		$thumbnail.click({ p: p, templates_obj: settings.templates_obj, 
			optFunc: { lg: function(){ p.current_templ_type = settings.templates_obj; },
						b: function(){
								$(".back-next-butt-wrapper").data( "layout_selected", "selected" );
								$(".back-next-butt-wrapper.web").find(".arrow-right").css("display", "block");
								$(".back-next-butt-wrapper.web").find(".next-button").toggleClass("blink");
								
								// alert($(settings.preview_container).closest(".layout-templates").hasClass("mobile"));

								if( $(settings.preview_container).closest(".layout-templates").hasClass("mobile") ||
									$(settings.preview_container).closest(".graphic-templates").hasClass("mobile")){
									switchStep("select layout", p);
								}

								$(".user-message").find("h2").text("Click NEXT to continue").toggleClass("blink").end()
													.find("p").text("Click NEXT to continue").toggleClass("blink");
								$(".user-focus").hide();
							} 
					}
		}, changeProductLayout )
	}
	$(".template-prewiew-thumb").each(function(){
			$(this).height( $(this).width() / $(this).data("wh_ratio") );	
		})
	$(window).resize(function(){ 
		$(".template-prewiew-thumb").each(function(){
			$(this).height( $(this).width() / $(this).data("wh_ratio") );	
		}) 
	});
}

function changeProductLayout(e, templ_id){
	var p = e.data.p,
		templ_obj = e.data.templates_obj,
		template_id = templ_id || $(this).prop("data-templ_id"),
		side_id = p.default_surface,
		c_step = $(".back-next-butt-wrapper").data("current_step");

	$(".template-prewiew-thumb").removeClass("active");
	typeof templ_id != "undefined" ? $("."+template_id).addClass("active")
									: $(this).addClass("active");

	p.current_template = template_id;
	p.current_templ_type = templ_obj;

	if(typeof p[templ_obj][side_id][template_id] !== "undefined"){
		p.surfaces[side_id].grid = p[templ_obj][side_id][template_id];

		if(typeof p[templ_obj][side_id][template_id].template_name != "undefined"){
			$("#product-info").html("Graphic Template ID: "+p[templ_obj][side_id][template_id].template_name);
		}
	}

	p.layout_data = {};

	$(".premade-text").remove();
	$("#demo-layer").remove();
	delete p.surfaces[side_id].premade_text_stack;
	loadGrid(p);

	if(!isMobile()){
		switch(c_step){
			case "styles page": $(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
								$(".cell-helper").addClass("seek-n-hide");
				 break;

			case "layout page": $(".cell").unbind("click").bind("click", function(e){ switchStep("edit pictures"); selectCell.call(this); });
								$(".cell-helper").removeClass("seek-n-hide");
				 break;
		}
	}
	
	// loadGraphic
	if(typeof e.data.optFunc !== "undefined" && typeof e.data.optFunc.lg == "function"){
		e.data.optFunc.lg(p[templ_obj][side_id][template_id], p);
		// console.log(decodeURI(p[templ_obj][side_id][template_id].uri))
	} 

	// Additional function
	if(typeof e.data.optFunc !== "undefined" && typeof e.data.optFunc.b == "function"){
		e.data.optFunc.b();	
	}

}

/*
-----------------------------------------------------------------------------------------*/

function loadGraphic(graph_templ_obj, p){
	var css_w, css_h,
		parent_w, parent_h,
		side_id = p.default_surface;
	
	$(".graph-templ-image").remove();

	if (typeof graph_templ_obj.uri !== "undefined") {

		$(".back-next-butt-wrapper").data( "graphic_selected", "selected" );

		product_size = { w: $("#product-wrapper").data( "product_css_w_px" ),
						 h: $("#product-wrapper").data( "product_css_h_px" ),
						 w_ratio: $("#product-wrapper").data( "product_css_w_px" ) / 100,
						 h_ratio: $("#product-wrapper").data( "product_css_h_px" ) / 100 };

		// console.log("Load Graphic:",graph_templ_obj.uri);

		css_w = ((convertUnits( p.surfaces[side_id].width, "to pix print" ) * (p.scale/100)) / product_size.w_ratio)+"%";
		css_h = ((convertUnits( p.surfaces[side_id].height, "to pix print" ) * (p.scale/100)) / product_size.h_ratio)+"%";
		$img = $("<img>").prop("src", graph_templ_obj.uri)
						 .addClass("graph-templ-image")
						 .css({ top: (p.surfaces[side_id].y / product_size.h_ratio)+"%" ,
						 		left: (p.surfaces[side_id].x / product_size.w_ratio)+"%", })
						 .width(css_w)
						 .height(css_h);

		p.layout_data[side_id].graphic_template.$img = $img;

		$("#product-image-container").append($img);

		if( typeof graph_templ_obj.text_stack != "undefined" ){
			// console.log(graph_templ_obj.text_stack)
			renderPremadeTexts(p, graph_templ_obj.text_stack, false);
			//** Unbind switchStep("add text"), bind switchStep("edit premade text")
			$(".texts-tab").unbind("click").bind("click", function(){ 
				switchStep("edit premade text", p);
			});
		}

		if(typeof graph_templ_obj.demo_layer!= "undefined" && graph_templ_obj.demo_layer.url != "undefined"){
			$("#demo-layer").remove();
			$demo_img = $("<img>").prop("src", graph_templ_obj.demo_layer.url);
			$("<div>").prop("id", "demo-layer")
					  .addClass("demo-layer-img")
					  .append($demo_img)
					  .appendTo("#product-wrapper")
					  .css({ top: (p.surfaces[side_id].y / product_size.h_ratio)+"%" ,
						 		left: (p.surfaces[side_id].x / product_size.w_ratio)+"%", })
					  .width(css_w)
					  .height(css_h);
		}
	};
}

/*
-----------------------------------------------------------------------------------------*/

function loadImage2Cell(args){
	// Append Image to the cell
	var p = args.p,
		$selected_cell = $( ".selected_cell" ),
		c_id = $selected_cell.prop("data-id"),
		this_cell_w = $selected_cell.width(), // Current width of the cell. relative to the size of the inner window
  		this_cell_h = $selected_cell.height(), // Current height of the cell. relative to the size of the inner window
  		this_cell_w_px = $selected_cell.prop("data-c_w"), // Current width of the cell in pixels before the window was scaled
  		this_cell_h_px = $selected_cell.prop("data-c_h"), // Current height of the cell in pixels before the window was scaled;
  		image_source = new Image();

	image_source.src = args.image_source;

	image_source.onload = function(){
		var ratw = 0, 
			r_w, 
			r_h,
			w_difference,
			h_difference,
			scale = 1,
			translateX,
			translateY,
			$canvas = $("<canvas>").prop("width", this_cell_w_px).prop("height", this_cell_h_px).width("100%").height("100%");

		$(".toolset.workdesk").css("display", "table-row");

		if(!$selected_cell.hasClass("image-filled")){
			$selected_cell.addClass("image-filled");
		}
		if(!$("#cellhelper"+c_id).hasClass("image-filled-helper")){
			$("#cellhelper"+c_id).addClass("image-filled-helper")
								 .find(".cell-upload-hint").remove();
		}

		// Ratio of original image size to cell size
		ratw = this_cell_w / this.width;
		if(this.height * ratw < this_cell_h){
			// Scale contexst to fit the height of the canvas 
			scale = this_cell_h_px / this.height;
		} else {
			// Scale contexst to fit the width of the canvas
			scale = this_cell_w_px / this.width;
		}

		p.canvas_data[c_id] = new OwnsterCanvas();
	    p.canvas_data[c_id].canvas = $canvas[0];
	    p.canvas_data[c_id].tX = $canvas[0].width/2;
	    p.canvas_data[c_id].tY = $canvas[0].height/2;
	    p.canvas_data[c_id].x_pos = p.surfaces[p.default_surface].grid.cells[c_id].x;
	    p.canvas_data[c_id].y_pos = p.surfaces[p.default_surface].grid.cells[c_id].y;
	    p.canvas_data[c_id].w = p.surfaces[p.default_surface].grid.cells[c_id].w;
	    p.canvas_data[c_id].h = p.surfaces[p.default_surface].grid.cells[c_id].h;
	    p.canvas_data[c_id].scale = scale;
	    p.canvas_data[c_id].img_src = image_source;
	    
	    if(typeof p.surfaces[p.default_surface].grid.cells[c_id].rotation!= "undefined"){
	    	p.canvas_data[c_id].cell_rotation = p.surfaces[p.default_surface].grid.cells[c_id].rotation;
	    }

	    p.canvas_data[c_id].render();

	    $selected_cell.find("canvas").remove().end()
			 .append( $canvas )
			 .css({ opacity: "1", border: "none" });

		$("#cellhelper"+c_id).find(".polaroid-icon").remove().end()
							 .append("<div class='cell-edit-hint'>Edit</div>");

		if($(".image-filled").length == Object.keys(p.layout_data[ p.default_surface ].cells).length){
			$(".back-next-butt-wrapper.web").find(".arrow-right").css("display", "block");
			$(".back-next-butt-wrapper.web").find(".next-button").toggleClass("blink");
		}
	}
}

//---------------------------------------------------------------------------------
// SAVE PRODUCT

function saveProduct(p) {
	var main_print_canvas = document.createElement("canvas"),
		ctx_main = main_print_canvas.getContext("2d"),

		drawTexts = function(ctx, canv_width, canv_height, text_stack){
			for(txt in text_stack){
				var pos = text_stack[txt].position,
					text_x = (canv_width / 100) * text_stack[txt].position.left_percents,
					text_y = (canv_height / 100) * text_stack[txt].position.top_percents;
				// Draw user texts on canvas -------------------
				ctx.font = (parseInt(text_stack[txt].fsize) * (canv_width / p.surfaces[p.default_surface].text_layer_web_width))+"px "+text_stack[txt].ffamily;
				ctx.fillStyle = text_stack[txt].tcolor;
				ctx.textBaseline="middle";
				ctx.textAlign = text_stack[txt].textalign;
				ctx.save();
				ctx.translate(text_x, text_y);
				ctx.rotate( (Math.PI / 180) * text_stack[txt].rotation );
				ctx.fillText(text_stack[txt].text, 0, 0);
				ctx.restore();
			}
		};

	/*-- Main --*/
	
	main_print_canvas.width = convertUnits( p.surfaces[p.default_surface].width, "to pix print" );
	main_print_canvas.height = convertUnits( p.surfaces[p.default_surface].height, "to pix print" );

	// Sort keys (cell ID's)
	var keys = [];
	for(k in p.canvas_data){
		if(p.canvas_data.hasOwnProperty(k)){
			keys.push(k);
		}	
	}
	keys.sort();
	// keys.reverse();
	
	for(var i=0; i < keys.length; i += 1){
		if(typeof p.canvas_data[keys[i]].cell_rotation!= "undefined"){
			console.log([keys[i]])
			ctx_main.save();
			ctx_main.translate(p.canvas_data[keys[i]].x_pos+(p.canvas_data[keys[i]].w /2 ), p.canvas_data[keys[i]].y_pos+(p.canvas_data[keys[i]].h /2 ));
			ctx_main.rotate((Math.PI / 180) * p.canvas_data[keys[i]].cell_rotation);
			ctx_main.drawImage( p.canvas_data[keys[i]].canvas, 
							(p.canvas_data[keys[i]].w /2 )*-1,
							(p.canvas_data[keys[i]].h /2 )*-1,
							p.canvas_data[keys[i]].w, 
							p.canvas_data[keys[i]].h );

			ctx_main.restore();
		} else {
			ctx_main.drawImage( p.canvas_data[keys[i]].canvas, 
							p.canvas_data[keys[i]].x_pos, 
							p.canvas_data[keys[i]].y_pos, 
							p.canvas_data[keys[i]].w, 
							p.canvas_data[keys[i]].h );
		}
	}

	for(side in p.layout_data){
		if(typeof p.layout_data[side].graphic_template == "object"){
			if(typeof p.layout_data[side].graphic_template.url != "undefined"){

				ctx_main.drawImage( 
						p.layout_data[side].graphic_template.$img[0], 
						0, 0,
						p.layout_data[side].graphic_template.width,
						p.layout_data[side].graphic_template.height
				);
			}
		}
	}

	if(typeof p.surfaces[p.default_surface].premade_text_stack !== "undefined"){
		drawTexts(ctx_main, main_print_canvas.width, main_print_canvas.height, p.surfaces[p.default_surface].premade_text_stack);
	}

	if(typeof p.surfaces[p.default_surface].text_stack !== "undefined"){
		drawTexts(ctx_main, main_print_canvas.width, main_print_canvas.height, p.surfaces[p.default_surface].text_stack);
	}

	/*$(".upload-progress-page").append(main_print_canvas);
	$("canvas",".upload-progress-page").css({ "width": "90%" });*/

	var dataURL = main_print_canvas.toDataURL();
	var blob = dataURItoBlob(dataURL);

	var fd = new FormData();
	var post_dta = { sides:{}, product_info:{} };

	for(s in p.surfaces){
		post_dta.sides[s] = {};
		post_dta.sides[s].product_background_img_url = p.surfaces[s].imgurl;
		post_dta.sides[s].product_background_img_width = convertUnits( p.surfaces[s].img_width, "to pix print" );
		post_dta.sides[s].product_background_img_height = convertUnits( p.surfaces[s].img_height, "to pix print" );
		post_dta.sides[s].user_img_width = convertUnits( p.surfaces[s].width, "to pix print" );
		post_dta.sides[s].user_img_height = convertUnits( p.surfaces[s].height, "to pix print" );
		post_dta.sides[s].user_img_x = p.surfaces[s].grid.x / p.scale * 100;
		post_dta.sides[s].user_img_y = p.surfaces[s].grid.y / p.scale * 100;
		post_dta.sides[s].name = p.surfaces[s].surface_name;

		if(typeof p.surfaces[s].maskurl !== "undefined"){
			post_dta.sides[s].maskurl = p.surfaces[s].maskurl;
	
		}
	}

	post_dta.product_info["scale"] = p.scale;
	post_dta.product_info["default_side"] = p.default_surface;
	post_dta.product_info["db_id"] = p.db_id;
	post_dta.product_info["product_name"] = p.name;

	fd.append("canvasImage", blob, p.surfaces[p.default_surface].surface_name);
	fd.append("sides", JSON.stringify(post_dta) );
	// console.log(post_dta)
	uploadFiles(fd);
}

//---------------------------------------------------------------------------------
// Convert dataURI to Blob

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

//---------------------------------------------------------------------------------
// Upload main file to the server

function uploadFiles( post_data ){
	$.ajax({
	  url: "../assets/php/user-upload-server/",
	  type: "POST",
	  data: post_data,
	  dataType: 'json',
	  processData: false,  // tell jQuery not to process the data
	  contentType: false,   // tell jQuery not to set contentType
	  complete: function(jqxhr, status){
	  				if(status == "success"){
	  					window.location = "../review/";
	  					// console.log(jqxhr.responseJSON);
	  				} else {
	  					// console.log(status);
	  				}
	  			},

	  xhr: function(){
			    var xhr = new window.XMLHttpRequest();
			    //Upload progress
			    xhr.upload.addEventListener("progress", function(evt){
			      if (evt.lengthComputable) {
			        var progress = parseInt(evt.loaded / evt.total * 100, 10);
			        $(".upload-progress-page").find("h1").text(Math.round(progress)+"%");
			      }
			    }, false);
			    
			    xhr.upload.addEventListener("load", function(){
			    	$(".upload-progress-page").find("h1").addClass("saving-animated").text("Saving...").end()
			    							  .find("p").text("Please wait while we saving your image.");
			    	
			    }, false);

			    return xhr;
			 }
	})
}

//---------------------------------------------------------------
// GET PRODUCT DETAILS FROM DATABASE

function loadProduct( product ){

	if(typeof PRODUCT_DATA !== "undefined"){
		// console.log(PRODUCT_DATA)
		product.product_data = PRODUCT_DATA;

		renderProduct(PRODUCT_DATA, product, function(){
			if( typeof product.templates !== "undefined"){
				var preview_container_templ = isMobile() ? "#template-thumbnails-container-mobile" :
															"#template-thumbnails-container-web";

				previewTemplates( PRODUCT_DATA, product, { preview_container: preview_container_templ, templates_obj: "templates" } );
				
			} 

			if( typeof product.graphic_templates !== "undefined"){
				var preview_graph_container_templ = isMobile() ? "#graphic-thumbnails-container-mobile" :
																 "#graphic-thumbnails-container-web";



				previewTemplates( PRODUCT_DATA, product, { preview_container: preview_graph_container_templ,templates_obj: "graphic_templates" } );
				// changeProductLayout({ data: { p : product} }, product.templates.default_template);
			}
			
			if( typeof product.templates !== "undefined"){
				changeProductLayout({ data: { p : product, templates_obj: "templates" } }, product.templates.default_template);

			}
		});	 
	}
}

/*
-----------------------------------------------------------------------------------*/

function renderPremadeTexts(p, premade_texts_stack, editable){
	var s = p.default_surface;
	var postfix = isMobile() ? "-mobile" : "-web";
	if(typeof editable == "undefined"){
		editable = false;
	}
	
	if ( typeof premade_texts_stack != "undefined" ) {
		p.surfaces[s].premade_text_stack = premade_texts_stack;
		
		var text_stack = p.surfaces[s].premade_text_stack,
			text_height = 0,
			text_lmargin = 0,
			fsize = 0,
			txt_layer_w = $("#texts-layer").width();
		
		$(".premade-text").remove();
		$(".text-input-container").remove();
		$(".premade-text-input-container").remove();
		for( txt in text_stack ){
			fsize = txt_layer_w / text_stack[txt].fsize_ratio_to_textslayer+"px";
			$onstagetext = $("<div class='premade-text "+txt+"'>")
				.css({  position : "absolute",
						"font-family": text_stack[txt].ffamily,
						"font-size": fsize,
						"display": "inline-block",
						"background-color": "#fafa00",
						"-ms-transform": "rotate("+text_stack[txt].rotation+"deg)",
						"-webkit-transform": "rotate("+text_stack[txt].rotation+"deg)",
						"transform": "rotate("+text_stack[txt].rotation+"deg)",
						"-ms-transform-origin": text_stack[txt].textalign,
						"-webkit-transform-origin": text_stack[txt].textalign,
						"transform-origin": text_stack[txt].textalign,
						"color": text_stack[txt].tcolor,
						"top": text_stack[txt].position.top,
						"left": text_stack[txt].position.left,
						"cursor": "pointer",
						"pointer-events":"auto" })

				// .toggleClass(txt)
				.data("identifier-class", txt)
				.data("font-family", text_stack[txt].ffamily)
				.data("font-size", text_stack[txt].fsize)
				.data("text-color", text_stack[txt].tcolor)
				.text( text_stack[txt].text );

			$onstagetext.click(function(){ 
				switchStep("edit premade text");
				$(".text-input-box."+$(this).data("identifier-class")).focus();
			})
				.bind("mouseover", function(){ $(".onstage_text_frame."+$(this).data("identifier-class")).css({ "visibility": "visible" }) })
				.bind("mouseout", function(){ $(".onstage_text_frame."+$(this).data("identifier-class")).css({ "visibility": "hidden" }) })
			
			$("#texts-layer").append( $onstagetext );
			text_height = $onstagetext.height()+4;
			$onstagetext.css({"line-height":"0%"})


			$("<div>").addClass("onstage_text_frame")
					  .toggleClass(txt)
					  .css({ "top": text_stack[txt].position.top,
							 "left": text_stack[txt].position.left,
							 "margin-top": ((text_height / 2) * -1)+"px",
							 "margin-left": (text_lmargin - 4)+"px",
							 "height": text_height+"px",
							 "width": ($onstagetext.width()+8)+"px",
							 "-ms-transform": "rotate("+text_stack[txt].rotation+"deg)",
							"-webkit-transform": "rotate("+text_stack[txt].rotation+"deg)",
							"transform": "rotate("+text_stack[txt].rotation+"deg)",
							"-ms-transform-origin": text_stack[txt].textalign,
							"-webkit-transform-origin": text_stack[txt].textalign,
							"transform-origin": text_stack[txt].textalign })
					  .appendTo("#texts-layer")
					  /*.bind("mouseover", function(){ $(this).css({ "visibility": "visible" }); console.log("m over") })
					  .bind("mouseout", function(){ $(this).css({ "visibility": "hidden" }); })*/

			// Add text inputs

			$textinput = $("<input type='text' class='text-input-box'/>")
							.val(text_stack[txt].text)
							.toggleClass(txt)
							.toggleClass("not-filled")
							.prop("maxlength", text_stack[txt].maxsym);
			
			$("#text-inputs-wrapper"+postfix).append(
				$("<div class='premade-text-input-container'>").append($textinput).append("<label class='remaining-symbols "+txt+"' >"+text_stack[txt].maxsym+"</label>")
			);
		}

		alignTexts(p);
		alignTexts(p); // Must be repited !!!

		// $(".onstage_text_frame").bind("mouseover", function(){ console.log("OOOver") })
		// $(".styles-butt").click();
		$(".text-input-box").unbind("focus").bind("focus", function(){
				var thistextsystemid = $(this).prop("class").split(" ")[1];
				$( ".premade-text."+thistextsystemid ).toggleClass("focused-text");
				$("#texts-layer").data("active-text", thistextsystemid );

				$( ".premade-text."+thistextsystemid ).unbind("mouseout");
				$(".onstage_text_frame."+thistextsystemid).css({ "visibility": "visible" });
			})
			.unbind("blur").bind("blur", function(){
				var thistextsystemid = $(this).prop("class").split(" ")[1];
				$(".premade-text."+thistextsystemid).removeClass("focused-text")
													.bind("mouseout", function(){ 
														$(".onstage_text_frame."+thistextsystemid).css({ "visibility": "hidden" }) 
													})
				$(".onstage_text_frame."+thistextsystemid).css({ "visibility": "hidden" });
			})
			.unbind("keyup").bind("keyup", function(){
				var thistextsystemid = $(this).prop("class").split(" ")[1];
					s = p.default_surface,
					$onstagetext = $(".premade-text."+thistextsystemid);

				$onstagetext.text($(this).val());
				
				if($(this).hasClass("not-filled")){
					$(this).removeClass("not-filled");

					if(!$(this).hasClass("filled-input")){
						$(this).toggleClass("filled-input");
					}
				}

				// Render remaining symbols value
				$(".remaining-symbols."+thistextsystemid).text( p.surfaces[s].premade_text_stack[thistextsystemid].maxsym - $(this).val().length );

				p.surfaces[s].premade_text_stack[thistextsystemid].text = $(this).val();
				switch(p.surfaces[s].premade_text_stack[thistextsystemid].textalign){
					case "center": text_lmargin = ($onstagetext.width()/2)* -1;
								   $onstagetext.css("margin-left", text_lmargin / ($onstagetext.parent().width() / 100)+"%"); break;

					case "right": text_lmargin = ($onstagetext.width() * -1);
								  $onstagetext.css("margin-left", text_lmargin / ($onstagetext.parent().width() / 100)+"%"); break;
				}

				// resize frame around the text as number of symbols increases
				$(".onstage_text_frame."+thistextsystemid)
					  .css({ "margin-left": (text_lmargin - 4)+"px",
							 "width": ($onstagetext.width()+8)+"px" })
			});
		}

}

//---------------------------------------------------------------------------------

function alignTexts(p){
	$(".premade-text").each(function(){
		var thistextsystemid = $(this).data("identifier-class"),
			text_lmargin = 0;

		switch(p.surfaces[p.default_surface].premade_text_stack[thistextsystemid].textalign){
			case "center": text_lmargin = ($(this).width()/2)* -1;
						   $(this).css("margin-left", text_lmargin / ($(this).parent().width() / 100)+"%"); break;

			case "right": text_lmargin = ($(this).width() * -1);
						  $(this).css("margin-left", text_lmargin / ($(this).parent().width() / 100)+"%"); break;
		}

		// resize frame around the text as number of symbols increases
		$(".onstage_text_frame."+thistextsystemid)
			  .css({ "margin-left": (text_lmargin - 4)+"px",
					 "width": ($(this).width()+8)+"px" })
	})
}

//---------------------------------------------------------------------------------
// SHOW / HIDE TEXT LAYER

function renderTextLayer(p, premade_texts_stack){
	var s = p.default_surface;

	if ( typeof premade_texts_stack != "undefined" ) {
		/*if ( typeof p.surfaces[s].text_stack !== "undefined" ) {
			$.extend(p.surfaces[s].text_stack, premade_texts_stack);
		} else {*/
			p.surfaces[s].text_stack = premade_texts_stack;
		// }
	}

	if ( typeof p.surfaces[s].text_stack !== "undefined" ) {
		var text_stack = p.surfaces[s].text_stack;
		$(".onstage-text").remove();
		for( txt in p.surfaces[s].text_stack ){

			$onstagetext = $("<div class='onstage-text'>")
				.css({  "font-family": text_stack[txt].ffamily,
						"font-size": text_stack[txt].fsize+"px",
						"display": "inline-block",
						// "background-color": "#fafa00",
						// height:"1px",
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
					containment:"#texts-layer",
					scroll: false,
					cursor: "move",
					create: function(){
						$(this).css({
							position : "absolute",
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
						p.surfaces[s].text_stack[thistextsystemid].position.top = Yperc_pos+"%";
						p.surfaces[s].text_stack[thistextsystemid].position.left = Xperc_pos+"%";
						p.surfaces[s].text_stack[thistextsystemid].position.top_percents = Yperc_pos;
						p.surfaces[s].text_stack[thistextsystemid].position.left_percents = Xperc_pos;

						p.surfaces[s].text_layer_web_width = $("#texts-layer").width();
						// $("#texts-layer").append( $("<div>").css({ position:"absolute", top: Yperc_pos+"%", left: Xperc_pos+"%", border:"solid thin #f00", width:"4px", height:"4px", "border-radius":"2px" }) );
					}
				});
				$("#texts-layer").append( $onstagetext );
		}
	}
}

//--------------------------------------------------------------
// RENDER PRODUCT DATA ON THE STAGE

function renderProduct(data, product, optFunc){
	$.extend( product, JSON.parse( data.productdata ));
	if(product.db_id == null){ product.db_id = data.id };
	
	loadImage( product, undefined, function(){
		// loadGrid( product );

		if(typeof optFunc == "function"){
			optFunc();
		}

		loadOptionalImages( product );
	});
}

//--------------------------------------------------------------
// DOWNLOAD IMAGE OF THE PRODUCT

function loadImage( p, opturl, optFunkOnLoad ){
	var sideid = p.default_surface, //sideID(),
	img_css = { width: (convertUnits( p.surfaces[sideid].img_width, "to pix print" ) * (p.scale/100))+"px" },
	img_src = (typeof opturl == "undefined") ? p.surfaces[ sideid ].imgurl : opturl;
	product_img = $("<img>").prop("src", img_src );
	$("#product-image-container")
			.find("img").remove().end()
			.append( product_img 
						.load(function(e){ // Resize and reposition image of the product
								var self = this,
									prod_to_page_ratio = 0.5,
									main_col_size_rat = 1,
									prod_wrap_size_rat = 1;

								
								main_col_size_rat = $("#main-column").width() / $("#main-column").height();
								// check the ratio of product height to window height
								prod_to_page_ratio = $(this).height() / $(window).height();

								if(prod_to_page_ratio > 0.6 && prod_to_page_ratio < 0.8){ 
									$("#main-column").removeProp("class").addClass("cols-8"); 
								}
								
								if(prod_to_page_ratio > 0.8 && prod_to_page_ratio < 1){ 
									$("#main-column").removeProp("class").addClass("cols-7");
								}
								$("#product-wrapper").height($(this).height());
								

								if(typeof optFunkOnLoad == "function"){
									optFunkOnLoad();
								}

								

								$(window).resize(function(){
									$("#product-wrapper").height($(self).height());
									prod_to_page_ratio = $(this).height() / $(window).height();

									if(prod_to_page_ratio < 0.6){ $("#main-column").removeProp("class"); }
									if(prod_to_page_ratio > 0.6 && prod_to_page_ratio < 0.8){ $("#main-column").removeProp("class").addClass("cols-8"); }
									if(prod_to_page_ratio > 0.8 && prod_to_page_ratio < 1){ $("#main-column").removeProp("class").addClass("cols-7"); }
								})
						})
			);

	if( typeof p.surfaces[ sideid ].maskurl !== "undefined"){
		$("#product-image-container").append( $("<img>").prop("src", p.surfaces[ sideid ].maskurl).addClass("product-mask"))
		// console.log("MASK: ",decodeURIComponent(p.surfaces[ sideid ].maskurl));
	}
}

//---------------------------------------------------------------------------------
// 

function loadOptionalImages( p ){
	var sideid = false,
		cont_height;
	$(".options-container").empty();

	for(side in p.surfaces){
		if(typeof p.surfaces[side].optional_images!= "undefined" && Object.keys(p.surfaces[side].optional_images).length > 0){
			if(typeof $(".options-container").data("isset") == "undefined" ){
				$(".options-container").data("isset", false);
				$(".options-container").data("side_name", side);
				sideid = side;
			}
		}
	}
	if(sideid){
		for(img in p.surfaces[sideid].optional_images){
			opt_img = $("<img>").prop("src", p.surfaces[sideid].optional_images[img].thumburl )
								.data("url", p.surfaces[sideid].optional_images[img].imgurl );

			if(typeof p.surfaces[sideid].optional_images[img].template_name != "undefined"){
				opt_img.data("template_name", p.surfaces[sideid].optional_images[img].template_name );	
			}

			$(".options-container").append(opt_img);
		}
		// cont_height = $(".options-container").height()+50;
		// $(".options-container").css({ bottom: "-"+cont_height+"px" })
		$(".options-container img").click(function(){
			var url = $(this).data("url");

			$(".options-container").data("isset", true);
			p.surfaces[sideid].imgurl = url;
			// loadImage(p, url);
			if($("#product-other-side", ".work-desk.web").length > 0) {
				$("#product-other-side", ".work-desk.web").find(".color-inset-preview-img").remove().end()
						   .append( $("<img>").load(function(){ switchStep("presave preview"); })
						   .prop("src", url)
						   .addClass("color-inset-preview-img") )
				$("#product-other-side", ".work-desk.web").css("z-index","6").css("display", "block")/*.addClass("fadein")*/;
			} else {
				
				$(".work-desk.mobile").find(".color-inset-preview-img").remove().end()
								   .append( $("<img>").load(function(){ switchStep("presave preview"); })
								   					  .prop("src", url)
								   					  .addClass("color-inset-preview-img") )
			}

			if(!isMobile()){
				$("#texts-layer").hide();
			}
		})
	}
}

//--------------------------------------------------------------
// LOAD GRID AND UPLOAD PHOTO CELLS

function loadGrid( p ){
	var sideid = p.default_surface, //sideID(),
		boxes = {},
		photo_size,
		gr_css_width_px = convertUnits( p.surfaces[sideid].grid.width, "to pix print" ) * (p.scale/100),
		gr_css_height_px = convertUnits( p.surfaces[sideid].grid.height, "to pix print" ) * (p.scale/100);

	// console.log(p.surfaces[sideid]);
	p.canvas_data = {}; // Reset canvas data

	product_size = { w: $("#product-wrapper").data( "product_css_w_px" ),
					 h: $("#product-wrapper").data( "product_css_h_px" ),
					 w_ratio: $("#product-wrapper").data( "product_css_w_px" ) / 100,
					 h_ratio: $("#product-wrapper").data( "product_css_h_px" ) / 100 };

	grid_css = { width: (gr_css_width_px / product_size.w_ratio)+"%",
				 height: (gr_css_height_px / product_size.h_ratio)+"%",
				 top: (p.surfaces[sideid].grid.y / product_size.h_ratio)+"%",
				 left: (p.surfaces[sideid].grid.x / product_size.w_ratio)+"%"  };

	$grid = $("#template-grid").empty().css( grid_css );
	$grid_helper = $("#grid-helper-frame").empty().css( grid_css );
	$("#texts-layer").css(grid_css);
	cell_css = {};

	// Copy details for canvas
	for(side in p.surfaces){
		p.layout_data.scale = p.scale/100;
		if(typeof p.layout_data[side] == "undefined"){
			p.layout_data[side] = {};

		};

		if(typeof p.layout_data[side].cells == "undefined"){ p.layout_data[side].cells = {}; };
		p.layout_data[side].canvas = { width: convertUnits( p.surfaces[side].width, "to pix print" ),
										 height: convertUnits( p.surfaces[side].height, "to pix print" ),
										 name: p.surfaces[side].surface_name };
		// Check if graphic template have been applyed to the surface
		if(typeof p.surfaces[side].grid.uri !== "undefined"){
			if(typeof p.layout_data[side].graphic_template == "undefined"){
				p.layout_data[side].graphic_template = { url: p.surfaces[side].grid.uri,
														 width: p.layout_data[side].canvas.width,
														 height: p.layout_data[side].canvas.height };
			}
		} else {
			if(typeof p.layout_data[side].graphic_template !== "undefined"){
				delete p.layout_data[side].graphic_template;
			}
		}
	}
	// console.log(convertUnits(p.surfaces[p.default_surface].img_width, "to pix print"));
	for(c in p.surfaces[sideid].grid.cells ){

		if(typeof p.surfaces[sideid].grid.cells[c].uploadable != "undefined" &&  p.surfaces[sideid].grid.cells[c].uploadable == true){
			c_w = p.surfaces[sideid].grid.cells[c].w * (p.scale/100);
			c_h = p.surfaces[sideid].grid.cells[c].h * (p.scale/100);
			c_x = p.surfaces[sideid].grid.cells[c].x * (p.scale/100);
			c_y = p.surfaces[sideid].grid.cells[c].y * (p.scale/100);

			cell_css = { width:  (c_w / (gr_css_width_px / 100)) +"%",
						 height: (c_h / (gr_css_height_px / 100)) +"%",
						 top: 	 (c_y / (gr_css_height_px / 100)) +"%",
						 left: 	 (c_x / (gr_css_width_px / 100)) +"%"  };

			if(typeof p.surfaces[sideid].grid.cells[c].rotation != "undefined"){
				
				$.extend(cell_css, { "-ms-transform-origin": "50% 50%",
									 "-webkit-transform-origin": "50% 50%",
									 "transform-origin": "50% 50%",
									 "-ms-transform": "rotate("+p.surfaces[sideid].grid.cells[c].rotation+"deg)",
									 "-webkit-transform": "rotate("+p.surfaces[sideid].grid.cells[c].rotation+"deg)",
									 "transform": "rotate("+p.surfaces[sideid].grid.cells[c].rotation+"deg)"} );
			}

			if(c_w < c_h){
				photo_dimensionA = "width";
				photo_dimensionB = "height";
			} else {
				photo_dimensionA = "height";
				photo_dimensionB = "width";
			}

			$polaroid_img = $("<img class='polaroid-icon' src='/assets/layout-img/personalization/polaroid-green-plain.png'>");
			var pi_w = $polaroid_img.width(),
				pi_h = $polaroid_img.height(),
				pi_rat = pi_w / pi_h;

			$polaroid_img.css(photo_dimensionA, "60%").css({"max-width": "128px", "max-height": "129px"});
							
			$("<div>").addClass("cell").prop("data-id", c)
									   .prop("data-c_w", p.surfaces[sideid].grid.cells[c].w)
									   .prop("data-c_h", p.surfaces[sideid].grid.cells[c].h)
									   .prop("data-c_x", p.surfaces[sideid].grid.cells[c].x)
									   .prop("data-c_y", p.surfaces[sideid].grid.cells[c].y)
									   .css( cell_css )
				.appendTo( $grid );

			$("<div>").addClass("cell-helper")
					  .prop("id", "cellhelper"+c)
					  .css( cell_css )
					  .append("<div class='cell-upload-hint'>Upload</div>")
					  .append($polaroid_img)
					  .appendTo( $grid_helper );
			// Save each cell data Printable
			p.layout_data[sideid].cells[c] = {	w: p.surfaces[sideid].grid.cells[c].w,
												h: p.surfaces[sideid].grid.cells[c].h,
												x: p.surfaces[sideid].grid.cells[c].x,
												y: p.surfaces[sideid].grid.cells[c].y, }

		}

	}

	$(".cell").unbind("mouseover").bind("mouseover", showCellInfo);
	$(".cell").unbind("mouseout").bind("mouseout", hideCellInfo);
	loadGraphic(p.surfaces[sideid].grid, p);

	// When empty cell clicked, switch to PhotoUpload tab

	if(isMobile()){
		$(".cell").unbind("click");
		$(".cell").bind("click", selectCell);
	}
}

function showCellInfo(e){
	c_id = $(this).prop("data-id")
	$("#cellhelper"+c_id).addClass("meover")
}

function hideCellInfo(e){
	$(".cell-helper").removeClass("meover");
}

function selectCell(){
	var c_step = $(".back-next-butt-wrapper").data( "current_step");
	unbindEvents();
	$(".cell").removeClass("selected_cell");
	$(this).addClass("selected_cell");

	$(".cell-helper").removeClass("selected_cell_helper");
	$("#cellhelper"+$(this).prop("data-id")).addClass("selected_cell_helper");

	if(!isMobile()){
		if($(this).hasClass("image-filled")){
			$(".toolset.workdesk").css("display", "table-row");
		} else {
			$(".toolset.workdesk").css("display", "none");
		}
	} else {
			
		if( (c_step == "upload photos" || c_step == "edit pictures" || c_step == "styles page") && !$(this).hasClass("image-filled") ){
			
			switchMenu("first upload menu");
		}
		if( $(this).hasClass("image-filled") ){
			switchStep("edit pictures");	
		}
	}
}
//--------------------------------------------------------------
//

function switch2PhotoUpload(){
	switchTab.call( $("#photos-tab"));
}

//---------------------------------------------------------------------------------
// 
function removeAdjacentSides(){
	// Make ID for each side to check if any of the cells share the same side
	sideA = "x1_"+c_x+"y1_"+c_y+"x2_"+(c_x+c_w)+"y2_"+c_y;
	sideB = "x1_"+(c_x+c_w)+"y1_"+c_y+"x2_"+(c_x+c_w)+"y2_"+(c_y+c_h);
	sideC = "x1_"+c_x+"y1_"+(c_y+c_h)+"x2_"+(c_x+c_w)+"y2_"+(c_y+c_h);
	sideD = "x1_"+c_x+"y1_"+c_y+"x2_"+c_x+"y2_"+(c_y+c_h);

	// Sides of the current cell
	current_box = { top: sideA, right: sideB, bottom: sideC, left: sideD };
	// Save sides that are adjacent in this array
	adjacent_sides = [];
	// Compare each side of the current cell to each side of all previous sides
	for(side in current_box){
		for(box in boxes){
			for(s in boxes[box]){
				if( current_box[side] === boxes[box][s] ){
					// Push css border style
					adjacent_sides.push("border-"+side+"-color");
				}
			}
		}
	}

	// Add current cell with its sides to the rest of the cells stack
	boxes[c] = current_box;

	border_css = {};

	for(var i = 0, tot = adjacent_sides.length; i < tot; i++){
		border_css[ adjacent_sides[i] ] = "#f00";
	}
}

//--------------------------------------------------------------
// IMAGE QUALITY

function imageQuality(data){
	q = { num_stars: 5, value: 100};

	$.extend(q, data);

	var one_star_val = 100 / q.num_stars,
		current_stars = 0;
		stars = "";

	for(var i = 0, tot = q.num_stars; i < tot; i+=1){
		if( current_stars <= q.value ){
			stars += "<a class='star full'>&#9733;</a>";

		} else {
			stars += "<a class='star empty'>&#9734</a>";
		}

		current_stars += one_star_val;
	}

	return stars;
}

//---------------------------------------------------------------------------------
// 

function outputQuality(cells){
	var qualyty_summ = 0,
		counter = 0;

	for( cell in cells){
		if(typeof cells[cell].quality !== "undefined"){
			// If Quality value is greater than 100% make it 100
			if(cells[cell].quality > 100){ cells[cell].quality = 100; }
			qualyty_summ += cells[cell].quality;
			counter += 1;
		}
	}

	avarage_quality = qualyty_summ / counter;

	$("#overal-image-quality-wrapper").html(
		"Print Quality "+imageQuality( { value: avarage_quality, num_stars: 7 })
	);
}

//--------------------------------------------------------------
// SWITCH SIDE

function switchSide( e ){
	$(".sides-switch-butt").removeClass("activesideswitch");
	$(this).addClass("activesideswitch");

	// $("#product-other-side").removeClass("fadeout").removeClass("fadein");

	switch( $(this).prop("id") ){
		case "side-inside-switch": 
			$("#product-other-side").css("z-index", "6");
			$("#texts-layer").hide();
		break;
		case "side-outside-switch": 
			$("#product-other-side").css("z-index", "-4"); 
			$("#texts-layer").show();
		break;
	}
}

//--------------------------------------------------------------
// MAKE RADIO MENUE TO SWITCH SIDES

/*
	<div id='sides-switch'>
		<input type='radio' name='sideswitch' id='sideswitch_surfaceN' checked='true/false' value='N'>
		<input type='radio' name='sideswitch' id='sideswitch_surfaceN1' checked='true/false' value='N1'>

		<table align='center'>
			<tr>
				<td>
					<label for='sideswitch_surfaceN' class='back-spread-icon/front-spread-icon activesideswitch'>Front</label>
				</td>
				<td>
					<label for='sideswitch_surfaceN1' class='back-spread-icon/front-spread-icon'>Front</label>
				</td>
			</tr>
		</table>
	</div>
*/
function makeSideSwitchMenu(product){
	var width;
	table = $("#sides-switch .table .tr");
	
	for(s in product.surfaces){
		
		$("<input type='radio' name='sideswitch' />")
			.prop("id", "sidewitch_"+s)
			.prop("checked", s == product.default_surface)
			.val( s ).appendTo(table);

		td = $("<div class='td'>").appendTo(table);
		
		switch(product.surfaces[s].surface_icon_class){
			case "front-spread-icon" : source = "/assets/layout-img/spreads_outside_icon.png"; break;
			case "back-spread-icon" : source = "/assets/layout-img/spreads_inside_icon.png"; break;
		}

		$l = $("<label>")
			.prop("for", "sidewitch_"+s)
			.addClass(product.surfaces[s].surface_icon_class)
			.html( "<img src='"+source+"' /><span>" + product.surfaces[s].surface_name + "</span>")
			.appendTo(td);

		if(s == product.default_surface){
			$l.addClass("activesideswitch");
		}
	}
	$(".td:last", "#sides-switch").after($("#save-design-butt-container"));
	// DELETE NEXT ROW TO SHOW SIDES SWITCH  //
		// $("#sides-switch").hide();  		//
	//-------------------------------------//

	$("input[name='sideswitch']").change( { product: product }, switchSide );
}

//-------------------------------------------------------------
// 

function sideID(){
	return $("input[name='sideswitch']:checked").val();
}

//-------------------------------------------------------------
// CONVERT UNITS

function convertUnits(val, toval){
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

//---------------------------------------------------------------------------------
// 
function updateBasketInfo(){
	a_basket = $("#cart-items-counter");
	$.post("../inc/ShoppingCartServer.php", { get_total_in_basket: true }, function(data){
		if(!data.error){
			if(data.total >0){
				remainder = data.total%10;
				if(remainder === 1){
					$("#cart-items-counter").html( data.total +" item");
				}else{
					$("#cart-items-counter").html( data.total +" items");	
				}
			} else {
				$("#cart-items-counter").html("0 items");
			}
		} else {
			$("#cart-items-counter").html("0");
		}
	}, "json")
}

//---------------------------------------------------------------------------------
// 

function confirmMSG(window_class, message, yesFunc, noFunk){
	$(".popup-message-window"+window_class).css("display", "block");
	$(".popup-message-window"+window_class).find(".message-wrapper").html(message);
	$(".popup-message-window"+window_class).find(".yes-butt").click(yesFunc);
	$(".popup-message-window"+window_class).find(".no-butt").click(noFunk);
}


/* Adjust responsive elements based on its current state
-----------------------------------------------------------------------------------*/
function responsiveSetup(){
	if( typeof $("#mobile-style-detector:visible") !== "undefined" && $("#mobile-style-detector:visible").length >= 1 ){
		$("#product-wrapper").detach().appendTo(".work-desk.mobile");
	} else {
		$("#product-wrapper").detach().appendTo(".work-desk.web");
	
		step = $(".back-next-butt-wrapper").data( "current_step");
		switch(step){
			case "select layout": break;
			
			case "layout page": toggleScrollBar(".layout-templates:visible"); break;
			case "styles page": toggleScrollBar(".graphic-templates:visible"); break;
			
			case "upload photos": toggleScrollBar(".layout-templates:visible"); break;
			case "facebook page": toggleScrollBar(".layout-templates:visible"); break;

			case "edit pictures": toggleScrollBar(".upload-page-wrapper:visible"); break;

			case "select color insert or save": toggleScrollBar(".optional-surface:visible"); break;

			case "presave preview":
				
			break;

			case "save product":
				
			break;
		}
	}
}

function isMobile(){
	if( typeof $("#mobile-style-detector:visible") !== "undefined" && $("#mobile-style-detector:visible").length >= 1 ){
		return true;		
	} else {
		return false;
	}
}








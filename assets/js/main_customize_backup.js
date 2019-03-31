// ------ ON DOCUMENT READY ----------------------------------------------------------------
$(document).ready(function(e){

	window.utils = new MPixelsUtils();
	// o_canva = new OwnsterCanvas();
	window.cell_setup = {};
	product = { layout_data: {}, canvas_data: {} };
	window.userfiles = new FilesHandler( { preview_container: $("#user-files-preview-wrapper"), p: product } );

	$.sessionStorage.isSet("selection_setup") ? $.sessionStorage.remove("selection_setup") : null;
	$.sessionStorage.remove("cell_setup");
	loadProduct( product );
	// Files Selected event
	$("#user-files-inp").change( function(e){
		userfiles.handleFiles(this.files[0]);
	})
	// Save Design Event
	/*$("#save-design-butt").prop("disabled", false).click(function(){
		var design_not_complete = false;
		
		for(c in product.layout_data[ product.default_surface ].cells){
			if(typeof product.layout_data[ product.default_surface ].cells[c].image == "undefined"){
				design_not_complete = true;
			}
		}
		if(design_not_complete){
			confirmMSG(
				".confirm-action",
				"There are empty cells in your design. Would you like to add more photos?",
				function(){
					$(".popup-message-window.confirm-action").css("display", "none");
					
				},
				function(){
					$(".popup-message-window.confirm-action").css("display", "none");
					// Check if options exist and selected
					preSaveCheck({data:{product: product}});
				}); 
			
		} else {
			preSaveCheck({ data: { product: product } })
			// saveDesign();
		}
	});*/

	userfiles.onImageReady = function(dataURL, file_id){
		loadImage2Cell( { image_source: dataURL, p: product, file_id: file_id } );
	}
	// Image thumbnails ready event
	userfiles.onFilesReady = function(){
		switchStep("edit pictures", product);
		// makeThumbsDraggable(".img_preview_container");
	};
	
	// Facebook button
	$(".upload-method-butt.fb-upload").click( facbookHandler );

	// Instagram
	$(".upload-method-butt.insta-upload").click({p: product}, instagramHandler );

	$("#layout-butt").click(function(){ 
		switchStep("layout page", product);  
	});
	
	$("#styles-butt").click(function(){ 
		switchStep("styles page", product);  
	});
	
	$(".back-button").click( { direction: "back", p: product }, changeStep);
	
	$(".next-button").click( { direction: "next", p: product }, changeStep);
	
	$("#upload-butt").click(function(){
		switchMenu("upload", product);
	});

	$("#rotate-butt").click(function(){
		switchMenu("rotate", product);
	});
			
	$("#move-butt").click(function(){
		switchMenu("move", product);
	});
			
	$("#zoom-butt").click(function(){
		switchMenu("zoom", product);
	});

	$("#text-butt").click(function(){
		switchMenu("text", product);
	});

	switchStep("select layout", product);
	addTextFunctionsInit(product);
});

/* Change Current Step
------------------------------------------------------------------------------------ */
function changeStep(e){
	var direction = e.data.direction,
		p = e.data.p;

	switch(direction){
		case "back": 
			switch($("#back-next-butt-wrapper").data( "current_step" )){
				case "select layout": window.location = "/our-products/"; break;
				case "upload photos": switchStep("select layout", p); break;
				case "edit pictures": switchStep("select layout", p); break;
				case "select color insert or save": switchStep("edit pictures", p); break;
				case "presave preview": 
					if($("#options-container").data("side_name") !== undefined){
						switchStep("select color insert or save", p); 
					} else {
						switchStep("edit pictures", p); 
					}
				break;
			}
		break;
		
		case "next":
			switch($("#back-next-butt-wrapper").data( "current_step" )){
				case "select layout": 
					if($("#back-next-butt-wrapper").data( "layout_selected" ) == "selected"){ 
						switchStep("upload photos", p);
					}
				break;
				case "edit pictures": switchStep("select color insert or save", p); break;
				case "select color insert or save": switchStep("presave preview", p);
				case "presave preview":
					switchStep("save product", p);
				break;
				case "save product":
					switchStep("save product", p);
				break;
			}
		break;
	}
}

/* switchStep Function
------------------------------------------------------------------------------------ */
function switchStep(step, p){
	$(".toolset").css("display", "none");
	$(".subset").css("display", "none");
	$(".page").css("visibility", "hidden");
	$(".user-message").hide();

	// alert(step);

	switch(step){
		case "select layout":
			// Show user message
			$(".user-message").show().find("h1")
				.text("Please select a Layout or a Graphic Style for your product. Then proceed to the Next step.");
			$("#bottom-panel").show();
			// change Menue to layout
			$(".toolset.layout").css("display", "table-row");

		break;
		
		/* Layouts fullscreen page ----------------*/
		case "layout page": 
			$("#layout-templates").css("visibility", "visible");
		break;

		/* ---------- Graphics fullscreen page ----------------*/
		case "styles page":
			$("#graphic-templates").css("visibility", "visible");
		break;
		
		/* ----------- Offer to upload photos  ----------------*/
		case "upload photos": 
			$(".user-message").show().find("h1")
				.text("Click an empty cell to upload your photo.");
			if($(".image-filled").length > 0){
				switchStep("edit pictures");
			} else {
				$("#bottom-panel").hide();
			}
		break;

		case "edit pictures":
			$("#upload-page-wrapper").css("visibility", "hidden");
			$("#bottom-panel").show();
			$("#grid-helper-frame").show();
			$(".next-button").text("Next →");
			$(".color-inset-preview-img").remove();

			if( $("#bottom-panel").data("current_subset") == null ){
				$(".toolset.workdesk").css("display", "table-row");
			} else {
				var c_subset = $("#bottom-panel").data("current_subset");
				$(".subset."+c_subset).css("display", "table-row");
			}

		break;

		case "select color insert or save":
			if($("#options-container").data("side_name") !== undefined){
				$(".next-button").text("Next →");
				$("#optional-surface").css("visibility", "visible");
			} else {
				switchStep("presave preview");
			}
		break;
		
		case "presave preview":
			$("#bottom-panel").hide();
			$("#grid-helper-frame").hide();
			$(".next-button").text("Save");
		break;

		case "save product":
			// $("#upload-progress-page").css("visibility", "visible");
			saveProduct(p);
		break;
	}

	$("#back-next-butt-wrapper").data( "current_step", step );
}

function switchMenu(menue, p){
	var $selected_cell = $( ".selected_cell" ),
		c_id = $selected_cell.prop("data-id");

	$(".subset").css("display", "none");
	$(".toolset").css("display", "none");
	$("main").unbind("vmousemove")
			 .unbind("touchstart");

	switch(menue){
		/* -------- Layouts and Graphics fullscreen page ---------*/
		case "first upload menu":
			var c_step = $("#back-next-butt-wrapper").data( "current_step");
			if( c_step == "upload photos" || c_step == "edit pictures" ){
				$("#upload-page-wrapper").css("visibility", "visible");
			}
		break;

		/*--------- Facebook and Instagram files preview page (fullscreen) ------------*/
		case "files preview menu": 
			$("#user-files-preview-wrapper").css("visibility", "visible");
		break;

		case "upload": 
			$(".subset.upload").css("display", "table-row"); 
			$("#bottom-panel").data("current_subset", "upload");
		break;

		case "rotate": 
			$(".subset.rotate").css("display", "table-row");
			$("#rotate-left-butt").bind("click", function(e){ p.canvas_data[c_id].rotate(-90) });
			$("#rotate-right-butt").bind("click", function(e){ p.canvas_data[c_id].rotate(90) });
		break;
		
		case "move":
			$(".subset.move").css("display", "table-row");
			$("main").bind("touchstart", function(e){ p.canvas_data[c_id].touchImgHandler(e) })
					 .bind("vmousemove", function(e1){ p.canvas_data[c_id].moveImgHandler(e1) })
		break;

		case "zoom": 
			$(".subset.zoom").css("display", "table-row");
			$("#zoomin-butt").bind("click", function(e){ p.canvas_data[c_id].zoom(0.025); });
			$("#zoomout-butt").bind("click", function(e){ p.canvas_data[c_id].zoom(-0.025); });
		break;
		case "text": $(".subset.text").css("display", "table-row"); break;
	}

	$(".done-butt").bind("click", function(){ 
		var c_step = $("#back-next-butt-wrapper").data( "current_step"); 
		$("#bottom-panel").data( "current_subset", null );
		$("main").unbind("vmousemove").unbind("touchstart");
		$("#rotate-left-butt").unbind("click")
		$("#rotate-right-butt").unbind("click");
		$("#zoomin-butt").unbind("click");
		$("#zoomout-butt").unbind("click");
		switchStep(c_step);
	});
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
------------------------------------------------------------------------------------ */
/*function preSaveCheck(data){
	if(typeof $("#options-container").data("isset") !== "undefined" && $("#options-container").data("isset") == false){
		confirmMSG(
			".do-action",
			"Please select the inner colour of your wallet.",
			function(){
				$(".popup-message-window.do-action").css("display", "none");
				$("input[name='sideswitch'][value='"+$("#options-container")
					.data("side_name")+"']").prop("checked", true)
					.change();

			},
			function(){}
		);
	} else {
		saveDesign(data);
	}
}*/
//---------------------------------------------------------------------------------
// 

function addTextFunctionsInit(p){
	// Color Picker Settings --------------
	$("#colorSelector")
		.data("text-color", '#000000')
		.spectrum({
			chooseText: "Choose",
			change: function(color) {
			    var thistextsystemid = $("#texts-layer").data("active-text"),
			    	s = p.default_surface;
				$('#colorSelector').data("text-color", color.toHexString());
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
	$("#font-family-select").ddslick({
		width: "100%",
	    selectText: "Select a Font",
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
	$("#font-size-select").ddslick({
		width: "100%",
	    selectText: "Select a Font Size",
	    onSelected: function (data) {
	    	var thistextsystemid = $("#texts-layer").data("active-text"),
	    		s = sideID();;
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

	$("#add-new-text-butt").click(function(){
		var elms_set_class = "text-set"+$(".text-input-box").length,
			ddSlickFontFamData = $("#font-family-select").data("ddslick"),
			ddSlickFontSizData = $("#font-size-select").data("ddslick"),
			fontfamily = ddSlickFontFamData.selectedData.value,
			fontsize = ddSlickFontSizData.selectedData.value,
			textcolor = $('#colorSelector').data("text-color"),
			s = sideID();
		if ( typeof p.surfaces[s].text_stack == "undefined" ){
			p.surfaces[s].text_stack = {};
		}

		p.surfaces[s].text_stack[elms_set_class] = { position: { top: 50, left: 50 },
													 tcolor: textcolor,
													 fsize: fontsize,
													 ffamily: fontfamily,
													 text: "",
													 selected_index: { sindex: 0, findex: 0 } }

		$textinput = $("<input type='text' class='text-input-box'/>").toggleClass(elms_set_class);
		$deletebutt = $("<a class='delete-text-button'>X</a>").toggleClass(elms_set_class);

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
					s = sideID();
				$(".onstage-text."+thistextsystemid).text($(this).val());
				p.surfaces[s].text_stack[thistextsystemid].text = $(this).val();
			});

		$("#text-inputs-wrapper").prepend(
			$("<div id='text-input-container'>").append($textinput).append($deletebutt)
		);
		$textinput.focus();
	})

	// Load fonts from google
	loadGoogleFonts();
}
//---------------------------------------------------------------------------------

function loadGoogleFonts(){
	var wf = document.createElement('script');
	WebFontConfig = {
	    google: { families: [ 'Astloch::latin', 'IM+Fell+English+SC::latin', 'Nosifer::latin', 'Alfa+Slab+One::latin', 'Ubuntu+Mono::latin', 'Trade+Winds::latin', 'Codystar::latin', 'Stalemate::latin', 'Poiret+One::latin', 'Henny+Penny::latin', 'Quicksand::latin', 'Petit+Formal+Script::latin', 'Lobster::latin', 'Fugaz+One::latin', 'Shadows+Into+Light::latin', 'Josefin+Slab::latin', 'Frijole::latin', 'Fredoka+One::latin', 'Gloria+Hallelujah::latin', 'UnifrakturCook:700:latin', 'Tangerine::latin', 'Monofett::latin', 'Monoton::latin', 'Pacifico::latin', 'Spirax::latin', 'UnifrakturMaguntia::latin', 'Creepster::latin', 'Maven+Pro::latin', 'Amatic+SC::latin', 'Dancing+Script::latin', 'Pirata+One::latin', 'Play::latin', 'Audiowide::latin', 'Open+Sans+Condensed:300:latin', 'Kranky::latin', 'Black+Ops+One::latin', 'Indie+Flower::latin', 'Sancreek::latin', 'Press+Start+2P::latin', 'Abril+Fatface::latin', 'Jacques+Francois+Shadow::latin', 'Ribeye+Marrow::latin', 'Playball::latin', 'Roboto+Slab::latin' ] }
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

function facbookHandler(){
	FB.getLoginStatus(function(response) {
  		if(response.status == "connected"){
			// Logged in
			FB.api('/me/?fields=albums{ name, picture }', function(response) {
				if(response && !response.error){
					$("#upload-buttons-wrapper-vertical").hide();
					$("#upload-buttons-wrapper").css("visibility", "visible");
					loadFBAlbums(response);
					window.albums_response = response;
				}
				
			});
		} else {
			FB.login(function (response) {
				if (response.authResponse) {
					facbookHandler();
				} else {
					// Login canceled
				}
			}, {scope:'user_photos'});
		}
	}, true);
}

function loadFBAlbums(r){
	if(typeof r.albums !== "undefined"){
		$("#user-files-preview-wrapper").find("*").remove()
		
		for( a in r.albums.data){
			$img = $("<img>").prop("src", r.albums.data[a].picture.data.url);
			
			$("<figure>").addClass("fb-album-thumbnail")
					  .prop("data-id", r.albums.data[a].id )
					  .append( $("<div>").addClass("fb-album-cover-image-container").append($img))
					  .append( $("<figcaption>").text( r.albums.data[a].name ) )
					  .click( { albumid: r.albums.data[a].id }, openAlbum)
			.appendTo("#user-files-preview-wrapper")
			
			// arrange image center inside its container
			$img.on("load", imgArangeCenter);
		}
	}
}

//--------------------------------------------------

function openAlbum(e){
	var albid = e.data.albumid;
	
	FB.api("/"+albid+"/photos/?fields=source", function(r){
		$("#user-files-preview-wrapper").find("*").remove()
		for(p in r.data){
			userfiles.renderImage(r.data[p].source, r.data[p].id, "fb")	
		}
		userfiles.onFilesReady();
		$("#upload-hints").show().text("Back to albums.")
						  .click( function(){
						  	 loadFBAlbums( albums_response );
						  	 $(this).hide();
						  } )
	})
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
			renderInstaImages("#user-files-preview-wrapper");
		},

		// Render images in container.
		renderInstaImages = function(container){
			$(container).find("*").remove();
			for(img in user_images){
				if(typeof user_images!= "undefined" && typeof user_images[img]!= "undefined"){
					// Save file name to instagram files array. Used when saving design.
					layout_data.instagram_files.push(user_images[img].images.standard_resolution.url);

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

	layout_data = e.data.p.layout_data[sideID()],
	layout_data.instagram_files = [];
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
			if(typeof ts[t].cells[c].uploadable != "undefined" &&  ts[t].cells[c].uploadable == true){
				c_w = ts[t].cells[c].w / w_scale;
				c_h = ts[t].cells[c].h / h_scale;
				c_x = ts[t].cells[c].x / w_scale;
				c_y = ts[t].cells[c].y / h_scale;

				cell_css = { width:  (c_w / (t_w / 100))+"%",
							 height: (c_h / (t_h / 100))+"%",
							 top: 	 (c_y / (t_h / 100))+"%",
							 left: 	 (c_x / (t_w / 100))+"%"  };
				
				photo_size = c_w < c_h ? c_w : c_h;

				$("<div>").addClass("preview-cell")
					.css( cell_css )
					.append($("<div class='photo-icon'>").css("height", (photo_size / (c_h / 100))+"%").css("width", (photo_size / (c_w / 100))+"%").css("margin-top", ((( c_h-photo_size )/2) / (c_h / 100))+"%" ))
					.appendTo( $thumbnail );
			}
		}

		if(typeof ts[t].thumburl !== "undefined"){
			$img = $("<img>").prop("src", ts[t].thumburl).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
		} else{
			if(typeof ts[t].uri !== "undefined"){
				$img = $("<img>").prop("src", ts[t].uri).addClass("graphic-templ-thumb-img").appendTo($thumbnail);
			}
		}

		$(settings.preview_container).append( $thumbnail );

		$thumbnail.click({ p: p, templates_obj: settings.templates_obj, 
			optFunc: { lg: loadGraphic,
						b: function(){
								$("#back-next-butt-wrapper").data( "layout_selected", "selected" )
								switchStep("select layout", p); 
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
		side_id = p.default_surface;

	$(".template-prewiew-thumb").removeClass("active");
	typeof templ_id != "undefined" ? $("."+template_id).addClass("active")
									: $(this).addClass("active");

	p.current_template = template_id;
	if(typeof p[templ_obj][side_id][template_id] !== "undefined"){
		p.surfaces[side_id].grid = p[templ_obj][side_id][template_id];
	}

	$.sessionStorage.isSet("selection_setup") ? $.sessionStorage.remove("selection_setup") : null;
	$.sessionStorage.isSet("cell_setup") ? $.sessionStorage.remove("cell_setup") : null;
	p.layout_data = {};
	
	loadGrid(p);
	// loadGraphic
	if(typeof e.data.optFunc !== "undefined" && typeof e.data.optFunc.lg == "function"){
		e.data.optFunc.lg(p[templ_obj][side_id][template_id], p);	
	} 
	// Additional function
	if(typeof e.data.optFunc !== "undefined" && typeof e.data.optFunc.b == "function"){
		e.data.optFunc.b();	
	} 
}

function loadGraphic(graph_templ_obj, p){
	var css_w, css_h,
		parent_w, parent_h,
		side_id = p.default_surface;
	
	$(".graph-templ-image").remove();

	if (typeof graph_templ_obj.uri !== "undefined") {

		product_size = { w: $("#product-wrapper").data( "product_css_w_px" ),
						 h: $("#product-wrapper").data( "product_css_h_px" ),
						 w_ratio: $("#product-wrapper").data( "product_css_w_px" ) / 100,
						 h_ratio: $("#product-wrapper").data( "product_css_h_px" ) / 100 };

		css_w = ((convertUnits( p.surfaces[side_id].width, "to pix print" ) * (p.scale/100)) / product_size.w_ratio)+"%";
		css_h = ((convertUnits( p.surfaces[side_id].height, "to pix print" ) * (p.scale/100)) / product_size.h_ratio)+"%";
		$img = $("<img>").prop("src", graph_templ_obj.uri)
						 .addClass("graph-templ-image")
						 .css({ top: (p.surfaces[side_id].y / product_size.h_ratio)+"%" ,
						 		left: (p.surfaces[side_id].x / product_size.w_ratio)+"%", })
						 .width(css_w)
						 .height(css_h);
		$("#product-image-container").append($img);
	};
}

//---------------------------------------------------------------

/*function switchTab(){
	hideHint();
	$(".product-tools-panel ").find("li").removeClass("active").end()
							  .find(".panel").removeClass("active");
	$(this).addClass("active");

	if( typeof arguments[0] !== "undefined" && typeof arguments[0].data !== "undefined" && typeof arguments[0].data.product !== "undefined"){
		product = arguments[0].data.product;
	}

	switch($(this).prop("id")){
		case "layout-tab" : $("#layout-templates").addClass("active");
							if( typeof product.templates !== "undefined"){
								previewTemplates( product.product_data, product, { preview_container: "#template-thumbnails-container", templates_obj: "templates" } );
								$(".template-prewiew-thumb").removeClass("active");
								if(typeof product.current_template != "undefined"){
									$("."+product.current_template).addClass("active");
								}
							} 
							break;

		case "graphics-tab" : $("#graphic-templates").addClass("active");
							if( typeof product.graphic_templates !== "undefined" && typeof product !== "undefined"){
								previewTemplates( product.product_data, product, { preview_container: "#graphic-thumbnails-container",templates_obj: "graphic_templates" } );
							}
							break;
									
		case "photos-tab" : $("#user-files").addClass("active"); break;
		case "text-tab" : $("#add-text-panel").addClass("active"); break;
	}
}*/

/*function makeThumbsDraggable(elm){
	$(elm).draggable({
		revert: "invalid", // when not dropped, the item will revert back to its initial position
		containment:"document",
		scroll: false,
		helper: "clone",
		cursor: "move",
		drag: function(){
			hideHint();
		},
		stop: function(){
			// $("#grid-helper-frame").css("visibility", "hidden");
		}

	});
}*/

//---------------------------------------------------------------

/*function makeDroppable(elm, p){
    var addImgToCell = function( event, ui, t) {
	      	var self = (typeof t !== "undefined") ? t : this,
	      		this_cell_w = $(self).width(), // Current width of the cell. relative to the size of the inner window
	      		this_cell_h = $(self).height(), // Current height of the cell. relative to the size of the inner window
	      		this_cell_w_px = $(self).prop("data-c_w"), // Current width of the cell in pixels before the window was scaled
	      		this_cell_h_px = $(self).prop("data-c_h"), // Current height of the cell in pixels before the window was scaled
	      		c_id = $(self).prop("data-id"),
	      		
	      		// Downloads FB and Instagram images to our server
	      		downloadFile = function(postdata, $thumbimg){
	      			var cell_msg = $("<em class='cell-loading-msg'>Loading...</em>");
	      			// $("#cellhelper"+c_id).append(cell_msg);
	      			$(self).append(cell_msg);
	      			$.post("../assets/php/instagram_server/index.php", postdata, function(respond){
						if(!respond.error){
							$thumbimg.prop("src", respond.imgurl).prop("data-source", "server");
							cell_msg.remove();
							loadImage2Cell( $("<img>").prop("src", respond.imgurl) );
						}
					}, "json");
	      		};

	      	$(".photo-icon-green",self).remove();
	      	if(typeof img_edit_hint_shown == "undefined"){
	      		hideHint();
	      		showHint("image-edit");
	      		window.img_edit_hint_shown = true;
	      	}

	      	// Check the source of the image. If Facebook or Instagram then image needs to be downloaded to our server first.
	      	switch($("img", ui.draggable ).prop("data-source")){
	      		case "fb" 	: downloadFile({ download_FB_file: $("img", ui.draggable ).prop("src") }, $("img", ui.draggable )); break;
	      		case "insta": downloadFile({ download_single_file: $("img", ui.draggable ).prop("src") }, $("img", ui.draggable )); break;
	      		default : loadImage2Cell( $("<img>").prop("src", $("img", ui.draggable ).prop("src")) ); break;
	      	}
    	};

    $(elm).each(function(){
    	var thumb = p.surfaces[p.default_surface].grid.cells[$(this).prop("data-id")];
    	if( typeof thumb.dropped_img_id !== "undefined"){
    		addImgToCell( null, { draggable: $("#"+thumb.dropped_img_id) }, this);
    	}
    })

    $(elm).droppable({
      accept: ".img_preview_container",
      activeClass: "ui-state-highlight",
      drop: addImgToCell
    });

}*/

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
			
		if(!$selected_cell.hasClass("image-filled")){
			$selected_cell.addClass("image-filled");
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
	    p.canvas_data[c_id].render();

	    $selected_cell.find("canvas").remove().end()
			 .append( $canvas )
			 .css({ opacity: "1", border: "none" });
	}
}

//---------------------------------------------------------------
// BIND CROP EVENT TO THE IMAGE

function bindCropToImage( $img, p ){

	var jcrop_api,
		$large_img;
	// Make click event trigger zone ontop of all elements
	$("<div>").addClass("trigger").width($img.parent().width())
									.height($img.parent().height())
									.css({ position: "absolute", 
											top: $img.parent().position().top+"px", 
											left: $img.parent().position().left+"px" })
									.click(function(){ $img.click(); })
									.appendTo($("#product-image-container"));
	//--------------------------------------------------------------------------------------
	// Cell click event. Pop Up Window
	$img.unbind("click").bind("click", function(){

		var clicked_img = this,
			side_id = p.default_surface,
			window_h_scale = 0.80,
			img_w,
			img_h;
		$("#popup-window").css("visibility", "visible");
		hideHint();
		$large_img = $("<img>").prop("src", $(this).prop("src"));
		img_w = $large_img[0].width;
		img_h = $large_img[0].height;
		// $("#popup-window #img-container").empty().append( $large_img );
		// Resize image in the pop up window
		$("#img-canvas").length <= 0 && $("#centered-window").prepend($("<canvas id='img-canvas' data-rotation='0'>"));
		$("#img-canvas").prop("width", img_w)
						.prop("height", img_h);

		img_w < img_h ? $("#img-canvas").css("height", $( window ).height() * window_h_scale )
					  : $("#img-canvas").css("width", $( window ).height() * window_h_scale );
		// Allign popup window in center
		$("#popup-window #centered-window")
				.css({  top: "50%", "margin-top": ($("#popup-window #centered-window").height()/2 * -1)+"px",
						left: "25%", "margin-left": ($("#popup-window #centered-window").width()/2 * -1)+"px" })
		//----------------------------------------------------------------------------------
		// Image ready
		$large_img.load(function(){

			var self = this,
				ctx = $("#img-canvas")[0].getContext("2d");

			cell_data_storage = $.sessionStorage.get("selection_setup");
			if(cell_data_storage != null && typeof cell_data_storage[ c_id+side_id ] == "object"){
				$.extend(cell_data, cell_data_storage[ c_id+side_id ]);
			};

			ctx.drawImage(this, 0,0);
			
			cropImage( { image: $("#img-canvas")[0], clicked_img: clicked_img, p: p } );

			img_rotation_data_map = { img: this, jcrop: jcrop_api, cropImg: cropImage, crop_img_args: { image: $("#img-canvas")[0], clicked_img: clicked_img, p: p } };
			$("#rotate_left_butt").bind("click", img_rotation_data_map, rotate);
			$("#rotate_right_butt").bind("click", img_rotation_data_map, rotate);

		})
		// Done Button event
		$("#popup-window button.done-butt").click(function(){
			// Hide popup window
			$("#popup-window").css("visibility", "hidden");
			
			if(typeof $("#img-canvas").data("Jcrop") !== "undefined"){
				$("#img-canvas").data("Jcrop").destroy();	
			}

			$("#rotate_left_butt").unbind("click");
			$("#rotate_right_butt").unbind("click");

			outputQuality(p.layout_data[ side_id ].cells);
		});
	});
}

//---------------------------------------------------------------------------------
// 
function rotate(e){
	var canvas = $("#img-canvas");
	
	// e.data.jcrop.destroy();
	$("#img-canvas").data("Jcrop").destroy();
	rotateImage({ image: e.data.img, canvas: canvas[0], degrees: $(this).data("degrees"), cropFunc: e.data.cropImg, crop_func_args: e.data.crop_img_args });
}

//---------------------------------------------------------------------------------
// 
function rotateImage(data){
	var canvas = data.canvas,
		context,
		image = data.image,
		degrees = data.degrees,
		rotation = $(canvas).data("rotation") + degrees;
		
		centerWindow = function(){
			// Allign popup window in center
			$("#popup-window #centered-window")
					.css({  top: "50%", "margin-top": ($("#popup-window #centered-window").height()/2 * -1)+"px",
							left: "5%" })
		};

	new_dimensions = rotatedDimensions({ angle: degrees, width: $(canvas).prop("width"), height: $(canvas).prop("height") });
	new_css_dimensions = rotatedDimensions({ angle: degrees, width: $(canvas).width(), height: $(canvas).height() });
	incell_img_dimensions = rotatedDimensions({ angle: degrees, width: $(data.crop_func_args.clicked_img).width(), height: $(data.crop_func_args.clicked_img).height() });

	$(canvas).remove();
	$canvas = $("<canvas id='img-canvas' data-rotation="+rotation+"></canvas>");
	$("#centered-window").prepend( $canvas );
	// $(canvas).data("rotation", rotation);

	$canvas.prop("width", new_dimensions.r_width )
			.prop("height", new_dimensions.r_height )
			.width(new_css_dimensions.r_width)
			.height(new_css_dimensions.r_height);

	// centerWindow();

	context = $canvas[0].getContext("2d");
    context.clearRect(0,0, $canvas[0].width, $canvas[0].height);
    // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save();

    // move to the center of the canvas
    context.translate($canvas[0].width/2,$canvas[0].height/2);
    // rotate the canvas to the specified degrees
    context.rotate(rotation*Math.PI/180);
    // draw the image
    context.drawImage(image, (image.width/2)*-1, (image.height/2)*-1);
    // we’re done with the rotating so restore the unrotated context
    context.restore();

    data.crop_func_args.clicked_img.src = $canvas.getCanvasImage();
    
    $.extend(data.crop_func_args, { image: $canvas[0] });
    data.cropFunc(data.crop_func_args);
}

//---------------------------------------------------------------------------------
// 

function cropImage(d){
	// JCROP ******************************************************************************
	var selection = {},
		p = d.p,
		side_id = p.default_surface;

		c_id = $(d.clicked_img).parent().prop("data-id"),
		cell_data = p.layout_data[ side_id ].cells[ c_id ],
		this_cell_w = $(d.clicked_img).parent().width(), // Current width of the cell. relative to the size of the inner window
  		this_cell_h = $(d.clicked_img).parent().height(), // Current height of the cell. relative to the size of the inner window
  		this_cell_w_px = $(d.clicked_img).parent().prop("data-c_w"), // Current width of the cell in pixels before the window was scaled
  		this_cell_h_px = $(d.clicked_img).parent().prop("data-c_h");

	// Ratio of in cell image size to its size in popup window. This is needed to determin scale of offset
	h_ratio = $(d.image).height() / $(d.clicked_img).height(),
	w_ratio = $(d.image).width() / $(d.clicked_img).width();
	// Offset of the selection. Offset inside a cell scaled proportionally to a new size of an image.
	offset_t = cell_data.image.offsettop * h_ratio; 
	offset_l = cell_data.image.offsetleft * w_ratio;
	// Selection size equals size of the cell scaled to the size of image inside popup window
	selection.width = (cell_data.w * p.scale/100) * w_ratio;
	selection.height = (cell_data.h * p.scale/100) * h_ratio;
	// Save original size of the image inside the cell
	selection.img_h = $(d.clicked_img).height();
	selection.img_w = $(d.clicked_img).width();
	// Jcrop events

	$(d.image).Jcrop({
		setSelect: [ offset_l * -1,
					 offset_t * -1,
					 offset_l * -1 + selection.width,
					 offset_t * -1 + selection.height ],

		aspectRatio: cell_data.w/cell_data.h,

        onSelect: function(c){

        			 // Change scale of the selection inside popup window
        			 selection.w_r = selection.width / c.w;
        			 selection.h_r = selection.height / c.h;
        			 // Save new offset of an image
        			 cell_data.image.offsettop = c.y / ($(d.image).height() / $(d.clicked_img).height()) * -1;
        			 cell_data.image.offsetleft = c.x / ($(d.image).width() / $(d.clicked_img).width()) * -1;
        			 // Change offset of the image inside its cell
        			 $(d.clicked_img).css("margin-top", (cell_data.image.offsettop / (this_cell_w / 100) )+"%");
        			 $(d.clicked_img).css("margin-left", (cell_data.image.offsetleft / (this_cell_w / 100) )+"%");
        			 // Change size of an image inside its cell according to a selection size
        			 $(d.clicked_img).width( ((selection.img_w * selection.w_r) / (this_cell_w_px / 100) )+"%" );
        			 // $(d.clicked_img).height( ((selection.img_h * selection.h_r) / (this_cell_h_px / 100) )+"%" );
        			 // This size needed for a correct crop on canvas while saving the design
        			 cell_data.image.width_altered = (selection.img_w * selection.w_r)/ (p.scale/100);
        			 cell_data.image.height_altered = (selection.img_h * selection.h_r)/ (p.scale/100);

        			 selection_data = {};
        			 selection_data[ c_id+side_id ] = cell_data;
        			 // $.sessionStorage.set("selection_setup", $.extend($.sessionStorage.get("selection_setup"), selection_data));

        			 cell_setup[c_id] = { img_w: selection.img_w * selection.w_r,
        			 					  img_h: selection.img_h * selection.h_r,
        			 					  img_offs_l: cell_data.image.offsetleft,
        			 					  img_offs_t: cell_data.image.offsettop };

        			 // Compute Image quality
        			 cell_data.quality = cell_data.image.height / (($(d.clicked_img).height() / (p.scale/100))/100);
        			 $("#img-quality-popup").html(
        			 	"Image Quality "+imageQuality( { value: cell_data.quality, num_stars: 7 })
        			 );
        		  }

    	}
    );
}

//---------------------------------------------------------------------------------
// Rotated dimensions calculator

function rotatedDimensions(d){
	var angle = d.angle * Math.PI / 180,
	    sin   = Math.sin(angle),
	    cos   = Math.cos(angle),
	
	// (0,0) stays as (0, 0)

	// (w,0) rotation
		x1 = cos * d.width,
	    y1 = sin * d.width,

	// (0,h) rotation
		x2 = -sin * d.height,
	    y2 = cos * d.height,

	// (w,h) rotation
		x3 = cos * d.width - sin * d.height,
	    y3 = sin * d.width + cos * d.height,

		minX = Math.min(0, x1, x2, x3),
	    maxX = Math.max(0, x1, x2, x3),
	    minY = Math.min(0, y1, y2, y3),
	    maxY = Math.max(0, y1, y2, y3);

	    return { r_width : Math.round( maxX - minX ),
	    		 r_height : Math.round( maxY - minY ) };
}

//---------------------------------------------------------------------------------
// SAVE PRODUCT

function saveProduct(p) {
	var main_print_canvas = document.createElement("canvas"),
		ctx_main = main_print_canvas.getContext("2d"),
		complete_product_canvas = document.createElement("canvas"),
		ctx_product = complete_product_canvas.getContext("2d"),
		canvas_indexes = Object.keys(p.canvas_data),
		total_canvases = canvas_indexes.length;

	main_print_canvas.width = convertUnits( p.surfaces[p.default_surface].width, "to pix print" );
	main_print_canvas.height = convertUnits( p.surfaces[p.default_surface].height, "to pix print" );

	//-----------------------------------------
	transferImgOntoMainCanvas = function(index){
		if(index < total_canvases){
			var prop = canvas_indexes[index];
			
			canvas_image = new Image();
			canvas_image.onload = function(){
				ctx_main.drawImage( this, 
									p.canvas_data[prop].x_pos, 
									p.canvas_data[prop].y_pos, 
									p.canvas_data[prop].w, 
									p.canvas_data[prop].h );
				index += 1;
				transferImgOntoMainCanvas(index);
			}

			canvas_image.src = p.canvas_data[prop].canvas.toDataURL();
		} else {
			var main_img_canva = new Image();
				main_img_canva.onload = function(){
					prepareFile2Upload(main_img_canva.src);
				}
				main_img_canva.src = main_print_canvas.toDataURL();
		}
	};

	//-----------------------------------------
	prepareFile2Upload = function(dataURL){
		var blob = dataURItoBlob(dataURL),
			fd = new FormData(),
			post_dta = { sides:{}, product_info:{} };

		/* Prepare form data. Information about product and its sides*/
		console.log("Preparing data to upload");
		for(s in p.surfaces){
			post_dta.sides[s] = {};
			post_dta.sides[s].product_background_img_url = p.surfaces[s].imgurl;
			post_dta.sides[s].product_background_img_width = convertUnits( p.surfaces[s].img_width, "to pix print" );
			post_dta.sides[s].product_background_img_height = convertUnits( p.surfaces[s].img_height, "to pix print" );
			post_dta.sides[s].user_img_width = convertUnits( p.surfaces[s].width, "to pix print" ); //convertUnits( p.surfaces[side].width, "to pix print" )
			post_dta.sides[s].user_img_height = convertUnits( p.surfaces[s].height, "to pix print" );
			post_dta.sides[s].user_img_x = p.surfaces[s].grid.x * (300/72);
			post_dta.sides[s].user_img_y = p.surfaces[s].grid.y * (300/72);
			post_dta.sides[s].name = p.surfaces[s].surface_name;
			if(typeof p.surfaces[s].maskurl !== "undefined"){
				post_dta.sides[s].maskurl = p.surfaces[s].maskurl;
			}
		}

		post_dta.product_info["scale"] = p.scale;
		post_dta.product_info["default_side"] = p.default_surface;
		post_dta.product_info["db_id"] = p.db_id;
		post_dta.product_info["product_name"] = p.name;

		fd.append("sides", JSON.stringify(post_dta) );
		fd.append("canvasImage", blob, p.surfaces[p.default_surface].surface_name);
		console.log(fd);
		console.log("Blob", blob);
		uploadFiles(fd);
	};

	transferImgOntoMainCanvas(0);
}

//-----------------------------------------------------------------------------------

function uploadFiles( post_data ){
	console.log("Uploading");
	$.ajax({
	  url: "../assets/php/user-upload-server/",
	  type: "POST",
	  data: post_data,
	  dataType: 'json',
	  processData: false,  // tell jQuery not to process the data
	  contentType: false,   // tell jQuery not to set contentType
	  complete: function(jqxhr, status){
	  				if(status == "success"){
	  					console.log(jqxhr.responseJSON);
	  					// window.location = "../review/";
	  				} else {
	  					console.log(status);
	  				}
	  			},

	  xhr: function(){
			    var xhr = new window.XMLHttpRequest();
			    //Upload progress
			    xhr.upload.addEventListener("progress", function(evt){
			      if (evt.lengthComputable) {
			        var progress = parseInt(evt.loaded / evt.total * 100, 10);
			        console.log(Math.round(progress)+"%", " / ", evt.total/1024/1024, "Mb");
			        $("#upload-progress-page").find("h1").text(Math.round(progress)+"%");
			      	// $("#progress-value").html(Math.round(progress)+"%");
			      	// $("#progress-bar").width(570/100*progress);
			      }
			    }, false);
			    
			    return xhr;
			 }
	})
}

//-----------------------------------------------------------------------------------

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

//---------------------------------------------------------------
// Save Design Handler

/*function saveDesign(e){
	var p = e.data.product,
		layout = p.layout_data,
		files_to_upload = [],
		insta_download = false,
		img_w,
		img_h,
		thumb_scale = 1,
		prepareFiles,
		compileSide,
		fd = new FormData();;
	window.sides = [];
	window.side_counter = 0;
	window.upl_formDada = { complete_product_img_names: [], // Prepare formData variables for upload
							default_surface: "",
							product_id: p.db_id,
							sides: [] };
	
	$("#sides-switch").css("display", "none");
	$("#progress-bar-wrapper").css("visibility", "visible");
	for(s in layout){
		if(typeof layout[s] === "object"){
			sides.push(s);
			upl_formDada.complete_product_img_names.push( layout[s].canvas.name+"complete" );

			// This object defines name of the product's side, identified by file name.
			// passed to the file uploader and used in the next review page to identfy picture, which side it belong to
			side_name = {};
			side_name[layout[s].canvas.name+"complete"] = layout[s].canvas.name;
			upl_formDada.sides.push( JSON.stringify( side_name ) )
			
			if (s == p.default_surface ) {
				upl_formDada.default_surface = layout[s].canvas.name+"complete";
			};
		}
	}	

	compileSide = function(s){ // Loop through surfaces
		var loadCellImages = function(s,cind){
				var drawTexts = function(){
						for(txt in p.surfaces[s].text_stack){
							var pos = p.surfaces[s].text_stack[txt].position;
							// Draw user texts on canvas -------------------
							canvas.drawText({
								fillStyle: p.surfaces[s].text_stack[txt].tcolor,
								x: pos.left / layout.scale,
								y: pos.top / layout.scale,
								fontSize: (parseInt(p.surfaces[s].text_stack[txt].fsize) / layout.scale)+"px",
								fontFamily: p.surfaces[s].text_stack[txt].ffamily,
								text: p.surfaces[s].text_stack[txt].text,
								fromCenter: false
							})
						}
					};

				ckeys = Object.keys( layout[s].cells );
				if (cind < ckeys.length) {
					c = ckeys[cind];
					if( typeof layout[s].cells[c].image != "undefined"){ 

						var image = new Image();

						image.src = layout[s].cells[c].image.uri;
						image.onload = function(){

							crop_x = (layout[s].cells[c].image.offsetleft / layout.scale ) * (this.width / layout[s].cells[c].image.width_altered)*-1;
							crop_y = (layout[s].cells[c].image.offsettop / layout.scale ) * (this.height / layout[s].cells[c].image.height_altered)*-1;
							crop_Width = layout[s].cells[c].w * (this.width / layout[s].cells[c].image.width_altered);
							crop_Height = layout[s].cells[c].h * (this.height / layout[s].cells[c].image.height_altered);
							
							if(crop_x < 0 ) crop_x = 0;
							if(crop_y < 0 ) crop_y = 0;
							if(crop_Width > this.width ) crop_Width = this.width;
							if(crop_Height > this.height ) crop_Height = this.height;
							canvas.drawImage({
								source: this.src,
								// Crop an image to the size of the cell
								sx: crop_x,
								sy: crop_y,
								sWidth: crop_Width,
								sHeight: crop_Height,
								// Draw a cropped image.
								fromCenter: false,
								x: Math.floor(layout[s].cells[c].x),
								y: Math.floor(layout[s].cells[c].y),
								width: Math.floor(layout[s].cells[c].w),
								height: Math.floor(layout[s].cells[c].h),
								load: function(){
									cind ++;
									loadCellImages(s, cind);
								}
								
							})
							
						}
					} else {
						cind ++
						loadCellImages(s, cind);
					}
				} else {
					
					if( ckeys.length > 0 && typeof layout[s].graphic_template != "undefined" ){
						var graph_img = new Image();
						graph_img.src = layout[s].graphic_template.url;
						graph_img.onload = function(){
							canvas.drawImage({
								source: this.src,
								
								fromCenter: false,
								x: 0, y: 0,
								width: Math.floor(layout[s].graphic_template.width),
								height: Math.floor(layout[s].graphic_template.height),
								load: function(){
									if( typeof p.surfaces[s].text_stack != "undefined" ){
										drawTexts();
									}
									compileCanvases();
								}
							});
						}
					} else {
						if( ckeys.length > 0 && typeof p.surfaces[s].text_stack != "undefined" ){
							drawTexts();
						}
						compileCanvases();
					}
				}
			},

			compileCanvases = function(){
				// Create a thumbnail image of the complete product, with mask and picture of actual object
				complete_product_canvas
					.prop( "width", img_w * thumb_scale)
					.prop( "height", img_h * thumb_scale);
					// First draw Image of the product
				complete_product_canvas.drawImage({
					source: ".."+p.surfaces[ s ].imgurl,
					fromCenter: false,
					x: 0,
					y: 0,
					width: img_w * thumb_scale,
					height: img_h * thumb_scale,
					// Next, draw user's created image on top of the product
					load: function(){

						$(this).drawImage({
							source: canvas[0],
							fromCenter: false,
							x: p.surfaces[s].grid.x * thumb_scale,
							y: p.surfaces[s].grid.y * thumb_scale, 
							width: layout[s].canvas.width*layout.scale * thumb_scale, 
							height: layout[s].canvas.height*layout.scale * thumb_scale,
							// Finaly Load Mask of the product
							load: function(){
								if(typeof p.surfaces[s].maskurl !== "undefined"){
									
									$(this).drawImage({
										source: p.surfaces[s].maskurl,
										fromCenter: false,
										x: p.surfaces[s].surfacemask.x * thumb_scale,
										y: p.surfaces[s].surfacemask.y * thumb_scale, 
										width: p.surfaces[s].surfacemask.width * thumb_scale, 
										height: p.surfaces[s].surfacemask.height * thumb_scale,
										load: function(){
											// Add files to upload queue
											prepareFiles(canvas, complete_product_canvas);
										}
									})
								} else {
									// Add files to upload queue
									prepareFiles(canvas, complete_product_canvas);
									
								}
							}
						})
					}
				});
			};

		if(typeof layout[s] === "object"){

			if(layout[s].canvas.height <= 0){ layout[s].canvas.height = 1 }
			if(layout[s].canvas.width <= 0){ layout[s].canvas.width = 1 } 
			
			canvas = $("<canvas>"); // Make a kanvas
			canvas.addClass("canvas-compiled")
 				.prop("width", layout[s].canvas.width )
				.prop("height", layout[s].canvas.height );


			img = $("#product-image-container").find("img");
			img_w = $("#product-wrapper").data("product_css_w_px");
			img_h = $("#product-wrapper").data("product_css_h_px");
			complete_product_canvas = $("<canvas>");

			//////////////////////////////////////////////
			// First Copy all images in cells to the canvas.
			loadCellImages(s,0);
			//////////////////////////////////////////////
			
		}
	}
	
	prepareFiles = function(canvas, complete_product_canvas){
		
		// Add file to the stack
		fd.append( "file"+side_counter,
					// Save Image for print. Read canvas as dataURL, then convert it to Blob
					userfiles.dataURItoBlob( canvas.getCanvasImage(), "image/png"), 
					layout[sides[side_counter]].canvas.name
				);

		// Save Image of a complete product
		fd.append( "complete_side"+side_counter,
					// Save Image for print. Read canvas as dataURL, then convert it to Blob
					userfiles.dataURItoBlob( complete_product_canvas.getCanvasImage(), "image/png"),
					layout[sides[side_counter]].canvas.name + "complete");

		side_counter++;

		if(side_counter < sides.length){
			compileSide(sides[side_counter]);
		} else {
			// Upload files
			// $("#files-stack").fileupload("add",{ files: files_to_upload });
			for(ud in upl_formDada){
				fd.append(ud, upl_formDada[ud]);
			}
			uploadFiles(fd);
		}
	};

	// File Upload Setup
	compileSide(sides[0]);
}*/

//***********************************************************************************
/*function uploadFiles(form_data){
	// $("#save-design-butt").prop("disabled", "disabled");
	$.ajax({
	  url: "../assets/php/user-upload-server/",
	  type: "POST",
	  data: form_data,
	  // dataType: 'json',
	  processData: false,  // tell jQuery not to process the data
	  contentType: false,   // tell jQuery not to set contentType
	  complete: function(jqxhr, status){
	  				if(status == "success"){
	  					window.location = "../review/";
	  				} else {
	  					console.log(status);
	  				}
	  			},

	  xhr: function(){
			    var xhr = new window.XMLHttpRequest();
			    //Upload progress
			    xhr.upload.addEventListener("progress", function(evt){
			      if (evt.lengthComputable) {
			        var progress = parseInt(evt.loaded / evt.total * 100, 10);
			      	$("#progress-value").html(Math.round(progress)+"%");
			      	$("#progress-bar").width(570/100*progress);
			      }
			    }, false);
			    
			    return xhr;
			 }
	});
}*/

//---------------------------------------------------------------
// GET PRODUCT DETAILS FROM DATABASE

function loadProduct( product ){
	if(typeof PRODUCT_DATA !== "undefined"){
		// console.log(PRODUCT_DATA)
		product.product_data = PRODUCT_DATA;
		renderProduct(PRODUCT_DATA, product);

		if( typeof product.templates !== "undefined"){
			previewTemplates( PRODUCT_DATA, product, { preview_container: "#template-thumbnails-container", templates_obj: "templates" } );
			
		} 

		if( typeof product.graphic_templates !== "undefined"){
			previewTemplates( PRODUCT_DATA, product, { preview_container: "#graphic-thumbnails-container",templates_obj: "graphic_templates" } );
			// changeProductLayout({ data: { p : product} }, product.templates.default_template);
		}
		
		if( typeof product.templates !== "undefined"){
			changeProductLayout({ data: { p : product, templates_obj: "templates" } }, product.templates.default_template);
		}
		/*var productID = PRODUCT_ID;
		$.post( productserverpath, { get_product_data: productID },
				function(data){
					if(!data.error){
						product.product_data = data;
						renderProduct(data, product);

						if( typeof product.templates !== "undefined"){
							previewTemplates( data, product, { preview_container: "#template-thumbnails-container", templates_obj: "templates" } );
							
						} 

						if( typeof product.graphic_templates !== "undefined"){
							previewTemplates( data, product, { preview_container: "#graphic-thumbnails-container",templates_obj: "graphic_templates" } );
							// changeProductLayout({ data: { p : product} }, product.templates.default_template);
						}
						
						if( typeof product.templates !== "undefined"){
							changeProductLayout({ data: { p : product, templates_obj: "templates" } }, product.templates.default_template);
						}
						// showHideTextLayer();
					} else {
						
					}
				},
		"json");*/
	}
}

//---------------------------------------------------------------------------------
// SHOW / HIDE TEXT LAYER

function renderTextLayer(p){
	/*	$(".cell","#template-grid").length > 0 || 
		$("#texts-layer").children().length >0	) ? $("#texts-layer").show()
							   : $("#texts-layer").hide();*/
	var s = p.default_surface;
	if ( typeof p.surfaces[s].text_stack !== "undefined" ) {
		var text_stack = p.surfaces[s].text_stack;
		$(".onstage-text").remove();
		for( txt in p.surfaces[s].text_stack ){
			$onstagetext = $("<div class='onstage-text'>")
				.css({  "font-family": text_stack[txt].ffamily,
						"font-size": text_stack[txt].fsize+"px",
						"color": text_stack[txt].tcolor,
						"top": text_stack[txt].position.top+"px",
						"left": text_stack[txt].position.left+"px" })

				.toggleClass(txt)
				.data("font-family", text_stack[txt].ffamily)
				.data("font-size", text_stack[txt].fsize)
				.data("text-color", text_stack[txt].tcolor)
				.text( text_stack[txt].text );

			$text_helper = $onstagetext.clone()
			// .toggleClass(elms_set_class)
			.click(function(){ $(".text-input-box."+txt).focus() })
			.draggable({
				containment:"#texts-layer",
				scroll: false,
				cursor: "move",
				create: function(){
					$(this).css({
						position : "absolute",
						top: text_stack[txt].position.top+"px",
						left: text_stack[txt].position.left+"px",
						"pointer-events":"auto",
					})
				},

				drag: function(e, ui){
					var thistextsystemid = $(this).prop("class").split(" ")[1];
						// s = sideID();
					$(".onstage-text."+thistextsystemid).css({ top: ui.position.top, left: ui.position.left })
					p.surfaces[s].text_stack[thistextsystemid].position.top = ui.position.top;
					p.surfaces[s].text_stack[thistextsystemid].position.left = ui.position.left;
				},
				stop: function(){
				}
			});
			$("#texts-layer").append( $text_helper );
			$("#template-grid").append( $onstagetext );
		}
	}
}

//--------------------------------------------------------------
// RENDER PRODUCT DATA ON THE STAGE

function renderProduct(data, product){
	$.extend( product, JSON.parse( data.productdata ));
	if(product.db_id == null){ product.db_id = data.id };
	// makeSideSwitchMenu( product ); 
	loadImage( product );
	loadGrid( product );
	loadOptionalImages( product );
}

//--------------------------------------------------------------
// DOWNLOAD IMAGE OF THE PRODUCT

function loadImage( p, opturl ){
	var sideid = p.default_surface, //sideID(),
	img_css = { width: (convertUnits( p.surfaces[sideid].img_width, "to pix print" ) * (p.scale/100))+"px" },
	img_src = (typeof opturl == "undefined") ? p.surfaces[ sideid ].imgurl : opturl;
	product_img = $("<img>").prop("src", img_src );
	
	$("#product-image-container")
			// .parent().css( { width: img_css.width } ).end() // Resize #work-desk
			.find("img").remove().end()
			.append( product_img 
						// .css( img_css )
						.load(function(e){ // Resize and reposition image of the product
								var self = this;
								$("#product-wrapper").height($(this).height());
								$(window).resize(function(){
									$("#product-wrapper").height($(self).height());
								})
						})
			);



	if( typeof p.surfaces[ sideid ].maskurl !== "undefined"){
	/*	var p_img_w_rat = $("#product-image-container").width() / 100,
			p_img_h_rat = $("#product-image-container").height() / 100;*/

		$("#product-image-container").append( $("<img>").prop("src", p.surfaces[ sideid ].maskurl).addClass("product-mask"))
	}
}

//---------------------------------------------------------------------------------
// 

function loadOptionalImages( p ){
	var sideid = false,
		cont_height;
	$("#options-container").empty();

	for(side in p.surfaces){
		if(typeof p.surfaces[side].optional_images!= "undefined" && Object.keys(p.surfaces[side].optional_images).length > 0){
			if(typeof $("#options-container").data("isset") == "undefined" ){
				$("#options-container").data("isset", false);
				$("#options-container").data("side_name", side);
				sideid = side;
			}
		}
	}
	if(sideid){
		for(img in p.surfaces[sideid].optional_images){
			opt_img = $("<img>").prop("src", p.surfaces[sideid].optional_images[img].thumburl ).prop("data-url", p.surfaces[sideid].optional_images[img].imgurl);
			$("#options-container").append(opt_img);
		}
		// cont_height = $("#options-container").height()+50;
		// $("#options-container").css({ bottom: "-"+cont_height+"px" })
		$("#options-container img").click(function(){
			var url = $(this).prop("data-url");
			$("#options-container").data("isset", true);
			p.surfaces[sideid].imgurl = url;
			// loadImage(p, url);
			$("#work-desk").find(".color-inset-preview-img").remove().end()
						   .append( $("<img>").load(function(){ switchStep("presave preview"); })
						   .prop("src", url)
						   .addClass("color-inset-preview-img") )
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
			photo_size = c_w < c_h ? c_w : c_h;

			$("<div>").addClass("cell").prop("data-id", c)
									   .prop("data-c_w", c_w)
									   .prop("data-c_h", c_h)
									   .prop("data-c_x", c_x)
									   .prop("data-c_y", c_y)
									   .css( cell_css )

				.appendTo( $grid );
			$("<div>").addClass("cell-helper").prop("id", "cellhelper"+c).css( cell_css ).appendTo( $grid_helper );
			// Save each cell data Printable
			p.layout_data[sideid].cells[c] = {	w: p.surfaces[sideid].grid.cells[c].w,
												h: p.surfaces[sideid].grid.cells[c].h,
												x: p.surfaces[sideid].grid.cells[c].x,
												y: p.surfaces[sideid].grid.cells[c].y, }

		}

	}

	loadGraphic(p.surfaces[sideid].grid, p);

	// When empty cell clicked, switch to PhotoUpload tab
	$(".cell").unbind("click");
	$(".cell").bind("click", function(){
		var c_step = $("#back-next-butt-wrapper").data( "current_step");
		$(".cell").removeClass("selected_cell");
		$(this).addClass("selected_cell");

		$(".cell-helper").removeClass("selected_cell_helper");
		$("#cellhelper"+$(this).prop("data-id")).addClass("selected_cell_helper");

		if( (c_step == "upload photos" || c_step == "edit pictures") && !$(this).hasClass("image-filled") ){
			switchMenu("first upload menu");
		}
	});

	// makeDroppable(".cell", p);
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
	var thisswitchid = $(this).prop("id");
	$(".activesideswitch").removeClass("activesideswitch");
	$("label[for="+thisswitchid+"]").addClass("activesideswitch");
	var p = e.data.product;
	loadImage( p );
	loadGrid( p );

	renderTextLayer(p);
	loadOptionalImages( p );
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
















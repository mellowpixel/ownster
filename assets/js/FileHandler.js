
function FilesHandler(options){
	this.settings = { preview_container: undefined };
	$.extend(this.settings, options);
}

//------------------------------------------------------------------------------------
FilesHandler.prototype.handleFiles = function(file){
	window.FileReader  	? this.readImgFiles(file)
						: this.handlImgFileNoFileAPI(file);
}

//************************************************************************************
// FileReader NOT SUPPORTED IN IE < 10 
//************************************************************************************

FilesHandler.prototype.readImgFiles = function(file){
	var reader = new FileReader(),
		self = this,
		file_id = file.name = self.htmlEntities(file.name).replace(/(?!\w)[\x00-\xC0]/g, '');

	reader.readAsDataURL(file);
	reader.onload = function(e){ 
		// self.renderImage( e.target.result, file_id );
		self.onImageReady( e.target.result, file_id );
	};
	reader.onloadend = function(e){
		self.onFilesReady();
	}
		
}

FilesHandler.prototype.htmlEntities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\s/g, '').replace(/\./g, '');
}

//-----------------------------------------------------------------------------------
FilesHandler.prototype.renderImage = function( dataURL, file_id, source, onClickHandler, thumbImgLoadHandler ){ 
	img_container = $("<div>").addClass("img_preview_container");
	// Assign Id to the cell (name of the file stripped spaces and dot) Id is used to find an image uri when side is switched.
	$("#"+file_id).length > 0	? img_container.prop("id", file_id + $("#"+file_id).length )
								: img_container.prop("id", file_id);
	$img = $("<img>");
	$img.on("load", function(){
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

		// Save original size of image in data set
		$(this).prop("data-width", im_w).prop("data-height", im_h);
		if(typeof onClickHandler == "function"){
			$(this).unbind("click").bind("click", onClickHandler)
		}

		if(typeof thumbImgLoadHandler == "function"){
			thumbImgLoadHandler();
		}
	});
	// console.log("render_img:", this.settings.preview_container.prop("class"))
	this.settings.preview_container.append( img_container.append( $img ) );
	$img.prop("src", dataURL).prop("data-source", source);
}

//-----------------------------------------------------------------------------------
FilesHandler.prototype.onFilesReady = function(){
	// THIS CALLBACK FUNCTION REASSIGNED IN MAIN_CUSTOMIZED
}

//-----------------------------------------------------------------------------------
FilesHandler.prototype.onImageReady = function(){
	// THIS CALLBACK FUNCTION REASSIGNED IN MAIN_CUSTOMIZED
}

//***********************************************************************************
// IE9- File API Not supported. Process file old way function
//***********************************************************************************

FilesHandler.prototype.handlImgFileNoFileAPI = function(file){
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

FilesHandler.prototype.dataURItoBlob = function(dataURI, dataTYPE){
    var binary = atob(dataURI.split(',')[1]), array = [];
    for(var i = 0; i < binary.length; i++){
    	array.push(binary.charCodeAt(i));	
    } 
    return new Blob([new Uint8Array(array)], {type: dataTYPE});
}


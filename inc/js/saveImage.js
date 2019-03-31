//-------------------------------------------------------------------------------------/	
function saveImage(canvases, template_picture_obj, wallet_outline, thumb_width, page_on_done, order_code){
	var copy_canva	= document.createElement("canvas"),
		context,
		text_layers,
		main_width,
		main_height,
		setup_string,
		val_name,
		arr_value;
		design_setup	= [];
		txt_layers_setup= ["text_layers"];
		txt_layer		= [];
		side_setup		= [];
	copy_canva.width 	= template_picture_obj.image.width;
	copy_canva.height	= template_picture_obj.image.height;	
	main_width 			= template_picture_obj.image.width;
	main_height 		= template_picture_obj.image.height;
	context				= copy_canva.getContext("2d");
	
	context.globalCompositeOperation		= "destination-over";	// draw new layers under the existing ones
	
	text_layers = document.getElementsByName("text_layer");
	//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
	
	if(typeof canvases.left_image === "object" && !canvases.left_image.hidden){		//	Draw left layer
		side_setup = [];
		side_setup = saveLayer(main_width/2, main_height, main_width/4, context, canvases.left_image);
		side_setup.unshift("left_image");
		design_setup.push(side_setup);
	}
	
	if(typeof canvases.whole_image === "object" && !canvases.whole_image.hidden){	//	Draw right side of the whole canvas layer
		side_setup = [];
		side_setup = saveLayer(main_width, main_height, main_width/2, context, canvases.whole_image);
		side_setup.unshift("whole_image");
		design_setup.push(side_setup);
	}
	
	context.clearRect(main_width/2, 0, main_width/2, main_height);	// Clear right side of the canvas to crop part of the left image that is on the right side of the canvas.
	
	if(typeof canvases.right_image === "object" && !canvases.right_image.hidden){
		
		if(typeof canvases.whole_image !== "object" || canvases.whole_image.hidden){
			context.fillStyle = "#fff";
			context.fillRect(0, 0, main_width/2, main_height);	
		}
		
		side_setup = [];
		side_setup = saveLayer(main_width/2, main_height, main_width * 0.75, context, canvases.right_image);
		side_setup.unshift("right_image");
		design_setup.push(side_setup);
		
		if(typeof canvases.left_image !== "object" || canvases.left_image.hidden){  // If no left image have been uploaded clear left side of the canvas to 
																					// crop part of the right image that is on the left side of the canvas
			context.clearRect(0, 0, main_width/2, main_height);
		}
	}
	
	if(typeof canvases.whole_image === "object" && !canvases.whole_image.hidden){
		saveLayer(main_width, main_height, main_width/2, context, canvases.whole_image);
	}
	
	context.globalCompositeOperation		= "source-over";	// draw new layers above the existing ones
	
	if(typeof template_picture_obj === "object" && !template_picture_obj.hidden){
		side_setup = [];
		side_setup = saveLayer(main_width, main_height, main_width/2, context, template_picture_obj);
		side_setup.push(template_picture_obj.template_id);
		side_setup.push(template_picture_obj.category_id);
		side_setup.unshift("template");
		design_setup.push(side_setup);
	}
	
		
	for(var i = 0, total = APP.text_layers.length; i<total; i+=1){
		txt_layer = [];
		txt_layer = saveTextLayers(context, APP.text_layers[i]);
		txt_layers_setup.push(txt_layer);
	}
	
	design_setup.push(txt_layers_setup);
	
	//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
	  
	send_form = document.getElementById("send");
	document.getElementById("data").value	= copy_canva.toDataURL();
	
	for(var i = 0, tot = design_setup.length; i < tot; i += 1){
		val_name	= design_setup[i].shift();
		
		if(typeof design_setup === "object"){
			arr_value	= design_setup[i].join("§");
		} else {
			arr_value	= design_setup[i];
		}
		
		input		= document.createElement("input");
		input.type	= "hidden";
		input.name	= val_name;
		input.value	= arr_value;
		
		send_form.appendChild(input); 
	}
	
	if( typeof page_on_done != "undefined"){
		send_form.action = page_on_done;
	}
	
	if( typeof order_code != "undefined" ){
		order_code_inp		= document.createElement("input");
		order_code_inp.type	= "hidden";
		order_code_inp.name	= "order_code";
		order_code_inp.value = order_code;
		send_form.appendChild( order_code_inp );
		
	}
	
//	send_form.submit();
	
}
	
//----------------------------------------------------------------------------------------	
	
function saveLayer(main_W, main_H, center_X, main_context, img_canvas){
	var c_scale,
		image_setup = [];
	
	c_scale = main_W / img_canvas.image.width;
	main_context.save();
	
	main_context.translate(center_X, main_H/2);
			
	main_context.scale(c_scale, c_scale);
	main_context.translate(img_canvas.__X, img_canvas.__Y);
	main_context.rotate(img_canvas.__angle*Math.PI/180);
	main_context.scale(img_canvas.__scaleX, img_canvas.__scaleY);
			
	main_context.drawImage(img_canvas.image, img_canvas.middleX*-1, img_canvas.middleY * -1, img_canvas.image.width, img_canvas.image.height);
	main_context.restore();
	
	image_setup.push(img_canvas.__X);
	image_setup.push(img_canvas.__Y);
	image_setup.push(img_canvas.__angle);
	image_setup.push(img_canvas.__scaleX);
	image_setup.push(img_canvas.__scaleY);
	image_setup.push(img_canvas.saved_scale);
	image_setup.push(img_canvas.image_path);
	
	return image_setup; 
}	
	
//----------------------------------------------------------------------------------------	

function saveTextLayers(context, layer_obj){
	text_layer_setup	= "";
	context.font 		= layer_obj.font;
	context.fillStyle 	= layer_obj.color;
	context.textAlign 	= layer_obj.align;
	context.textBaseline= layer_obj.baseline;
	context.fillText(layer_obj.text, layer_obj.x, layer_obj.y);
	
	text_layer_setup = layer_obj.font_post +"@!@$£*jad"+ layer_obj.color +"@!@$£*jad"+ layer_obj.align +"@!@$£*jad"+ layer_obj.text +"@!@$£*jad"+ layer_obj.x +"@!@$£*jad"+ layer_obj.y +"@!@$£*jad"+ layer_obj.baseline;
	return text_layer_setup;
}
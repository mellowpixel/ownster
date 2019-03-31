

function loadImageIntoCanvas(side_to_load, path, opt_func){

	switch(side_to_load){
		case "whole_success":		
							uploaded_img = uploadImage(path);			
							uploaded_img.onload = function(){
								APP.uploaded_img_obj.whole_image = createNewImageOnCanvas(uploaded_img,
																				$("uploaded_canvas"),
																				APP.template_img_obj.image.width,
																				APP.template_img_obj.image.height,
																				APP.template_img_obj.width,
																				APP.template_img_obj.height,
																				APP.template_img_obj.middleX,
																				APP.template_img_obj.middleY );
								
								APP.uploaded_img_obj.whole_image.hidden		= false;
								APP.uploaded_img_obj.whole_image.image_path = this.src;
																				
								GUI.canvas_switch.whole_canvas_switch.show();
								GUI.canvas_switch.resetButtons();													
								GUI.canvas_switch.whole_canvas_switch.clicked();
								
							//	getReadyToWork();
								
							//	APP.loading_window.style.zIndex = "0";
		
								if(typeof opt_func == "function"){
									opt_func();	
								} else {
									getReadyToWork();	
								}
								
							}
							break;
				
		case "left_success":
								
								uploaded_img = uploadImage(path);
								uploaded_img.onload = function(){			
								APP.uploaded_img_obj.left_image = createNewImageOnCanvas(uploaded_img,
																				$("uploaded_canvas_left"),
																				APP.template_img_obj.image.width/2,
																				APP.template_img_obj.image.height,
																				APP.template_img_obj.width/2,
																				APP.template_img_obj.height,
																				APP.template_img_obj.middleX/2,
																				APP.template_img_obj.middleY );
																				
								APP.uploaded_img_obj.left_image.hidden		= false;												
								APP.uploaded_img_obj.left_image.image_path	= this.src;
								
								GUI.canvas_switch.left_canvas_switch.show();
								GUI.canvas_switch.resetButtons();													
								GUI.canvas_switch.left_canvas_switch.clicked();
								
							//	getReadyToWork();
											
							//	APP.loading_window.style.zIndex = "0";
											
								if(typeof opt_func == "function"){
									opt_func();	
								} else {
									getReadyToWork();	
								}										
							}
							break;
							
		case "right_success":		
							uploaded_img = uploadImage(path);
							uploaded_img.onload = function(){			
								APP.uploaded_img_obj.right_image = createNewImageOnCanvas(uploaded_img,
																				$("uploaded_canvas_right"),
																				APP.template_img_obj.image.width/2,
																				APP.template_img_obj.image.height,
																				APP.template_img_obj.width/2,
																				APP.template_img_obj.height,
																				APP.template_img_obj.middleX/2,
																				APP.template_img_obj.middleY );
																				
								APP.uploaded_img_obj.right_image.hidden		= false;
								APP.uploaded_img_obj.right_image.image_path	= this.src;
																				
								APP.uploaded_img_obj.right_image.canvas.style.left = String(APP.template_img_obj.width/2) +"px";
								
								GUI.canvas_switch.right_canvas_switch.show();
								APP.unhideHTMLElement.call(GUI.canvas_switch.right_canvas_switch.clear_canvas_butt);
								GUI.canvas_switch.resetButtons();													
								GUI.canvas_switch.right_canvas_switch.clicked();
								
							//	getReadyToWork();	
							//	APP.loading_window.style.zIndex = "0";
								
								if(typeof opt_func == "function"){
									opt_func();	
								} else {
									getReadyToWork();	
								}
							}
							break;
	}
}
  //-----------------------------------------------------------------------------------------/					
 //								R A D I O   B U T T O N										/
//-----------------------------------------------------------------------------------------/
 
 function RadioButton(){
	var self = this,
		mouse_over = false;
//		old_width;
		
	this.radio;
	this.img_obj;
	this.image_normal;
	this.image_over;
	this.image_active;
	this.active = false;
	
	this.class_name_normal;	// prototype property
	this.class_name_over;	// prototype property
	this.class_name_active;	// prototype property
	
	RadioButton.resetButtons = function(callBack){
		for(var button in this){
			if(typeof this[button] === "object"){
				if(typeof this[button].radio !== "undefined"){
					if(this[button].radio.checked){
						this[button].returnToNormal();

					}
				} else {
					if(typeof this[button].active !== "undefined"){
						if(this[button].active){
							this[button].returnToNormal();
	
						}
					}	
				}
			}
		}
		
		if(callBack === "function"){
			callBack();
		}
	}

	this.onHover = function(){	
		if(typeof self.radio !== "undefined"){
			if(self.radio.checked === false){
				changeImage();
			}
		} else {
			if(typeof self.active !== "undefined"){
				if(!self.active){
					changeImage();
				}
			} else {
				changeImage();
			}
		}
	}
	
	this.returnToNormal = function(){
		if(typeof self.img_obj !== "undefined"){
			self.img_obj.src = self.image_normal;
			self.active = false;
			self.img_obj.onload = function(){ self.img_obj.className = self.class_name_normal; }
		}
	}
	
	this.clicked = function(){
		if(typeof self.radio !== "undefined"){ 
			self.radio.checked = "checked";
		} else {
			self.active = true;
			
		}
		if(typeof self.img_obj !== "undefined"){
			if(typeof self.image_active !== "undefined"){
				self.img_obj.src = self.image_active;
			}
			self.img_obj.onload = function(){ self.img_obj.className = self.class_name_active; }
		}
		mouse_over = false;	
	}
	
	this.hide = function(){
		if(typeof self.radio !== "undefined"){
			self.radio.style.visibility = "hidden";
		}
		
		if(typeof self.img_obj !== "undefined"){
			self.img_obj.style.visibility = "hidden";
		}
	}
	
	this.show = function(){
		if(typeof self.radio !== "undefined"){
			self.radio.style.visibility = "visible";
		}
		
		if(typeof self.img_obj !== "undefined"){
			self.img_obj.style.visibility = "visible";
		}
	}
	
	function changeImage(){
		
		if(!mouse_over){	// Check for moseover or mouseout
			self.img_obj.src = self.image_over;
			self.img_obj.onload = function(){self.img_obj.className = self.class_name_over;}
		} else {
			self.img_obj.src = self.image_normal;
			self.img_obj.onload = function(){self.img_obj.className = self.class_name_normal;}
		}
		mouse_over ? mouse_over = false: mouse_over=true;	
	}
	
 }
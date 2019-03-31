
function OwnsterCanvas(){
	this.canvas = undefined;
	this.ctx = undefined;
	this.img_src = undefined;
	this.tX = 0;
	this.tY = 0;
	this.Xa = 0;
	this.Ya = 0;
	this.scale = 1;
	this.angle = 0;
}

OwnsterCanvas.prototype.touchImgHandler = function(touch_ev) {
	this.Xa = touch_ev.originalEvent.touches[0].pageX;
	this.Ya = touch_ev.originalEvent.touches[0].pageY;
	// Prevent Page Scroll while moving
	touch_ev.preventDefault();
};

OwnsterCanvas.prototype.clickImgHandler = function(click_ev) {
	this.Xa = click_ev.pageX; 
	this.Ya = click_ev.pageY;
	// Prevent Page Scroll while moving
	// click_ev.preventDefault();
};

OwnsterCanvas.prototype.moveImgHandler = function(move_ev, $selected_cell) {
	var scale_ratio  = this.canvas.width / $(this.canvas).width(),
		pos_x1 = 0,
		pos_y1 = 0,
		pos_x2 = 0,
		pos_y2 = 0,
		img_w = this.img_src.width * this.scale,
		img_h = this.img_src.height * this.scale,
		img_dm = {},
		tempX = 0,
		tempY = 0;

	img_dm = rotatedDimensions(img_w, img_h, this.angle);

	tempX = this.tX + Math.round((move_ev.pageX - this.Xa) * scale_ratio);
	tempY = this.tY + Math.round((move_ev.pageY - this.Ya) * scale_ratio);

	pos_x1 = (tempX - img_w / 2)-(img_dm.r_w - img_w)/2;
	pos_y1 = (tempY - img_h / 2)-(img_dm.r_h - img_h)/2
	pos_x2 = pos_x1 + img_dm.r_w;
	pos_y2 = pos_y1 + img_dm.r_h;

	this.tX = (pos_x1 <= 0 && pos_x2 >= this.canvas.width ) ? tempX : this.tX;
	this.tY = (pos_y1 <= 0 && pos_y2 >= this.canvas.height) ? tempY : this.tY;

	this.Xa = move_ev.pageX;	// Save position of the previous pixel to determine the direction of cursor
	this.Ya = move_ev.pageY;

	this.render();
}

OwnsterCanvas.prototype.zoom = function(scale){
	var img_w = this.img_src.width * (this.scale + scale),
		img_h = this.img_src.height * (this.scale + scale),
		img_dm = rotatedDimensions(img_w, img_h, this.angle);
		img_x1= this.tX - img_dm.r_w / 2,
		img_x2= img_x1 + img_dm.r_w,
		img_y1= this.tY - img_dm.r_h / 2,
		img_y2= img_y1 + img_dm.r_h;


	console.clear();
	console.log("Canv W:",this.canvas.width, " | Canv H:", this.canvas.height,
				"\nImg R W:", img_dm.r_w, " | Img R H:", img_dm.r_h
				/*"\nCanv X1:", img_x1, " | Canv Y1:", img_y1,
				"\nCanv X2:", img_x2, " | Canv Y2:", img_y2*/
				);
	console.log(this.scale + scale > 0, this.canvas.width <= img_dm.r_w, this.canvas.height <= img_dm.r_h)

	if(this.scale + scale > 0 && this.canvas.width <= img_dm.r_w && this.canvas.height <= img_dm.r_h){

		if(img_x1 >= 0){ this.tX = img_dm.r_w / 2; }
		if(img_x2 <= this.canvas.width ){ this.tX = (this.canvas.width - img_dm.r_w) + (img_dm.r_w / 2); }
		if(img_y1 >= 0){ this.tY = img_dm.r_h / 2; }
		if(img_y2 <= this.canvas.height ){ this.tY = (this.canvas.height - img_dm.r_h) + (img_dm.r_h / 2); }

		this.scale += scale;
		this.render();
	}
}

OwnsterCanvas.prototype.rotate = function(ang){
	var img_w = this.img_src.width * this.scale,
		img_h = this.img_src.height * this.scale,
		pos_x1 = this.tX - img_w / 2,
		pos_y1 = this.tY - img_h / 2,
		pos_x2 = 0,
		pos_y2 = 0,
		img_dm = {},
		tempX = 0,
		tempY = 0;

	img_dm = rotatedDimensions(img_w, img_h, this.angle + ang);

	pos_x1 = (pos_x1)-(img_dm.r_w - img_w)/2;
	pos_y1 = (pos_y1)-(img_dm.r_h - img_h)/2
	pos_x2 = pos_x1 + img_dm.r_w;
	pos_y2 = pos_y1 + img_dm.r_h;

	// if rotated image is less then canvas dimensions make it equal to canvas dimensions
	if(this.canvas.width > img_dm.r_w){ 
		this.scale = this.scale + (img_dm.r_w / this.canvas.width);
		img_w = this.img_src.width * this.scale;
		img_h = this.img_src.height * this.scale;
		img_dm = rotatedDimensions(img_w, img_h, this.angle + ang);
	}
	
	if(this.canvas.height > img_dm.r_h){ 
		this.scale = this.scale + (img_dm.r_h / this.canvas.height);
		img_w = this.img_src.width * this.scale;
		img_h = this.img_src.height * this.scale;
		img_dm = rotatedDimensions(img_w, img_h, this.angle + ang);
	}

	// if rotated image side is within the canvas area adjust the position of the image
	if(pos_x1 >= 0){ this.tX = img_dm.r_w / 2; }
	if(pos_x2 <= this.canvas.width ){ this.tX = (this.canvas.width - img_dm.r_w) + (img_dm.r_w / 2); }
	if(pos_y1 >= 0){ this.tY = img_dm.r_h / 2; }
	if(pos_y2 <= this.canvas.height ){ this.tY = (this.canvas.height - img_dm.r_h) + (img_dm.r_h / 2); }

	this.angle = this.angle + ang;
	this.render();
}

OwnsterCanvas.prototype.render = function(){
	ctx = this.canvas.getContext("2d");
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	ctx.save();
	ctx.translate(this.tX, this.tY);
	ctx.scale(this.scale, this.scale);
	ctx.rotate( (Math.PI / 180) * this.angle );
	ctx.drawImage(this.img_src, -this.img_src.width / 2, -this.img_src.height / 2 );
	ctx.restore();
}

function rotatedDimensions(width, height, angle){
	var angle = angle * Math.PI / 180,
	    sin   = Math.sin(angle),
	    cos   = Math.cos(angle),
	
	// (0,0) stays as (0, 0)

	// (w,0) rotation
		x1 = cos * width,
	    y1 = sin * width,

	// (0,h) rotation
		x2 = -sin * height,
	    y2 = cos * height,

	// (w,h) rotation
		x3 = cos * width - sin * height,
	    y3 = sin * width + cos * height,

		minX = Math.min(0, x1, x2, x3),
	    maxX = Math.max(0, x1, x2, x3),
	    minY = Math.min(0, y1, y2, y3),
	    maxY = Math.max(0, y1, y2, y3);

	    return { r_w : Math.round( maxX - minX ),
	    		 r_h : Math.round( maxY - minY ) };
}

function rotatePoints(x, y, width, height, a) {
    var cos = Math.cos,
        sin = Math.sin,
        xm = width / 2,
        ym = height / 2,

        a = a * Math.PI / 180, // Convert to radians because that is what
                               // JavaScript likes

        // Subtract midpoints, so that midpoint is translated to origin
        // and add it in the end again
        xr = (x - xm) * cos(a) - (y - ym) * sin(a)   + xm,
        yr = (x - xm) * sin(a) + (y - ym) * cos(a)   + ym;

    return {xr: xr, yr: yr};
}


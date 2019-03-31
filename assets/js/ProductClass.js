// ------ PRODUCT CLASS --------------------------------------------------------------------

function Product(){
	var self = this;	
	this.settings = { 	name : "No Name",
						scale : 100,
						img_width : 50,
						img_height : 50 }

	for(i in arguments){
		if(typeof arguments[i]=== "object"){
			$.extend(this.settings, arguments[i]);
		}
	}

	this.name = this.settings.name;
	this.db_id = null;
	this.default_surface = null;
	this.primary_surface = null; // the surface ID of the first made surface
	this.scale = this.settings.scale;
	this.surfaces = {}; //Object of objects
	this.current_surface = "";

	// NEW SURFACE METHOD---------
	this.addSurface = function(){
		var surface_id = "",
			s = self.surfaces;
		
		for(new_surf in arguments){
			var ratio = null;
			if(typeof arguments[new_surf] === "object"){
				sett = arguments[new_surf]; // settings for new surface object

				//... generate surface id for new surface object. Add it to the surfaces list...
				do{	
					surface_id = "surface_id"+(Math.floor(Math.random() * 999) + 1)
					if (typeof s[surface_id] !== "object") {
						s[surface_id] = {};
						this.current_surface = surface_id;
						s[surface_id].img_width = typeof sett.img_width != "undefined"? sett.img_width : this.settings.img_width;
						s[surface_id].img_height = typeof sett.img_height != "undefined"? sett.img_height : this.settings.img_height;
						break;
					};
					
				}while(typeof s[surface_id] !== "object" )
				//.............................................................................

				ratio = s[surface_id].img_width / s[surface_id].img_height;

				s[surface_id].surface_name	= isset(sett.surface_name)? sett.surface_name : "Unnamed Surface";
				s[surface_id].product_surf_scale = { constraint : false};
				s[surface_id].surf_grid_scale = { constraint : false };
				s[surface_id].grid			= {};
				s[surface_id].grid.cells 	= {};
				s[surface_id].grid.proportion = isset(sett.grid_proportion)? sett.grid_proportion : "proportional";
				
				s[surface_id].grid.numcells_w	= isset(sett.numcells_w)? sett.numcells_w : 1;
				s[surface_id].grid.numcells_h	= isset(sett.numcells_h)? sett.numcells_h : 1;

				// s[surface_id].grid.active_cell_size = isset(sett.active_cell_size)? sett.active_cell_size : 45;

				s[surface_id].width			= isset(sett.width)? sett.width : s[surface_id].img_width - 2;
				s[surface_id].height		= isset(sett.height)? sett.height : s[surface_id].width / ratio;

				s[surface_id].grid.width 	= isset(sett.grid_width)? sett.grid_width : s[surface_id].width + 5;
				s[surface_id].grid.height 	= isset(sett.grid_height)? sett.grid_height : s[surface_id].grid.width / ratio;
			}
		}
		return surface_id;
	}
}




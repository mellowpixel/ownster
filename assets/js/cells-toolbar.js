// cells-toolbar.js

function ToolbarCells(settings){
	var self_r = this;
	this.settings = { product : null, workdesk : null};
	
	$.extend(this.settings, settings);

	this.p = this.settings.product;
	this.grid = this.p.surfaces[this.p.current_surface].grid;
	this.workdesk = this.settings.workdesk;

	// BUTTONS EVENTS------------------------------------------------------------------------------------------
	this.uploadable_butt = $("button#uploadable").button({ icons: { primary: "ui-icon-blank" }, text: false })
												 .click( { grid : this.grid, self : this }, this.uploadableHandle);
	this.mergecells_butt = $("button#merge-cells").button({ icons: { primary: "ui-icon-blank" }, text: false })
												.click( { grid : this.grid, self : this }, this.mergeHandle);
	this.splitcells_butt = $("button#split-cells").button({ icons: { primary: "ui-icon-blank" }, text: false })
												.click( { grid : this.grid, self : this }, this.splitHandle);
	this.cellmask_butt = $("button#cell-mask").button({ icons: { primary: "ui-icon-blank" }, text: false })
												.click( { grid : this.grid, self : this }, this.maskedHandle);
	this.draw_cell_butt = $("#draw-cells").button()
										.click( { grid : this.grid, self : this }, this.draw_cellHandle);

	this.v_split_spinner = $("#split-numcells-v").spinner({ min: 1 }).spinner("value", 1);
	this.h_split_spinner = $("#split-numcells-h").spinner({ min: 1 }).spinner("value", 1);
	this.rotate_cell_spinner = $("#rotate-cell-input")
									.spinner({ min: 0, max: 360 })
									.spinner("value", 0)
									.spinner({spin: function(e, ui){ $.extend(e, {data:{self_class: self_r}}); self_r.rotateCell(e, ui); } })
									.bind("change", {self_class: self_r}, this.rotateCell);
	
	//---------------------------------------------------------------------------------------------------------
}

//*************************************************************************************************************

// Add Cell Rotation
ToolbarCells.prototype.rotateCell = function(e, ui){
	var angle = 0,
		self_class = e.data.self_class;

	switch(e.type){
		case "spin" :  angle = ui.value; break;
		case "change" :  angle = $(e.target).val(); break;
	}

	$(".cell.selected").each(function(){
		self_class.grid.cells[$(this).prop("id")].rotation = angle;

		$(this).css({ "-ms-transform-origin": "50% 50%",
					  "-webkit-transform-origin": "50% 50%",
					  "transform-origin": "50% 50%",
					  "-ms-transform": "rotate("+angle+"deg)",
					  "-webkit-transform": "rotate("+angle+"deg)",
					  "transform": "rotate("+angle+"deg)"});
	})
}

function adjustCellPosition(self_class, cell_id){
	var	scale = p.scale/100,
		grid_w = self_class.workdesk.convert(self_class.grid.width, "to pix print") * scale,
		grid_h = self_class.workdesk.convert(self_class.grid.height, "to pix print") * scale,
		cell_coord = $(this).position();

	self_class.grid.cells[cell_id].x = cell_coord.left / scale,
	self_class.grid.cells[cell_id].y = cell_coord.top / scale,
	self_class.grid.cells[cell_id].x_ratio = grid_w / cell_coord.left,
	self_class.grid.cells[cell_id].y_ratio = grid_h / cell_coord.top;
}

// TOGGLE UPLOADABLE MODE--------------------------------
ToolbarCells.prototype.uploadableHandle = function(e) {
	var cells_storage = e.data.grid.cells,
		self = e.data.self;

	self.switchMode( $(".cell.selected"), "selected","uploadable");

	// console.log(cells_storage);
}

// MERGE CELLS ------------------------------------------
ToolbarCells.prototype.mergeHandle = function(e) {
	var self = e.data.self,
		cells_storage = e.data.grid.cells;

	self.switchMode( $(".cell.selected"), "selected");
	
	console.log(cells_storage);
}

// SPLIT CELLS ------------------------------------------
ToolbarCells.prototype.splitHandle = function(e) {
	var self = e.data.self,
		grid = e.data.grid,
		$selected_cells = $(".cell.selected"),
		grind_print_w = self.workdesk.convert( grid.width, "to pix print"), 
		grind_print_h = self.workdesk.convert( grid.height, "to pix print");

	// Split each cell into 4 equal cells
	$selected_cells.each( function(){
		var selected_cell = $(this),
			s_cell_id = selected_cell.prop("id");
		
		self.switchMode( selected_cell, "selected", "splitcell"); // REMOVE .selected, .cell, ADD .splitcell

		self.workdesk.splitCell({	celltosplit: selected_cell,
									cell_id : s_cell_id,
									width: grid.cells[s_cell_id].w,
									height: grid.cells[s_cell_id].h,
									scale: self.p.scale,
									h_numcells: self.v_split_spinner.spinner("value"),
									v_numcells: self.h_split_spinner.spinner("value")		});

		//delete grid.cells[ s_cell_id ];
		//selected_cell.remove();
	});
	self.workdesk.removeUnusedCells();

	// console.log(grid);
}

// SPLIT CELLS ------------------------------------------
ToolbarCells.prototype.maskedHandle = function(e) {
	var self = e.data.self,
		cells_storage = e.data.grid.cells;

	self.switchMode( $(".cell.selected"), "selected", "masked");
	
	console.log(cells_storage);
}

// DRAW CELL --------------------------------------------
ToolbarCells.prototype.draw_cellHandle = function(e) {
	var self = e.data.self,
		cells_storage = e.data.grid.cells;
	if($(this).prop("checked")){
		$("label[for='draw-cells']").addClass("checked");
		self.workdesk.manual_cell_drawing_mode = true;
		self.workdesk.bindCellDrawingEvents();
	} else {
		$("label[for='draw-cells']").removeClass("checked");
		self.workdesk.removeOverDrawingZone();
		self.workdesk.manual_cell_drawing_mode = false;
	}
}

//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

ToolbarCells.prototype.switchMode = function(cellobj){
	var self = this,
		arg = arguments;

	cellobj.each(function(){
		cellstorage = self.grid.cells[$(this).prop("id")];

		for(var i = 1, tot = arg.length; i < tot; i+=1){
			$(this).toggleClass( arg[i] );
			cellstorage[arg[i]] = $(this).hasClass(arg[i]);
			// console.log(arg[i]);
		}
	})
}














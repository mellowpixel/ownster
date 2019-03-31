// Scroll Class requires jQuery

function OwnsterScrollBar (settings){
	this.settings = { scroll_container: undefined,
					  scrolled_page: undefined,
					  scrolled_page_position: 0,
					  scrollbar_settings: undefined,
					  scroll_bar_slider: undefined };

	this.$scroll_bar = undefined;
	this.$scroll_bar_slider = undefined;

	$.extend(this.settings, settings);

	if(typeof this.settings.scroll_container !== "undefined"){
		if(this.settings.scroll_container instanceof jQuery){
			this.scroll_container = this.settings.scroll_container;
		} else {
			if(typeof this.settings.scroll_container == "string"){
				this.scroll_container = $(this.settings.scroll_container);
			}
		}
	}

	if(typeof this.settings.scrolled_page !== "undefined"){
		if(this.settings.scrolled_page instanceof jQuery){
			this.scrolled_page = this.settings.scrolled_page;
		} else {
			if(typeof this.settings.scrolled_page == "string"){
				this.scrolled_page = $(this.settings.scrolled_page);
			}
		}
	}

	// this.makeScrollBar();
}

//---------------------------------------------------------------------------------
// 
OwnsterScrollBar.prototype.makeScrollBar = function() {
	this.$scroll_bar = $("<div>");
	this.$scroll_bar_slider = $("<div>");
	this.$scroll_bar.append(this.$scroll_bar_slider).appendTo(this.settings.scroll_container);

	if(typeof this.settings.scrollbar_settings.params !== "undefined"){
		for(p in this.settings.scrollbar_settings.params){
			this.$scroll_bar.attr(p, this.settings.scrollbar_settings.params[p])
		}
	}

	if(typeof this.settings.scroll_bar_slider.params !== "undefined"){
		for(param in this.settings.scroll_bar_slider.params){
			this.$scroll_bar_slider.attr(param, this.settings.scroll_bar_slider.params[param])
		}
	}

	this.$scroll_bar_slider.unbind("mousedown").unbind("mousemove")
					.data("saved_position", 0)
					.bind("mousedown", {self:this}, this.mousemoveHandler);	
};

//---------------------------------------------------------------------------------
// 
OwnsterScrollBar.prototype.resizeScroll = function() {
	var page_size_ratio = $(this.settings.scrolled_page).height() / $(this.settings.scroll_container).height();
	this.$scroll_bar_slider.height(this.$scroll_bar.height() / page_size_ratio);
};

//---------------------------------------------------------------------------------
// 
OwnsterScrollBar.prototype.getPosition = function(vector) {
	var pos = this.$scroll_bar_slider.position();
	switch(vector){
		case "vertical": return pos.top; break;
		case "horizontal": return pos.left; break;
	}
};

//---------------------------------------------------------------------------------
// 
OwnsterScrollBar.prototype.mousemoveHandler = function(e_down) {
	var self = e_down.data.self,
		saved_position = self.$scroll_bar_slider.data("saved_position"),
		offset = $(".scroll_detector", self.settings.scrolled_page).position(),
		step_ratio = (offset.top - $("#lyouts-page-wrapp").height()) / (self.$scroll_bar.height()-self.$scroll_bar_slider.height()-10);
	
	e_down.preventDefault(); // Prevents selection of the page content

	$("main").unbind("mousemove").bind("mousemove", function(e_move){
		mouse_offset = saved_position + e_move.pageY - e_down.pageY;		
		if(mouse_offset >= 0 && mouse_offset <= $(self.settings.scroll_container).height()-self.$scroll_bar_slider.height()-10){
			self.$scroll_bar_slider.css({top: mouse_offset+"px"})
								   .data("saved_position", mouse_offset);

			$(self.settings.scrolled_page).css( "margin-top", (-1 * mouse_offset * step_ratio)+"px");
		}
	});

	$(document).bind("mouseup", function(eup){ 
		$("main").unbind("mousemove");
		$(document).unbind("mouseup"); })
};


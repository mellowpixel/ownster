function ExpandablePanels(settings){
	this.settings = { product : null, 
					  workdesk : null,
					  expand_butt : ".expand-pannel-butt" };

	$.extend(this.settings, settings);

	$(this.settings.expand_butt).bind("click", this.toggleExpandPanel );
}

ExpandablePanels.prototype.toggleExpandPanel = function(e){
	// this - button.expexpand-pannel-butt
	var self = this;

	$(".expandable-panel").not($(this).closest("aside")).addClass("closed");
	$(".expand-pannel-butt").text("►");
	$(this).closest("aside").hasClass("closed") ? (function(){ $(self).closest("aside").removeClass("closed"); $(self).text("▼"); })()
												: (function(){ $(self).closest("aside").addClass("closed"); $(self).text("►"); })()
}
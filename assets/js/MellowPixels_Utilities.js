
function MPixelsUtils(){
	
	this.makeJqObj = function(selection){
		if(!selection.jquery){
			if (typeof selection == "string") {
				return $(selection);
			}
		} else {
			return selection;
		}
	}
}

MPixelsUtils.prototype.sayHi = function(){
	alert("Hi!");
}

MPixelsUtils.prototype.addButtons = function( parent, text, title, butt_class, onClk, attributes ){
	
/* Append single or multiple buttons to HTML element / elements. *******************************************/
/*
/* @param arguments[0] {Array} Array of objects with button parametrs e.g.,
/*								[ { parent : ".parent", text : "Submit", onClk : function(){}}, {...}, ... ]
/*
/* OR ADD SINGLE BUTTON BY PRESENTING ARGUMENTS
/*
/* @param parent	 {String/jQuery Object} "DOM .class / #id or jQuery object where button to be appended."
/* @param text		 {String} "Text inside the button"
/* @param title		 {String} "Title of the button"
/* @param butt_class {String} "Button Class jQuery style e.g. ".button_class"
/* @param onClk		 {Function}	"Function to be executed on click"
/* @param attributes {Object} "Any additional atributes to the button."
/*
/***********************************************************************************************************/

	//----------- Add optional attributes -----------------//
	var addAttr = function(attr_obj){
		if( typeof attr_obj != "undefined" &&
			typeof attr_obj != "object"){
				for(attr in attr_obj){
					$button.attr( attr, attr_obj[attr]);
				}
		}
	}
	//----------------------------------------------------//
	// Add Multiple Buttons from array of objects
	if(arguments[0] instanceof Array){
		var buttons = arguments[0];
		for(i in buttons){
			$button = $("<button></button>");
			(typeof buttons[i].text != "undefined") && $button.text( buttons[i].text );
			(typeof buttons[i].title != "undefined") && $button.attr( "title", buttons[i].title );
			(typeof buttons[i].butt_class != "undefined") && $button.addClass( buttons[i].butt_class );
			(typeof buttons[i].onClk != "undefined" &&
			 typeof buttons[i].onClk == "function") && $button.click( buttons[i].onClk );
			
			addAttr(buttons[i].attr);
		 
			 if(typeof buttons[i].parent == "string" ){ buttons[i].parent = $(buttons[i].parent); }
			 $( buttons[i].parent ).append( $button );
		}
		
	} else {
		
		// Add Single Button
		$button = $("<button>"+text+"</button>")
					.addClass( butt_class )
					.attr("title", title)
					.click(onClk);
		addAttr(attributes);
			
		if(typeof parent == "string"){ parent = $(parent); }
		$( parent ).append( $button );
	}	
}

/* SWAP ADJACENT HTML ELEMENTS *****************************************************************************/
/*
/* @param collection	{String/jQuery} "Collection of ellements from which to get an index of elm_to_swap"
/* @param elm_to_swap	{String/jQuery} "HTML element that will be swapped"
/* @param direction		{String}		"Up or Down"
/*
/***********************************************************************************************************/
MPixelsUtils.prototype.swapHtmlElm = function(collection, elm_to_swap, direction){
	var index = null;
	$collection = this.makeJqObj(collection);
	$elm_to_swap = this.makeJqObj(elm_to_swap);

	index = $collection.index( $elm_to_swap );
	if (typeof direction == "string") {
		direction = direction.toLowerCase();
		switch(direction){
			case "up" : (function(){ 
							(index > 0) && $elm_to_swap.insertBefore( $collection.eq(index-1));
						}()); break;
			case "down" : (function(){ $elm_to_swap.insertAfter( $collection.eq(index+1))}()); break;
		}
	};
}

/* RETURNS INDEXES OF HTML ELEMENTS INSIDE COLLECTION  *****************************************************/
/* Returns array of objects. First key/value is an HTML elemen's attribute value, second is its index
/* within a collection. 
/*
/* @param selection		{String/jQuery} "Collection of ellements to be indexed."
/* @param id_attribute	{String} 		"Name of the html attribute to use for element identification."
/* @param start_ind		{Integer}		"Optional parametr. Use if indexing should start from value other than 0"
/* @return indexes		{Array of Objects} "[{ id : html_attr_val, index : elm_index}, {...}, ...]"
/*
/***********************************************************************************************************/

MPixelsUtils.prototype.getElmsIndex = function(selection, id_attribute, start_ind){
	var indexes = [];
	if (typeof start_ind == "undefined") { start_ind = 0;};
	$collection = this.makeJqObj(selection);
	$collection.each(function(index, element) {
        indexes.push( { id : $(element).attr(id_attribute), index : index+start_ind });
    });
	return indexes;
}

MPixelsUtils.prototype.randomString = function(lengt){
	var a = shuffle(["a","b","c","d","e","f",
				 "g","h","i","j","k","l",
				 "m","n","o","p","q","r",
				 "s","t","u","v","w","x",
				 "y","z"]),
		str = "";

	for (var i = 0; i < lengt; i+=1) {
		str+= a[i];
		
	};
	return str;
}

MPixelsUtils.prototype.htmlEntitiesEncode = function(rawstr){
	var s = rawstr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
   					return '&#'+i.charCodeAt(0)+';';
			});
	return s
}

MPixelsUtils.prototype.shuffle = function(a){ //v1.0
    for(var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
    return a;
};

MPixelsUtils.dataURItoBlob = function(dataURI, dataTYPE){
    var binary = atob(dataURI.split(',')[1]), array = [];
    for(var i = 0; i < binary.length; i++){
    	array.push(binary.charCodeAt(i));	
    } 
    return new Blob([new Uint8Array(array)], {type: dataTYPE});
}

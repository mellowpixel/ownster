/*//////////////////////////////////////////////////////////////////////
 *
 *
 *
 *
 *
*///////////////////////////////////////////////////////////////////////

function Utilities(){
	var self = this;
	
	this.ajax_server_path = "";

	/*
	 *	This function checks if object is a HTML element
	 *	returns True or False
	*/	
	
	this.isElement = function(obj){
	  return ( typeof HTMLElement === "object" ? obj instanceof HTMLElement : typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string");
	}
	
	
	/*/////////////////////////////////////////////////////////////////////////////////////////////////
	 *																								//
	 *	On AJAX Ready State write output into container as innerHTML							   //
	 *	valueToSend is the value to send to the ajax server										  //
	 *	optional_Function is an optional function that executes on readyState					 //
	 *																							//
	 *///////////////////////////////////////////////////////////////////////////////////////////
	 
	 
	this.sendReceiveToID = function(htmlID, valueToSend, optional_Function)
	{
		var Request = self.ajaxRequest();
		Request.open("POST", self.ajax_server_path, true);
		Request.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
	
		Request.onreadystatechange = function(){
			var output,
				optional_value,
				array_level;
				
			if(Request.readyState == 4)
			{
				if(Request.responseText !== ""){
					output = Request.responseText.split(":|");
					switch(output[0]){
						
						case "msg": message('messageBox', output[1]);
									break;
									
						case "alert": alert(output[1]);
										break;			
								
						case "append": 	var element = document.createElement('div');
										element.innerHTML = output[1];
										document.getElementById(htmlID).appendChild(element);
										break;
						
						case "location":	window.location = output[1];
											break;
										
						case "value":	optional_value = output[1];
										break;
										
						case "array":	optional_value = output[1].split("~");
										
										break;
														
						case "securearray":	optional_value = output[1].split("[$%£§]");
										
										break;
										
						case "multyarray":	array_level = output[1].split("[$%£§]");
											optional_value = [];
											for( var i = 0, tot = array_level.length; i < tot; i += 1){
												optional_value.push(array_level[i].split("[$%£Sub]"));
											}
										
										break;
						
						
						default : if(htmlID !== null){
									document.getElementById(htmlID).innerHTML = output[1];
									}
								//	alert(output[1]);
									break;
					}
				}
				
				if(typeof(optional_Function) == 'function'){
					if(typeof optional_value !== "undefined"){
						
						optional_Function(optional_value);

					} else {
						optional_Function();
					
					}
				}
			}
		}
		
		Request.send(valueToSend);
	}
	
	
	/*/////////////////////////////////////////////////////////////////////////////////////////////////
	 *																								//
	 *	CROSS-BROWSER AJAX REQUEST INITIATION													   //
	 *																		  					  //
	 */////////////////////////////////////////////////////////////////////////////////////////////
	
	 
	this.ajaxRequest = function()
	{
		try {
			newRequest = new XMLHttpRequest();
		}
		catch(e1) {
			try {
				newRequest = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e2) {
				try {
					newRequest = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch(e3) {
					alert("Ajax Error. Update your Browser!");
					return false;
				}
			}
		}
		return newRequest;
	}
	
	
	/*/////////////////////////////////////////////////////////////////////////////////////////////////
	 *																								//
	 *	ISSET Implementation																	   //
	 *																		  					  //
	 */////////////////////////////////////////////////////////////////////////////////////////////
	 
	 
	this.isset = function(variable)
	{
		return typeof(variable) != 'undefined'
	}
	
	
	/*/////////////////////////////////////////////////////////////////////////////////////////////////
	 *																								//
	 *	$()																						   //
	 *																		  					  //
	 */////////////////////////////////////////////////////////////////////////////////////////////
	
	
	function $(ID)
	{
		return document.getElementById(ID)
	}
	
	/*/////////////////////////////////////////////////////////////////////////////////////////////////
	 *																								//
	 *	Get Height of the document																   //
	 *																		  					  //
	 */////////////////////////////////////////////////////////////////////////////////////////////
	 
	this.getDocHeight = function() {
    	var D = document;
		return Math.max(
			Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
			Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
			Math.max(D.body.clientHeight, D.documentElement.clientHeight)
		);
	}
	
	/*/////////////////////////////////////////////////////////////////////////////////////////////////
	 *																								//
	 *	Get Cursor coord relative to the page top left corner									   //
	 *																		  					  //
	 */////////////////////////////////////////////////////////////////////////////////////////////
	 
	this.mouseX = function(evt) {
		if (evt.pageX) return evt.pageX;
		else if (evt.clientX)
		   return evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
		else return null;
	}
	
	this.mouseY = function(evt) {
		if (evt.pageY) return evt.pageY;
		else if (evt.clientY)
		   return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
		else return null;
	}

}
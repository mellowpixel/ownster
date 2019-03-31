$(document).ready(function(){
	
	window.setInterval(function(){
		$("body").append("<p>Punish him!</p>");
		punisher(0);
	}, 30000);

});

function punisher(counter){
	var
	product_ids = [3,6,8,9],
	on_off_switch = 0,
	url="http://ownster.co.uk/assets/php/ProductServer.php";
	$.post( "cur.php",
			{toggleActive: product_ids[counter] , active: on_off_switch, url: url },
			function(data){
				$("body").append("<p>Product ID: "+product_ids[counter]+", Active: "+on_off_switch+" ---- "+data+"</p>");
				if((counter+1) < product_ids.length){ 
					counter = counter+1;
					punisher(counter);
				}
			},
			"json");
}
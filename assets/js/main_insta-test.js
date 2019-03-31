$(document).ready(function(){

/*	$('#instagram-wrapper').on('willLoadInstagram', function(event, options) {
    console.log(options);
  });
  $('#instagram-wrapper').on('didLoadInstagram', function(event, response) {
    console.log(response);
  });
  $('#instagram-wrapper').instagram({
    hash: 'love',
    clientId: 'a6d8e22917604c61b4f2e35b46e21a22'
  });*/

/*API = Instajam.init({
    clientId: 'a6d8e22917604c61b4f2e35b46e21a22',
    redirectUri: 'http://ownster.mellowpixels.com/personalize-test/',
    scope: ['basic', 'comments']
});

API.user.self.profile(function(response) {
    console.log(response);
});*/

API = Instajam.init({
	    clientId: 'a6d8e22917604c61b4f2e35b46e21a22',
	    redirectUri: 'http://ownster.mellowpixels.com/personalize-test/',
	    scope: ['basic', 'comments']
	});

	if(API.authenticated){

		API.user.self.profile(function(response) {
		    $("main").append("<h2>Hello "+response.data.full_name+"!</h2");
		});

		API.user.self.media(loadImages);
	} else {
		window.location = API.authUrl;
	} 

});

//---------------------------------------------------------------------------------
// 

function loadImages(response){
	console.log(response);
	for(img in response.data){
		$("<img>").prop("src", response.data[img].images.low_resolution.url).appendTo("main")
	}
}


















var canvas, 
	ctx, 
	flickrPhotos, 
	flickrRand, 
	flickrUrl, 
	unescoData, 
	unescoRand, 
	lat, 
	lon, 
	place,
	bgWidth,
	bgHeight,
	deg = Math.random() * (-0.3 - 0.3) + 0.3;

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  getLocation();
} 

function saveImage() {
	console.log('in saveImage function');
	var canvasData = canvas.toDataURL("image/png"); 
	console.log('canvasData has data');
	if (canvasData) {
		$.ajax({
			type: "POST",
			url: "writeImage.php",
			data: {image: canvasData},
			success: function() {
				console.log("image saved");
			},
			error: function(response) {
				console.log(response);
				resetVariables();
				getLocation();
			}
		});
	}
}

function drawGlobie(deg) {
	var globie = document.getElementById("globie");

  ctx.rotate(deg);
  ctx.drawImage(globie, 0, 200, 700, 700);

  saveImage();
}

function drawBg() {
	var bg = document.getElementById("bg");

	ctx.drawImage(bg, 0, 0, 600, 600, 0, 0, 600, 600);

	drawGlobie(deg);
}

function jsonFlickrApi (response) {
	var flickrPhotos = response.photos.photo;
	var flickrRand = Math.floor(Math.random() * (flickrPhotos.length + 1)); 

	if (flickrPhotos[flickrRand] !== undefined) {
		var flickrUrl = flickrPhotos[flickrRand]['url_l'];
		if (flickrUrl !== undefined) {
			console.log(flickrUrl);
			$.ajax({
				type: "POST",
				url: "saveImage.php",
				data: {image: flickrUrl},
				success: function() {
					console.log("bg saved");
					$('body').append('<img id="bg" src="bg.jpg">');
					$('#bg').load(function() {
						/*bgWidth = $('#bg').width();
						bgHeight = $('#bg').height();
						console.log('width ' + bgWidth);
						console.log('height ' + bgHeight);
						if (bgWidth >= 600 && bgHeight >= 600) {
							drawBg();
						} else {
							console.log('too small');
							$('#bg').remove();
							getLocation();
						}*/
						drawBg();
					});
				},
				error: function(response) {
					console.log(response);
				}
			});
		} else { // flickrUrl == undefined
			console.log('flickrUrl undefined');
			resetVariables();
			getLocation();
		}
	} else { // flickrPhotos[flickrRand] == undefined
		console.log('flickrPhotos[flickrRand] undefined');
		resetVariables();
		getLocation();
	}

}

function getFlickr(lat, lon) {
	$.ajax({
		url: 'https://api.flickr.com/services/rest/?' + 
		'method=flickr.photos.search' + 
		'&api_key=9d836eb4572899e19c64492f195b8784' + 
		'&lat=' + lat + 
		'&lon=' + lon + 
		'&extras=url_l' + // image size
		'&format=json',
		dataType: 'jsonp',
	  type: 'GET',
	});
}

function getLocation() {
	$.ajax({
		url: 'unesco.json',
		dataType: 'json',
	  type: 'GET',
	  success: function(data) {
	  	unescoData = data.QUERYRESULT.DATA;
	  	unescoRand = Math.floor(Math.random() * (unescoData.length + 1));
	  	lat = unescoData[unescoRand][0];
	  	lon = unescoData[unescoRand][1];
	  	place = unescoData[unescoRand][5];

	  	console.log('Globie visits ' + place);
	  	getFlickr(lat, lon);
	  }
	});
}

function resetVariables() {
	flickrPhotos = undefined;
	flickrRand = undefined;
	flickrUrl = undefined;
	unescoData = undefined;
	unescoRand = undefined;
	lat = undefined;
	lon = undefined;
	place = undefined;
	bgWidth = undefined;
	bgHeight = undefined;
}

$(function(){ 
	init();
});

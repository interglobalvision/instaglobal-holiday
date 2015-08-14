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
	bg,
	$bg,
	deg = Math.random() * (-0.2 - 0.2) + 0.2;

 

function postToInsta(filename) {
	$.ajax({
		type: "POST",
		url: "postToInsta.php",
		data: {filename: filename, caption: caption},
		success: function(response) {
			console.log('image posted ' + response);
		},
		error: function(response) {
			console.log('instagram error ' + response);
		}
	});
}

function saveImage() {
	var canvasData = canvas.toDataURL("image/jpg"); 
	if (canvasData) {
		$.ajax({
			type: "POST",
			url: "writeImage.php",
			data: {image: canvasData},
			success: function(response) {
				console.log("filename" + response);
				//postToInsta(response);
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
  ctx.drawImage(globie, 0, 500, 850, 850);

  saveImage();
}

function drawBg() {
	bg = document.getElementById("bg");

	ctx.drawImage(bg, 0, 0, 600, 600, 0, 0, 1080, 1080);

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
					
					$bg = $('#bg');

					$bg.load(function() {
						bgWidth = $('#bg').width();
						bgHeight = $('#bg').height();
						console.log('width ' + bgWidth);
						console.log('height ' + bgHeight);
						
						if (bgWidth >= 600 && bgHeight >= 600) {
							drawBg();
						} else {
							console.log('too small');
							$('#bg').remove();
							resetVariables();
							getLocation();
						}

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
		'&api_key=731a3dc1069a15969d725a3805acc530' + 
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
	  	caption = 'Globie visits ' + place;

	  	$('#caption').html(caption);

	  	console.log(caption);
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
	bgWidth = null;
	bgHeight = null;
	$bg = null;
	bg = null;
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  getLocation();
}

$(function(){ 
	init();
});

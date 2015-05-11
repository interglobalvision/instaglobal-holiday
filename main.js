var canvas, ctx;
var deg = Math.random() * (-0.3 - 0.3) + 0.3;
function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  //getLocation();
  drawGlobie();  
  //if you run drawGlobie() instead of getLocation() [skipping the whole bg render process], saveImage() function runs completely.  so i think the bug has something to do with the way the bg is being drawn. 
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
	var flickrObj = Math.floor(Math.random() * (flickrPhotos.length + 1)); 
	var flickrUrl = flickrPhotos[flickrObj]['url_l'];

	console.log(flickrUrl);

	$('body').append('<img id="bg" src="' + flickrUrl + '">');

	$('#bg').load(function() {
		drawBg();
	})
}
function getFlickr(lat, lon) {
	$.ajax({
		url: 'https://api.flickr.com/services/rest/?' + 
		'method=flickr.photos.search' + 
		'&api_key=9d836eb4572899e19c64492f195b8784' + 
		'&lat=' + lat + 
		'&lon=' + lon + 
		'&extras=url_l' + 
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
	  	var unescoData = data.QUERYRESULT.DATA;
	  	var unescoObj = Math.floor(Math.random() * (unescoData.length + 1));
	  	var lat = unescoData[unescoObj][0];
	  	var lon = unescoData[unescoObj][1];
	  	var place = unescoData[unescoObj][5];

	  	console.log('Globie visits ' + place);
	  	getFlickr(lat, lon);
	  }
	});
}
/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Generator, Modernizr */

Generator = {
  canvas: undefined,
  ctx: undefined,
  lat: undefined,
  lon: undefined,
  place: undefined,
  deg: Math.random() * (-0.3 - 0.3) + 0.3,

  init: function() {
    var _this = this;

    _this.canvas = document.getElementById('generator');
    _this.ctx = _this.canvas.getContext('2d');
    _this.getLocation();

  },

  getLocation: function() {
    var _this = this;

    $.ajax({
      url: 'unesco.json',
      dataType: 'json',
      type: 'GET',
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('jqXHR', jqXHR);
        console.log('textStatus', textStatus);
        console.log('errorThrown', errorThrown);
      },
      success: function(data) {
        var unescoData = data.QUERYRESULT.DATA;
        var unescoObj = Math.floor(Math.random() * (unescoData.length + 1));
        _this.lat = unescoData[unescoObj][0];
        _this.lon = unescoData[unescoObj][1];
        _this.place = unescoData[unescoObj][5];

        _this.getFlickr();
      }
    });

  },

  getFlickr: function() {
    var _this = this;

    $.ajax({
      url: 'https://api.flickr.com/services/rest/?' +
      'method=flickr.photos.search' +
      '&api_key=731a3dc1069a15969d725a3805acc530' +
      '&lat=' + _this.lat +
      '&lon=' + _this.lon +
      '&extras=url_l' +
      '&format=json' +
      '&jsoncallback=?',
      dataType: 'jsonp',
      type: 'GET',
      error: function(jqXHR, textStatus, errorThrown) {
        console.log('jqXHR', jqXHR);
        console.log('textStatus', textStatus);
        console.log('errorThrown', errorThrown);
      },
      success: function(response) {
        console.log('Flickr Response', response);

        _this.loadFlickrImage(response);
      }
    });

  },

  loadFlickrImage: function(response) {
    var _this = this;
    var flickrPhotos = response.photos.photo;

    if (flickrPhotos !== 'undefined') {
      var flickrObj = Math.floor(Math.random() * (flickrPhotos.length + 1));
      var flickrUrl = flickrPhotos[flickrObj]['url_l'];

      $('body').append('<img id="bg" src="' + flickrUrl + '">');

      _this.bg = document.getElementById('bg');
      _this.bg.onload = function() {
        console.log('background loaded');
        _this.drawBg();
      };
    } else {
      _this.getFlickr();
    }

  },

  drawBg: function() {
    var _this = this;

    _this.ctx.drawImage(_this.bg, 0, 0, 600, 600, 0, 0, 1000, 1000);
    _this.drawGlobie(_this.deg);

  },

  drawGlobie: function() {
    var _this = this;
    var globie = document.getElementById('globie');

    _this.ctx.rotate(_this.deg);
    _this.ctx.drawImage(globie, 0, 200, 700, 700);

    $('#caption').html('Globie visits ' + _this.place);

    _this.saveImage();

  },

  saveImage: function() {
    var _this = this;

/*
    var canvasData = _this.canvas.toDataURL('image/png');
    console.log('canvasData has data. You need to save this into an img element');
*/

  },

  urlToData: function(url, callback, outputFormat) {
    var img = new Image();

    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      var canvas = document.createElement('converter');
      var ctx = canvas.getContext('2d');
      var dataURL;

      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
      canvas = null;
    };

    img.src = url;
}

};

jQuery(document).ready(function () {
  'use strict';

  Generator.init();

});
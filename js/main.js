/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Generator, Modernizr */

Generator = {
  canvas: undefined,
  ctx: undefined,
  lat: undefined,
  lon: undefined,
  place: undefined,
  width: 1000,
  height: 1000,
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

      _this.urlToData(flickrUrl, function(data) {
        _this.drawBackground(data);
      });

    } else {
      _this.getFlickr();
    }

  },

  drawBackground: function(data) {
    var _this = this;
    var img = new Image();

    img.onload = function() {
      var height = img.naturalHeight;
      var width = img.naturalWidth;
      var multiplier;
      var offset;

      if (height === width) {

        // handle square image
        multiplier = _this.height / height;
        _this.ctx.drawImage(img, 0, 0, (width * multiplier), (height * multiplier));

      } else if (height > width) {

        // handle portrait
        multiplier = _this.width / width;
        offset = (((height * multiplier)-_this.height) / 2);

        _this.ctx.drawImage(img, 0, -offset, (width * multiplier), (height * multiplier));

      } else {

        // handle landscape
        multiplier = _this.height / height;
        offset = (((width * multiplier)-_this.width) / 2);

        _this.ctx.drawImage(img, -offset, 0, (width * multiplier), (height * multiplier));

      }

      _this.drawGlobie(_this.deg);

    };
    img.src = data;

  },

  drawGlobie: function() {
    var _this = this;
    var globie = document.getElementById('globie');

    _this.ctx.rotate(_this.deg);
    _this.ctx.drawImage(globie, 0, 500, 850, 850);

    $('#caption').html('Globie visits ' + _this.place);

    _this.saveImage();

  },

  saveImage: function() {
    var _this = this;
    var canvasData = _this.canvas.toDataURL('image/png');

    document.getElementById('output').src = canvasData;

  },

  urlToData: function(url, callback, outputFormat) {
    var img = new Image();

    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      var canvas = document.createElement('CANVAS');
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
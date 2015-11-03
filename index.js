function processImage (img) {
  // img.height, .width, .data [r,g,b,a,r,g,b,a...]
  rotate90(img);
}

function copy (img) {
  return img;
}

function transparent (img) {
  var result = img;
  var data = img.data;
  for(var i = 3; i < data.length; i += 4) {
    if(data[i - 3] === 255 && data[i - 2] === 255 && data[i - 1] === 255) {
      data[i] = 1;
    }
  }
  result.data = data;
  return result;
}

function tintRed (img) {
  var result = img;
  var data = img.data;
  for(var i = 0; i < data.length; i += 4) {
    data[i] = data[i] + Math.floor(0.9 * (255 - data[i]));
  }
  result.data = data;
  return result;
}

function greyscale (img) {
  var result = img;
  var data = img.data;
  for(var i = 0; i < data.length; i += 4) {
    var maxRGB = Math.max(data[i], data[i + 1], data[i + 2]);
    data[i] = maxRGB;
    data[i + 1] = maxRGB;
    data[i + 2] = maxRGB;
  }
  result.data = data;
  return result;
}

function invertColors (img) {
  var result = img;
  var data = img.data;
  for(var i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  result.data = data;
  return result;
}

function flipVertical (img) {
  var result = img;
  var data = img.data;
  var newData = data.join('').split('');
  var step = img.width * 4;
  for(var i = img.data.length - step; i >= 0; i -= step) {
    for(var j = 0; j < step; j++) {
      newData[j + img.data.length - i - step] = data[i + j];
    }
  }
  result.data = newData;
  return result;
}

function flipHorizontal (img) {
  var result = img;
  var data = img.data;
  var newData = data.join('').split('');
  var step = img.width * 4;
  for(var i = 0; i < img.data.length; i += step) {
    for(var j = 0; j < step; j += 4) {
      newData[i + step - j - 4] = data[i + j];
      newData[i + step - j - 3] = data[i + j + 1];
      newData[i + step - j - 2] = data[i + j + 2];
      newData[i + step - j - 1] = data[i + j + 3];
    }
  }
  result.data = newData;
  return result;
}

function rotate90 (img) {
  var result = img;
  var data = img.data;
  var newData = data.join('').split('');
  var step = img.width * 4;
  var index = 0;
  for(var i = img.data.length - step; i < img.data.length; i += 4) {
    for(var j = i; j > 0; j -= step) {
      newData[index] = data[j];
      newData[index + 1] = data[j + 1];
      newData[index + 2] = data[j + 2];
      newData[index + 3] = data[j + 3];
      index += 4;
    }
  }
  result.data = newData;
  return result;
}

function blur (img, blurFactor) {}




// DON'T MESS WITH WHAT'S BELOW

var fs = require('fs')
var path = require('path')
Png = require('node-png').PNG;
var date = Date.now()
var inputFilePath = './images/beach.png'
var outputFilePath = './images/out/'+String(date)+'.png'

fs.createReadStream(inputFilePath)
.pipe(new Png({
  filterType: 4
}))
.on('parsed', function() {
  processImage(this)
  this.pack().pipe(fs.createWriteStream(outputFilePath));
});

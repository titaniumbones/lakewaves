const download = require('images-downloader').images,
      fs = require('fs'),
      request = require('request');

// The file will be downloaded to this directory. For example: __dirname + '/mediatheque'
const waveDest = 'images/waves',
      windDest = 'images/wind';

let wave_images = [],
    wind_images = [],
    cast = "";

for (var i = -48; i < 121; i++){
  var offset = i;
  if(offset > 9){
    offset = "+"+offset;
    cast="fcast";
  }else if(offset > 0 && offset < 10){
    offset = "+0"+offset;
    cast="fcast";
  }else if(offset < 0 && offset > -10){
    offset = "-0"+(i*(-1));
    cast="ncast";
  }else if(offset == 0){ //skip zero, avoid preload issues
    offset = "+01";
    i=1;
    cast="fcast";
  } else {
    cast = "ncast";
  }
  for (let stem of ["/owv", "/own"]) {
    let url = "http://www.glerl.noaa.gov/res/glcfs/"+cast+ stem + offset+".gif",
        image = "";
    if (stem == "/owv") {
      image = "images/waves/" + stem +offset + ".gif";
    } else {
      image = "images/wind/" + stem +offset + ".gif";
    }
      
    let req = request(url);
    req.pipe(fs.createWriteStream(image));
    //promises.push(req);
    console.log (`downloaded ${url} to ${image}`);
  }
  
  wave_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset+".gif");
  wind_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset+".gif");
}









const download = require('images-downloader').images,
      fs = require('fs'),
      request = require('request-promise');

const lakes = ["ontario", "erie", "huron", "superior", "michigan"];


async function getLakeImages(lake) {
  let waveDest = `images/${lake}/waves`,
      windDest = `images/${lake}/wind`,
      waveStem = "/" + lake[0] + "wv",
      windStem = "/" + lake[0] + "wn",
      baseURL = "http://www.glerl.noaa.gov/res/glcfs/";

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
      offset = "-00";
      //i=1;
      cast="ncast";
    } else {
      cast = "ncast";
    }

    await request(baseURL + cast + waveStem + offset + ".gif")
      .pipe(fs.createWriteStream(waveDest + waveStem + offset + ".gif"));
    //console.log(req);
    //req.pipe(fs.createWriteStream(waveDest + waveStem + offset + ".gif"));
    console.log(waveDest + waveStem + offset + ".gif");
    await request(baseURL + cast + windStem + offset + ".gif")
      .pipe(fs.createWriteStream(windDest + windStem + offset + ".gif"));
    //promises.push(req);
    //console.log (`downloaded ${url} to ${image}`);
    
    // for (let stem of ["/owv", "/own"]) {
    //   let url = "http://www.glerl.noaa.gov/res/glcfs/"+cast+ stem + offset+".gif",
    //       image = "";
    //   if (stem == "/owv") {
    //     image = waveDest + stem + offset + ".gif";
    //   } else {
    //     image = windDest + stem + offset + ".gif";
    //   }
      
    //   let req = request(url);
    //   req.pipe(fs.createWriteStream(image));
    //   //promises.push(req);
    //   console.log (`downloaded ${url} to ${image}`);
    // }
    
    wave_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset+".gif");
    wind_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset+".gif");
  }  
}

// The file will be downloaded to this directory. For example: __dirname + '/mediatheque'
let wave_images = [],
    wind_images = [],
    cast = "";


lakes.forEach(function(lake) {getLakeImages(lake)});

/**
 * 
 * @param {} lake and object with properties name, slug, assets?
 */
function buildLakeTab (lake) {
  
}

/**
 * 
 * @param {} lakes list of lake objects
 */
function buildNav (lakes) {
  let navWrapper = {
    open: `<ul class="nav nav-tabs" id="myTab" role="tablist">`,
    close: `</ul>`
  };
  let navHTML = navWrapper.open;
  for (l of lakes) {
    
  }
  
}

/**
*
*
**/
function buildIndexHTML( ) {

  // assemble navs
  let navsHTML = buildNav(lakes)
  
  // assemble tabs
  let tabsWrapper = {
    open: `<div class="tab-content" id="myTabContent">`,
    close: `</div>`
  };
  let tabsHTML = tabsWrapper.open;
  for (l of lakes) {
    tabsHTML += buildLakeTab(l);
  }
  tabsHTML += tabsWrapper.close;

  
}

















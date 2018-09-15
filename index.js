const download = require('images-downloader').images,
      fs = require('fs'),
      request = require('request-promise'),
      jsonfile = require('jsonfile');

const lakes = ["ontario", "erie", "huron", "superior", "michigan"];
// const lakes = ["ontario"];

let imageMeta = {},
    errors = 0;
try {
  imageMeta = jsonfile.readFileSync(`images/imageMeta.json`);
} catch (err) {
  console.log("imageMeta.json not found. creating file & initializing empty imagemeta");
  if (!(fs.existsSync("images"))) {
    console.log("creating images directory");
    fs.mkdir("images");
  }
}

const defaultModTime = "Sat, 1 Sep 2018 01:12:51 GMT";


function constructImageList(lake) {
  
  let waveDest = `images/${lake}/waves`,
      windDest = `images/${lake}/wind`,
      waveStem = "/" + lake[0] + "wv",
      windStem = "/" + lake[0] + "wn",
      baseURL = "http://www.glerl.noaa.gov/res/glcfs/",
      cast="",
      meta={};

  // ugly, finicky name management
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
    }else if(offset == 0){ 
      offset = "-00";
      //i=1;
      cast="ncast";
    } else {
      cast = "ncast";
    }
    // add wach wave and wind to to list
    let wave = {name: waveStem + offset,
                fullURL: baseURL + cast + waveStem + offset + ".gif",
                fullPath: waveDest + waveStem + offset + ".gif"},
        wind = {name: windStem + offset,
                fullURL: baseURL + cast + windStem + offset + ".gif",
                fullPath: windDest + windStem + offset + ".gif"};
    meta[wave.name] = {lastModified : defaultModTime,
                       path: wave.fullPath,
                       url: wave.fullURL};
    meta[wind.name] = {lastModified : defaultModTime,
                       path: wind.fullPath,
                       url: wind.fullURL};

  }
return meta;
}

// iterate through the lakes and then add all to
// as single object, which can be written to meta
function constructFullImageList() {
  let result = {};
  for (let l of lakes) {
    Object.assign(result, constructImageList(l));
  }
  writeImageMetaToFile("images/imageMeta.json", result);
  return result;
}

// stupid utility function
function writeImageMetaToFile(file, obj) {
  jsonfile.writeFile(file, obj, function (err) {
    if (err) console.error(err);
  });

}

// takes an image name and returns a modified version of its meta
// if successful, otherwise returns an error object
async function getImage(imageName) {
  let singleMeta = imageMeta[imageName];
  
  let path = singleMeta.path,
      modTime = singleMeta.lastModified,
      url = singleMeta.url;
  
  let options = {url: singleMeta.url,
                 method: "GET",
                 resolveWithFullResponse: true,
                 headers:{'If-Modified-Since': modTime,
                          'fulldownloadpath':path},
                 encoding: null,
                 simple: false,
                 testoptions: "testingnow"
                };
  await request(options)
        .then(function(response){
          if (response.statusCode == 200) {
            console.log(`resolved ${url} successfully!`);
            console.log(`attempting to write to ${path}`);
            let thisStream = fs.createWriteStream(path);
            thisStream.write(response.body);
            thisStream.end();
            thisStream.on('finish', () => {
              console.log(`wrote all data to ${path}`);
            });
            singleMeta.lastModified = response.headers['last-modified'];
            imageMeta[imageName] = singleMeta;
          } else if (response.statusCode == 304) {
            console.log (`${imageName} is unchanged and does not need to be downloaded.`);
          } else {
            console.log(`doesn't look good. ${imageName} returned ${response.statusCode}`);
            errors += 1;
          }
        })
        .catch (function (err) {
          console.log(`oops, error! ${err}`);
          console.dir(w);
          errors += 1;

        });

  return singleMeta;
}


// this is obsolete; we might use it in the future if this becomes a webapp. 
async function getLakeImages(lake) {
  let options = {
    url: "http://www.glerl.noaa.gov/res/glcfs/fcast/owv+01.gif",
    method: "GET",
    resolveWithFullResponse: true,
    headers:{'If-Modified-Since': imageMeta["/owv+01"]["lastModified"]},
    simple: false
  };

  request(options)
    .then(function(results) {
      console.log(results.statusCode);
      if (results.statusCode == 200 ) {
        let allPromises = [];
        for (let i in imageMeta) {
          if (i[1] ==  lake[0]) {
            allPromises.push (getImage(i));
          }
        }
        Promise.all(allPromises)
          .then(function (values) {
            console.dir(imageMeta);
            console.log(`there were ${errors} errors loading the files.`);
            jsonfile.writeFile('images/imageMeta.json', imageMeta, function (err) {
              console.log(`unable to write to images/imageMeta.json: ${err}`);
            });
          });
      } else if (results.statusCode == 304 ) {
        console.log(`images don't appear to have changed, aborting download`);
      } else {
        console.log(`huh, something went wrong: ${results.statusCode} ${results.statusMessage}`);
      }
    })
    .catch(function(error) {
      console.log(`Error! ${error}`);
    });

}


async function allLakes () {
  let options = {
    url: "http://www.glerl.noaa.gov/res/glcfs/fcast/owv+01.gif",
    method: "GET",
    resolveWithFullResponse: true,
    headers:{'If-Modified-Since': imageMeta["/owv+01"].lastModified},
    simple: false
  };

  request(options)
    .then(function(results) {
      console.log(results.statusCode);
      if (results.statusCode == 200 ) {
        let allPromises = [];
        for (let i in imageMeta) {
          allPromises.push (getImage(i));
        }
        Promise.all(allPromises)
          .then(function (values) {
            console.dir(imageMeta);
            console.log(`there were ${errors} errors loading the files.`);
            jsonfile.writeFile('images/imageMeta.json', imageMeta, function (err) {
              console.log(`unable to write to images/imageMeta.json: ${err}`);
            });
          });
      } else if (results.statusCode == 304 ) {
        console.log(`images don't appear to have changed, aborting download`);
      } else {
        console.log(`huh, something went wrong: ${results.statusCode} ${results.statusMessage}`);
      }
    })
    .catch(function(error) {
      console.log(`Error! ${error}`);
    });

}



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
  for (let l of lakes) {
    
  }
  
}

/**
*
*
**/
function buildIndexHTML( ) {

  // assemble navs
  let navsHTML = buildNav(lakes);
  
  // assemble tabs
  let tabsWrapper = {
    open: `<div class="tab-content" id="myTabContent">`,
    close: `</div>`
  };
  let tabsHTML = tabsWrapper.open;
  for (let l of lakes) {
    tabsHTML += buildLakeTab(l);
  }
  tabsHTML += tabsWrapper.close;

  
}



// for (let lake of lakes) {
//   getLakeImages(lake);
// }
// testImage =  { lastModified: 'Sat, 1 Sep 2018 01:12:51 GMT',
//                path: 'images/michigan/wind/mwn+120.gif',
//                url: 'http://www.glerl.noaa.gov/res/glcfs/fcast/mwn+120.gif' };
// testImage = "/mwn+120";

// console.log(getImage(testImage));
// console.log(constructFullImageList());

allLakes();

const download = require('images-downloader').images,
      fs = require('fs'),
      request = require('request-promise'),
      jsonfile = require('jsonfile');

const lakes = ["ontario", "erie", "huron", "superior", "michigan"];
// const lakes = ["ontario"];

let imageMeta= jsonfile.readFileSync(`images/imageMeta.json`),
    errors = 1;
;

async function getLakeImages(lake) {
  let waveDest = `images/${lake}/waves`,
      windDest = `images/${lake}/wind`,
      waveStem = "/" + lake[0] + "wv",
      windStem = "/" + lake[0] + "wn",
      baseURL = "http://www.glerl.noaa.gov/res/glcfs/",
      cast="";
      
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

    let wave = {name: waveStem + offset,
                fullURL: baseURL + cast + waveStem + offset + ".gif",
                fullPath: waveDest + waveStem + offset + ".gif"},
        wind = {name: windStem + offset,
                fullURL: baseURL + cast + windStem + offset + ".gif",
                fullPath: windDest + windStem + offset + ".gif"};
    for (w of [wave,wind] ) {
      let options = {url: w.fullURL,
                     method: "GET",
                     resolveWithFullResponse: true,
                     headers:{'If-Modified-Since': imageMeta[w.name]["lastModified"],
                              'fulldownloadpath':w.fullPath},
                     encoding: null,
                     simple: false,
                     testoptions: "testingnow"
                    };
      await request(options)
        .then(function(response){
          //console.log ("logging response");
          // console.log(response.request.headers.fulldownloadpath);
          let dl = response.request.headers.fulldownloadpath;
          if (response.statusCode == 200) {
            // jsonfile.writeFile('request-headers.json', response.request.headers, function (err) {
            //   console.log(`unable to write to request.json: ${err}`);
            // });
            console.log(`resolved ${w.name} successfully!`);
            console.log(`attempting to write to ${dl}`);
            let thisStream = fs.createWriteStream(dl);
            // console.log(response);
            thisStream.write(response.body);
            thisStream.on('finish', () => {
              console.log('wrote all data to file');
            });
            imageMeta[w.name] = {url: w.fullURL,
                                 path: w.fullPath,
                                 lastModified: response.headers['last-modified']};
            console.log(imageMeta[w.name]);
          } else if (response.statusCode == 304) {
            console.log (`${w.name} is unchanged and does not need to be downloaded.`)
          } else {
            console.log(`doesn't look good. ${w.name} returned ${response.statusCode}`);
            errors += 1;
          }
        })
        .catch (function (err) {
          console.log(`oops, error! ${err}`);
          console.dir(w);
          errors += 1;

        });
      // try {
      //   let r = await request(options);
        
      // } catch (err) {

      // }
    }

    wave_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset+".gif");
    wind_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset+".gif");
  }


}

// The file will be downloaded to this directory. For example: __dirname + '/mediatheque'
let wave_images = [],
    wind_images = [],
    cast = "";


async function allLakes () {
  let options = {
    url: "http://www.glerl.noaa.gov/res/glcfs/fcast/owv+01.gif",
    method: "GET",
    resolveWithFullResponse: true,
    headers:{'If-Modified-Since': imageMeta["/owv+01"]["lastModified"]},
    simple: false
  }

  request(options)
    .then(function(results) {
      
      if (results.headers.statusCode == 200 ) {
        let allPromises = [];
        for (let lake of lakes) {
          allPromises.push (getLakeImages(lake));
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
        console.log(`images don't appear to have changed, aborting download`)
      } else {
        console.log(`huh, something went wrong: ${results.statusCode} ${results.statusMessage}`);
      }
    })
    .catch(function(error) {
      console.log(`Error! ${error}`)
    });

}
allLakes()
  // .then(function (){
  //   console.dir(imageMeta);
  //   console.log(`there were ${errors} errors loading the files.`);
  //   jsonfile.writeFile('images/imageMeta.json', imageMeta, function (err) {
  //     console.log(`unable to write to images/imageMeta.json: ${err}`);
  //   });
  // });

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

// for (let lake of lakes) {
//   getLakeImages(lake);
// }


















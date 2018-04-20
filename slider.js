let the_images = document.the_images = [];
const lakes = ["ontario", "erie", "huron", "superior", "michigan"];
let imageMeta = {};



$.preloadImages = function(waves, wind) {
  console.log(imageMeta);
  var loaded = 0;
  var total = 169 *2 *5;
  for (let w of [waves, wind]) {
    
    for (let i of w) {
      let attrs = {//"data-gallery": "wind",
        "data-toggle": "lightbox",
        "href": i};
      let a= $('<a>');
      a.attr(attrs);
      a.append($("<img />").attr("src", arguments[i]));
      console.dir(a);
      loaded++;
      var percentage = parseInt(loaded / total * 100) + '%';
      $('#progress-bar').html("Loading images: "+percentage);

    }
  }
  
};

$.preloadAllImagesSlowly =  function (imageArray, index) {
  index = index || 0;
  if (imageArray && imageArray.length > index) {
    var img = new Image ();
    img.onload = function() {
      $.preloadAllImagesSlowly(imageArray, index + 1);
    };
    img.src = imageArray[index];
    console.log(`preloading ${imageArray[index]}`)
  }
};


$(function() {
  
  // $.getJSON("images/imageMeta.json", function(data) {
  //   imageMeta = JSON.parse(data);    
  // });
  var loaded = 0;
  var total = 169 *2 *5;
  $( "#slider" ).slider({
    background: 100, 
    range: "min",
    min: -48,
    max: 120,
    value: 0,

    slide: function( event, ui ) {
      var offset = ui.value;
      if(offset > 9){
	offset = "+"+offset;
	cast="fcast";
      }else if(offset > 0 && offset < 10){
	offset = "+0"+offset;
	cast="fcast";
      }else if(offset < 0 && offset > -10){
	offset = "-0"+(offset*(-1));
	cast="ncast";
      }else if(offset == 0){ //skip zero, avoid preload issues
	offset = "-00";
	cast="fcast";
      }

      $("#number").text( offset );
      // $("#waves").attr("src","http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset +".gif");
      // $("#wind").attr("src","http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset +".gif"); 
      // $("#wave-link").attr("href","http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset +".gif");
      for (let lake of lakes) {
        let l=lake[0];
        $(`#${lake}-waves`).attr("src",`images/${lake}/waves/${l}wv${offset}.gif`);
        $(`#${lake}-wind`).attr("src",`images/${lake}/wind/${l}wn${offset}.gif`); 
        $(`#${lake}-wave-link`).attr("href",`images/${lake}/waves/${l}wv`+ offset +`.gif`);
        $(`#${lake}-wind-link`).attr("href",`images/${lake}/wind/${l}wn`+ offset +`.gif`);
      }
    }
  });    
  //enable slider
  $( "#slider" ).slider("enable");
  $("#slider ui-slider-handle").trigger('click');
  $(".ui-slider-handle").focus();

  $.getJSON("images/imageMeta.json", function(data) {

  })
    .then(function (data){
      imageMeta = data;
      //preload images from -48 to 120
      let wave_images = [],
          wind_images = [],
          cast = "";

      for (let lake of lakes) {
        let l = lake[0];
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
	    cast="ncast";
          } else {
            cast = "ncast";
          }
          //the_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset+".gif");
          //the_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset+".gif");
          wave_images.push( `images/waves/${l}wv${offset}.gif`);
          wind_images.push( `images/wind/${l}wn${offset}.gif`);
          the_images.push( `images/waves/${l}wv${offset}.gif`);
          the_images.push( `images/wind/${l}wn${offset}.gif`);

        }
      }



      for (let lake of lakes) {
        let l=lake[0];
        $(`#${lake}-waves`).attr("src",`images/${lake}/waves/${l}wv-00.gif`);
        $(`#${lake}-wind`).attr("src",`images/${lake}/wind/${l}wn-00.gif`); 
        $(`#${lake}-wave-link`).attr("href",`images/${lake}/waves/${l}wv-00.gif`);
        $(`#${lake}-wind-link`).attr("href",`images/${lake}/wind/${l}wn-00.gif`);
      }

      //document.getElementById("slider").focus();

      $("#slider ui-slider-handle").trigger('click');
      $(".ui-slider-handle").focus();

      jQuery.imgpreload(the_images,
		        {
			  each: function()
			  {
			    loaded++;
		            var percentage = parseInt(loaded / total * 100) + '%';
                            $('#progress-bar').html("Loading images: "+percentage);
			  },
			  all: function()
			  {
                            //$('#progress-bar').fadeOut(300);

			    $('#progress-bar').html(`Images last updated ${imageMeta["/own-01"]['lastModified']}`);
			    //load images for +01 (fade in?)
	                    
			  }
		        });
      

      //$.preloadImages(the_images);
      //$.preloadImages(wave_images, wind_images);
      //$.preloadAllImagesSlowly(the_images,0);
      
    });
  
  
});

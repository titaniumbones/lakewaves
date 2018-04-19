var the_images = document.the_images = [];



$.preloadImages = function(waves, wind) {
  var loaded = 0;
  var total = 168 *2;
  for (w of [waves, wind]) {
    for (let i of w) {
      let attrs = {"data-gallery": "wind",
                   "data-toggle": "lightbox",
                   "href": i};
      let a= $('<a>');
      a.attr(attrs);
      a.append($("<img />").attr("src", arguments[i]));
      loaded++;
      var percentage = parseInt(loaded / total * 100) + '%';
      $('#progress-bar').html("Loading images: "+percentage);

    }
  }
  
};

$(function() {
  
  
  //preload images from -48 to 120
  let wave_images = [],
      wind_images = [],
      cast = "";
  for (var i = -48; i < 121; i++){
	var offset = i;
	if(offset > 9){
		offset = "+"+offset;
		cast="fcast";
	}else if(offset > 0 && offset < 10){
		offset = "+0"+offset
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
    the_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset+".gif");
    the_images.push("http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset+".gif");
    wave_images.push( "images/waves/owv"+ offset+".gif");
    wind_images.push( "images/wind/own"+ offset+".gif");

  }
  
  
  //$.preloadImages(the_images);
  $.preloadImages(wave_images, wind_images);
    
    $( "#slider" ).slider({
      background: 100, 
      range: "min",
      min: -48,
      max: 120,
      value: 01,

      slide: function( event, ui ) {
	var offset = ui.value;
	if(offset > 9){
	  offset = "+"+offset;
	  cast="fcast";
	}else if(offset > 0 && offset < 10){
	  offset = "+0"+offset
	  cast="fcast";
	}else if(offset < 0 && offset > -10){
	  offset = "-0"+(offset*(-1));
	  cast="ncast";
	}else if(offset == 0){ //skip zero, avoid preload issues
	  offset = "+01";
	  cast="fcast";
	}

        $("#amount").text( offset );
        // $("#waves").attr("src","http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset +".gif");
        // $("#wind").attr("src","http://www.glerl.noaa.gov/res/glcfs/"+cast+"/own"+ offset +".gif"); 
        // $("#wave-link").attr("href","http://www.glerl.noaa.gov/res/glcfs/"+cast+"/owv"+ offset +".gif");
        $("#waves").attr("src","images/waves/owv"+ offset +".gif");
        $("#wind").attr("src","images/wind/own"+ offset +".gif"); 
        $("#wave-link").attr("href","images/waves/owv"+ offset +".gif");
        $("#wind-link").attr("href","images/wind/own"+ offset +".gif");

      }
    });    

    $("#waves").attr("src","http://www.glerl.noaa.gov/res/glcfs/fcast/owv+01.gif");
    $("#wind").attr("src","http://www.glerl.noaa.gov/res/glcfs/fcast/own+01.gif");        
    
    //$("#graph_container").fadeIn(1000);

  
    // jQuery.imgpreload(the_images,
    //     	      {
    //     		each: function()
    //     		{
    //     		  loaded++;
    //     	          var percentage = parseInt(loaded / total * 100) + '%';
    //                       $('#progress-bar').html("Loading images: "+percentage);
    //     		},
    //     		all: function()
    //     		{
    //                       $('#progress-bar').fadeOut(300);

    //     		  //enable slider
    //     		  $( "#slider" ).slider("enable");
			  
    //     		  //load images for +01 (fade in?)
	                  
    //     		}
    //     	      });
    


    
    
  });

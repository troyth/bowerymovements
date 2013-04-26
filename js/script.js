/////// TWITTER ///////


// GLOBAL VARS

var timeActivity = 864000;
var getInterval = 60;   

var verticalBubbleShift = 205;
var maxTweetLevel3 = 6;
var svgId = "overlay";

var runUpdates = false;


var tweetObj = {};

var tweetIdObj = {};

var IMG = [];
IMG[1] = [];
IMG[1][1] = {
	width: 6556,
	height: 1100//1000+100
};
IMG[1][2] = {
	width: 13112,
	height: 2250//2000+250
};
IMG[1][3] = {
	width: 19668,
	height: 3500//3000+500
};
IMG[1][4] = {
	width: 26224,
	height: 5000//4000+1000
};

IMG[2] = [];
IMG[2][1] = {
	width: 2485,
	height: 1100//1000+100
};
IMG[2][2] = {
	width: 4970,
	height: 2250//2000+250
};
IMG[2][3] = {
	width: 7455,
	height: 3500//3000+500
};
IMG[2][4] = {
	width: 9940,
	height: 5000//4000+1000
};

IMG[3] = [];
IMG[3][1] = {
	width: 6892,
	height: 1100//1000+100
};
IMG[3][2] = {
	width: 13784,
	height: 2250//2000+250
};
IMG[3][3] = {
	width: 20675,
	height: 3500//3000+500
};
IMG[3][4] = {
	width: 27567,
	height: 5000//4000+1000
};

IMG[4] = [];
IMG[4][1] = {
	width: 3446,
	height: 1100//1000+100
};
IMG[4][2] = {
	width: 6891,
	height: 2250//2000+250
};
IMG[4][3] = {
	width: 10337,
	height: 3500//3000+500
};
IMG[4][4] = {
	width: 13782,
	height: 5000//4000+1000
};


//fetch tweets by face
function getTweets() {
  console.log("getTweets() Called with face: "+ angleIndex);

    var target_url = 'http://dirty.gsappcloud.org/webassite-api/tweets/movements/elevation/'+angleIndex;

    $.ajax({
      type : "GET",
      dataType : "jsonp",
        url : target_url, // ?callback=?
        success: function(data){
          console.log('success');
          //console.log(data);
          //console.log(data.length);
          if (data.length != 0) {
            drawTweetsFace(data);
          }
        },

        error: function(e){
          console.log('ajax error');
          console.dir(e);
        }
    }); 
};


function drawTweetsFace(data) {
	console.log("drawTweetsFaceCalled");

	$('.bubbletext, .bubblebg').remove();

	var BUILDING_TWEET_COUNTER = [];

	for (var i = 0; i <data.length; i++) { 

		if(typeof BUILDING_TWEET_COUNTER[ data[i].hashtags[0] ] == 'undefined'){
	    	BUILDING_TWEET_COUNTER[ data[i].hashtags[0] ] = 1;
	    }else{
	    	BUILDING_TWEET_COUNTER[ data[i].hashtags[0] ]++;
	    }

	  	var $line = $('#'+data[i].hashtags[0]+' line');

		var ptxt = parseInt($line.attr('x2')) - 60;
	    var ptyt = parseInt($line.attr('y2'))-80-verticalBubbleShift * BUILDING_TWEET_COUNTER[ data[i].hashtags[0] ];

		var classString = data[i].hashtags[0]+'Text';
	    var classStringFace = 'Face' + angleIndex;

	    $('#image').append( '<p id="'+data[i].hashtags[0]+'Text" class="bubbletext '+ classString+'" style="width:200px; height:auto; position:absolute; z-index:101;left:' + ptxt + 'px;top:'+ ptyt + 'px" >'+data[i].text+'</p>');

	    var ptxb = parseInt($line.attr('x2'))-80;
	    var ptyb = parseInt($line.attr('y2'))-130-verticalBubbleShift * BUILDING_TWEET_COUNTER[ data[i].hashtags[0] ];

	    var bubbleString = "";
	    if (BUILDING_TWEET_COUNTER[ data[i].hashtags[0] ] > 1 ){
	      var randInt = Math.floor((Math.random()*5)+1);
	      bubbleString = "bubbleTop"+String(randInt)+".png";
	    }
	    else {
	      var randInt = Math.floor((Math.random()*5)+1);
	      bubbleString = "bubbleBottom"+String(randInt)+".png";
	    }

	    $('#image').append( '<img src="img/bubbles/'+bubbleString+'"  class="bubblebg '+ classString+'" style="width:auto; height:auto; position:absolute; z-index:100;left:' + ptxb + 'px;top:'+ ptyb +'px" />');

	}

}







//dimensions of currently loaded image
var imgHt;
var imgWd;

//log current image position
var zoomIndex;
var angleIndex;

//establish limits to image range
var maxZoom = 3;
var maxAngle = 4;

//boolean toggles for functions
var spinToggle = false;
var zoomToggle = false;

var refresh = false;

//spin speed for tweening frames
var spinSpeed = 150;

//limits for image heights by zoom level
var lev1ht = '1500px';
var lev2ht = '1500px';
var lev3ht = '2000px';

//starting positions for background graphic
var initial_position = [];

initial_position[3] = [];
initial_position[3][1] = { top: '-1400px', left: '-5400px' };
initial_position[3][2] = { top: '-1400px', left: '-400px' };
initial_position[3][3] = { top: '-1400px', left: '-400px' };
initial_position[3][4] = { top: '-1400px', left: '-400px' };

//block elevation
var block_elevation;


//swaps the image underlay and regenerates the SVG overlay
function swapImage(direction){
	//stop Zooming while spin is in effect
	zoomToggle = false;

	//clear SVG to prevent selection while turning
	$('#overlay').empty();

	//set new source for next frame
	var srcNew = "images/"+angleIndex+"-"+zoomIndex+".png";

	//load new image
	//$('#image img').attr('src', srcNew);
	console.log('IMG[angleIndex][zoomIndex].height: '+ IMG[angleIndex][zoomIndex].height);

	$('#image').css({
    	width: IMG[angleIndex][zoomIndex].width,
    	height: IMG[angleIndex][zoomIndex].height
    });

	$('#image img').one("load", function() {
        // image loaded here
        initImageDraggable();
        refreshImage();
    }).attr("src", srcNew);

	//move image into initial position
	//setInitialBackgroundImagePosition();
	

	console.log('svg '+zoomIndex+'/'+angleIndex+' loaded.');

	//re-enable zooming
	ZoomToggle = true;

	refresh = true;

}

function spinRight(event){
	event.preventDefault();
	//alert('spinRight called');
	console.log('spinRight called');

	//for values at the min
	if (angleIndex <= 1) angleIndex = maxAngle;

	//for all numbers above the min
	else if (angleIndex > 1)angleIndex--;

	swapImage();	
}//end Spin Right


function spinLeft(event){
	event.preventDefault();
	//alert('spinLeft called');
	console.log('spinLeft called');

	//for values at the min
	if (angleIndex >= maxAngle) angleIndex = 1;

	//for all numbers above the min
	else if (angleIndex < maxAngle)angleIndex++;

	swapImage('left');
}//end Spin Left


//load corresponding SVG overlay when new image loaded
function refreshImage(){
	console.log('refreshImage()');

	$('polygon, rect').unbind('mouseenter', 'mouseleave');

	/*
	//load new svg
	$('#overlay').load('svg/bm--'+zoomIndex+'__'+angleIndex+'.svg', function() {
		console.log('svg loaded, binding polygon hover event');

		getTweets();
		

		$('polygon, rect').bind('mouseenter', function(){
			var $elem = $(this);
			var elemID = $elem.parents().attr('id');

			var $container = $('#'+elemID);

			var container_top = $container.position().top;
			var container_bottom = container_top - $container.height();

			//width and height of the hover image
			var WIDTH_OF_HOVER_ELEMENT = 20;//width in pixels
			var HEIGHT_OF_HOVER_ELEMENT = 100;//height in pixels

			var left = parseInt($('#image').position().left) + 
					parseInt($container.find('line').attr('x1')) -
					WIDTH_OF_HOVER_ELEMENT;

			$('#marker').css('left', left);

			var top_of_bottom = parseInt($('#image').position().top) + 
					parseInt($container.find('line').attr('y2')) +
					Math.abs(
						parseInt($container.find('line').attr('y1')) -
						parseInt($container.find('line').attr('y2'))
					)*2 -
					HEIGHT_OF_HOVER_ELEMENT;

			if(top_of_bottom > window.innerHeight){
				$('#marker').css('bottom', '20%');
			}else{
				$('#marker').css('top', top_of_bottom);
			}

			//@todo: might need to hardcode marker width as it will be 0 when empty
			left = left + parseInt($('#image').css('left')) - parseInt($('#marker').width());

			$('#marker').empty();
			$('#marker').append(elemID);
		}).bind('mouseleave' ,function(){

			$('#marker').empty();
		});
	});	
*/
}



function initImageDraggable(){

	var w = $('#image > img').width();
	var h = $('#image > img').height();

	$('#image').css({
    	width: IMG[angleIndex][zoomIndex].width,
    	height: IMG[angleIndex][zoomIndex].height
    });


	var x1 = -1*Math.abs( w - window.innerWidth );
	var y1 = -1*Math.abs( h - window.innerHeight );//seems to have a 400 px offset

	var x2 = 0,
		y2 = 1400;//add 1400 pixels for tweets on top of high buildings

	console.log('('+x1 + ', '+ y1 + '), ('+ x2 + ','+y2+')');

	$('#image').draggable("option", "containment", [x1, y1, x2, y2]);//.css('top', initial_position[zoomIndex][angleIndex].top ).css('left', initial_position[zoomIndex][angleIndex].left ).css('backgroundColor', 'red');

}

var MAX_ZOOM_INDEX = 3;

function zoomIn(event){
	event.preventDefault();

	if(zoomIndex < MAX_ZOOM_INDEX){
		zoomIndex++;
		swapImage();
	}
}

function zoomOut(event){
	event.preventDefault();

	if(zoomIndex > 1){
		zoomIndex--;
		swapImage();
	}
}







/////////INITIAL_LOAD/////////
$(document).ready(function(){
	console.log('document loaded');

	imgHt = lev3ht;//@todo: change this to lev1 when i implement zooming
	imgWd = $('#image img').width();

	//parse filename variables
	zoomIndex = 1;
	angleIndex = 1;
	
	
	/////////SPIN_LEFT/////////
	$('#spin-left').on('click', spinLeft); 

	/////////SPIN_RIGHT/////////
	$('#spin-right').on('click', spinRight); //end Spin Right

	/////////ZOOM IN/////////
	$('#zoom-in').on('click', zoomIn); 

	/////////ZOOM OUT/////////
	$('#zoom-out').on('click', zoomOut); 

	$('#image').draggable();

	//load initial SVG overlay
	refreshImage();
});//end ready function


//apply jQuery UI draggable to the image
$(window).on('load', initImageDraggable);











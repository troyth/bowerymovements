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


function setInitialBackgroundImagePosition(){
	console.log('zoomIndex: '+ zoomIndex + ' angleIndex: '+ angleIndex);

	$('#image').css('top', initial_position[zoomIndex][angleIndex].top );
	$('#image').css('left', initial_position[zoomIndex][angleIndex].left );
}


//swaps the image underlay and regenerates the SVG overlay
function swapImage(direction){
	//stop Zooming while spin is in effect
	zoomToggle = false;

	//clear SVG to prevent selection while turning
	$('#overlay').empty();


	if(direction == 'right'){
		//for values at the min
		if (angleIndex <= 1) angleIndex = maxAngle;

		//for all numbers above the min
		else if (angleIndex > 1)angleIndex--;
	}else{
		//for values at the min
		if (angleIndex >= maxAngle) angleIndex = 1;

		//for all numbers above the min
		else if (angleIndex < maxAngle)angleIndex++;
	}

	//set new source for next frame
	var srcNew = "img/bm--"+zoomIndex+"__"+angleIndex+".png";

	//load new image
	//$('#image img').attr('src', srcNew);

	$('#image img').one("load", function() {
        // image loaded here
        refreshSVG();
    }).attr("src", srcNew);

	//move image into initial position
	setInitialBackgroundImagePosition();
	
	

	console.log('svg '+zoomIndex+'/'+angleIndex+' loaded.');

	//re-enable zooming
	ZoomToggle = true;

	refresh = true;

}

function spinRight(event){
	event.preventDefault();
	//alert('spinRight called');
	console.log('spinRight called');

	swapImage('right');	
}//end Spin Right


function spinLeft(event){
	event.preventDefault();
	//alert('spinLeft called');
	console.log('spinLeft called');

	swapImage('left');
}//end Spin Left




/////////INITIAL_LOAD/////////
$(document).ready(function(){
	console.log('document loaded');

	imgHt = lev3ht;//@todo: change this to lev1 when i implement zooming
	imgWd = $('#image img').width();

	//parse filename variables
	zoomIndex = 3;
	angleIndex = 1;

	//move image up to align with bottom of browser
	setInitialBackgroundImagePosition();
	

	$('#overlay').load('svg/bm--'+zoomIndex+'__'+angleIndex+'.' + 'svg', function() {  
		//do something
		console.log("svg loaded.");
	});
	
	/////////SPIN_LEFT/////////
	$('#spin-left').on('click', spinLeft); 

	/////////SPIN_RIGHT/////////
	$('#spin-right').on('click', spinRight); //end Spin Right

	//apply jQuery UI draggable to the image
	$('#image').draggable();

	//reload the correct svg every time the image changes
	$('#image img').on('change', refreshSVG);

	refreshSVG();
});//end ready function

function refreshSVG(){
	console.log('refreshSVG()');
	/////////IMAGE_RELOAD/////////
	/*
	$('#image').on('load',function(){
		alert('image reload called');
		imgHt = $('#image img').height();
		imgWd = $('#image img').width();
		$('#image').css({
			width: imgWd,
			height: imgHt
		});
	});*/

	$('polygon').unbind('mouseenter', 'mouseleave');

	//load new svg
	$('#overlay').load('svg/bm--'+zoomIndex+'__'+angleIndex+'.svg', function() {
		console.log('svg loaded, binding polygon hover event');
		

		$('polygon').bind('mouseenter', function(){
			console.log('mouse enter');
			var $elem = $(this);
			var elemID = $elem.parents().attr('id');

			$('#marker').empty();
			$('#marker').append(elemID);
			console.log('hovering over: ' +elemID);
		}).bind('mouseleave' ,function(){
			console.log('mouse leave from svg polygon');

			$('#marker').empty();
			$('#marker').append("nada");
		});
	});

		
}

//--LOAD NEW ELEMENTS--//
$(window).on('load', refreshSVG);
	




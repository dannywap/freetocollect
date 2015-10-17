// Define the overlay, derived from google.maps.OverlayView
function Roundthumb(opt_options) {
     // Initialization
     this.setValues(opt_options);
	 var katcolor = ["", "#d1cabc", "#8db6fd", "#96d970", "#e9bab5", "#ffc000", "#7f6000"];

     var div = this.div_ = document.createElement('div');
     div.style.cssText = 'position: absolute; display: block;' + 
						  'background: url("'+this.get('src').toString()+'") no-repeat center;' +
						  'background-size: 100% auto; background-position: center top;' +
	                      'width: 48px; height: 48px;' +
                         // '-moz-border-radius: 20px 20px 20px 20px; -webkit-border-radius: 20px 20px 20px 20px; border-radius: 20px;' +
                          '-moz-border-radius: 40%; -webkit-border-radius: 40%; border-radius: 40%;' +
						  '-moz-animation: dwgfadein 0.5s ease-in;-webkit-animation: dwgfadein 0.5s ease-in;'+
						  'border: 2px solid ' + katcolor[this.get('katid')] + ';';
	// *********** CLUSTERS DWG v1.0
	if(this.get('annonsid').toString().indexOf(";") > 0){  // <<<------- Vi har en kluster ikon. Släng på en siffra också:
		 var antalinomcluster = this.get('annonsid').toString().split(";"); 
		 // istället för röd:  #60915e
		 if(parseInt(antalinomcluster[4])>99){ reddotwidth="28"; }else{reddotwidth="18";}
		 // div.innerHTML  = '<div style="background-color: red; color: white; width: '+reddotwidth+'px; height:18px; margin: 5px; font: bold 13px verdana; text-shadow: none !important;-moz-border-radius: 10px 10px 10px 10px;-webkit-border-radius: 10px 10px 10px 10px;border-radius: 10px; text-align: center;">'+antalinomcluster[4]+'</div>';
		 div.innerHTML  = '<span style="background-color: #c753c7; border: 1px solid #641d64; color: white; width: '+reddotwidth+'px; height:18px; display: table-cell; vertical-align: middle; font: bold 12px arial; text-shadow: none !important;-moz-border-radius: 50%;-webkit-border-radius: 50%;border-radius: 50%; text-align: center;">'+antalinomcluster[4]+'</span>';
	}
};
 
Roundthumb.prototype = new google.maps.OverlayView;
 
Roundthumb.prototype.onAdd = function() {
     // var pane = this.getPanes().overlayImage;  <-- pga: http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3
     var pane = this.getPanes().overlayMouseTarget;
     pane.appendChild(this.div_);

     // Ensures the Roundthumb is redrawn if the text or position is changed.
     var me = this;
     // google.maps.event.addDomListener(this.div_, 'click', function() { // <-- pga: http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3
			// google.maps.event.trigger(me, 'click');
	 // });

	 
     this.listeners_ = [
	      google.maps.event.addDomListener(this.div_, 'click', function() { // <-- pga: http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3
			google.maps.event.trigger(me, 'click'); }),
	      google.maps.event.addDomListener(this.div_, 'dblclick', function() { // <-- pga: http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3
			google.maps.event.trigger(me, 'dblclick'); })
          // google.maps.event.addListener(this, 'position_changed',
               // function() { me.draw(); }),
          // google.maps.event.addListener(this, 'text_changed',
               // function() { me.draw(); }),
          // google.maps.event.addListener(this, 'zindex_changed',
               // function() { me.draw(); })
     ];
};
 
// Implement onRemove
Roundthumb.prototype.onRemove = function() {
	 // Jag har lärt mig mer och nu gör vi denna enklare (samt INNAN vi tar bort DIV):
	 google.maps.event.clearInstanceListeners(this.div_);

     this.div_.parentNode.removeChild(this.div_);
 
     // Roundthumb is removed from the map, stop updating its position/text.
     // for (var i = 0, I = this.listeners_.length; i < I; ++i) {
          // google.maps.event.removeListener(this.listeners_[i]);
     // }
};

// Implement hide/show
Roundthumb.prototype.hide = function() {
	// this.div_.style.cssText = 'visibility: hidden;';
	this.div_.style.visibility = 'hidden';
}
Roundthumb.prototype.show = function() {
	this.div_.style.visibility = 'visible';
}
 
// Implement draw
Roundthumb.prototype.draw = function() {
     var projection = this.getProjection();
     var position = projection.fromLatLngToDivPixel(this.get('position'));
     var div = this.div_;
     div.style.left = position.x-20 + 'px';
     div.style.top = position.y-20 + 'px';
     // div.style.display = 'block';
     // div.style.width = '47px';
     // div.style.height = '47px';
     // div.style.border = '1px solid white';
     div.style.zIndex = this.get('zIndex'); //ALLOW Roundthumb TO OVERLAY MARKER
};













var innercirclediameter = 12;
var innercircleborder = 3;
var outercirclediameter = 12;
var outercircleborder = 1;

// Define the overlay, derived from google.maps.OverlayView
function MeMarker(opt_options) {
     // Initialization
     this.setValues(opt_options);
	// width: 48px;
	// height: 48px
	// borderradius: 20px

	var bgurl=this.get('bgurl') || 'img/gmap_me_marker.png';
	var dheight=this.get('heightpx') || '16';
	var dwidth=this.get('widthpx') || '16';
	var dborderradius=this.get('borderradiuspx') || '9';
	var dborder=this.get('borderpx') || '0';
	var dbordercolor=katcolor[this.get('bordercolor')] || '#111177';
	
	var div2 = this.div2_ = document.createElement('div');	 // Vi skapar denna först så den hamnar underst!
	div2.style.cssText =
						'position: absolute; display: block;' + 
						'background: #9cba8c; border: '+outercircleborder+'px solid #9cba8c;' +  // Kan inte använda border då blir den sne
						'width: '+outercirclediameter+'px; height: '+outercirclediameter+'px;' +	
						'-moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;' + 
						'-moz-animation: pulsate 4.0s ease-in-out infinite; -webkit-animation: pulsate 4.0s ease-in-out infinite;';

	var div = this.div_ = document.createElement('div');						
	div.style.cssText =	
						'position: absolute; display: block;' + 
						// 'background: #6a96f0; border: '+innercircleborder+'px solid #477ae4;' +  // prev: 4e85f6
						'background: #FFFFFF; border: '+innercircleborder+'px solid #4c8036;' +  // prev: 4e85f6
						'width: '+innercirclediameter+'px; height: '+innercirclediameter+'px;' +	
						'-moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;';
						
	
};
 
MeMarker.prototype = new google.maps.OverlayView;
 
MeMarker.prototype.onAdd = function() {
     var pane = this.getPanes().overlayImage;  // <-- pga: http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3
     // var pane = this.getPanes().overlayMouseTarget; // Denna är klickbar men på grund av problem med Android 4.2.2 (som vanligt) blir allting EJ klickbart när denna används för MeIcon.
     pane.appendChild(this.div2_);  // Vill ha 2 underst då det är ringen. <<-- Här sker nämligen lager placeringen.	
     pane.appendChild(this.div_);

     var me = this;
	 
     this.listeners_ = [
	      // google.maps.event.addDomListener(this.div_, 'click', function() { // <-- pga: http://stackoverflow.com/questions/3361823/make-custom-overlay-clickable-google-maps-api-v3
			// google.maps.event.trigger(me, 'click'); }),
          google.maps.event.addListener(this, 'position_changed',
               function() { me.draw(); })
          // google.maps.event.addListener(this, 'text_changed',
               // function() { me.draw(); }),
          // google.maps.event.addListener(this, 'zindex_changed',
               // function() { me.draw(); })
     ];
};
 
// Implement onRemove
MeMarker.prototype.onRemove = function() {
     this.div_.parentNode.removeChild(this.div_);
 
     // MeMarker is removed from the map, stop updating its position/text.
     for (var i = 0, I = this.listeners_.length; i < I; ++i) {
          google.maps.event.removeListener(this.listeners_[i]);
     }
};

// Implement hide/show
MeMarker.prototype.hide = function() {
	// this.div_.style.cssText = 'visibility: hidden;';
	this.div2_.style.visibility = 'hidden';
	this.div_.style.visibility = 'hidden';
}
MeMarker.prototype.show = function() {
	this.div2_.style.visibility = 'visible';
	this.div_.style.visibility = 'visible';
}
 
// Implement draw
MeMarker.prototype.draw = function() {
	var dheight=this.get('heightpx') || 16;
	var dwidth=this.get('widthpx') || 16;


     var projection = this.getProjection();
     var position = projection.fromLatLngToDivPixel(this.get('position'));
	 var div2 = this.div2_;
     var div = this.div_;
	 div2.style.left = position.x-(outercirclediameter/2)-(outercircleborder) + 'px';
     div2.style.top = position.y-(outercirclediameter/2)-(outercircleborder) + 'px';
     div.style.left = position.x-(innercirclediameter/2)-(innercircleborder) + 'px';
     div.style.top = position.y-(innercirclediameter/2)-(innercircleborder) + 'px';
     // div.style.display = 'block';
     // div.style.width = dwidth + 'px';
     // div.style.height = dheight + 'px';
     // div.style.border = '1px solid white';
     div.style.zIndex = this.get('zIndex'); //ALLOW MeMarker TO OVERLAY MARKER
};








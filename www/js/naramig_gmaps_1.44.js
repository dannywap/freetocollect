
var dwginfoWindow = null;
var dwgmarkersArray = [];
var dwgClustersArray = [];
// var dwglistenersArray = []; Vi löser detta på annat sätt
var dwginfowindowArray = [];
var dwgmapid= null;
var dwgMapPinNormal = null;
var visitedPins = [];
var savedWindowHeight;
var naramigfirstshow=true;
var markersFilter='';
var tiltedSinceLastShowNaraMig=false;

var markerCluster = null;
var showMapThumbs = true;
var clusterMarkers = false;
var prevMapCenter = null;
var markersColorFilter = 0;
var katcolor = ["#555555", "#d1cabc", "#8db6fd", "#96d970", "#e9bab5", "#ffc000", "#7f6000"];
var katdescs = ["Av", "Fordon", "Elektronik", "Hem & Hushåll", "Kläder & Leksaker", "Sport & Fritid", "Djur"];
var lastValidCenter = null; // För att se till att hålla användaren inom Sverige... Hjälpa honom ifall han råkar dra hit o dit...
var skipCurrentCenterChanges=0;
var stillLoadingMarkers=false;
var zoomLevel=12;
var prevZoomLevel=12;
// Nya heatmap - skitsnyggt:
// var heatspotData = new google.maps.MVCArray();
// var heatmap = new google.maps.visualization.HeatmapLayer();
var markerMyPos = null;
var mapTypeLoaded='GMAPS';
var showSeaOfThumbs=true;
var seaofthumbslat=0;
var seaofthumbslng=0;
var seaofthumbsboundary='';
var clusterWasJustDblClicked=false;

// var dwginfoWindow79 = new google.maps.InfoWindow({       //  <-- Vi kör inte mer dessa sedan v1.02
	// disableAutoPan: true,
	// content: ' '
// });

// function dwgaddExtraInfoMarker(lat,lng,content) {
	// var dwgmarker89 = new google.maps.Marker({
		// position: new google.maps.LatLng(lat,lng),
		// map: dwgmapid,       //  **************************************************************************************** EJ I CLUSTER
		// icon: dwgMapPinInfo,		
		// content: content
	// });
	// google.maps.event.addListener(dwgmarker89, 'click', function () {
		// // Detta fungerar jättebra, men vi provar att direkt öppna istället.
		// dwginfoWindow79.setContent(this.content);
		// dwginfoWindow79.open(dwgmapid, this);
		// //this.setIcon('img/gmap_marker_selected.png');
	// });
	// dwgmarkersArray.push(dwgmarker89); 
// }

function thisIsPiledOnOtherMarker(lat,lng){
	for (var i=0; i<dwgmarkersArray.length; i++){
		if(dwgmarkersArray[i].lat == lat && dwgmarkersArray[i].lon == lng){
			return true;  // "return" always stops the loop.
		}
	}
	// Else
	return false;
}

function InArrayAlready(id){
	for (var i=0; i<dwgmarkersArray.length; i++){
		if(dwgmarkersArray[i].annonsid == id){
			return true;  // "return" always stops the loop.
		}
	}
	// Else
	return false;
}
function isClusterMarker(pinannonsid){
	if(pinannonsid.toString().indexOf(";") > 0){
		return true;
	}else{
		return false;
	}
}

function dwgaddMarker(lat,lng,pinannonsid,foto,kategoriid) {
	var isIdInArrayAlready = InArrayAlready(pinannonsid);
	var isCluster=isClusterMarker(pinannonsid);
	if(isIdInArrayAlready==false || isClusterMarker==true){

		// *** Denna är sweet men behövs faktiskt inte
		// var plusOrMinusLat = Math.random() < 0.5 ? -1 : 1;
		// var plusOrMinusLng = Math.random() < 0.5 ? -1 : 1;
		// while(thisIsPiledOnOtherMarker(lat,lng)){ // Vi ser hur det blir om vi varje gång vi lägger en ikon kollar att den inte vill lägga sig på en tidigare.
			// lat=lat+0.001*plusOrMinusLat;
			// lng=lng+0.001*plusOrMinusLng;
		// }
	
	
		// Provade också .hasOwnProperty(pinannonsid) och in_array(visitedPins,pinannonsid) som skall vara snabbare
		// Men dessa fungerade inte. Se: http://jsperf.com/array-vs-obj  och  http://jsperf.com/in-array-vs-inarray-vs-indexof
		var pinCounter='';
		if(isCluster==true){  // <<<------- Vi har en kluster ikon. Släng på en siffra också:
			var antalinomcluster = pinannonsid.toString().split(";"); 
			pinCounter=antalinomcluster[4];
		}
		// Med min nya Figure Out-When-To-Cluster-Engine som baseras på (if result > 50 eller max allowed markers on screen) så bör denna kombineras med en funktion på klienten som rensar upp alla ikoner som borde ingå i denna ifall 
		// det är så att man drar in över skärmen och ett område plötsligt behöver klustras då vi passerade max. Då måste de som tillhör denna nya klusterikon också försvinna. 
		// Denna funktion kommer också förhindra misstag av andra varianter av cluster motorer genom denna rensning. Den tar lite kräm men är väl värd detta tror jag.
		// Detta måste också ske INNAN vi pushar denna cluster icon annars tar den bort sig själv.
		if(isCluster==true){cleanUpMarkersIncludedInThisCluster(antalinomcluster[0].toString(),antalinomcluster[1].toString());}

		
		
		
		if(showMapThumbs==false){
			if(visitedPins.indexOf(pinannonsid)> -1){  
				dwgPinStyle=dwgMapPinVisited;
			}else{
				dwgPinStyle=dwgMapPinNormal;
			}
			var dwgmarker79 = new google.maps.Marker({
				position: new google.maps.LatLng(lat,lng),
				map: dwgmapid,
				icon: dwgPinStyle,		
				// content: pinannonsid
				annonsid: pinannonsid
			});
		}else{
			if(isCluster==true){							// Förbered för att ta bort ikoner som inte är kategorivarianter av denna klusterikon men ingår i denna kluster ikonen. Den här logiken med lat, lon som värde kan lösa det.
				latsum=antalinomcluster[0].toString();
				lngsum=antalinomcluster[1].toString();
			}else{
				latsum=lat.toString();
				lngsum=lng.toString();	
			}
			var dwgmarker79 = new Roundthumb({
				map: dwgmapid,
				position: new google.maps.LatLng(lat,lng),
				src: weburl+'/foton/thumbs/'+foto,
				katid: kategoriid,
				annonsid: pinannonsid,
				lat: latsum,	// Måste tydliggöra dessa för att snabbare kunna rensa bort markers som ingår i en clusterikon som dykt upp "cleanUpMarkersIncludedInThisCluster(lat,lon)"
				lon: lngsum,
				clusterCount: pinCounter
			});
		}
		// GMAPS EVENTS: https://developers.google.com/maps/documentation/javascript/events
		if(isCluster==true){
		
			google.maps.event.addListener(dwgmarker79, 'click', function () {
				setTimeout(function () { 
					if(clusterWasJustDblClicked==false){
						fitBoundary2(dwgmarker79.position);
					}
					clusterWasJustDblClicked=false;
				},400);
			});
			
			google.maps.event.addListener(dwgmarker79, 'dblclick', function(event) { 
				clusterWasJustDblClicked=true; // För att stoppa singleclick eventet från att krocka och allt buggar fett! :)
				// alert("You dblclicked a cluster");
				seaofthumbslat=this.lat;
				seaofthumbslng=this.lon;
				seaofthumbsboundary='';
				// jQuery.mobile.navigate("#pageseaofthumbs");
				$.mobile.pageContainer.pagecontainer( "change", "#pageseaofthumbs",{ allowSamePageTransition: true });
			});
			
			dwgClustersArray.push(dwgmarker79); // Då dessa skall rensas på helt andra tider så blir det korkat och buggigt långsamt med att försöka få splice att fungera mot en stor array istället för att ha en liten array man kan tömma snabbare och oftare.
		
		}else{
			google.maps.event.addListener(dwgmarker79, 'click', function () {
				// Detta fungerar jättebra, men vi provar att direkt öppna istället.
				// dwginfoWindow79.setContent('Denna pin content: '+this.annonsid+'<br> lat:'+this.lat+' <br>long'+this.lon);
				// dwginfoWindow79.open(dwgmapid, this);
				// visitedPins.push(this.annonsid);
				// naraMigviewId(this.annonsid);
				viewId(this.annonsid);
				// if(showMapThumbs==false){ this.setIcon('img/gmap_marker_selected.png'); }
			});
			dwgmarkersArray.push(dwgmarker79);
		}
		// var dwglistener79 = google.maps.event.addListener(dwgmarker79, 'click', function () {
		// dwglistenersArray.push(dwglistener79);
		
		// google.maps.event.removeListener(listenerHandle);
				
		
		// Denna behövs nog inte då nedan gör samma sak.
		// if(isCluster==true && kategoriid != markersColorFilter){ // Vi har en cluster och dess kategori är inte vald.
			// dwgmarker79.hide(); // Göm alltid redundanta cluster ikoner (då dessa alltid skapas för alla kategorier...
		// }
		// if(!dwgempty(markersColorFilter) && kategoriid != markersColorFilter){ // Alla ikoner oavsett 
			// dwgmarker79.hide(); // Om filter är på göm då direkt vid utskrift alla markers som inte passar kat
		// }
	}else{
		// Den finns redan på kartan
	}
}
function showSeaOfThumbsBoundaries(){
	var dwgbounds = dwgmapid.getBounds(); 
	var ne = dwgbounds.getNorthEast(); 
	var sw = dwgbounds.getSouthWest(); 
	var swlatlng = sw.lat() + ";" + sw.lng();
	var nelatlng = ne.lat() + ";" + ne.lng();	
	seaofthumbsboundary="&boundaries="+swlatlng+";"+nelatlng; // (går nerifrån vänster upp höger eftersom uppåt norr är ++ på skalan likaså är öster ++ på skalan)
	// jQuery.mobile.navigate("#pageseaofthumbs");
	$.mobile.pageContainer.pagecontainer( "change", "#pageseaofthumbs",{ allowSamePageTransition: true });
}

function hideMarkersButThisCategory(kat,clicked){
	// markersFilter="&kat="+kat+'000';
	markersFilter="&kat="+kat; // v5 style
	// if(markersColorFilter==kat){kat=0;}
	if(clicked == true){
		if(markersColorFilter == kat){
			kat=0;
			markersFilter="";
		}
	}
	// Först rensar vi rent...
	dwgClearAllMarkers();
	dwgClearOnlyClusterMarkers();
	
	// for(var i = 0; i<dwgmarkersArray.length; i++){
        // if(dwgmarkersArray[i].katid != kat && kat !=0){
            // // not primary, hiding  
            // dwgmarkersArray[i].hide();
        // }else{
			// dwgmarkersArray[i].show();
		// }
		// // // DWG CLUSTER också oavsett kat=0:
		// // if(dwgmarkersArray[i].clusterCount != '' && dwgmarkersArray[i].katid != kat){ 
			// // dwgmarkersArray[i].hide(); 
		// // }
	// }
	// Och ClusterIkonerna som numera för performance och buggig splice ligger i en egen.  - Då splice dock är buggig kommer vi fortsätta se att single-markers saknas på kartan då man pannar och de tas bort (men ändå inte då splice inte är 100%-ig).
	// for(var i = 0; i<dwgClustersArray.length; i++){
        // if(dwgClustersArray[i].katid != kat){
            // dwgClustersArray[i].hide();
        // }else{
			// dwgClustersArray[i].show();
		// }
	// }
	
	if(markersColorFilter != kat){
		$("#mapkatbtn1").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn2").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn3").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn4").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn5").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn6").height("30").css({ boxShadow: 'none' }); // Clean up
		// for(var i=1;i<7;i++){
			// var mapkatbtny="#mapkatbtn"+i.toString();
			// $(mapkatbtny).height("30").css({ boxShadow: 'none' }); // Clean up
		// }
		var mapkatbtnx="#mapkatbtn"+kat.toString();
		$(mapkatbtnx).height("40").css({ boxShadow: '0px 1px 8px #444' });
		setTimeout(function () {  // Så vi hinner rensa ikonerna så inte denna hackar så mycket.
			$("#fadepop")
			.css('opacity', 1)
			.html($.t("map.html_categ_filter", {katdescskat: katdescs[kat]})) //'<p style="padding: 20px;">Kategorifilter: '+katdescs[kat]+'</p>')
			.css("background-color", katcolor[kat])
			.show()
			.fadeIn(200, "swing", function(){
				$("#fadepop").animate( { opacity: 0, easing: "easeInQuint" }, 1500);
			});
		},200);

		// var fadepopper=document.getElementById("fadepop");
		// fadepopper.style.cssText = '-moz-transition: 1 0.5s ease-in-out;'+
					// '-o-transition: 1 0.5s ease-in-out;'+
					// '-webkit-transition: 1 0.5s ease-in-out;'+
					// 'transition: 1 0.5s ease-in-out;';
		// fadepopper.style.zIndex = 999;
		
		// setTimeout(function () { 
			// $("#fadepop").hide();
		// },1700);
	}
	markersColorFilter = kat;
	// Och ladda om (v5-style):

	// var currMapCenter = dwgmapid.getCenter();
	// dwgAddTheMarkers(currMapCenter.lat(),currMapCenter.lng());
	setTimeout(function () {    
		google.maps.event.trigger(dwgmapid,"idle");
	},800);
}

function dwgAddTheMarkers(dwglat,dwglong) {	
	stillLoadingMarkers=true;
	
	var dwgbounds = dwgmapid.getBounds(); 
	var ne = dwgbounds.getNorthEast(); 
	var sw = dwgbounds.getSouthWest(); 
	var swlatlng = sw.lat() + ";" + sw.lng();
	var nelatlng = ne.lat() + ";" + ne.lng();	
	var boundaries="&boundaries="+swlatlng+";"+nelatlng; // (går nerifrån vänster upp höger eftersom uppåt norr är ++ på skalan likaså är öster ++ på skalan)
	// alert(boundaries);
	var zoomlvl="&zoomlevel="+zoomLevel;
	var str23=" ";
	var cacheonlythissession=dwgguid();
	var mapinfo=document.getElementById("mapinfodiv");
	// mapinfo.innerHTML = "boundaries:" + sw.lat().toString().substring(0, 7) + ";" + sw.lng().toString().substring(0, 7) + ";<br>" + ne.lat().toString().substring(0, 7) + ";" + ne.lng().toString().substring(0, 7);
	// alert("http://www.bortskankes.se/phonegap1/naramig_markers5.php?lat="+dwglat+"&long="+dwglong+boundaries+markersFilter+zoomlvl+"&nocache="+cacheonlythissession);
	$.ajax({
		url        : weburl+"/mob_"+appver+"/naramig_markers5.php?lat="+dwglat+"&long="+dwglong+boundaries+markersFilter+zoomlvl+"&nocache="+cacheonlythissession,
		// type	   : 'GET',
		beforeSend : function() {$.mobile.loading('show');},
		complete   : function() {$.mobile.loading('hide');},
		dataType   : "json",
		cache: false,  		//  Eftersom vi har problem med att det ibland stannar redan vid start och sedan fungerar inte ajax anrop längre:
		async: true,   		//  http://stackoverflow.com/questions/11296036/chrome-not-handling-jquery-ajax-query
		timeout: 2000,		//  Detta kan ha att göra med att browsern cachear felsvaret och sedan alltid får felmeddelande från cache. Provar dessa tre för att ta bort cache.
		success    : function(dwgdata5) {
			// alert('Works!');
			ajax.parseJSON(dwgdata5);
			setTimeout(function () { 
				$("#fadepop").hide();
				stillLoadingMarkers=false; 
			},500);

		},
		error      : function() {
			dwgalert($.t("map.msg_could_not_conn5")); //'Kunde inte skapa en anslutning. Prova igen!');                  
		}
	}); 
	var ajax = {  
		parseJSON:function(result){
			$.each( result, function(i, dwgmarkerval) {
				str23 = dwgmarkerval.content+" ";
				if(str23.substr(0,5)=="Info:"){
					dwgaddExtraInfoMarker(dwgmarkerval.lat,dwgmarkerval.lon,dwgmarkerval.content);
				}else{
					dwgaddMarker(dwgmarkerval.lat,dwgmarkerval.lon,dwgmarkerval.content,dwgmarkerval.foto,dwgmarkerval.katid);
				}		
			});
		}
	};
}


function fitBoundary2(pos) {
		// var clustIconlatlng = new google.maps.LatLng(clustIconlat,clustIconlng);
		dwgmapid.setCenter(pos);
		// setTimeout(function () {    
			var currzoom=dwgmapid.getZoom();
			currzoom=currzoom+1;
			dwgmapid.setZoom(currzoom);
			// setTimeout(function () {    
				// google.maps.event.trigger(dwgmapid,"idle");
			// },300);
		// },300);

}



// *********************************************************** Kan nog ta bort dessa 4 funktioner då de fungerar väldigt kasst känns bättre att bara ta cluster ikonens pos o zooma in 2ggr. Google måste ändå anpassa sig till en passande "max ZoomLevel" som passar bäst in.
function fitBoundary(boundlatlnglatlng) {
	var boundaries = boundlatlnglatlng.split(";"); 
	// setTimeout(function () { 
		// skipCurrentCenterChanges=2;  // Vi vill trigga omläsning av kartan för att ta bort klusterikoner och räkna om... Gör det manuellt istället.
		// Om man fått tillbaka ett recordset som visar ett dwgcluster man klickat på så kan denna absolut snyggaste rutin snabbt zooma in dessa:
		// http://stackoverflow.com/questions/2818984/google-map-api-v3-center-zoom-on-displayed-markers
		var latlngbounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(boundaries[0], boundaries[1]),
			new google.maps.LatLng(boundaries[2], boundaries[3])
		);
		dwgmapid.setCenter(latlngbounds.getCenter());
		dwgmapid.fitBounds(latlngbounds);	
		// myFitBounds(dwgmapid,latlngbounds); 
}
// ************************************************************ Kanske kan denna fungera bättre:
// http://shades-of-orange.com/post/2014/07/04/Remove-The-Padding-From-The-Google-Map-API-v3-fitBounds%28%29-Method
function myFitBounds(myMap, bounds) {
    myMap.fitBounds(bounds);
	
	setTimeout(function () {
		var overlayHelper = new google.maps.OverlayView();
		overlayHelper.draw = function () {
			if (!this.ready) {
				var zoom = getExtraZoom(this.getProjection(), bounds, myMap.getBounds());
				if (zoom > 0) {
					myMap.setZoom(myMap.getZoom() + zoom);
				}
				this.ready = true;
				google.maps.event.trigger(this, 'ready');
			}
		};
		overlayHelper.setMap(myMap);
	},500);
}
// LatLngBounds b1, b2 -> zoom increment
function getExtraZoom(projection, expectedBounds, actualBounds) {
    var expectedSize = getSizeInPixels(projection, expectedBounds),
        actualSize = getSizeInPixels(projection, actualBounds);

    if (Math.floor(expectedSize.x) == 0 || Math.floor(expectedSize.y) == 0) {
        return 0;
    }

    var qx = actualSize.x / expectedSize.x;
    var qy = actualSize.y / expectedSize.y;
    var min = Math.min(qx, qy);

    if (min < 1) {
        return 0;
    }

    return Math.floor(Math.log(min) / Math.log(2) /* = log2(min) */);
}
// LatLngBounds bnds -> height and width as a Point
function getSizeInPixels(projection, bounds) {
    var sw = projection.fromLatLngToContainerPixel(bounds.getSouthWest());
    var ne = projection.fromLatLngToContainerPixel(bounds.getNorthEast());
    return new google.maps.Point(Math.abs(sw.y - ne.y), Math.abs(sw.x - ne.x));
}
// *****************************************************************************************************





function dwgClearAllMarkers(){
// NOTERA ATT VI VERKAR HA MINNESLÄCKOR DÅ APPEN TILL SIST BARA DÖR NÄR MAN KÖRT RUNT EN STUND. 
// DET VERKAR INTE FINNAS NÅGOT ATT GÖRA... TILLS JAG LÄSTE OM DENNA KILLEN:
// http://stackoverflow.com/questions/21142483/google-maps-js-v3-detached-dom-tree-memory-leak
				// The difference between the two is this line:
				  // delete markers[key];
				// This is the code that I used to add markers and remove markers:
				// var existingMarkers = Object.keys(markers);
				// for(var index in existingMarkers) {
				  // var key = existingMarkers[index];
				  // markers[key].setMap(null);
				  // delete markers[key];
				// }
				// for (max = i+400; i<max; i++) {
				  // var latlng = new google.maps.LatLng(lat+=0.1,lng+=0.1);
				  // markers[i] = new google.maps.Marker({position: latlng, map: map});
				// }

	while(dwgmarkersArray[0]){   // SKIITSNYGG LOOP! Denna behåller vi och använder överallt den kan tillämpas.
		google.maps.event.clearInstanceListeners(dwgmarkersArray[dwgmarkersArray.length-1]); // Eftersom pop tar bort den sist pålagda. length-1 eftersom det annars hamnar utanför 
		var tmpMarkerToDelete = dwgmarkersArray.pop().setMap(null);
		delete tmpMarkerToDelete;   // Baserat på ovan MEMORYLEAK exempel: http://embed.plnkr.co/jCa2dl/index.html  http://stackoverflow.com/questions/21142483/google-maps-js-v3-detached-dom-tree-memory-leak
	}
	// var overlayMap = this.getPanes().overlayMouseTarget;
	// var existingMarkers = overlayMap.keys(markers);
	// while(existingMarkers[0]){   // SKIITSNYGG LOOP! Denna behåller vi och använder överallt den kan tillämpas.
		// google.maps.event.clearInstanceListeners(existingMarkers[existingMarkers.length-1]) // Eftersom pop tar bort den sist pålagda. length-1 eftersom det annars hamnar utanför 
		// var tmpMarkerToDelete = existingMarkers.pop().setMap(null);
		// delete tmpMarkerToDelete;   // Baserat på ovan MEMORYLEAK exempel: http://embed.plnkr.co/jCa2dl/index.html  http://stackoverflow.com/questions/21142483/google-maps-js-v3-detached-dom-tree-memory-leak
	// }

	
	
	
	// for (var i=0; i<dwgmarkersArray.length; i++){
		// dwgmarkersArray[i].setMap(null);
		// // google.maps.event.removeListener(dwglistenersArray[i]);
		// google.maps.event.clearInstanceListeners(dwgmarkersArray[i]); // Denna är enklare: https://developers.google.com/maps/documentation/javascript/events?csw=1#removing
	// }
	// dwgmarkersArray.length=0;
	// // dwglistenersArray.length=0
}
function dwgClearOnlyClusterMarkers(){
	while(dwgClustersArray[0]){   // SKIITSNYGG LOOP! Denna behåller vi och använder överallt den kan tillämpas.
		google.maps.event.clearInstanceListeners(dwgClustersArray[dwgClustersArray.length-1]); // Eftersom pop tar bort den sist pålagda. length-1 eftersom det annars hamnar utanför 
		var tmpMarkerToDelete = dwgClustersArray.pop().setMap(null);
		delete tmpMarkerToDelete;   // Baserat på ovan MEMORYLEAK exempel: http://embed.plnkr.co/jCa2dl/index.html  http://stackoverflow.com/questions/21142483/google-maps-js-v3-detached-dom-tree-memory-leak
	}
}
function cleanUpMarkersIncludedInThisCluster(lat1,lon1){
	// Då vi inte kan splicea ut data från en array (verkar suuuper buggigt och långsamt så provar vi att helt enkelt att 
	// när vi ändå loopar igenom hela arrayen pusha in allt i en ny tmparray och sedan flytta över detta data tillbaka.
	var tmpMarkersArray=[];
	while(dwgmarkersArray[0]){
		var indx = dwgmarkersArray.length-1;
		if(dwgmarkersArray[indx].lat.indexOf(lat1) == 0 && dwgmarkersArray[indx].lon.indexOf(lon1) == 0 && dwgmarkersArray[indx].lat != lat1 && dwgmarkersArray[indx].lon != lon1){ // ==0 i detta läget betyder träff eftersom de matchar på 1a bokstav.
			google.maps.event.clearInstanceListeners(dwgmarkersArray[indx]); // Eftersom pop tar bort den sist pålagda. length-1 eftersom det annars hamnar utanför 
			var tmpMarkerToDelete = dwgmarkersArray.pop().setMap(null);
			delete tmpMarkerToDelete;
		}else{
			var tmpMarkerToSave = dwgmarkersArray.pop(); // Spara denna marker
			tmpMarkersArray.push(tmpMarkerToSave);
			delete tmpMarkerToSave;
		}
	}
	dwgmarkersArray = []; // Töm orginalet
	while(tmpMarkersArray[0]){   // SKIITSNYGG LOOP! Denna behåller vi och använder överallt den kan tillämpas.
		var tmpMarkerToCopy = tmpMarkersArray.pop();
		dwgmarkersArray.push(tmpMarkerToCopy);
		delete tmpMarkerToCopy;   // Baserat på ovan MEMORYLEAK exempel: http://embed.plnkr.co/jCa2dl/index.html  http://stackoverflow.com/questions/21142483/google-maps-js-v3-detached-dom-tree-memory-leak
	}
	tmpMarkersArray=[];
	
	
	// for (var i=0; i<dwgmarkersArray.length; i++){
		// // if(dwgmarkersArray[i].annonsid.toString().indexOf(";") > 0){
		// if(dwgmarkersArray[i].lat.indexOf(lat1) == 0 && dwgmarkersArray[i].lon.indexOf(lon1) == 0 && dwgmarkersArray[i].lat != lat1 && dwgmarkersArray[i].lon != lon1){ // ==0 i detta läget betyder träff eftersom de matchar på 1a bokstav.
			// // alert(lat1+"is in:"+dwgmarkersArray[i].lat+"  and lon:"+lon1+" is in:"+dwgmarkersArray[i].lon);
			// google.maps.event.clearInstanceListeners(dwgmarkersArray[i]); // Denna är enklare: https://developers.google.com/maps/documentation/javascript/events?csw=1#removing
			// // google.maps.event.removeListener(dwglistenersArray[i]);
			// dwgmarkersArray[i].setMap(null);
			 
			// // OM SPLICE NEDAN: Då splice är buggig kommer vi fortsätta se att single-markers saknas på kartan då man pannar och de tas bort (men ändå inte från array då splice inte är 100%-ig).
			// dwgmarkersArray.splice(i, 1); // Ta bort från array också. <<<<<<<<< HÄR ÄR ETT PROBLEM! DENNA GÖR VI INTE NU PGA PRESTANDA PROBL. MEN DET INNEBÄR ATT NÄR MAN ZOOMAR IN PÅ KLUSTER DÄR DENNA INGICK INNAN MAN DROG ÖVER SKÄRMEN SÅ KOMMER DENNA INTE SYNAS.
		// }
	// }
}

// function getlatlonglight(){   // SEDAN v1.4 (2015-04-05) Lägger vi ner light. Det finns numera bara getlatlong() och så är det. 
	// if(navigator.geolocation){
		// navigator.geolocation.getCurrentPosition(successfullyGotLatLongLight);
	// }else{
		// // No navigator supported
	// }
// }
// function successfullyGotLatLongLight(position){
	// // alert("got lightlatlong");
	// userlat		= position.coords.latitude;
	// userlong	= position.coords.longitude;
	// if(userlat>69.0 || userlat<14.6 || userlong>24.8 || userlong < 10.0 ){
		// // Utanför Sverige
	// }else{
		// window.localStorage.setItem("userlat",userlat);
		// window.localStorage.setItem("userlong",userlong);
	// }
// }

function gotoMyLocation(){
	dwgmapid.setCenter(markerMyPos.position);
}
function lasaAnvandarVillkor(){
	// dwgalert("Vill du läsa Google Maps användarvillkor?");
	dwgconfirm("Vill du läsa Google Maps användarvillkor i din webläsare?","Google Maps villkor","Avbryt,Ja tack!",villeLasaAnvandarvillkoren);
}
function villeLasaAnvandarvillkoren(btn){
	// alert("Du klickade knapp nr: "+btn);
	if(btn==2){	// Öppna extern webläsare precis som vid tweet, fb etc fast nu till google användarvillkor.
		urlenattlasa="https://www.google.com/intl/sv_se/help/terms_maps.html"; // https://www.google.com/intl/en_us/help/terms_maps.html
		openExtLink(urlenattlasa);
	}
}


function initiatemap(){
		zoomLevel=12;
		getlatlong();
	// ---- Sätt en nice fullscreeen på Gmaps:
		// navbarheight = document.getElementById('gmapfooter').style.height;
		var navbarheight = $("#gmapfooter").height();
			//gmapheight = screen.height;
		var gmapheight=$(window).height();
			// if(device.version=='4.2' || device.version=='4.2.2' || device.version=='4.3'){gmapheight=$(window).height();} // Ytterligare en 4.2.2 specialare: http://stackoverflow.com/questions/22724567/how-to-deal-with-width-inconsistency-between-android-4-0-4-3-and-4-4-on-cordova
			// if(device.platform='Android'){gmapheight=$(window).height();}
		var newgmapheight = gmapheight - navbarheight;
			// gmapheight = screen.height - footerHeight;
			
		    //$('#dwgmap').height(gmapheight);
		// gmapheight = gmapheight + "px";
		// $('#dwgmap').css({height: gmapheight});
		$("#dwgmap").height(newgmapheight);
		
		// - Default lat lng. Skall bara sättas inne i "function initiatemap(){" eftersom vi inte vill ha en falsk latlng på foton etc som laddas upp. 
		//   Där är det bättre det är blankt. Det är egentligen bara i kartan vi MÅSTE ha en latlng.

		// var dwgtmplat=57.707616;
		// var dwgtmplong=11.972690;
		var dwgtmplat=51.510051;
		var dwgtmplong=-0.1349;
		// ---- Fixa till en latlong på något sätt.
		if(!dwgempty(userlat)){
			// alert("i have latlong");
			dwgtmplat=userlat;
			dwgtmplong=userlong;
		}else if(!dwgempty(userwebpostnrlat)){
			// alert("i took latlong from postnr");
			dwgtmplat=userwebpostnrlat;
			dwgtmplong=userwebpostnrlong;
		}else{
			// alert("i used manual fake latlong");
		}
	// Stylea GMAPS kartan här: http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
	// var styles = [
				  // {
					// stylers: [
					  // { hue: "#00ffe6" },
					  // { saturation: -20 }
					// ]
				  // },{
					// featureType: "road",
					// elementType: "geometry",
					// stylers: [
					  // { lightness: 100 },
					  // { visibility: "simplified" }
					// ]
				  // },{
					// featureType: "road",
					// elementType: "labels",
					// stylers: [
					  // { visibility: "off" }
					// ]
				  // },
				  // { 
					// "elementType": "labels.icon", 
					// "stylers": [ { "visibility": "off" } ] 
				  // } 
				// ];
			
	// var styles = [ { "featureType": "transit.line", "elementType": "labels.icon", "stylers": [ { "saturation": -35 }, { "lightness": -10 }, { "gamma": 1.75 }, { "visibility": "off" } ] },{ "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#0088ff" }, { "saturation": -58 }, { "gamma": 0.6 } ] } ];
	// var styles = [ { "featureType": "transit.line", "elementType": "labels.icon", "stylers": [ { "saturation": -35 }, { "lightness": -10 }, { "gamma": 1.75 }, { "visibility": "off" } ] },{ "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry", "stylers": [ { "hue": "#0088ff" }, { "saturation": -58 }, { "gamma": 0.6 } ] },{ } ];
	// Good one:
	// var styles = [ { "featureType": "transit.line", "elementType": "labels.icon", "stylers": [ { "saturation": -35 }, { "lightness": -10 }, { "gamma": 1.75 }, { "visibility": "off" } ] },{ "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry", "stylers": [ { "hue": "#00ff3c" }, { "gamma": 0.57 }, { "saturation": -69 } ] },{ } ];
	// Happy one:
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry", "stylers": [ { "hue": "#00ff2b" }, { "gamma": 0.86 }, { "saturation": -62 }, { "lightness": -4 } ] },{ "elementType": "labels.text.fill", "stylers": [ { "visibility": "on" } ] } ];
	// Dead one:
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry", "stylers": [ { "hue": "#00ff2b" }, { "saturation": -72 }, { "lightness": -26 }, { "gamma": 1.72 } ] },{ "elementType": "labels.text.fill", "stylers": [ { "visibility": "on" } ] } ];
	// Light one: 
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "elementType": "geometry", "stylers": [ { "hue": "#00ff2b" }, { "saturation": -69 }, { "lightness": 27 }, { "gamma": 1.09 } ] },{ "elementType": "labels.text.fill", "stylers": [ { "visibility": "on" } ] } ]
	// Soft one:
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "elementType": "labels.text.fill", "stylers": [ { "visibility": "on" } ] },{ "elementType": "geometry.fill", "stylers": [ { "gamma": 0.24 }, { "lightness": 46 }, { "saturation": 32 } ] },{ "stylers": [ { "hue": "#00ff00" }, { "saturation": -74 }, { "lightness": 8 }, { "gamma": 1.75 } ] } ]
	// Simple Soft Grayish
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#55ff00" }, { "saturation": -84 } ] } ];
	// Simple Soft Grayish - with text	
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#55ff00" }, { "saturation": -84 } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] } ]
	// Simple Soft Grayish with green - with text	
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#55ff00" }, { "gamma": 1.72 }, { "saturation": -73 } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] } ];
	// Simple Soft Grayish with green liiite mörkare - with text	
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#55ff00" }, { "saturation": -66 }, { "gamma": 1.39 } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] } ];
	// Simple Soft one variation:
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#00ff00" }, { "saturation": -74 }, { "gamma": 1.26 } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] } ];
	// Simple Soft one variation darker:
	// var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#00ff00" }, { "saturation": -75 }, { "gamma": 0.8 } ] },{ "elementType": "labels.text", "stylers": [ { "visibility": "on" } ] } ];
	// Utarbetad Soft med Softtext och Simple details
	var styles = [ { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "stylers": [ { "hue": "#55ff00" }, { "saturation": -75 }, { "gamma": 0.75 } ] },{ "elementType": "labels.text", "stylers": [ { "hue": "#00ff09" }, { "visibility": "simplified" }, { "color": "#608959" } ] },{ "elementType": "geometry", "stylers": [ { "visibility": "simplified" } ] } ];
	var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

	// dwgtmplat=62.43;
	// dwgtmplong=17.32;
	
	// MIN STATUS PÅ KARTAN: https://code.google.com/apis/console/b/0/?noredirect&pli=1#project:1074974084487:quotas
	var dwggmapoptions = {
		mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		},
		zoom: zoomLevel,
		center: new google.maps.LatLng(dwgtmplat,dwgtmplong),
		scrollwheel: false,
		disableDoubleClickZoom: true,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: false
		// navigationControlOptions: {	style: google.maps.NavigationControlStyle.SMALL	},
		// mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	dwgmapid = new google.maps.Map(document.getElementById("dwgmap"), dwggmapoptions);
	//zoomLevel = dwgmapid.getZoom();
	dwgmapid.mapTypes.set('map_style', styledMap);
	dwgmapid.setMapTypeId('map_style');


	dwgMapPinNormal = {
			url: 'img/gmap_marker_unselected.png',
			size: new google.maps.Size(32, 32),
			// The origin for this image is 0,0.
			origin: new google.maps.Point(0,0),
			// The anchor for this image is the base of the flagpole at 0,32.
			anchor: new google.maps.Point(16, 32)
	};
	dwgMapPinVisited = {
			url: 'img/gmap_marker_selected.png',
			size: new google.maps.Size(32, 32),
			// The origin for this image is 0,0.
			origin: new google.maps.Point(0,0),
			// The anchor for this image is the base of the flagpole at 0,32.
			anchor: new google.maps.Point(16, 32)
	};
	dwgMapPinMe = {
			url: 'img/gmap_me_marker.png',
			size: new google.maps.Size(16, 16),
			// The origin for this image is 0,0.
			origin: new google.maps.Point(0,0),
			// The anchor for this image is the base of the flagpole at 0,32.
			anchor: new google.maps.Point(8, 8)
	};
	dwgMapPinInfo = {
			url: 'img/social-map.png',
			size: new google.maps.Size(32, 32),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(16, 30)
	};
	
	// Debugsyfte:
	// var rectangle = new google.maps.Rectangle({
		// strokeColor: '#FF0000',
		// strokeOpacity: 0.6,
		// strokeWeight: 2,
		// fillColor: '#FF0000',
		// fillOpacity: 0.35,
		// map: dwgmapid,
		// bounds: new google.maps.LatLngBounds(
		// new google.maps.LatLng(59.0, 17.0),
		// new google.maps.LatLng(59.9999, 17.9999))
	// });

	

// Add vart jag är:
	// var infowindow33 = new google.maps.InfoWindow({
		// disableAutoPan: true,
		// content: '<div>Här tror jag att vi är...</div>'
	// });
	// var markerMyPos = new google.maps.Marker({
		// position: new google.maps.LatLng(dwgtmplat,dwgtmplong),
		// map: dwgmapid, 							// <-- Clusterer does not like this. http://stackoverflow.com/questions/14176595/markerclusterer-not-clustering-markers
		// icon: dwgMapPinMe,
		// // icon: ,
		// // title: '<div>Här tror jag att vi är...</div>'
		// optimized: false,
		// title: "jag"
	// });
	markerMyPos = new MeMarker({
		position: new google.maps.LatLng(dwgtmplat,dwgtmplong),
		map: dwgmapid 							// <-- Clusterer does not like this. http://stackoverflow.com/questions/14176595/markerclusterer-not-clustering-markers
	});
	
	// Denna fungerar fint, men vi behöver den inte! :)
	// var dwgmcircle = new google.maps.Circle({
		// center: new google.maps.LatLng(57.6978236, 11.9289323),
		// map: dwgmapid,
		// radius: 5000, 
		// strokeColor: "#FF0000",
		// strokeOpacity: 0.8,
		// strokeWeight: 2,
		// fillColor: "#FF0000",
		// fillOpacity: 0.35
	// });

	// infowindow33.open(dwgmapid,markerMyPos); Om man vill öppna dem från början.
	// google.maps.event.addListener(markerMyPos, 'click', function() {
		// infowindow33.open(dwgmapid,markerMyPos);
	// });

// Listeners:		

	// google.maps.event.addListener(dwgmapid, 'zoom_changed', function() {
		// zoomLevel = dwgmapid.getZoom();
		// // this is where you will do your icon height and width change.
		// // T.ex. om jag vill gruppera och visa som stora fält när man zoomar ut. (Kan köra en count på antal varor per kommun och sätt ut som blaffor när man passerar
		// // lägre än 9 i zoom t.ex.
	// });

	// google.maps.event.addListener(dwgmapid, 'center_changed', function(event) {  <--- Denna har funkat bra länge i v1.0 släpptes denna. Men jag har misstankar den gör för mycket hela tiden. Provar därför "idle".
	// google.maps.event.addListener(dwgmapid, 'dragend', function(event) { 
	google.maps.event.addListener(dwgmapid, 'idle', function(event) { 
		// if(skipCurrentCenterChanges==0){
			// var newpos = dwgmapid.getCenter();
			// prevMapCenter = new google.maps.LatLng(newpos.lat(), newpos.lng());
			// if(stillLoadingMarkers==false){
				// prevZoomLevel = zoomLevel;
				// zoomLevel = dwgmapid.getZoom();
				// if((prevZoomLevel != zoomLevel) || zoomLevel<13){
					// dwgClearAllMarkers();	// Numera rensar vi bara markers om man zoomar in ut och eller om vi är utzoomade och skapar klusterikoner (se naramig_markers2.php)
				// }
				// if(prevZoomLevel > zoomLevel){ // Vi zoomar IN. Då kan vi behålla alla singel ikoner och endast lösa upp klusterikoner. 
					// dwgClearOnlyClusterMarkers();	// Numera rensar vi bara markers om man zoomar in ut och eller om vi är utzoomade och skapar klusterikoner (se naramig_markers2.php)
				// }
				// dwgAddTheMarkers(newpos.lat(),newpos.lng());
			// }
		// }
		// if(skipCurrentCenterChanges>0){skipCurrentCenterChanges--;}
		
		var currMapCenter = dwgmapid.getCenter();
			// Logiken: 
			//	Pan - Delete vissa markers som ingår i nya cluster som bildas då boundaries förändras. Alla clusterikoner skapas om. Lägg till nya markers.
			//	Zoomin - Delete inga markers. Lös upp Alla cluster. lägg till nya ikoner och clusterikoner. Alla clusterikoner skapas om. Lägg till nya markers.
			//	Zoomut - Delete alla markers. Alla cluster skapas om.
		
		// if(prevMapCenter != currMapCenter){
			prevMapCenter = currMapCenter;
			zoomLevel = dwgmapid.getZoom();
			if(dwgempty(currMapCenter)){dwgalert($.t("map.msg_gps_location_failed")); } //"Misslyckades identifiera position");}
			
			// Zoomut
			if((prevZoomLevel > zoomLevel)){ // Med min nya clusterengine v2.0 behöver man inte deleta clusterikonerna längre. (Det kan bli liiite felräkning så länge som vi inte rundar av edges av boundary. Så det borde vi, men det är ändå bara marginella fel tror jag)
				prevZoomLevel = zoomLevel;
				dwgClearAllMarkers();	// Numera rensar vi bara alla markers om man zoomar ut.
			// }else if(zoomLevel>14 && prevZoomLevel<15){
				// clearUpLastClusterMarkersIfDeepZoomAndNoClearMarkers();
			// }
			
			// Zoomin
			}else if(prevZoomLevel < zoomLevel){ // Vi zoomar IN. Då kan vi behålla alla singel ikoner och endast lösa upp klusterikoner. Varje g. då löser vi också problemet med att de annars stannar kvar i sista zoomin'en. 
				prevZoomLevel = zoomLevel;
			}

			// Faktum är att vi faktiskt alltid måste cleanup av cluster markers även när vi rör över skärmen nu på grund av min "räkna antal markers before cluster :-P"
			if(stillLoadingMarkers==false){
				stillLoadingMarkers=true; // Så klart sätter vi detta med en g så vi kan timea laddningen till senare. Nu hinner clearclustericons köra klart också kan vi hoppas. 
				dwgClearOnlyClusterMarkers();	// Vi rensar alltid cluster markers. Vid varje rörelse.
				setTimeout(function () { dwgAddTheMarkers(currMapCenter.lat(),currMapCenter.lng()); },650); // As we updateallmarkers above...
			}
		// }

		
		// changed from event "dragend" to "center_changed" but weird behavior.
		// alert('map dragged to lat:' + evt.latLng.lat().toFixed(6) + ', long:' + evt.latLng.lng().toFixed(6) + '!');   WTF!!!!
		// Om vi vill kunna låta användaren dra omkring och ladda nya ikoner där kartan är centrerad.
		// Och vart vi hamnade på kartan: evt.latLng.lat().toFixed(3) / evt.latLng.lng().toFixed(3)  
	});
	
	
	
	// google.maps.event.addListener(dwgmapid, 'dblclick', function(event) { 
		// // Vi gör så att dblclick eventet alltid växlar mellan uppe eller nere vid marken så slipper man zooma runt så mycke.
		// // Detta kräver ju då också att vi disablear disableDoubleClickZoom propertin i kartan då också. :)
		// zoomLevel = dwgmapid.getZoom();
		// if(zoomLevel != 14){
			// dwgmapid.setZoom(14);
			// // $("#naramig").trigger('idle');
		// }else{
			// dwgmapid.setZoom(11);
			// // $("#naramig").trigger('idle');
		// }
	// });
	
	// google.maps.event.addListener(dwgmapid, 'click', function(event) { 
		// var lat=event.latLng.lat();
		// var lng=event.latLng.lng();
		// var cntr = new google.maps.LatLng(lat, lng);
		// dwgmapid.setCenter(cntr);
	// }
	stillLoadingMarkers=true;
	dwgClearAllMarkers();  // Nu när vi inte rensar ikoner lika händigt behövs detta om användare kollar på annat och kommer tillbaka. 
	setTimeout(function () {   // DENNA LADDNING SKER ENDAST FÖRSTA GÅNGEN. Och pga Initiation av map så väntar vi 2sek för att slippa korrupta objekt då man laddar för tidigt.
		dwgAddTheMarkers(dwgtmplat,dwgtmplong); 
	},2000);
	naramigfirstshow=false; // Now we have showed map once! (Simulate pageinit)
	// $("#naramig").trigger('click'); // För att initialt dölja menyn för att visa logga. <--- Numera i v1.02 kör vi med fast navbar.
}

$( window ).on( "orientationchange", function( event ) {
	// if(lastPageClicked=='naramig'){
	if($.mobile.activePage.attr("id")!="naramig"){
		tiltedSinceLastShowNaraMig=true;
		// setTimeout(function () { initiatemap();},600);
	}
	if($.mobile.activePage.attr("id")=="naramig"){
		//google.maps.event.addDomListener(window, 'load', initiatemap());			
		setTimeout(function () { initiatemap();},600);
	}
	// Om vi är på fullviewphoto så vill vi automatiskt justera bredden på fotot vid vridning:
	if($.mobile.activePage.attr("id")=="pagefullscreenphoto"){
		setTimeout(function () { dblclckzoomphoto(); },600);
	}	
});




// $(document).on('pageinit', '#naramig', function (event) { 
$(document).on('pageshow', '#naramig', function (event) {  // WE WANT THIS ON PAGEINIT! But as GMaps don't handle pageinit very well on iPhone (map up in right corner rest white) we'll have to simulate it.
	if((naramigfirstshow==true || lastPageClicked!='naramig') && lastPageClicked!='pageseaofthumbs'){ // As mentioned on row above and as we only want this triggered once (on init acctually).
		tiltedSinceLastShowNaraMig=false;
		lastPageClicked='naramig';
		markersFilter='';
		markersColorFilter = 0;
		$("#mapkatbtn1").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn2").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn3").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn4").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn5").height("30").css({ boxShadow: 'none' }); // Clean up
		$("#mapkatbtn6").height("30").css({ boxShadow: 'none' }); // Clean up
		
		// if(!dwgempty(adkat)){
			// dwgconfirm("Vill du behålla kategorifiltret på?","Bortskänkes.se","Nej,Ja",addFilterForMap);
		// }
		
		// $( "#panelnaramig" ).on( "panelclose", function() {
			// $('#gmapfooter').toolbar("show");
			// $('#dwgnativescrollfiller').height(1);
			// $('#dwgnativescrollfiller').hide();
		// } );
		// var footerHeight = $('[data-role="footer"]').outerHeight(true),
			// headerHeight = $('[data-role="header"]').outerHeight(true),
			// padding = 15*2; //ui-content padding
	
		setTimeout(function () { initiatemap();},600);  // Vänta in att gmapheight verkligen har satts ordentligt innan vi kör. Fix bugg:1
	}else{
		if(tiltedSinceLastShowNaraMig==true){				// Om vi tiltar när vi tittar på en annons från kartan och sedan backar utan att ladda om gmaps så kommer gmaps vara CP. Därför måste vi tvinga reload.
			setTimeout(function () { initiatemap();},600);  // Yeah! Det funkade skitsmutt!  <)
			tiltedSinceLastShowNaraMig=false;
		}
	}
	$("#fadepop").hide();
	
	lastPageClicked='naramig';
});



$(document).on('pageshow', '#pageseaofthumbs', function (event) {  // WE WANT THIS ON PAGEINIT! But as GMaps don't handle pageinit very well on iPhone (map up in right corner rest white) we'll have to simulate it
	// var header='<a onClick="history.back();" class="ui-btn ui-btn-right ui-icon-back ui-btn-icon-notext ui-corner-all" data-icon="back" data-theme="b"></a>';
	if(lastPageClicked!='pageseaofthumbs'){
		lastPageClicked='pageseaofthumbs';
		// var header='';
		// var seaofthumbshtml='';
		var nocachex=dwgguid();
		if(seaofthumbsboundary != ''){
			var whattoload=seaofthumbsboundary;
		}else{
			var whattoload="lat="+seaofthumbslat+"&long="+seaofthumbslng;
		}
		$.ajax({
			url        : weburl+"/mob_"+appver+"/seaofthumbs.php?"+whattoload+markersFilter+"&nochcx="+nocachex,
			beforeSend : function() {$.mobile.loading('show');},
			complete   : function() {$.mobile.loading('hide');},
			dataType   : "html",
			success    : function(dwgdata5) {
				var seaofthumbshtml=dwgdata5;
				// $("#seaofthumbsmain").html(header+seaofthumbshtml).trigger("create").enhanceWithin();
				$("#seaofthumbsmain").html('');
				$( seaofthumbshtml ).appendTo( "#seaofthumbsmain" ).enhanceWithin();
			},
			error      : function() {
				dwgalert('Kunde inte skapa en anslutning. Prova igen!');                  
			}
		}); 
	}
});
$(function(){  // NOTERA ATT DETTA ÄR FÖR FULLVIEW FOTO!  - Inte Page View!
   $( "#pageseaofthumbs" ).on( "swiperight", swiperightHandler );
	function swiperightHandler( event ){
		// $( event.target ).addClass( "swiperight" );
		history.back();   // I full screen foto can man rightswipe'a sig ut!
		return false;
	}
});
function viewIdSeathumb(thumbid){
	$("#seathumb"+thumbid).addClass( "seathumbclick" );
	setTimeout(function () {  
		$("#seathumb"+thumbid).removeClass( "seathumbclick" );
		viewId(thumbid); 
	},200);
}

	











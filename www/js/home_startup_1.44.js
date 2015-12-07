// Vi utvecklar Bortskänkes-appen med Cordova (Phonegap) och jQuery Mobile:
// http://flippinawesome.org/2013/04/08/phonegap-build-part4/

// Vänta först på att både jQMobile och Cordova har laddats:
// http://stackoverflow.com/questions/10945643/correct-way-of-using-jquery-mobile-phonegap-together
// http://demos.jquerymobile.com/1.1.0/docs/pages/phonegap.html
//----------------------------------------------------------
// För att felsöka app-trafiken applicera detta filter i wireshark: (ip.dst == 46.30.212.68 || ip.src==46.30.212.68) && http
//---------------------------------------
// KNAPPAR: 
// Skapa egna knappar: http://www.bestcssbuttongenerator.com
// http://codepen.io/cheeriottis/pen/inluv
// Progressbarknappar för upload: http://tympanus.net/Development/ProgressButtonStyles/
// DATAVISUALISERING: 
// http://codepen.io/ejsado/pen/hqolF
// http://www.freshdesignweb.com/jquery-css3-loading-progress-bar.html (flera här i)


var appver=1.44;
var prevappver=1.42;
var devinfo='';
var currentscrollpos;
var adkat='';
var adlan='';
var adhideclosed='';
var showclosedadsselectswitchloading=0;
var returntopos=false; 
var visapakartalat='';
var visapakartalong='';
var pulledpage=0;
var pagelimit=30; // Måste ta hänsyn till vad som sitter på serversidan.
var dwgtmpurl='';
var skickamailrubrik='';
var skickamailid=0;
var skickamailstamp='';
var lastscrolldirection='';  // up or down 
var nowhidethesearchbar=true;
var endpullpause=1;			// iscroll håller vi på (sista minut+sek)
var allowedToActOnScrollMove=true;
var prevscrollHpos=0;
var adsPreFetchDistance=80*5;	// Hur långt i förväg skall vi hämta ytterligare annonser.
var currentlyViewedAd='';	// för pageview sidan
// var currentlyViewedDistance=0;
var currentlySearchedText=''; // Ett försök att få swipeleft/right att funka med search text men detta uppnåddes aldrig
var lastPageClicked='home';		// Nödvändigt för att kunna stänga av swipeleft/right på annonser som öppnas i "PaKarta" då vi inte har logik för prev / next där.
var lastViewAdsUpdate=''; // För att autorefresha om det tagit ett tag sedan man var och titta på appen sist.
var seenmessageaboutanimals=false;
var showonceiPodSimCardMessage=false;
var retryloaduserwebdata=0;
var userwebnamn='';
var userwebadress='';
var userwebpostnr='';
var userwebpostnrlat='';
var userwebpostnrlong='';
var userwebpostnrisok=false;
var userwebplatsid='';
var userwebkommunid='';
var userwebortid='';
var userwebkommun='';
var userwebtelefon='';
var userwebmobil='';
var userwebactivated=false;
var useremail='';
var userdeviceuuid='';
var usercode='';
var tmpusernamn='';
var tmpusermobil='';
var tmpusertelefon='';
var tmpuserpostnr='';
var i18nIsInit = false;
// var weburl = 'http://www.bortskankes.se';
// var weburl=''; // Sätter denna i "pagebeforecreate" med hjälp av i18n och vad som står i språkfilen. <) Nix: sätter den numera i index.htlm head strax efter init av i18n
var urlhist=[];
var panelPlatserHtml='';

// GLOBAL CONFIGS FROM WEBSITE (is declared in getconfig() with ajax call to website):
var usingort=false;  // Set default venertheless when declaring
var insertorter=false;
var minlat=0;
var maxlat=360;
var minlong=0;
var maxlong=360;
var defaultlat=57.707616; // Dessa skall aldrig användas då getconfig hämtar ny default lat long beroende på land. Men om ALLT failar är detta roligare än i Atlanten (0,0).
var defaultlong=11.972690;  // Där mina ögon för första gång såg Jacq i riktiga livet.
var postnrmaxchars=10;
var postnrminchars=4;
var autoselcategory={};

// Lite sträng variabler vi vill sätta i "pagebeforecreate" direkt efter i18 istället för att ha i funktionerna (för att kunna återanvända krånglig kod från hemsidan RWD2015).
var selectnowlan=''; // 'Välj län...';
var selectnowkommun=''; // 'Välj nu kommun...';
var selectnowort=''; // 'Välj nu ort...';
var selectfirstlan=''; // 'Välj först län...';
var selectfirstkommun=''; // 'Välj först kommun...';
var isthisaddressincorrect='';
var pleaseverifypostnrformat=''; // 'Vänligen kontrollera postnummer.'
var smssomeonedwg_ipad_warning = '';





// var aboutus='<img src="img/bortskankes_se_logo.png" style="width: 100%"><p>Sedan 2004 har Bortskänkes.se bedrivit sin verksamhet i syfte att minska Sveriges avfall och därmed också förbrukningen av jordens begränsade resurser.<br> \
	// Allt avfall innebär idag en enorm belastning på vår planet och bidrar ofta till förgiftade och förstörda områden. Att skapa en ny produkt bidrar också till en viss förgiftning och förstörelse med energi från kolkraftverk eller giftiga ämnen vid tillverkningen.<br>\
	// Genom att återanvända brukningsbara varor och öka dess livslängd kan man hoppa över en generation av avfall och kanske minska nedsågandet av jordens lungor och uppvärmningen samt förgiftningen av våra hav.<br>\
	// Det är nödvändigt för vår framtid att vi slutar slänga användbara saker och istället ser till att det återanvänds av andra som kan ha intresse i detta.</p>\
	// <p>Tack för ditt bidrag och för en renare natur,<br>\
	// Bortskänkes.se</p>\
	// <p>Kontakt och övriga pressfrågor:<br>\
	// kontakt@bortskankes.se</p>\
	// <p>Support och hjälp:<br>\
	// support@bortskankes.se</p>\
	// <p>Hemsidan:<br>\
	// <a href="#" onClick="openExtLink(\'http://www.bortskankes.se\')">http://www.bortskankes.se</a>\
	// <p>Facebook:<br>\
	// <a href="#" onClick="openExtLink(\'http://facebook.com/bortskankes\')">http://facebook.com/bortskankes</a></p>\
	// ';
var aboutus2=	'<img src="img/bortskankes_se_logo.png" style="width: 100%"><p><b>VÄLKOMMEN HIT</b><br>' +
'Vi hoppas du skall ha en trevlig upplevelse när du strosar runt kring våra annonser och letar efter sådant som kan passa just dig. Här finns det mesta du kan tänka dig för att inreda en lya helt gratis, möbler har vi ett ordentligt överskott på. Men det finns också ibland riktiga guldkorn för de som söker lite flottare saker så som en segelbåt, bil, platt-TV, playstation eller märkeskläder. Skulle du stöta på en annons som känns otrevligt eller stötande bör du rapportera detta med rapportknappen i annonsen.</p>'+
'<p>Även om det mesta är gratis kommer du nog lägga märka till att djur har en liten prislapp på sig. Detta är den ”symboliska kostnaden” du måste betala för att visa att du tänker engagera dig i att ta hand om krabaten också. Alla levande djur måste ha en sådan och därför har vi tillsammans med Djurskyddet kommit fram till vad de minsta beloppen kan vara för att fortfarande kunna säga att man förutom detta belopp skänker djuret och inte har ett vinstintresse vid överlämnandet.</p>'+
'<p>Syftet med vår verksamhet är också att minska mängden skräp som hamnar på soptippen och istället förmedla en medveten konsumption för samhället där vi lär oss sluta slänga fungerande saker. På detta sätt kan vi utöka varors livslängd och därmed minska konsumptionen samt det förtärande det annars innebär av vår jords begränsade resurser.</p>'+
'<p>Du blir glad, givaren blir också glad men gladast blir nog jorden.</p>'+
'<p>Tack för ditt bidrag och för en renare natur,<br>'+
'Bortskänkes.se</p>'+
'<p>Kontakt och övriga pressfrågor:<br>'+
'kontakt@bortskankes.se</p>'+
'<p>Support och hjälp:<br>'+
'support@bortskankes.se</p>'+
'<p>Hemsidan:<br>'+
'<a href="#" onClick="openExtLink(\'http://www.bortskankes.se\')">http://www.bortskankes.se</a>'+
'<p>Facebook:<br>'+
'<a href="#" onClick="openExtLink(\'http://facebook.com/bortskankes\')">http://facebook.com/bortskankes</a></p>';
var aboutus = '';
var aboutus_appver='';
	


// BOOST Performance by removing 
$.mobile.defaultPageTransition   = 'none';
$.mobile.defaultDialogTransition = 'none';

// Gör GoogleAds reklam med Google Ads MobileSDK
// https://developers.google.com/mobile-ads-sdk/docs/admob/advanced?csw=1#play


// På grund av click buggen i Android 4.2.2 (blir massa klickande av ett click) DETTA LÖSER DET SMUTT:
last_click_time = new Date().getTime();
document.addEventListener('click', function (e) {
    click_time = e['timeStamp'];
    if (click_time && (click_time - last_click_time) < 1000) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return false;
    }
    last_click_time = click_time;
}, true);

// På grund av buggen HCN rapporterade att iscrollview inte fungerar som den skall vid orientationchange ---- VI FÅR JOBBA PÅ DETTA!
// $(window).bind("orientationchange", function(evt){
	// // alert(evt.orientation);
	// $( ".selector" ).pagecontainer( "getActivePage" );
	
// });


function openExtLink(urlen938){
	if( /Android/i.test(navigator.userAgent) ) { 
		// För att öppna externa länkar typ Djurskyddet etc. i Android. Detta funkar dock inte i iPhone:
		navigator.app.loadUrl(urlen938, { openExternal:true });
	}else{
		// IPhone:
		// http://stackoverflow.com/questions/15988019/phonegap-2-5-0-how-to-open-external-url-for-ipad-iphone
		var ref = window.open(urlen938, '_system');
	}
}

// function popurlhist(){
	// // return urlhist.pop();
	// urlhist.pop(); // first remove current page that has been pushed. 
	// var goback=urlhist.pop();
	// alert("goback hash:"+goback);
	// // window.location.href=goback;
	// // window.location.hash=goback;
	// $(location).attr('hash')=goback; 
// }
// function pushurlhist(){
	// // urlhist.push(window.location.href);
	// // urlhist.push(window.location.hash); // Eftersom vi kör en "onepage view" behöver vi bara xyz efter .html?xyz
	// var tmpurl=$(location).attr('hash'); 
	// urlhist.push(tmpurl); // Eftersom vi kör en "onepage view" behöver vi bara xyz efter .html?xyz
// }
function goback(){
	var navtothis="#"+lastPageClicked;
	// alert(navtothis);
	// jQuery.mobile.navigate(navtothis);
	$.mobile.pageContainer.pagecontainer( "change", navtothis,{ allowSamePageTransition: true });
}

function sayhi(){
	alert("hi!");
}


function getconfig(){
	// var nocachex=dwgguid();
	$.ajax({
		type: "POST",
		dataType: 'json',	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
		url: weburl+"/mob_"+appver+"/get_settings.php", // + nocachex,
		// data: sendData, // Skicka nycklar som låser upp och hämtar userwebdata
		// crossDomain:true,
		// async: false,
		// cache: false, 
		success: function (data) {
			usingort=data.usingort;  // Set default nevertheless when declaring
			insertorter=data.insertorter;
			minlat=data.minlat;
			maxlat=data.maxlat;
			minlong=data.minlong;
			maxlong=data.maxlong;
			defaultlat=data.defaultlat;
			defaultlong=data.defaultlong;
			postnrmaxchars=data.postnrmaxchars;
			postnrminchars=data.postnrminchars;
			autoselcategory=data.autoselcategory;
			showmapbutton=data.showmapbutton;
			aboutus=data.aboutus;
			katdescs=data.katdescs;

			// // $(".navpakartabtn").hide();
			// $(".navpakartabtn").remove();
			// var tmphtml = $("#annonserfooter").html();
			if(!showmapbutton){
			//	setTimeout(function () {
					// Det räckte INTE att köra remove på knappen och en update av HTML-koden. På något sätt har knapparna fått fasta storlekar då. Även om jag snor html-koden från diven och gör recreate på det så går det inte. Måste omskapa HMTL-koden för navbar helt för att knappar skall få ny bredd för 3 knappar.
					var newnavbarlaggtill='<div data-role="navbar" class="dwgnavbar"><ul class="dwgnavbarul"><li><a href="#laggtill"  style="background-color: #60915e !important; border-color: #60915e; color: #fff;text-shadow: 0;" data-icon="camera" class="ui-btn-active ui-state-persist">' + $.t("navbar.add") + '</a></li>';
					newnavbarlaggtill=newnavbarlaggtill+'<li><a href="#home" data-icon="bullets" class="dwgnavbarbtn">' + $.t("navbar.home") + '</a></li>';
					newnavbarlaggtill=newnavbarlaggtill+'<li><a href="#mittkonto" data-icon="user" class="dwgnavbarbtn">' + $.t("navbar.profile") + '</a></li></ul></div>';

					var newnavbarhome='<div data-role="navbar" class="dwgnavbar"><ul class="dwgnavbarul"><li><a href="#laggtill" data-icon="camera" class="dwgnavbarbtn">' + $.t("navbar.add") + '</a></li>';
					newnavbarhome=newnavbarhome+'<li><a href="#home" style="background-color: #60915e !important; border-color: #60915e; color: #fff;text-shadow: 0;" data-icon="bullets" class="ui-btn-active ui-state-persist">' + $.t("navbar.home") + '</a></li>';
					newnavbarhome=newnavbarhome+'<li><a href="#mittkonto" data-icon="user" class="dwgnavbarbtn">' + $.t("navbar.profile") + '</a></li></ul></div>';
				
					var newnavbarmittkonto='<div data-role="navbar" class="dwgnavbar"><ul class="dwgnavbarul"><li><a href="#laggtill" data-icon="camera" class="dwgnavbarbtn">' + $.t("navbar.add") + '</a></li>';
					newnavbarmittkonto=newnavbarmittkonto+'<li><a href="#home" data-icon="bullets" class="dwgnavbarbtn">' + $.t("navbar.home") + '</a></li>';
					newnavbarmittkonto=newnavbarmittkonto+'<li><a href="#mittkonto" data-icon="user"  style="background-color: #60915e !important; border-color: #60915e; color: #fff;text-shadow: 0;" class="ui-btn-active ui-state-persist">' + $.t("navbar.profile") + '</a></li></ul></div>';

					$("#dwgfootlaggtill").html(newnavbarlaggtill).trigger("create");//.refresh();				
					$("#dwgfoothome").html(newnavbarhome).trigger("create");//.refresh();
					$("#dwgfootmittkonto").html(newnavbarmittkonto).trigger("create");//.refresh();
					//$(".dwgnavbar").trigger("create");//.refresh();
					//	$("#annonserfooter").html('<div data-role="navbar" class="dwgnavbar"><ul class="dwgnavbarul"><li><a href="#laggtill" data-icon="camera" class="dwgnavbarbtn" data-i18n="[html]navbar.add">Lägg till</a></li><li><a href="#home" data-icon="bullets" class="ui-btn-active ui-state-persist"  data-i18n="[html]navbar.home">Annonser</a></li><li><a href="#mittkonto" data-icon="user" class="dwgnavbarbtn" data-i18n="[html]navbar.profile">Min profil</a></li></ul></div>').trigger("create");//.refresh();
					// $(".dwgnavbarul").listview('refresh');//.refresh();
			//	},100);
			}
		}, // --end success
		error: function (jqXHR, textStatus, errorThrown) {
			dwgalert($.t("profile.msg_could_not_conn6")); //"Vi verkar inte kunna nå servern just nu. Prova igen om en stund eller kontakta support@bortskankes.se om problemet kvarstår.");
		} // --end error
	}); // --end ajax
}

// A dynamic way to make navbar icons to highlight when clicked. But not needed as I have it static in pages + using ui-state-persist. Still not working. - Known bug.
// $(document).on( "pagecontainerchange", function() {
	// var current = $( ".ui-page-active" ).prop("id");   
	// // Remove active class from nav buttons
	// $( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
	// // Add active class to current nav button
	// $( "[data-role='navbar'] a" ).each(function() {
		// var href = $( this ).prop("href");
		// if ( href.indexOf(current, href.length - current.length) !== -1 ) {
			// $( this ).addClass( "ui-btn-active" ).trigger('refresh');
		// }
	// });
// });

function getPanelPlatser(){
	// var popularalan = document.getElementById('popularalan');
	// var allalan = document.getElementById('allalan');
	// popularLans.options.length = 0;
	$("#popularalan").empty();
	$("#allalan").empty();
	var nocachex=dwgguid();
	$.ajax({
		type: "GET",
		dataType: "text",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
		//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
		url: weburl+"/include/get_kommun_ajax.php?nocachex="+nocachex,
		success: function (data) {
			// alert(data);
			var lanen=data.split('|');
			var appendpopulararlan="";
			var appendallalan="";
			for (i=1; i<lanen.length; i++) {
				var id_lan=lanen[i].split(';'); // We send values as |23;Goteborg|24;Stockholm|...etc
				// var opt = document.createElement('option');
				// opt.value = id_lan[0];
				// opt.innerHTML = id_lan[1];
				// lanSelect.appendChild(opt);
				appendallalan = appendallalan + '<li><a href="#" onclick="doupdatelankat2('+id_lan[0]+',adkat);" data-rel="close">'+id_lan[1]+'</a></li>';
				if(id_lan[2]==true){
					appendpopulararlan = appendpopulararlan + '<li><a href="#" onclick="doupdatelankat2('+id_lan[0]+',adkat);" data-rel="close">'+id_lan[1]+'</a></li>';
				}
			}
			// $('#popularalan').append('<li><a href="#" onclick="doupdatelankat2(10,adkat);" data-rel="close">Nära Stockholm2</a></li>').listview('refresh');
			$('#popularalan').append(appendpopulararlan).listview('refresh');
			$('#allalan').append(appendallalan).listview('refresh');
			// setTimeout(function () {$("#lan").closest('div').addClass('highlightdiv'); }, 600);
			// setTimeout(function () {$("#lan").closest('div').removeClass('highlightdiv'); }, 2000);
		}, // --end success
		error: function (jqXHR, textStatus, errorThrown) {
		} // --end error
	});
	// // $("pnlkats").append('<h3>kalle</h3>');
	// // $("pnlkats").append('<div data-role="collapsible"><h3>kalle</h3></div>');
	// // TEST::
	// $("#pnlkats").append('<div data-role="collapsible"><h3>Hem och hushåll2</h3><ul data-role="listview" id="allafordon234" class="allafordon9877"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon234</a></li></ul></div>').collapsibleset("refresh");
	// setTimeout( function(){ $(".allafordon9877").listview("refresh"); },1000);
	// // $("#pnlkats").destroy();
	// // $("#pnlkats").empty().destroy();
	// // $("#pnlkats").append('<div data-role="collapsible"><h3>Hem och hushåll2</h3><ul data-role="listview"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon</a></li></ul></div>');
	// // $("#pnlkats").collapsible("create");
	// // $( "#pnlkats" ).collapsibleset( "option", "enhanced", true );
	// // $("pnlkats").append('<div data-role="collapsible"><h3>Hem och hushåll2</h3><ul data-role="listview"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon</a></li></ul></div>').collapsibleset( "refresh" );
	// $("#divkategorier").empty();
	// $("#divkategorier").html('<div id="kat1" onclick="showhide(\'#kat1data\');"><b>Open fordon</b></div><div id="kat1data"><ul data-role="listview" id="allafordon234" class="allafordon9877"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon234</a></li></ul></div>').trigger("create");
	//setTimeout( function(){ $(".allafordon9877").listview("refresh"); },400);

	

}

function getPanelKategorier(){
	var nocachex=dwgguid();
	$.ajax({
		type: "GET",
		dataType: "json",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
		//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
		url: weburl+"/include/get_kategori_ajax.php?nocachex="+nocachex,
		success: function (data) {
			// alert(data);
			var divkategorihtml='';
			var i=0;
			for(var key in data) {
				if(data[key].kategori==''){ // Om kategori är tomt har vi en huvudkategor
					i++;
					if(i>1){divkategorihtml=divkategorihtml+'</ul></div>';} // Om inte första så stäng föregående kategori.
					// divkategorihtml+='<div data-role="collapsibleset" data-collapsed-icon="carat-r" data-expanded-icon="carat-d" data-inset="true" data-corners="false" data-theme="a" data-content-theme="a" id="pnlkats">  <div data-role="collapsible" id="katjhdjdh'+ i +'data">   <h3 onclick="showhide(\'#kat'+ i +'data\');" id="katjhd8378kkk'+ i +'data">'+ data[key].huvudkategori +'</h3> </div></div>'      + '<div id="kat'+ i +'data" style="display: none;"><ul data-role="listview">' +   '<li><a href="#" onclick="doupdatelankat2(adlan,\''+ data[key].id +'\');" data-rel="close">'+ data[key].huvudkategori +'</a></li>';
					divkategorihtml=divkategorihtml+'<div class="huvudkategoribtn" onclick="showhidekat(\''+ i +'\');"><b>'+ data[key].huvudkategori +'</b></div><div id="kat'+ i +'data" style="display: none;"><ul data-role="listview">' +   '<li><a href="#" onclick="doupdatelankat2(adlan,\''+ data[key].id +'\');" data-rel="close">'+ data[key].huvudkategori +'</a></li>';
					// alert('<div onclick="showhide(\'#kat'+ i +'data\');"><b>'+ data[key].huvudkategori +'</b></div><div id="kat'+ i +'data"><ul data-role="listview">');
				}else{
					divkategorihtml=divkategorihtml+'<li><a href="#" onclick="doupdatelankat2(adlan,\''+ data[key].id +'\');" data-rel="close">'+ data[key].kategori +'</a></li>';
					// alert(divkategorihtml);
				}
			}
			if(i>1){divkategorihtml=divkategorihtml+'</ul></div>';} // Om vi hade träffar stäng nu också sista kategorin.
			// alert("text:"+divkategorihtml);
			$("#divkategorier").html(divkategorihtml).trigger("create");
			setTimeout(function () { 
				$('#panelkategorierwrapper').iscrollview("resizeWrapper");
				$('#panelkategorierwrapper').iscrollview("refresh");
			},300);


		}, // --end success
		error: function (jqXHR, textStatus, errorThrown) {
		} // --end error
		
	});
		
	// // $("pnlkats").append('<h3>kalle</h3>');
	// // $("pnlkats").append('<div data-role="collapsible"><h3>kalle</h3></div>');
	// // TEST::
	// $("#divkategorier").append('<div data-role="collapsible"><h3>Hem och hushåll2222</h3><ul data-role="listview" id="allafordon234" class="allafordon9877"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon234</a></li></ul></div>').collapsibleset("refresh");
	// setTimeout( function(){ $(".allafordon9877").append('<li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Ingafordon2342</a></li>').listview("refresh"); },1000);
	
	// // $("#pnlkats").destroy();
	// // $("#pnlkats").empty().destroy();
	// // $("#pnlkats").append('<div data-role="collapsible"><h3>Hem och hushåll2</h3><ul data-role="listview"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon</a></li></ul></div>');
	// // $("#pnlkats").collapsible("create");
	// // $( "#pnlkats" ).collapsibleset( "option", "enhanced", true );
	// // $("pnlkats").append('<div data-role="collapsible"><h3>Hem och hushåll2</h3><ul data-role="listview"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon</a></li></ul></div>').collapsibleset( "refresh" );
	// $("#divkategorier").empty();
	
	
	// $("#divkategorier").html('<div id="kat1" onclick="showhide(\'#kat1data\');"><b>Open fordon</b></div><div id="kat1data"><ul data-role="listview" id="allafordon234" class="allafordon9877"><li><a href="#" onclick="doupdatelankat2(adlan,\'1000\');" data-rel="close">Alla fordon234</a></li></ul></div>').trigger("create");
	//setTimeout( function(){ $(".allafordon9877").listview("refresh"); },400);

}



function dwgalert(dwgAlertMsg){
	dwgAlertTitle = $.t("app.title");
	dwgAlertBtnTitle = 'Ok';
	// if(device.version=='4.2' || device.version=='4.2.2'){
		// alert(dwgAlertMsg);
	// }else{
		navigator.notification.alert(
			dwgAlertMsg,				// message
			onDwgAlertConfirm,			// callback
			dwgAlertTitle,				// title
			dwgAlertBtnTitle			// buttonName
		);
	// }
	
	// $.mobile.pageContainer.pagecontainer("getActivePage").addClass("blur-filter");
	// var dwgActivePage = $(':mobile-pagecontainer').pagecontainer('getActivePage')[0].id;
	// dwgActivePage.addClass("blur-filter");
	// setTimeout($(".ui-header, .ui-footer, .ui-content, .dwgnavbarul").addClass("blur-filter"),100);
	
	// $(".ui-header, .ui-footer, .ui-content, .dwgnavbarul").addClass("blur-filter");
	// blurit();
}
function onDwgAlertConfirm(button) {
	// alert('You selected button ' + button);
	$(".blur-filter").removeClass("blur-filter");
}
function dwgconfirm(dwgAlertMsg,dwgAlertTitle,dwgAlertBtnsTitle,confirmFunc){
	var dwgConfirmAnswer;
	dwgAlertTitle = typeof dwgAlertTitle !== 'undefined' ? dwgAlertTitle : 'Bortskänkes.se';
	dwgAlertBtnsTitle = typeof dwgAlertBtnsTitle !== 'undefined' ? dwgAlertBtnsTitle : 'Ok,Cancel';
	navigator.notification.confirm(
		dwgAlertMsg,				// message
		confirmFunc,				// callback
		dwgAlertTitle,				// title
		dwgAlertBtnsTitle			// buttonName (xx,yy)
	);
	// blurit();
}


function blurit(){
	$(".ui-header, .ui-footer, .ui-content, .dwgnavbarul").addClass("blur-filter");
}
function unblurit(){
	$(".blur-filter").removeClass("blur-filter");
}

function logit(activity, details){
// 	$sqlstring="insert into activities set ip_id=$ip_id, ip='$ipadress', $annons_sql email_id=$email_id, email=?, cookie_id=$cookie_id, activity=?, details=?, httpuseragent='$httpuseragent', httpacceptlanguage='$httpacceptlanguage', regdatum=now()";
	var nocachex=dwgguid();
	var logData = {
		email: useremail,
		deviceuid: userdeviceuuid,
		activity: activity,
		details: details
	};
	$.ajax({
		type: "POST",
		dataType: 'text',
		url: weburl+"/mob_"+appver+"/logit.php?cachx=" + nocachex,
		data: logData,    // http://json.org/ 
		success: function (data) {
			// Success av loggning...
		}, // --end success
		error: function (jqXHR, textStatus, errorThrown) {
			// Misslyckades logga... ingen fara...
		} // --end error
	});
}

function loaduserwebdata(refreshmittkontobuttonsnow){
// 	$sqlstring="insert into activities set ip_id=$ip_id, ip='$ipadress', $annons_sql email_id=$email_id, email=?, cookie_id=$cookie_id, activity=?, details=?, httpuseragent='$httpuseragent', httpacceptlanguage='$httpacceptlanguage', regdatum=now()";
	var nocachex=dwgguid();
	userdeviceuuid	= storageReadData("userdeviceuuid");
	useremail		= storageReadData("useremail");
	
	// DANNY!!! GÖR DETTA: AKTIVERA DENNA REMMADE KOD F.O.M. version 1.43   
	// Det är skitsnyggt med detta meddelande. Men det startar vi först när iphone 1.42 är släppt då detta redan kommer med UserWebData upgrade och annars blir lite för mycket meddelanden.
	// prevappver		= storageReadData("prevappver");
	// if(prevappver != appver){
		// storageWriteData("prevappver",appver);
		// dwgalert("Bortskänkes appen har nu blivit uppgraderad till version "+appver);
	// }

	
	// alert(userdeviceuuid+useremail);
	var keyData = {
		useremail: useremail,
		userdeviceuuid: userdeviceuuid  // DENNA KAN IDAG HACKAS. Vi borde nog checka om mobil device id verkligen ingår i denna variabel.
		// Borde köra vid uppstart då vi laddar "loaduserlocdata" en checkdeviceid is in userdeviceuuid. En enkel .indexOf>-1. 
		// Då har vi bekräftat att användaren inte tagit någon annans och stoppat in i sin lokala cache.
		// Å andra sidan är detta lika osafe eftersom man kan sniffa med wireshark på cafe och bara klistra in i browser.
		// Måste helt enkelt se över att använda SSL - för mobil delarna iallafall. one.com erbjuder detta.
	};
	$.ajax({
		type: "POST",
		dataType: 'json',	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
		url: weburl+"/mob_"+appver+"/mittkonto_loaduserwebdata.php?cachx=" + nocachex,
		data: keyData, // Skicka nycklar som låser upp och hämtar userwebdata
		// async: false,
		// cache: false, 
		success: function (data) {
			if(data.isok || data.isok=="true"){
				// alert(data); // Sätt dataType: 'text', så kan man läsa detta i klartext. Men isåfall får man jsonData = $.parseJSON(data) istället . 
				userwebnamn=data.namn;
				usercode=data.usercode;
				userwebtelefon=data.telefon;
				userwebmobil=data.mobil;
				userwebadress=data.adress;
				userwebplatsid=data.platsid;
				userwebkommunid=data.kommunid;
				userwebortid=data.ortid;
				userwebpostnr=data.postnr;
				userwebpostnrisok=data.okpostnr;
				userwebpostnrlat=data.postnrlat;
				userwebpostnrlong=data.postnrlong;
				userwebkommun=data.kommun;
				userwebplatstext=data.platstext; // Den lilla rutan med "kommunval" som visas under POSTNR i mittkonto.
				// if( data.activated || data.activated=="true" ){ userwebactivated=true; }   // http://json.org/ - Vi behöver inte konvertera json data som vi behöver med webstorage data.
				userwebactivated=data.activated;
				// alert("activated with: "+useremail+userdeviceuuid+" userwebactivated:"+userwebactivated);
				if(refreshmittkontobuttonsnow){
					refreshmittkontofields();  // Är detta satt till true så är vi på mittkonto sidan och tryckt spara. Då skall denna funktion köras efter att vi lyckats ladda datat. INTE INNAN. Så detta är snyggast.
					refreshmittkontobuttons();
				}
			}else{
				// do not fill variables with "undefined" as this is ugly
				// fetch is ok but email-mobile != activated. 
				// alert("Not activated:"+data.error);
			}
			// setTimeout( function(){alert(userwebnamn + ' ' + userwebadress + ' ' + userwebpostnr + ' ' + userwebplatsid + ' ' + userwebtelefon + ' ' + userwebactivated)},10000);		
		}, // --end success
		error: function (data) {
			if(retryloaduserwebdata<4){
				retryloaduserwebdata++;
				setTimeout(loaduserwebdata,3000);  // << Utan "()" måste det vara eller så gör man så här: setTimeout(function(){loaduserwebdata()},3000);
			}else{
				retryloaduserwebdata=0;   // Relax and reset value for another time.
				// dwgalert("Din profil kunde inte läsas in. Kontrollera att ");  <-- Det är redan tydligt att man inte kunde ladda annonserna. Gör nåt snyggare där istället. 
				// alert("We did NOT succed in accessing mittkonto_loaduserwebdata.php?cachx=" + nocachex);
			}
		} // --end error
	}); // --end ajax
} // --end loaduserwebdata()

function onetimeconverttowebdata(){  // FÖR ATT KONVERTERA <1.4 appar till nya WEBUSERDATA (ligger i emails tabellen istället för locally).
	// Om dessa finns lokalt skall vi uppgradera: namn, email, useremailconfirmed, postnr
	// Upgrade process:
	// 1. Load namn, email, useremailconfirmed, userdeviceuuid, telefon, mobil postnr, platsid
		useremail	= storageReadData("useremail"); // Redan laddat
		userdeviceuuid	= storageReadData("userdeviceuuid"); // Redan laddat ... Men för säkerhets skull. 
		tmpusernamn 	= storageReadData("usernamn");
		tmpuseremailconfirmed	= storageReadData("useremailconfirmed");
		tmpusertelefon	= storageReadData("usertelefon");
		tmpusermobil	= storageReadData("usermobil");
		tmpuserpostnr	= storageReadData("userpostnr");
		tmpuserplatsid	= storageReadData("userplatsid");  // ONETIMEUPGRADE: Endast använd vid onetime upgrade. Detta pillas annars vid sidan av med mittkonto_changekommun.php
		firstregistration = true;
	// 2. Save as tmpusernamn, tmpusermobil, tmpusertelefon, tmpuserpostnr, useremail, userdeviceuuid
	if(tmpuseremailconfirmed===true){ // DET FÖRUTSÄTTER ATT EMAIL+DEV ÄR ACTIVATED. 
		var sendData = {
			tmpusernamn: tmpusernamn,
			tmpusermobil: tmpusermobil,
			tmpusertelefon: tmpusertelefon,
			tmpuserpostnr: tmpuserpostnr,
			tmpuserplatsid: tmpuserplatsid,  // ONETIMEUPGRADE: Endast använd vid onetime upgrade. Detta pillas annars vid sidan av med mittkonto_changekommun.php
			useremail: useremail,			// Detta är nycklarna som låser upp.
			userdeviceuuid: userdeviceuuid,  	// DENNA KAN IDAG HACKAS. Vi borde nog checka om mobil device id verkligen ingår i denna variabel.
			firstregistration: firstregistration
		};
		var nocachex=dwgguid();
		$.ajax({
			type: "POST",
			dataType: 'json',	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
			url: weburl+"/mob_"+appver+"/mittkonto_saveuserwebdata.php?cachx=" + nocachex,
			data: sendData, // Skicka nycklar som låser upp och hämtar userwebdata
			success: function (data) {
				// alert("Sidan svarade...");
				if(data.isok || data.isok=="true"){
					dwgalert(data.resulttxt); // Och berätta vad som hände på serversidan. :)
					loaduserwebdata(true);		// Denna hämtar bara variablerna. Förutsatt att det är activated. Med (true) så körs automatiskt en refreshmittkontofields vid success.... :)
					// setTimeout(refreshmittkontofields,1000);  // Detta kanske kan krångla... beroende på hur lång tid loadwebuserdata tar... borde istället vara en variabel som sätt och om satt så kör denna från loaduserwebdata vid success.
				}else{
					dwgalert(data.resulttxt); // Och berätta vad som hände på serversidan. :(
				}
				// Då detta var en ONETIME UPGRADE MÅSTE VI SE TILL ATT DETTA INTE SKER IGEN GENOM ATT SLÄNGA GAMMAL DATA. 
				deletelocalolddata();
			}, // --end success
			error: function (jqXHR, textStatus, errorThrown) {
				dwgalert($.t("home.msg_upgradelocprof_noconn")); // "Vi skulle vilja uppgradera din lokala profil till den nya versionen. Men vi verkar inte kunna nå servern just nu. Kontrollera nätverket och prova att starta om appen.");
				// Vi låter all data ligga kvar lokalt till nästa omstart. 
			} // --end error
		}); // --end ajax
	}else{
		// Delete all lokal shit so we don't get fooled here again. It was not even activated. 
		deletelocalolddata();
	}
	
			// storageWriteData("tmpusernamn",tmpusernamn);
			// storageWriteData("useremail",useremail);
			// storageWriteData("tmpusermobil",tmpusermobil);
			// storageWriteData("tmpusertelefon",tmpusertelefon);
			// storageWriteData("tmpuserpostnr",tmpuserpostnr);
			// storageWriteData("tmpuserplatsid",tmpuserplatsid);  // ONETIMEUPGRADE: Endast använd vid onetime upgrade. Detta pillas annars vid sidan av med mittkonto_changekommun.php
		// // 3. Also save value: startpollemailconfirmation  // NEJ! VI SKALL INTE POLLA. DET SKER BARA OM EMAIL EJ AKTIV. OCH DET ÄR EN FÖRUTSÄTTNING OM VI SKALL UPPGRADERA. 
			// storageWriteData("firstregistration",true);
		// 4. töm nu det gamla lokala datat från <v1.4.  (VARFÖR EGENTLIGEN.... MÅSTE VI DET. DET TAR JU INGEN PLATS. AVSPÅRBARHET KAN DET VARA KUL. 
			// DESSUTOM UNER UTVECKLINGSFASEN ÄR DET MYCKET ONÖDIGT. 
			// storageWriteData("usernamn",'');
			// storageWriteData("usermobil",'');
			// storageWriteData("usertelefon",'');
			// storageWriteData("userpostnr",'');
			// storageWriteData("userplatsid",'');  
			// storageWriteData("usercode",'');
			// storageWriteData("userpostnrlat",'');
			// storageWriteData("userpostnrlong",'');
			// storageWriteData("userlan",'');
			// storageWriteData("userkommun",'');
			// storageWriteData("userpostnrlat",'');
			// storageWriteData("userpostnrlong",'');
		// 5. starta nu loaduserdata() igen (den har redan körts men utan pollning satt och bara laddat username och device och hämtar en halvtom profil från online). Nu kommer den automatiskt ladda upp lokala profilen.
			// Hmmm... nej eftersom vi inte skall polla. Inte heller köra nedan. Om vi är offline så slår det inte igenom. 
			// saveuserwebdata();
}
function deletelocalolddata(){
	dwgalert($.t("home.msg_app_is_upgraded_to_v", {appver: appver})); //"Appen har nu uppgraderats till v"+appver+".");
	window.localStorage.removeItem("usernamn");		// <--- IOCH MED DETTA KAN INTE LÄNGRE ONTIMEUPGRADE TRIGGAS. 
	window.localStorage.removeItem("usermobil");
	window.localStorage.removeItem("usertelefon");
	window.localStorage.removeItem("userpostnr");
	window.localStorage.removeItem("userplatsid");  
	window.localStorage.removeItem("usercode");
	window.localStorage.removeItem("userpostnrlat");
	window.localStorage.removeItem("userpostnrlong");
	window.localStorage.removeItem("userlan");
	window.localStorage.removeItem("userkommun");
	window.localStorage.removeItem("userpostnrlat");
	window.localStorage.removeItem("userpostnrlong");
}



function viewAds2(dwgaddurl,dwgpage){
	var cachuxdate = new Date();
	lastViewAdsUpdate = cachuxdate.getTime(); // Set the last time we did a view-refresh
	var cachux = "&chx="+cachuxdate.getDay()+cachuxdate.getHours()+cachuxdate.getMinutes();
	if(dwgempty(dwgpage)){pulledpage=0;}
	if(dwgempty(dwgaddurl)){dwgtmpurl='';}else{dwgtmpurl=dwgaddurl;}
	if(dwgaddurl=='searchtxt'){dwgaddurl='&searchtxt=' + document.getElementById('searchtxt').value; currentlySearchedText=dwgaddurl;}else{currentlySearchedText='';}
	var dwgurl = weburl+'/mob_'+appver+'/adlist.php?a=b' + dwgaddurl + adhideclosed;
	dwgurl=dwgurl+'&page='+dwgpage;
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: dwgurl,
		type: 'GET',
		dataType: "text",  // Måste speca att detta är txt annars är default json...
		// cache: false,   // AV NÅGON ANLEDNING FAILAR HELA STARTEN AV APPEN OM DENNA ÄR PÅ. 
		error: function (x,t,m){ 
			if(t=="timeout"){
				dwgalert($.t("home.msg_could_non_connect1")); //	"Det verkar vara problem med att kontakta server. Vänligen försök igen om en stund.");
			} 
			if(dwgempty(dwgpage)){
				// Här BORDE vi göra if not empty dwgpage thenonly alert and say vi kunde inte hämta fler... istället för att ta bort allt. 
				document.title='Problem'; 
				$('#annonser').html($.t("home.html_adlist_no_conn")); //'<h3 style=\"color: silver !important; margin:15px 5px 5px 5px !important;\">Fick ingen kontakt. Prova igen om en stund... </h3> <a href="#" data-role="button" data-icon="refresh" data-inline="false" onClick="viewIdAjax(\'' + id + '\');">Ladda om</a>'); 
				$('#annonser').trigger("create");
				$.mobile.loading('hide');
				$("#iscrollwrapper").iscrollview("scrollTo", 0, 0, 0, false); // Då det kan bli en vit skärm om man scrollar ner och tappar anslutning då.
				$.mobile.silentScroll(0); // Om inte iscroll finns längre.
			}else{
				dwgalert($.t("home.msg_could_not_fetch_more_ads")); //"Lyckades inte hämta fler annonser. Prova igen om en stund...");
			}

		}, 
		success: function (data) {
			if(dwgempty(dwgpage)){
				$('#annonser').html(data);
			}else{
				if(data.indexOf("Inga träffar...")<0){ // Annars får vi bara massa rader av "inga träffar" varje g vi rör displayen vid ingen träff.
					$("#annonserul").append(data);
					// TESTAR MED NATIVE SCROLL: ***********************************************!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					// $("#home").height($("#annonserul").height());  NIX! Behövs massa mer för att stänga av iscrollview.
					$("#annonserul").listview("refresh");  
				}
			}
			$('#annonser').trigger("create");		
			$('#annonser').trigger("refresh"); // Tryout to see if iscrollview grabs it better.	

			// if($('#annonser').height() < screen.height){ // Vi måste göra den lite högre om för kort annars kommer det hända skumma grejer när vi bara får ett par annonser i listan o listan är <=screen.height. Då behövs ju ingen scroll så den försvinner och sökrutan kan inte längre döljas.
				// $('#annonser').css({height: (screen.height+30) + "px"}); // Detta buggar ibland... Vågar inte använde detta.
			// }
			
			// Pull to refresh update av window size:
			
			// $('#iscrollwrapper').iscrollview("resizeWrapper");  // 2014-05-07 Vi provar nytt bara för att förbättra.
			// $('#iscrollwrapper').iscrollview("refresh",200);
		    setTimeout(function () {
				// $('#iscrollwrapper').iscrollview("resizeWrapper");   // 2015-04-10: v1.42 Vi provar att ta bort detta för att effektivisera. Verkar flyta lite lugnare utan denna och ställer heller inte till det...(?)
				$('#iscrollwrapper').iscrollview("refresh");
			}, 700);

			
						
			// $.mobile.silentScroll(1)
			
			// $.mobile.silentScroll(30)
			if(nowhidethesearchbar==true){  // Bara vid refresh och init, men inte vid upscroll:
				setTimeout(function () { 
					$("#iscrollwrapper").iscrollview("scrollTo", 0, -131, 2000, false); 
					nowhidethesearchbar=false;
				},1500); // Dölj långsamt och vackert sökrutan, så man vet den finns. Invänta först att refreshen är klar.
			}

		}
		// timeout:7000  // <-- Detta blev aldrig bra.. Blev alltid bara att det hängde och timeout slog aldrig till.
	});
}


function viewId(id){
	// Vart var vi på scrollen
	// Pga denna bugg: https://github.com/jquery/jquery-mobile/issues/6688
	// https://github.com/jquery/jquery-mobile/commit/f6cf315b259b555d63c45a6668936ad82166eb7f
	// 2014-05-06: currentscrollpos = $(window).scrollTop();
	// $("html, body").animate({ scrollTop: 0 }, 500);
	
	// 2015-10-17 Vi gör detta efter laddat material som test ett tag i denna nya. 
	// jQuery.mobile.navigate("#pageview");

	$('#pageviewloadinto').html($.t("home.html_view_loading")); //'<h3 style="color: silver !important; margin:15px 5px 5px 5px !important;">Laddar detaljer...</h3>');
	$('#pageviewloadinto').trigger( 'updatelayout');
	// $.mobile.silentScroll(0); // Omgående upp oavsett iscrollview finns eller inte. Fungerar inte. Det måste till en iscrollview på den.
	setTimeout(function () { viewIdAjax(id);},100);
	

}
function viewIdSwipe(id){ // Enda skillnaden är att vi inte tömmer pageview mellan annonserna (för en mjukare övergång)
	// jQuery.mobile.navigate("#pageview");
	setTimeout(function () { viewIdAjax(id);},200);
}
function viewIdAjax(id){
	// $("#pageviewloadintowrapper").iscrollview("scrollTo", 0, 0, 0, false); // Denna verkar dock bugga lite då o då. Typ krocka med laddningen av annonser så det stannar efter denna.

	var cachuxdate = new Date();
	var cachux = "&chx="+cachuxdate.getDay()+cachuxdate.getHours()+cachuxdate.getMinutes(); 
	var usrinfo = "&ucode="+usercode;
	var dwgurl = weburl+'/mob_'+appver+'/viewid.php?id=' + id + usrinfo + cachux;  // id=1234&direction=prev&kat=3100&lan=23  - På php sidan (if !empty(direction) så skicka previos eller den som gäller)
	
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		dataType: "text",
		url: dwgurl,
		type: 'GET',
		error: function (){ 
			// document.title='Misslyckad laddning'; 
			$('#pageviewloadinto').html($.t("home.html_view_failed_load")); //'<h3 style="color: silver !important; margin:15px 5px 5px 5px !important;">Misslyckad laddning prova igen...</h3> <a href="#" data-role="button" data-icon="refresh" data-inline="false" onClick="viewIdAjax(\'' + id + '\');">Ladda om</a> <a href="#" data-role="button" data-icon="back" data-inline="false" onClick="history.back();">Backa tillbaka</a> ');
			$('#pageviewloadinto').trigger("create");
			$('#pageviewloadinto').trigger("refresh");
		}, 
		success: function (data) {
			currentlyViewedAd=id;
			// $('#annonserfooter').toolbar( "hide" );
			$('#pageviewloadinto').html(data); // PGA Android Softbar/Softbuttons (oftast height 25dp) MÅSTE vi ha det så här med extra 40px (25dp). Mycket bättre än alternativen som kan bugga fult med white bar i slutet. Läs: http://stackoverflow.com/questions/3407256/height-of-status-bar-in-android
			// $('#pageviewloadinto').trigger("updatelayout"); 
			
			$('#pageviewloadinto').trigger("create").trigger("refresh").trigger("updatelayout");

			// $('#pageviewloadinto').trigger("create");
			// $('#pageviewloadinto').trigger("refresh"); 
			// $('#pageviewloadinto').trigger("update"); 
			
			// var pageviewloadintocontentheight = screen.height+135;
			// pageviewloadintocontentheight = pageviewloadintocontentheight + "px";
			// $('#pageviewloadintowrapper').css({height: pageviewloadintocontentheight}); 
			$('#pageviewloadintowrapper').css({height: screen.height + "px"});
			
			// ADDED 2015-10-17:
			setTimeout(function () { 
				// jQuery.mobile.navigate("#pageview",{ transition : "slide"}) 
				// jQuery.mobile.navigate("#pageview");
				// $.mobile.navigate("#pageview");
				// $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pageview", { role: "dialog" } );
				// $( ":mobile-pagecontainer" ).pagecontainer( "change", "#pageview",{ transition: "slide", allowSamePageTransition: true });
				// $.mobile.pageContainer.pagecontainer("change", "#page", { options });    (,reverse: true)
				$.mobile.pageContainer.pagecontainer( "change", "#pageview",{ allowSamePageTransition: true });
				$('#pageviewloadinto').trigger("create").trigger("refresh").trigger("updatelayout");

			},300);

			
			setTimeout(function () {    // Invänta ny höjd innan vi sätter iscrollview.
				// Fixa så att inte iscrollview låser panelen från att scrollas.
				// $('#pageviewloadintowrapper').iscrollview("refresh");
				
				// 2014-05-07 - Provar en ny grej:
				// $("#pageviewloadintowrapper").data("mobileIscrollview").resizeWrapper();
				// $("#pageviewloadintowrapper").data("mobileIscrollview").refresh();
				
				$('#pageviewloadintowrapper').iscrollview("resizeWrapper");
				$('#pageviewloadintowrapper').iscrollview("refresh");

				
				// $('#pageviewloadintowrapper').iscrollview("refresh");
				// var myView = $("#panelview").data("mobileIscrollview");
				// myView.refresh(500);
				// $.mobile.silentScroll(0);
				$("#pageviewloadintowrapper").iscrollview("scrollTo", 0, 0, 0, false);
			},500);
		},
		timeout:8000
		// retryMax:2
	});
	

	
	// Här bet den försent...
	// 2014-05-06: $.mobile.silentScroll(currentscrollpos)
}

function showhidekat(thisitem){
		//#kat1data
		// Dölja alla andra när man togglar sin kategori
		for(i=1;i<7;i++){
			var hidethis="#kat"+i+"data";
			if(i!=thisitem){$(hidethis).hide(100);}
		}	
		// $(thisthing).toggle(300,"swing");
		var thisthing="#kat"+thisitem+"data";
		$(thisthing).toggle(100);
		
		setTimeout(function () { 
			$('#panelkategorierwrapper').iscrollview("resizeWrapper");
			$('#panelkategorierwrapper').iscrollview("refresh");
		},300);

}

function showhide(thisthing){
		// $(thisthing).toggle(300,"swing");
		$(thisthing).toggle(100);
}
function showhideShareOnSocial(){
	$("#scamreportdiv").hide(100);
	$("#transportoptions").hide(100);
	$("#shareonsocial").toggle(300,"swing");
	$('#pageviewloadintowrapper').iscrollview("resizeWrapper");
	$('#pageviewloadintowrapper').iscrollview("refresh");
	// var bottomposy=$("#iscrollwrapper").iscrollview("scrollerH") - screen.height;
	setTimeout(function () { 
		var tmmpPos=$("#pageviewloadintowrapper").iscrollview("maxScrollY");
		$("#pageviewloadintowrapper").iscrollview("scrollTo", 0, tmmpPos, 700, false); 
		// var scrolldownalittle=$("#pageviewloadintowrapper").iscrollview("y")-80;
		// alert(scrolldownalittle+$("#pageviewloadintowrapper").iscrollview("wrapperH"));
		// alert("CurrY:"+$("#pageviewloadintowrapper").iscrollview("y"));
		// alert("maxscroll:"+$("#pageviewloadintowrapper").iscrollview("maxScrollY"));
		// if(scrolldownalittle+$("#pageviewloadintowrapper").iscrollview("wrapperH")>0){
			// $("#pageviewloadintowrapper").iscrollview("scrollTo", 0, scrolldownalittle, 1000, false); 
		// }
	},1000);
}
function showhideScamReport() {
	$("#shareonsocial").hide(100);
	$("#transportoptions").hide(100);
	$("#scamreportdiv").toggle(300,"swing");
	$('#pageviewloadintowrapper').iscrollview("resizeWrapper");
	$('#pageviewloadintowrapper').iscrollview("refresh");
	// var bottomposy=$("#pageviewloadintowrapper").iscrollview("scrollerH") - screen.height;
	setTimeout(function () { 
		var tmmpPos=$("#pageviewloadintowrapper").iscrollview("maxScrollY");
		$("#pageviewloadintowrapper").iscrollview("scrollTo", 0, tmmpPos, 700, false); 
	},1000);
}
function reportScamAd(tmpannonsid,tmpcode1){
	var isuserregistered=userisregistered();
	if(isuserregistered != true){
		dwgalert($.t("home.msg_please_first_register")); //"Vänligen registrera dig först under 'Min profil' (både email och postnr).");
	}else{
		mailObjData = {
			annonsid: tmpannonsid,
			code1: tmpcode1,
			ucode: usercode,
			score: '-1'
		};
		$.ajax({
			url: weburl+"/mob_"+appver+"/vote.php",
			type: "POST",
			data: mailObjData,
			success: function(data, textStatus, jqXHR)
			{
				// Vi lyckades maila
				dwgalert($.t("home.msg_thanks_for_keeping_clean")); //"Tack för att du hjälper till att hålla rent. Mvh Bortskänkes.se");
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				// So...
				// alert(textStatus);
				dwgalert($.t("home.msg_could_not_connect2")); // "Just nu kunde vi inte nå servern. Prova igen tack!");
			}
		});
	}
}


function showhideStarAd(tmpannonsid,tmpcode1){
	var isuserregistered=userisregistered();
	if(isuserregistered != true){
		dwgalert($.t("home.msg_please_first_register")); //"Vänligen registrera dig först under 'Min profil' (både email och postnr).");
	}else{
		var nextstar='star_clicked.svg';
		var tmpscore=1;
		if($("#starforads").attr('src')=='img/star_clicked.svg'){
			nextstar='star.svg';
			tmpscore=0;
		}
		$("#starforads").attr('src','img/'+nextstar);
		mailObjData = {
			annonsid: tmpannonsid,
			code1: tmpcode1,
			ucode: usercode,
			score: tmpscore
		};
		$.ajax({
			url: weburl+"/mob_"+appver+"/vote.php",
			type: "POST",
			data: mailObjData,
			success: function(data, textStatus, jqXHR)
			{
				// Vi lyckades maila
				// alert("ok"+data);
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				// So...
				// alert(textStatus);
			}
		});
	}
}
function showhideTransportOption(){
	$("#scamreportdiv").hide(100);
	$("#shareonsocial").hide(100);
	$("#transportoptions").toggle(300,"swing");
	// setTimeout(function () { 
	$('#pageviewloadintowrapper').iscrollview("resizeWrapper");
	$('#pageviewloadintowrapper').iscrollview("refresh");
	// var tmmpPos=$("#pageviewloadintowrapper").iscrollview("maxScrollY");
	// $("#pageviewloadintowrapper").iscrollview("scrollTo", 0, tmmpPos, 700, false); 

	//},500);
	// var bottomposy=$("#iscrollwrapper").iscrollview("scrollerH") - screen.height;
	setTimeout(function () { 
		var tmmpPos=$("#pageviewloadintowrapper").iscrollview("maxScrollY");
		$("#pageviewloadintowrapper").iscrollview("scrollTo", 0, tmmpPos, 700, false); 
	},1000);
}


// function socialShareFacebook(fburl,fbphoto,fbcapt,fbdesc){
	// // FB.ui({
	  // // method: 'share',
	  // // href: fburl,
	// // }, function(response){});
	// FB.ui({method: 'feed',
		// picture: fbphoto,
		// link: fburl,
		// caption: fbcapt,
		// description: fbdesc
	// }, requestCallback);
// }

function shareFacebookLike(url){
    // window.location="http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
	openExtLink("http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url));
}
function shareTwitter(url, text){
    openExtLink("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url));
}
function shareEmail(subject, body){
    openExtLink("mailto: ?subject=" + subject + "&body=" + body);
}
function shareGooglePlus(url, text){
	openExtLink("https://plus.google.com/share?url=" + url + "&text=" + text);
}

// *************************  SMSa ett nummer:
function smsSomeoneDWg(number,msg){
	if( /iPad|iPod/i.test(navigator.userAgent) ) {   // NEJ! JAG KAN INTE DÖMA UT iPad då DE KAN ha telefoner i sig!!!!! :(
		if(showonceiPodSimCardMessage==false){
			dwgalert(smssomeonedwg_ipad_warning); //"Notera att det endast går att ringa med din iPad/iPod om den har levererats med ett SIM-kort.");
			showonceiPodSimCardMessage=true;
		}
	}
	if(navigator.userAgent.toLowerCase().match(/android|iemobile/i)) {
		document.location.href = 'sms:'+number+'?body='+msg;
	// } else if(navigator.userAgent.toLowerCase().match(/iphone/i) || navigator.userAgent.toLowerCase().match(/ipad/i)) {
		// document.location.href = 'sms:'+number+'&body='+msg;
	// } else {
		// dwgalert($.t("home.msg_call_adverter_on", {number: number} )); //"SMSa annonsören på tel: "+number+".");
	// }
	} else {
		document.location.href = 'sms:'+number+'&body='+msg;
	}
}






// Dessa två swipes på HOME menyn kanske kan tas bort för att ha mindre hooks och pressa minnet mindre...
$(function(){  // HOME - AllaAnnonser (Swipe Up)
	$( "#home" ).on( "swiperight", swiperightHandler );
	function swiperightHandler( event ){
		$( event.target ).addClass( "swiperight" );
		if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ){ // Bara om det inte är så att användaren stänger en panel med swipe:
			$("#iscrollwrapper").iscrollview("scrollTo", 0, 0, 0, false); // På AllaAnnonser (Home) innebär swipe left upp igen och right = längst ner.
			return false;
		}
	}
});
$(function(){  // HOME - AllaAnnonser (Swipe Down)
   $( "#home" ).on( "swipeleft", swipeleftHandler );
	function swipeleftHandler( event ){
		$( event.target ).addClass( "swipeleft" );
		if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ){   // Bara om det inte är så att användaren stänger en panel med swipe:
			var tmmpPos=$("#iscrollwrapper").iscrollview("maxScrollY");
			$("#iscrollwrapper").iscrollview("scrollTo", 0, tmmpPos, 0, false);  // På AllaAnnonser (Home) innebär swipe left upp igen och right = längst ner.
			return false;
		}
	}
});



// $(function(){  // NOTERA ATT DETTA ÄR FÖR FULLVIEW FOTO!  - Inte Page View!
   // $( "#pagefullscreenphoto" ).on( "swiperight", swiperightHandler );
	// function swiperightHandler( event ){
		// $( event.target ).addClass( "swiperight" );
		// history.back();   // I full screen foto can man rightswipe'a sig ut!
		// return false;
	// }
// });

$(function(){  // Bind the swiperightHandler callback function to the swipe event on div.box
   $( "#pageview" ).on( "swiperight", swiperightHandler );
	// Callback function references the event target and adds the 'swiperight' class to it
	function swiperightHandler( event ){
		$( event.target ).addClass( "swiperight" );
		// history.back();
		if(dwgempty(currentlySearchedText) && lastPageClicked=='home'){ // Vi fick aldrig search eller PåKarta att fungera med bläddra... 
			viewIdSwipe(currentlyViewedAd+'&direction=prev&kat='+adkat+'&lan='+adlan+adhideclosed);
		}else{
			history.back();
		}
		return false;
	}
});

$(function(){  // Bind the swipeleftHandler callback function to the swipe event on div.box
   $( "#pageview" ).on( "swipeleft", swipeleftHandler );
	// Callback function references the event target and adds the 'swipeleft' class to it
	function swipeleftHandler( event ){
		$( event.target ).addClass( "swipeleft" );
		// history.back();
		if(dwgempty(currentlySearchedText) && lastPageClicked=='home'){ // Vi fick aldrig search eller PåKarta att fungera med bläddra...
			viewIdSwipe(currentlyViewedAd+'&direction=next&kat='+adkat+'&lan='+adlan+adhideclosed);
		}else{
			history.back();
		}
		return false;
	}
});


function showFullScreenPhoto(fotot){
	htmlgrejs='<img onClick="dblclckzoomphoto();" id="zoomfullscreenphoto" src="'+weburl+'/foton/'+fotot+'" style="width: 100% !important; height: auto !important; position:absolute !important; top:0 !important; bottom:0 !important; margin:auto !important;">';
	// jQuery.mobile.navigate("#pagefullscreenphoto");
	// $.mobile.pageContainer.pagecontainer( "change", "#pagefullscreenphoto",{ allowSamePageTransition: true });
	$.mobile.pageContainer.pagecontainer( "change", "#pagefullscreenphoto",{ allowSamePageTransition: false });

	// screenheight=$(window).height() + "px";
	//screenheight=screen.height + "px";
	$( "#pagefullscreenphotomain" ).html(htmlgrejs);
	$( "#pagefullscreenphotomain" ).trigger("create");
	$( "#pagefullscreenphotomain" ).trigger("refresh");
	setTimeout(function () { dblclckzoomphoto("zoom"); },600);
	// $( "#pagefullscreenphotomain" ).css({height: screenheight});
	// $( "#fullscreenphotoheader" ).toggle();	Då döljer man den för evigt... Detta är inte samma som toggle header visibility
	// var image=document.getElementById('zoomfullscreenphoto');
	// image.addEventListener("gesturechange", gestureChange, false);
	// image.addEventListener("gestureend", gestureEnd, false);

	// image.addEventListener('gesturechange',function(e){
		// if(e.scale>1){
			// //zoom in 			//increase the size of image according to the e.scale
			// image.style("width: "+e.scale*100+"%;");
		// }
		// else if(e.scale<1){
			// //zoom out 			//decrease the size of image according to the e.scale
		// }
	// });
}
function dblclckzoomphoto(zoomed){
	// original height / original width x new width = new height
	// UNDERBART BRA SÄTT NEDAN ATT TA REDA PÅ BREDD O HÖJD DÅ screen.width/height FÖRSTÖRDE ALLT FÖR MIG I CA 3TIMMAR!!!!!
	var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	// alert(x + ' × ' + y);
	
	var tmpheight=$("#zoomfullscreenphoto").height();
	var tmpwidth=$("#zoomfullscreenphoto").width();
	if(tmpheight<tmpwidth){var imgaspectratio=tmpheight/tmpwidth;}else{var imgaspectratio=tmpwidth/tmpheight;}
	
	if(tmpheight<tmpwidth){
		var fullwidth=y/imgaspectratio;
	}else{
		var fullwidth=y*imgaspectratio;
	}
	// var fullheight=fullwidth*imgaspectratio;

	// alert("imgwidth:"+tmpwidth+"imgheight:"+tmpheight+"scrwidth:"+screen.width+"scrheight:"+screen.height+"fullwidth:"+fullwidth);
	if($("#pagefullscreenphoto").width() == x || zoomed=="zoom"){
		// if(screen.height>screen.width){
			$("#pagefullscreenphoto").width(fullwidth);
			// $("#pagefullscreenphoto").height(fullheight);
			// $("#pagefullscreenphoto").height(fullheight+"px;");
		// }else{
			// $("#pagefullscreenphoto").width(screen.width*imgaspectratio);
			// // $("#pagefullscreenphoto").height(screen.height);
		// }
	}else{
		$("#pagefullscreenphoto").width(x);
		// $("#pagefullscreenphoto").height(y);
	}
}

// function gestureChange(e) {

    // e.preventDefault();

    // scale = e.scale;
    // var tempWidth = _width * scale;

    // if (tempWidth > max) tempWidth = max;
    // if (tempWidth < min) tempWidth = min;

    // $('#square').css({
        // 'width': tempWidth + 'px',
        // 'height': tempWidth + 'px'
    // });
// }

// function gestureEnd(e) {

    // e.preventDefault();
    // _width = parseInt($('#square').css('width'));
// }





//function doupdatelankat(){
//	addurl='?lan=' + document.lankatform.lan.value+'&kat=' + document.lankatform.kat.value;
//	viewAds2(addurl);
//}
function doupdatelankat2(lan,kat){
	if(lan){
		if(lan=='latlong'){
			// alert("We're going latlong on this!");
			if(!dwgempty(userlat)){tmplat=userlat;tmplong=userlong;}
			else if(!dwgempty(userwebpostnrlat)){tmplat=userwebpostnrlat;tmplong=userwebpostnrlong; dwgalert($.t("home.msg_gps_not_avail_using_profile")); } //"Din mobilposition kunde inte lokaliseras så vi utgår från din profil istället."); }
			else{ dwgalert($.t("home.msg_no_pos_avail_please_conf_profile")); } //"Din position har inte hittats ännu. Fyll i 'Min Profil' för en ungefärlig position.");}
			lan='latlong:'+tmplat+','+tmplong;
		}
		adlan=lan;
	}
	$("#panelplatser").panel("close");  // eftersom data-rel="close" inte fungerar i dynamiskt tillagda il-records. Men det är helt ok. en petitess. 
	$("#panelkategorier").panel("close");// eftersom data-rel="close" inte fungerar i dynamiskt tillagda il-records. Men det är helt ok. en petitess. 

	if(kat){adkat=kat;}
	addurl='&lan=' + adlan+'&kat=' + adkat;
	// alert(addurl);
	viewAds2(addurl);
}
function doshowhideclosed(){
	if(showclosedadsselectswitchloading==0){ // Do not run on changed value when switch is autochanged on startup. Jag vet detta är CP men den kör onChange när man sätter det annars. 
		if($("#showclosedadsselectswitch").val()=='off'){
			adhideclosed='&hideclosed=1';
			storageWriteData("adhideclosed",adhideclosed);  // Vi sparar detta också. 
		}else{
			adhideclosed='';
			storageWriteData("adhideclosed",adhideclosed);
		}
		addurl='&lan=' + adlan+'&kat=' + adkat;
		// alert("adhideclosed:"+adhideclosed+" val:"+$("#showclosedadsselectswitch").val());
		setTimeout(function () { viewAds2(addurl); },300); // Så att animationen av flipswitchen inte hackar.
		setTimeout(function () { $("#panelkategorier").panel("close"); },1000);
	}
}
function closingview(){
		if(returntopos){
		$.mobile.silentScroll(currentscrollpos);
	}
}

// *************************  Ring ett nummer:
function callSomeoneDWg(number,protocol){
	if(dwgempty(protocol)){protocol='tel:';}
	// Detect if iPad:  http://www.jquerybyexample.net/2012/02/detect-apple-devices-ipad-iphone-ipod.html
	// Eller denna hellre: http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery
	//if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	if( /iPad|iPod/i.test(navigator.userAgent) ) {   // NEJ! JAG KAN INTE DÖMA UT iPad då DE KAN ha telefoner i sig!!!!! :(
		// some code..
		if(showonceiPodSimCardMessage==false){
			dwgalert($.t("home.msg_ipad_pod_might_not_have_sim")); //"Notera att det endast går att ringa med din iPad/iPod om den har levererats med ett SIM-kort.");
			showonceiPodSimCardMessage=true;
		}
	}
	if(navigator.userAgent.toLowerCase().match(/android|iemobile/i)) {
		// document.location.href = 'tel:'+number;
		document.location.href = protocol+number;
	} else if(navigator.userAgent.toLowerCase().match(/iphone/i) || navigator.userAgent.toLowerCase().match(/ipad/i)) {
		document.location.href = protocol+number;
		// window.plugins.phoneDialer.dial(number); // <<-- Kan vara för att jag saknar pluginnen!!!
	} else {
		dwgalert($.t("home.msg_call_adverter_on", {number: number} )); //"Ring annonsören på tel: "+number+".");
	}
}

// *************************  Ring ett nummer:
function smsSomeoneDWg(number,msg){
	if( /iPad|iPod/i.test(navigator.userAgent) ) {   // NEJ! JAG KAN INTE DÖMA UT iPad då DE KAN ha telefoner i sig!!!!! :(
		if(showonceiPodSimCardMessage==false){
			dwgalert($.t("home.msg_ipad_pod_might_not_have_sim")); //"Notera att det endast går att ringa med din iPad/iPod om den har levererats med ett SIM-kort.");
			showonceiPodSimCardMessage=true;
		}
	}
	if(navigator.userAgent.toLowerCase().match(/android|iemobile/i)) {
		document.location.href = 'sms:'+number+'?body='+msg;
	} else if(navigator.userAgent.toLowerCase().match(/iphone/i) || navigator.userAgent.toLowerCase().match(/ipad/i)) {
		document.location.href = 'sms:'+number+'&body='+msg;
	} else {
		dwgalert($.t("home.msg_call_adverter_on", {number: number} )); //"Ring annonsören på tel: "+number+".");
	}
}



// *******************************************************

function skickaMailSet(tmpskickamailrubrik,tmpskickamailid,tmpskickamailstamp){
	skickamailrubrik = tmpskickamailrubrik;
	skickamailid = tmpskickamailid;
	skickamailstamp = tmpskickamailstamp;
	// alert(skickamailrubrik+' '+skickamailid+' '+skickamailstamp);
	// Reset the mail form:
	document.getElementById('skickamailbody').value='';
	$("#pageskickamailcontent").show();
	$("#pageskickamailskickat").hide();
}
function skickamail(){
	tmpskickamailbody=document.getElementById('skickamailbody').value;
	if(tmpskickamailbody.length < 20){ 
		dwgalert($.t("home.msg_please_formulate_with_more_words")); //"Vänligen formulera lite mer ord i ditt mail...");
	}else{
		// tmpmailannonsid = document.getElementById('skickamailid').value;
		// tmpmailmailbody = document.getElementById('skickamailbody').value;
		// tmpmailmailstamp = document.getElementById('skickamailmailstamp').value;
		tmpmailannonsid = skickamailid;
		tmpmailmailbody = document.getElementById('skickamailbody').value;
		tmpmailmailstamp = skickamailstamp;
		mailObjData = {
			annonsid: tmpmailannonsid,
			namn: userwebnamn,
			telefon: userwebtelefon,
			email: useremail,
			mailbody: tmpmailmailbody,
			mailstamp: tmpmailmailstamp
		};
		$.ajax({
			url: weburl+"/view_send_mail.php",
			type: "POST",
			data: mailObjData,
			dataType: 'text',
			success: function(data, textStatus, jqXHR)
			{
				// Vi lyckades maila
				$("#pageskickamailcontent").hide();
				$("#pageskickamailskickat").show();
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				dwgalert($.t("home.msg_could_non_connect3")); //'Anslutningen misslyckades! Kontrollera internetanslutning och prova igen.');
			}
		});
	}  
}

// TEST:
// function loadEntireHome(){  // Denna måste köras i pagebeforecreate. Då fungerar iscrollview med panelen. Men det går INTE att fixa dynamiskt senare. Tro mig!
	// // var platsernashtml="<div data-iscroll=\"\" id=\"dynamicpanelplatser\"><p><a href=\"#\" onclick=\"doupdatelankat2('0',adkat);\" data-rel=\"close\" data-role=\"button\">All of U.K. 33</a> </p><p><a href=\"#\" onclick=\"doupdatelankat2('latlong',adkat);\" data-rel=\"close\" data-role=\"button\" data-icon=\"navigation\" data-iconpos=\"left\">Near me</a></p><p><ul data-role=\"listview\" data-inset=\"true\"><li><a href=\"#\" onclick=\"doupdatelankat2(7,adkat);\" data-rel=\"close\">Near London</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(5,adkat);\" data-rel=\"close\">Near Birmingham</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(3,adkat);\" data-rel=\"close\">Near Leeds</a></li></ul></p><p><ul data-role=\"listview\" data-inset=\"true\">";
	// // "<li><a href=\"#\" onclick=\"doupdatelankat2(4,adkat);\" data-rel=\"close\">East Midlands</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(6,adkat);\" data-rel=\"close\">East of England</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(7,adkat);\" data-rel=\"close\">London</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(1,adkat);\" data-rel=\"close\">North East</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(2,adkat);\" data-rel=\"close\">North West</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(12,adkat);\" data-rel=\"close\">Northern Ireland</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(11,adkat);\" data-rel=\"close\">Scotland</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(8,adkat);\" data-rel=\"close\">South East</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(9,adkat);\" data-rel=\"close\">South West</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(10,adkat);\" data-rel=\"close\">Wales</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(5,adkat);\" data-rel=\"close\">West Midlands3</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(3,adkat);\" data-rel=\"close\">Yorkshire and The Humber3</a></li></ul></p><p><br><br></p>";

	// var nocachex=dwgguid();
	// return $.ajax({  // by adding "return" we must wait for ajax to end. Detta behövdes här för att panelen skulle byggas i pagebeforecreate 
		// type: "GET",
		// dataType: "html",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
		// //url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
		// url: weburl+"/mob_"+appver+"/home_start.php?nocachex="+nocachex,
		// success: function (data) {
			// $("#home").html(data).trigger("create").trigger("refresh");
			// $(document).trigger("updateLayout");
		// }, // --end success
		// error: function (jqXHR, textStatus, errorThrown) {
		// } // --end error
	// });
// }



// REPLACED WITH getPanelPlatser()
// function loadPanelPlatser(){  // Denna måste köras i pagebeforecreate. Då fungerar iscrollview med panelen. Men det går INTE att fixa dynamiskt senare. Tro mig!
	// // var platsernashtml="<div data-iscroll=\"\" id=\"dynamicpanelplatser\"><p><a href=\"#\" onclick=\"doupdatelankat2('0',adkat);\" data-rel=\"close\" data-role=\"button\">All of U.K. 33</a> </p><p><a href=\"#\" onclick=\"doupdatelankat2('latlong',adkat);\" data-rel=\"close\" data-role=\"button\" data-icon=\"navigation\" data-iconpos=\"left\">Near me</a></p><p><ul data-role=\"listview\" data-inset=\"true\"><li><a href=\"#\" onclick=\"doupdatelankat2(7,adkat);\" data-rel=\"close\">Near London</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(5,adkat);\" data-rel=\"close\">Near Birmingham</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(3,adkat);\" data-rel=\"close\">Near Leeds</a></li></ul></p><p><ul data-role=\"listview\" data-inset=\"true\">";
	// // "<li><a href=\"#\" onclick=\"doupdatelankat2(4,adkat);\" data-rel=\"close\">East Midlands</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(6,adkat);\" data-rel=\"close\">East of England</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(7,adkat);\" data-rel=\"close\">London</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(1,adkat);\" data-rel=\"close\">North East</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(2,adkat);\" data-rel=\"close\">North West</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(12,adkat);\" data-rel=\"close\">Northern Ireland</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(11,adkat);\" data-rel=\"close\">Scotland</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(8,adkat);\" data-rel=\"close\">South East</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(9,adkat);\" data-rel=\"close\">South West</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(10,adkat);\" data-rel=\"close\">Wales</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(5,adkat);\" data-rel=\"close\">West Midlands3</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(3,adkat);\" data-rel=\"close\">Yorkshire and The Humber3</a></li></ul></p><p><br><br></p>";

	// var nocachex=dwgguid();
	// return $.ajax({  // by adding "return" we must wait for ajax to end. Detta behövdes här för att panelen skulle byggas i pagebeforecreate 
		// type: "GET",
		// dataType: "text",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
		// //url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
		// url: weburl+"/include/get_kommun_ajax.php?nocachex="+nocachex,
		// success: function (data) {
			// panelPlatserHtml="<div data-iscroll=\"\" id=\"dynamicpanelplatser\"><p><a href=\"#\" onclick=\"doupdatelankat2('0',adkat);\" data-rel=\"close\" data-role=\"button\">All of U.K. 44</a> </p><p><a href=\"#\" onclick=\"doupdatelankat2('latlong',adkat);\" data-rel=\"close\" data-role=\"button\" data-icon=\"navigation\" data-iconpos=\"left\">Near me</a></p><p><ul data-role=\"listview\" data-inset=\"true\"><li><a href=\"#\" onclick=\"doupdatelankat2(7,adkat);\" data-rel=\"close\">Near London</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(5,adkat);\" data-rel=\"close\">Near Birmingham</a></li><li><a href=\"#\" onclick=\"doupdatelankat2(3,adkat);\" data-rel=\"close\">Near Leeds</a></li></ul></p><p><ul data-role=\"listview\" data-inset=\"true\">";
			
			// var lanen=data.split('|');
			// for (i=1; i<lanen.length; i++) {
				// var id_lan=lanen[i].split(';'); // We send values as |23;Goteborg|24;Stockholm|...etc
				// panelPlatserHtml = panelPlatserHtml+"<li><a href=\"#\" onclick=\"doupdatelankat2("+id_lan[0]+",adkat);\" data-rel=\"close\">"+id_lan[1]+"4</a></li>";
			// }
			
			// panelPlatserHtml = panelPlatserHtml+"</ul></p><p><br><br></p></div>";
		// }, // --end success
		// error: function (jqXHR, textStatus, errorThrown) {
		// } // --end error
	// });
// }
// function generatePanelPlatser(){  // Denna måste köras i pagebeforecreate. Då fungerar iscrollview med panelen. Men det går INTE att fixa dynamiskt senare. Tro mig!
			
	// $("#panelplatserwrapper").empty().append(panelPlatserHtml).trigger("create");
	// // $(document).trigger("updateLayout");
	// // $(document).trigger("refresh");
	// //$("#dynamicpanelplatser").iscrollview("resizeWrapper").trigger("create");
	// setTimeout( function(){ $("#dynamicpanelplatser").iscrollview("resizeWrapper").trigger("create");}, 300);
	
	// // $("#panelplatserwrapper").html(platsernashtml).trigger("create").iscrollview("resizeWrapper"); // Detta fungerar men den blir stel och ger ej att scrolla så vi behöver:
	// // $("#panelplatserwrapper").empty().append(platsernashtml).trigger("create").trigger("updateLayout");
	// // setTimeout( function(){ $("#dynamicpanelplatser").iscrollview("resizeWrapper").trigger("create");}, 300);
// }




// $(document).on("pagecreate", function() {
	// // alert("created!");
	// // $("#panelview").on( "panelclose", function( event, ui ) {
		// // alert('Collapsedpanel');
		// // $.mobile.silentScroll(currentscrollpos);
		// // $.mobile.changePage( link, { transition: "slideup", reverse: false, changeHash: false });
		// // $.mobile.changePage( link, {reverse: true, changeHash: false });
		// // Note: For performance reasons, jQuery Mobile recommend using "pop", "fade" or "none" for smooth and fast animations.
		// // http://www.w3schools.com/jquerymobile/tryit.asp?filename=tryjqmob_popup_transitions
	// // }); 
	
	// // $(document).on( "panelclose", "#externalpanel", function() {
	// //	alert("closed!");
	// //	$.mobile.silentScroll(currentscrollpos);
	// // });
// });

$(document).on("pagecreate", function() {
	if(screen.width == 375 || screen.width == 414){ //Om iphone 6 eller 6+, sätt en sötare grafik igen. För ingen kan läsa den utzoomade standarden annars.
		$('meta[name=viewport]').remove();
		$('head').append('<meta name="viewport" content="width=300,initial-scale=1.1,maximum-scale=1.1,user-scalable=no">');
		$(document).trigger( "updatelayout" );
	}
	
});


// $(document).bind("mobileinit", function(){
	// var i18nOpts = { resGetPath: 'locales/sv/translation.json' };
	// i18n.init(i18nOpts);
// }); 
// $( document ).on( "mobileinit", function() {
	// alert("Mobileinit");
	// // var i18nOpts = { resGetPath: 'locales/sv/translation.json' };
	// // i18n.init(i18nOpts);
	// // alert("i18n initiated");
// });

// $(document).on("pagebeforeload", function () {
// });


$(document).on("pagebeforecreate", function () {
	// loadEntireHome();
	
	// $('.navpakartabtn').remove();

	
// $(document).on("pagecontainerbeforetransition", function () {  // https://jqmtricks.wordpress.com/2014/03/26/jquery-mobile-page-events/
// $(document).on("mobileinit", function () {  http://www.gajotres.net/page-events-order-in-jquery-mobile-version-1-4-update/
    if (!i18nIsInit){
			// // i18n.init({ lng: "sv-SE", currentLocale: 'sv' });
			// // i18n.init({ lng: 'sv-SE' }, function(t) { /* loading done */ });
			// i18n.init({ resGetPath: 'locales/sv/translation.json' }, function(t) { /* loading done */ });
			// //$("#dwgnavbarul").i18n();
			// $(".dwgnavbarbtn").i18n(); // Behövs...
			// setTimeout( function(){ $(document).trigger( "updatelayout" ); },300);
			// // För att trigga i phonegap: https://github.com/i18next/i18next/issues/126

		// var i18nOpts = { resGetPath: 'locales/sv/translation.json' };
		// i18n.init(i18nOpts).done(function () {
			
		
		// OM i18n OCH PRESTANDA:
		// i18n initieras långsamt och måste initieras emellan "fil"-laddningen av jQuery och jQuery mobile. 
		// Därför sätter man "mobileinit" ute i HTML-filen så klart. INTE inne i en av mina filer som laddas långt senare (efter jQuery Mobile).
		// Se script-blocket ute i index.html under script taggen i huvudet som laddar jQuery. 
		// Förstod efter att ha läst här: https://api.jquerymobile.com/mobileinit/
		
		// OM i18n OCH BUGGAR PROBLEM:
		// Notera att spåkfilen (translation.json) inte kan innehålla "// kommentarer" och att det är RIKTIGT LÄTT att missa ett kommatecken.
		// Om det blir fel i språkfilen så laddas helt enkelt inte språket och inget händer.
		
		// OM i18n OCH TEXTFILEN:
		// Ta hjälp att konvertera text med detta program: http://i18next.com/pages/ext_webtranslate.html
		
		
			weburl=$.t("app.weburl");  // Vi laddar den här också eftersom obfuscate kanske döper om variabeln och den som görs i index head blir pointless. (Men det har vi nu bekräftat den inte gör. Lugnt oavsett)
            $("html").i18n();  // <--- Jättesnyggt men för långsamt. Det blinkar till innan man ser nya språket. INTE LÄNGRE! LÖSNING: i18n.init i en mobileinit mellan script blocken jQuery och JQM i index.html

			
// Skapa panelen platser från dynamiskt data från servern. (Alla län) Denna MÅSTE köras från pagebeforecreate, annars fungerar inte iscrollview i panelen. (iscrollview klarar inte paneler dynaiskt)
//$.when( generatePanelPlatser() ).done(); // Vänta in...

			// $(".dwgnavbarbtn").i18n();  // Detta går också för långsamt. Det flippar mellan språken.
			 // // Enhance new  navbar widget
			// $('[data-role="navbar"]').navbar();
			// $("#panelplatserwrapper").i18n().trigger("create");
			// weburl=$.t("app.weburl");
            i18nIsInit = true;
			// // $(document).trigger( "updatelayout" ); 
			// // setTimeout( function(){ $(document).trigger( "updatelayout" ); },300);
			// // setTimeout( function(){ $("#panelplatserwrapper").trigger("create"); },600);
        // });
		
		//setTimeout( function(){ $("#panelplatserwrapper").i18n().trigger("create"); },500);
		
		// Nedan slår direkt, det betyder att i18next är för långsam:
		// $(".dwgnavbarbtn").html("test");
		// $('[data-role="navbar"]').navbar();
		
		// setTimeout(function(){
			// Vi försökte köra detta i en ".on("iscroll_init", function()" men då hade inte i18n laddat ännu. Men att köra detta här i verkade fungera finfint!  =)
			$.mobile.iscrollview.prototype.options.pullDownResetText = $.t("home.pulldownresettext"); 		// "Dra ner för att uppdatera..."
			$.mobile.iscrollview.prototype.options.pullDownPulledText = $.t("home.pulldownpulledtext");				// "Släpp för att uppdatera..."
			$.mobile.iscrollview.prototype.options.pullDownLoadingText = $.t("home.pulldownloadingtext");	// "Uppdaterar..."
			$.mobile.iscrollview.prototype.options.pullUpResetText = $.t("home.pullupresettext");					// " "
			$.mobile.iscrollview.prototype.options.pullUpPulledText = $.t("home.pulluppulledtext");		// "Släpp så skall jag leta fler..."
			$.mobile.iscrollview.prototype.options.pullUpLoadingText = $.t("home.pulluploadingtext");				// "Letar..."

			
			selectnowlan=$.t("profile.lan"); // 'Välj län...';
			selectnowkommun=$.t("profile.nowkommun"); // 'Välj nu kommun...';
			selectnowort=$.t("profile.nowort"); // 'Välj nu ort...';
			selectfirstlan=$.t("profile.kommun"); // 'Välj först län...';
			selectfirstkommun=$.t("profile.ort"); // 'Välj först kommun...';
			isthisaddressincorrect='(Är detta fel?)';
			pleaseverifypostnrformat=$.t("profile.pleaseverifypostal"); // 'Vänligen kontrollera postnummer.'
			
			smssomeonedwg_ipad_warning = $.t("home.msg_ipad_pod_might_not_have_sim");
		// },250);
		// Nu när vi har "weburl" ladda då dynamiskt js-filen från web för Disaster Recover situationen. 
		// setTimeout(function () {
			// var fileref=document.createElement('script');
			// fileref.setAttribute("type","text/javascript");
			// fileref.setAttribute("src", weburl+'/mob_'+appver+"/generic_functions.js");
			// document.getElementsByTagName("head")[0].appendChild(fileref);
		// }, 2000);

		
    }
});



// // $(document).on("iscrollview_init", function() {
// $(document).on("iscroll_init", function() {
	// // $.mobile.iscrollview.prototype.options.refreshDelay = 100;
	// // $("#iscrollwrapper").iscrollview("option", "pullDownResetText", "So nice downa...");
	// // $("#iscrollwrapper").iscrollview("option", "pullDownPulledText", "Yeahh...");
	// // $("#iscrollwrapper").iscrollview("option", "pullDownLoadingText", "Oaahh...");
	// // $("#iscrollwrapper").iscrollview("option", "pullUpResetText", "Oaeeeahh...");
	// // $("#iscrollwrapper").iscrollview("option", "pullUpPulledText", "Oauuuahh...");
	// // $("#iscrollwrapper").iscrollview("option", "pullUpLoadingText", "Oaooiodahh...");
	
	// // $.mobile.iscrollview("option", "pullDownResetText", "So nice downa...");
	// // $.mobile.iscrollview("option", "pullDownPulledText", "Yeahh...");
	// // $.mobile.iscrollview("option", "pullDownLoadingText", "Oaahh...");
	// // $.mobile.iscrollview("option", "pullUpResetText", "Oaeeeahh...");
	// // $.mobile.iscrollview("option", "pullUpPulledText", "Oauuuahh...");
	// // $.mobile.iscrollview("option", "pullUpLoadingText", "Oaooiodahh...");
	// $.mobile.iscrollview.prototype.options.pullDownResetText = $.t("home.pulldownresettext"); 		// "Dra ner för att uppdatera..."
	// $.mobile.iscrollview.prototype.options.pullDownPulledText = $.t("home.pulldownpulledtext");				// "Släpp för att uppdatera..."
	// $.mobile.iscrollview.prototype.options.pullDownLoadingText = $.t("home.pulldownloadingtext");	// "Uppdaterar..."
	// $.mobile.iscrollview.prototype.options.pullUpResetText = $.t("home.pullupresettext");					// " "
	// $.mobile.iscrollview.prototype.options.pullUpPulledText = $.t("home.pulluppulledtext");		// "Släpp så skall jag leta fler..."
	// $.mobile.iscrollview.prototype.options.pullUpLoadingText = $.t("home.pulluploadingtext");				// "Letar..."
// });


$(document).on('pageshow', '#home', function (event) {
	lastPageClicked='home';
	// pushurlhist();
	
	getPanelPlatser();
	setTimeout(getPanelKategorier,800);
	
	// $("#iscrollwrapper").iscrollview("option", "pullDownResetText", "So nice downa...");
	// $("#iscrollwrapper").iscrollview("option", "pullDownPulledText", "Yeahh...");
	// $("#iscrollwrapper").iscrollview("option", "pullDownLoadingText", "Oaahh...");
	// $("#iscrollwrapper").iscrollview("option", "pullUpResetText", "Oaeeeahh...");
	// $("#iscrollwrapper").iscrollview("option", "pullUpPulledText", "Oauuuahh...");
	// $("#iscrollwrapper").iscrollview("option", "pullUpLoadingText", "Oaooiodahh...");



	
	
	// Skapa panelen platser från dynamiskt data från servern. (Alla län) Denna MÅSTE köras från pagebeforecreate, annars fungerar inte iscrollview i panelen. (iscrollview klarar inte paneler dynaiskt)
	// generatePanelPlatser();
	
	$("#appuppdatering").hide();
	// AutoUpdateIfOldData(); // Om det var ett tag sedan vi startade så är det dags att ladda om allt.
	// alert("pageshow");
	// setTimeout(refreshmittkontobuttons,800);
	
		// PULL-DOWN-REFRESH med iscrollview - Sätt ett event att fånga pull-down:
	var iscrollwrapit = $("#iscrollwrapper").data("mobileIscrollview");
	iscrollwrapit.$wrapper.bind("iscroll_onpulldown", function () {
		// alert("You pulled it!");
		lastscrolldirection='down';
		adkat=''; // Om vi gör refresh skall dessa tömmas
		adlan='';
		nowhidethesearchbar=true; // Se till att scrolla mjukt ner tills searchbar är dold.
		viewAds2();
	});
	// iscrollwrapit.$wrapper.bind("iscroll_onpullup", function () {
		// var pulldate = new Date();
		// var pullnow=0;
		// pullnow=pullnow+(pulldate.getMinutes()*100)+pulldate.getSeconds();
		// // var pullnowmax=ispullnow+2
		// // alert(endpullpause +'<'+ pullnow);
		// if( (endpullpause < pullnow) || (endpullpause > pullnow+3) ){ // Vi ger den tre sekunder på sig
			// endpullpause=pulldate.getMinutes()*100+pulldate.getSeconds();
			// pulledpage++;
			// // alert("You pulled it:"+pulledpage);
			// lastscrolldirection='up';
			// var scrollheighHprev=$("#iscrollwrapper").iscrollview("scrollerH");
			// viewAds2(dwgtmpurl,pulledpage*pagelimit);
			// if(scrollheighHprev+70>$("#iscrollwrapper").iscrollview("scrollerH")){ // Bara om vi fått lite annonser
				// var scrolldownalittle=$("#iscrollwrapper").iscrollview("y")-80; // Vi flyttar oss ner en rad i annonserna efter att ha hämtat nya.
				// setTimeout( function() { $("#iscrollwrapper").iscrollview("scrollTo", 0, scrolldownalittle, 3000, false) },1000);
			// }
		// }
	// });
	iscrollwrapit.$wrapper.bind("iscroll_ontouchend", function () {  // Trying out transparent
		// var tmplist='<li style="background-color: #FFFFFF !important;" class="has-odd-thumb tmplistitem"><a href="#"><div class="thumbContainer"><img src="img/loadingadphoto.jpg"></div><h2 style="-webkit-animation: {from{color:white} to{color:gray}} 5s;">Loading data...</h2><p> </p></a></li>';
		if(allowedToActOnScrollMove==true){
			allowedToActOnScrollMove=false; // För att kunna sätta en timeout på efter släpp så den får rulla lite -på (så att det inte sätts femtielva timeouter samtidigt.
			setTimeout( function() {
				allowedToActOnScrollMove=true;  // För att kunna sätta en timeout på efter släpp så den får rulla lite -och av! 
				if($("#iscrollwrapper").iscrollview("y") < $("#iscrollwrapper").iscrollview("maxScrollY")+adsPreFetchDistance){  
					// $("#annonserul").append(tmplist);
					allowedToActOnScrollMove=false;
					setTimeout( function() {allowedToActOnScrollMove=true;}, 4000); 
					pulledpage++;
					viewAds2(dwgtmpurl,pulledpage*pagelimit);
					// Vi bör dock INTE använda nedan softscroll här:
					// setTimeout( function() { 
						// if(($("#iscrollwrapper").iscrollview("y")-20) < $("#iscrollwrapper").iscrollview("maxScrollY")){
							// $("#iscrollwrapper").iscrollview("scrollTo", 0, scrolldownalittle, 2000, false) }
				}
			},900);	
		}
	});
	
	$(document).on('click', '.ui-input-clear', function () {
		viewAds2('');
	});
	
	
	
	// $("#panelplatser").on( "panelopen", function( event, ui ) {
		// alert("panelopen");
		// $('#panelplatserwrapper').css({height: screen.height + "px"});
	// });
	// $("#panelkategorier").on( "panelopen", function( event, ui ) {
		// alert("panelopen");
		// $('#panelkategorierwrapper').css({height: screen.height + "px"});
	// });
		
	var winheight=$(window).height();
	$('#panelplatserwrapper').css({height: winheight + "px"});
	$('#panelkategorierwrapper').css({height: winheight + "px"});  // <--- HÄR funkade inte window.height alls. Här gäller screen height.
	// $('#panelplatserwrapper').css({height: screen.height + "px"});
	// $('#panelkategorierwrapper').css({height: screen.height + "px"});
	
	// if(adhideclosed==''){ $("#showclosedadsselectswitch").val('off').attr('selected', 'selected'); alert("val off");}else{$("#showclosedadsselectswitch").val('on').attr('selected', 'selected'); alert("val on");}
	// if(adhideclosed==''){ $('#showclosedadsselectswitch option[value="on"]').prop('selected', 'selected'); alert("val on");}else{ $('#showclosedadsselectswitch option[value="off"]').prop('selected', 'selected'); alert("val off");}
	// if(adhideclosed==''){ $('#showclosedadsselectswitch').prop('selected', false).filter('[value="on"]').prop('selected', true); alert("val on");}else{ $('#showclosedadsselectswitch').prop('selected', false).filter('[value="off"]').prop('selected', true); alert("val off");}
	//if(adhideclosed==''){ $('#showclosedadsselectswitch').flipswitch("enable").flipswitch("refresh"); alert("val on"); }else{ $('#showclosedadsselectswitch').flipswitch("disable").flipswitch("refresh");  alert("val off");}
	// if(adhideclosed==''){ $('#showclosedadsselectswitch').val("on").flipswitch("refresh"); alert("val on"); }else{ $('#showclosedadsselectswitch').val("off").flipswitch("refresh");  alert("val off");}  <-- Denna fungerar men kör också onChange och det vill jag inte.
	// if(adhideclosed==''){ $('#showclosedadsselectswitch').prop('selected', false).filter('[value="on"]').prop('selected', true).flipswitch("refresh"); alert("val on"); }else{ $('#showclosedadsselectswitch').prop('selected', false).filter('[value="off"]').prop('selected', true).flipswitch("refresh");  alert("val off");}
	// if(adhideclosed==''){ $('#showclosedadsselectswitch').off("change").val("on").flipswitch("refresh").on("change", flipChanged); alert("val on"); }else{ $('#showclosedadsselectswitch').off("change").val("off").flipswitch("refresh").on("change", flipChanged); alert("val off");}
	// $('#showclosedadsselectswitch').flipswitch("disable");
	// if(adhideclosed==''){ $('#showclosedadsselectswitch').val("on").flipswitch("refresh"); alert("val on"); }else{ $('#showclosedadsselectswitch').val("off"); alert("val off");}
	// $('#showclosedadsselectswitch').flipswitch("enable");
	// if(adhideclosed==''){ $('#showclosedadsselectswitch').flipswitch( "option", "disabled",true); alert("val on"); }else{ $('#showclosedadsselectswitch').flipswitch( "option", "disabled",false); alert("val off");}

});  // - end of pageshow - home
    	


$(document).on('pageshow', '#pageskickamail', function (event) {
	if(dwgempty(useremail)){
		$("#pageskickamailsubmit").attr("disabled", "disabled");
		dwgalert($.t("home.msg_please_first_register3")); //"Vänligen fyll först i din email i din profil (knappen 'Min profil') innan du svarar på annonser.");
		// jQuery.mobile.navigate("#mittkonto");
		$.mobile.pageContainer.pagecontainer( "change", "#mittkonto",{ allowSamePageTransition: true });
	}else{
		$("#pageskickamailsubject").text('Svar på: '+skickamailrubrik);
		document.getElementById('skickamailid').value =			skickamailid;
		document.getElementById('skickamailmailstamp').value = 		skickamailstamp;
		$("#pageskickamailsubmit").removeAttr("disabled");
		setTimeout( function() { $('#skickamailbody').focus().select(); },1500);
	}
});

// $(document).on('pageshow', '#pageview', function (event) {
		// // pushurlhist();
// });

// $( document ).on( "pageinit", function( event ) {   
	// // Nej, Denna rocka inte bra med Navbar som ibland åkte ner pga av detta. Provar pluginen istället! :)
	// // //  if (navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)) {  // See more here: http://blog.cornbeast.com/2013/10/fixing-the-transparent-ios7-status-bar-for-phonegap-and-jquery-mobile/
	// // if(navigator.userAgent.match(/(iPad.*|iPhone.*|iPod.*);.*CPU.*OS 7_\d/i)){
		// // $("body").addClass("ios7");
		// // $('body').append('<div id="ios7statusbar"/>');
	// // }

// });

$(document).ready(function () {   // <--- Denna sker bara en gång <) pageshow-sida sker varje klick på en navbar och den sidan visas.
	setTimeout(function() { navigator.splashscreen.hide(); },1200);  // But we must first disable autohide in config.xml

	
	
	// StatusBar.backgroundColorByHexString("#FFFFFF");


	// alert("docready");
	// $("#annonser").html("<b> Hello World 3</b>"); // to make the font bold
	// $('#externalpanel').blurjs({     Dödade hela appen. Uppenbarligen är rörelse o blur ingen bra kombo så vi hoppar över detta för kompabilitetsprio.
	// 	source: 'body',
	//	radius: 5
	// });
	// $('#testdwg').blurjs({
	//	source: 'body',
	//	radius: 10
	// });			    Funkar hyggligt!
	
	// Sätt lite språkspecifika egenskaper: - Nej vi sätter dessa rätt i diven istället så slipper vi fundera på rätt tillfälle
	// iscrollwrapit.options.pullDownResetText = "Dra ner för att uppdatera...";
	// iscrollwrapit.options.pullDownPulledText = "Släpp för att uppdatera...";
	// iscrollwrapit.options.pullDownLoadingText = "Uppdaterar...";
	// iscrollwrapit.iscrollview("option", {"pullDownResetText":"Dra ner för att uppdatera...","pullDownPulledText":"Släpp för att uppdatera...","pullDownLoadingText":"Uppdaterar..."});
	

	// if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
		// $('.ui-page').css({margin-top: 20px
	// }

	
	//$("#rubrikwidth").width(containerWidth - 100);
	$("#laggtilldivhiddenuntilphoto").hide(); 	// Göm läggtill-submit diven tills man tagit ett kort.
	$("#laggtilldivwhendone").hide();			// Samt läggtill-klar diven!
	$("#laggtillonskasdivwhendone").hide();			// Samt läggtill-klar önskas diven!

	// $('#laggtillklarbtn').prop('disabled', true);  // Sätt även Submit/Klar btn initialt att vara disabled. Inte längre...
	
	
	// LAZY LOAD av thumbnails i listan av varor
	// $("img").unveil();
	
	// Satte viewAds2 i on pageshow-#home men då laddades annonserna om varje gång man klickade knappen. Vill nog inte ha det. Refresh skall ha ett syfte.
	// oldprofile = storageReadData("usernamn");
	// if(!dwgempty(oldprofile)){
		// setTimeout( function () { onetimeconverttowebdata(); }, 3000);  // ONCE WE UPGRADE THEN DELETE LOCAL STORAGE VALUE usernamn
	// }
	loaduserwebdata();  // Vi hämtar från webben direkt (och försöker var 3e sek x 3 om error)
	setTimeout(function () { viewAds2(''); },1700); 
	
	// LOADUSERDATA laddar det lokala data som behövs för att hämta webuserdata (email+deviceuuid)
	setTimeout(function () { loaduserdata(); },800); // För att ge mer responskänsla i navbar
	
	// GETCONFIG hämtar maxlat, minpostnr, visaort etc från GLOBAL CONFIG
	setTimeout(function () { getconfig(); },350); // För att ge mer responskänsla i navbar
	setTimeout(function () { getKategorier(); },1300); // Hämta alla kategorier som skall visas i Lägg till selecten endast en gång vid uppstart. Då den är statisk. För att ge mer responskänsla i navbar
	
				

});   


// Visa på karta från Panel View Ad:
function visaPaKartaPage(dwgtmplat5,dwgtmplong5){
	visapakartalat = dwgtmplat5;
	visapakartalong = dwgtmplong5;
}

$(document).on('pageshow', '#pagevisapakarta', function (event) {
	// titleheight = document.getElementById('gmapfooter').style.height;
	var pagevisapakartacontentheight = screen.height;
	// if(device.version=='4.2' || device.version=='4.2.2' || device.version=='4.3'){pagevisapakartacontentheight=(pagevisapakartacontentheight/2)+120;} // Ytterligare en 4.2.2 specialare: http://stackoverflow.com/questions/22724567/how-to-deal-with-width-inconsistency-between-android-4-0-4-3-and-4-4-on-cordova
	if(device.platform='Android'){pagevisapakartacontentheight=$(window).height();}
	// gmapheight = screen.height - footerHeight;
	pagevisapakartacontentheight = pagevisapakartacontentheight + "px";
	$('#pagevisapakartacontent').css({height: pagevisapakartacontentheight}); 

	var dwggmapoptions57 = {
		zoom: 12,
		center: new google.maps.LatLng(visapakartalat,visapakartalong),
		scrollwheel: false,
		disableDoubleClickZoom: true,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: true,
		overviewMapControl: false,
		// navigationControlOptions: {	style: google.maps.NavigationControlStyle.SMALL	},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	dwgmapid57 = new google.maps.Map(document.getElementById("pagevisapakartacontent"), dwggmapoptions57);
	dwgMapPinNormal57 = {
		url: 'img/gmap_marker_unselected.png',
		size: new google.maps.Size(32, 32),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(16, 32)
	};
	var dwgmarker79 = new google.maps.Marker({
		position: new google.maps.LatLng(visapakartalat,visapakartalong),
		map: dwgmapid57,
		icon: dwgMapPinNormal57		
		// content: pinannonsid
	});
});


var dwgdevice='No info...';
// Wait for Cordova to load
// http://docs.phonegap.com/en/3.1.0/cordova_events_events.md.html#deviceready
// function onLoad() {
	// document.addEventListener("deviceready", onDeviceReady, false);
// }
document.addEventListener("deviceready", onDeviceReady);
// $(document).on("deviceready", function () {
	// onDeviceReady();
	// alert("deviceready");
	// var success = function(status) {
		// alert('Message: ' + status);
	// }
	// var error = function(status) {
		// alert('Error: ' + status);
	// }
	// window.cache.clear( success, error );
// }

function onDeviceReady() {
	// CLEAR THE WEBVIEW CACHE!
	// http://stackoverflow.com/questions/30358408/phonegap-disable-caching
	// https://github.com/moderna/cordova-plugin-cache
	var success = function(status) {
		// alert('Message: ' + status);
	}
	var error = function(status) {
		// alert('Error: ' + status);
	}
	window.cache.clear( success, error );

	
	
	getlatlong();
	// devinfo= 'Device Cordova: '  + device.cordova + '<br />' + 
				// 'Device Platform: ' + device.platform + '<br />' + 
				// 'Device UUID: '     + device.uuid     + '<br />' + 
				// 'Device Model: '    + device.model     + '<br />' + 
				// 'Device Version: '  + device.version  + '<br />';
	devinfo= ' ('  + device.cordova + ')<br />' + 
				'OS: ' + device.platform + ' ' + device.version  + '<br />' +
				'Telephone: '    + device.model     + '<br />' + 
				'UUID: '     + device.uuid     + '<br />';
	// Dessa kan först börja lyssnas här enligt: http://docs.phonegap.com/en/3.4.0/cordova_events_events.md.html#menubutton
	
	aboutus_appver='<p style="color: silver !important; font-size:10px !important;">App version: '+appver+' '+devinfo+'</p>';

	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);  // Från mina Android-användare har det efterfrågats en möjlighet att stänga appen via menyn.
	
	// for performance boosting
	$.mobile.autoInitializePage = false;
	// $.mobile.defaultPageTransition = 'slide'; // Skitfräckt och stiligt när alla pages slidear höger (och history.back automatiskt åt motsatt håll). Men tyvärr för långsamt gensvar på knappar när detta är på. (swipe)
	$.mobile.defaultPageTransition = 'none';
	$.mobile.touchOverflowEnabled = false;
	$.mobile.defaultDialogTransition = 'none';
	
	// 2015-04-08 FIX FÖR iPHONE6   --- Vi gör detta i pagecreate istället.
	// I iPhone6 har allt innehåll krympt och texten är knappt läsbar.
	// if(device.platform=="iOS") {
		// //set viewportScale
		// // 7.1: iPhone 6 Plus
		// // 7.2: iPhone 6 
		// models={'iPhone7,1':'1.2', 'iPhone7,2':'1.2'};
		// if(device.model in models) {
			// // $('#viewport').attr('content', 'user-scalable=no, initial-scale='+models[device.model]+', minimum-scale='+models[device.model]+', maximum-scale='+models[device.model]+', width=device-width');
			// // $('head').append('<meta name="viewport" content="user-scalable=no, initial-scale=1.2, minimum-scale=1.2, maximum-scale=1.2, width=device-width">');
			// $('head').append('<meta name="viewport" content="user-scalable=no, initial-scale='+models[device.model]+', minimum-scale='+models[device.model]+', maximum-scale='+models[device.model]+', width=device-width">');
		// }
	// }

	// Also load the user data for mittkonto_storedata.js
	// loaduserdata();
}

function onPause() {
    // Handle the pause event
}
function onResume() {
    // Handle the resume event
	setTimeout( function() { AutoUpdateIfOldData(); },2000); // Just i onResume ser det ut att behövas massa mer tid innan update of annonser.
}
function onMenuKeyDown(){
	dwgconfirm("Would you like to close this app?","Bortskänkes.se","",closeAppNow);
}
function AutoUpdateIfOldData(){
	var tmpdate=new Date();
	var currentTimeInMs=tmpdate.getTime(); // Get it in Ms
	var timeDiffSinceLastUpdate=currentTimeInMs-lastViewAdsUpdate;
	if(timeDiffSinceLastUpdate>1000*60*60*1){  // Om mer än en timma sedan
		// jQuery.mobile.navigate("#home");
		$.mobile.pageContainer.pagecontainer( "change", "#home",{ allowSamePageTransition: true });
		// setTimeout( function() { viewAds2(); },500);
		setTimeout( function() { window.location.reload(true); },500);  // Då tidigare inte fungerade provar vi detta. PS. "true" betyder töm cache.  <)
	}
}
function closeAppNow(buttonIndex){
	// Alternativ till detta är att det stängs när man backar förbi alla annonser... men jag vill nog inte det: http://stackoverflow.com/questions/8602722/phonegap-android-back-button-close-app-with-back-button-on-homepage
	if(buttonIndex === 1){
		navigator.app.exitApp();
	}
	$(".blur-filter").removeClass("blur-filter"); // Oavsett måste denna släckas.
}



$(document).on("iscroll_init", function() {
	$.mobile.iscrollview.prototype.options.refreshDelay = 400;
});




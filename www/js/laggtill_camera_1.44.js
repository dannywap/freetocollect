    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
	// Och annonsvariablarna:
	var annonseditid;
	var annonscode1;
	var annonscode2;
	var annonsrubrik;
	var annonsbeskrivning;
	var annonskategori;
	var annonstyp;
	var annonskommun;
	var annonsnamn;
	var annonsemail;
	var annonstelefon;
	var annonsmobil;
	var annonspostnr;
	var annonslat;
	var annonslong;
	var annonspayid;
	var picRotation=0;
	
	var typevalidationmsg=0;
	var animalvalidationmsg=0;
	var onskeannonsermsg=0;

	// var autoSelCategory= array(
			// "soff":3100,
			// "bord":3100,
			// "skåp":3100,
			// "hylla":3100,
			// "stol":3100,
			// "säng":3100,
			// "fåtö":3100,
			// "möbl":3100,	
			// "tv ":2100,
			// "tv.":2100,
			// "tum":2100,
			// "video":2100,
			// "dvd":2100,
			// "kisse":6090,
			// "katt":6090,
			// "cykel": 1100,
			// "moped": 1100,
			// "piano": 4200,
			// "orgel": 4200);
	// var autoSelCategory= array("soff":3100,"bord":3100,"skåp":3100,"hylla":3100,"stol":3100,"säng":3100,"fåtö":3100,"möbl":3100,"tv ":2100,"tv.":2100,"tum":2100,"video":2100,"dvd":2100,"kisse":6090,"katt":6090,"cykel": 1100,"moped": 1100,"piano": 4200,"orgel": 4200);
	// var autoSelCategory= array("soff":"3100","bord":"3100","skåp":"3100","hylla":"3100","stol":"3100","säng":"3100","fåtö":"3100","möbl":"3100","tv ":"2100","tv.":"2100","tum":"2100","video":"2100","dvd":"2100","kisse":"6090","katt":"6090","cykel":"1100","moped":"1100","piano":"4200","orgel":"4200");
	// var autoSelCategory= {"soff":3100,"bord":3100,"skåp":3100,"hylla":3100,"stol":3100,"säng":3100,"fåtö":3100,"möbl":3100,"tv ":2100,"tv.":2100,"tum":2100,"video":2100,"dvd":2100,"kisse":6090,"katt":6090,"cykel": 1100,"moped": 1100,"piano": 4200,"orgel": 4200};
	

	
	function getKategorier(){
		// $("#dwglaggtillkategorier").attr('data-native-menu',true);

		var katSelect = document.getElementById('dwglaggtillkategorier');
		// $("#dwglaggtillkategorier").selectmenu("destroy").empty(); // destory it - NECESSARY TO EMPTY IT WHEN IT IS A SELECT WITH data-native-menu="false"
		$("#dwglaggtillkategorier").empty(); // .selectmenu( "refresh", true );
		katSelect.options.length = 0;

		var nocachex=dwgguid();
		
		// var kats={"j0":{"id":1000,"huvudkategori":"Vehicles","kategori":""},"j1":{"id":1100,"huvudkategori":"Vehicles","kategori":"Motors and cycles"},"2":{"id":1200,"huvudkategori":"Vehicles","kategori":"Cars"},"3":{"id":1300,"huvudkategori":"Vehicles","kategori":"Boats"},"4":{"id":1400,"huvudkategori":"Vehicles","kategori":"Parts"},"5":{"id":1900,"huvudkategori":"Vehicles","kategori":"Other"},"6":{"id":2000,"huvudkategori":"Electronics","kategori":""},"7":{"id":2100,"huvudkategori":"Electronics","kategori":"TV and Video"},"8":{"id":2200,"huvudkategori":"Electronics","kategori":"Gaming consoles"},"9":{"id":2300,"huvudkategori":"Electronics","kategori":"Computers and accessories"},"10":{"id":2400,"huvudkategori":"Electronics","kategori":"Hifi and Music"},"11":{"id":2500,"huvudkategori":"Electronics","kategori":"Telephones"},"12":{"id":2900,"huvudkategori":"Electronics","kategori":"Other"},"13":{"id":3000,"huvudkategori":"Home and household","kategori":""},"14":{"id":3100,"huvudkategori":"Home and household","kategori":"Furniture"},"15":{"id":3200,"huvudkategori":"Home and household","kategori":"Appliances"},"16":{"id":3300,"huvudkategori":"Home and household","kategori":"Materials"},"17":{"id":3400,"huvudkategori":"Home and household","kategori":"Tools"},"18":{"id":3500,"huvudkategori":"Home and household","kategori":"Timber"},"19":{"id":3900,"huvudkategori":"Home and household","kategori":"Other"},"20":{"id":4000,"huvudkategori":"Sport and Leisure","kategori":""},"21":{"id":4100,"huvudkategori":"Sport and Leisure","kategori":"Sport"},"22":{"id":4200,"huvudkategori":"Sport and Leisure","kategori":"Music"},"23":{"id":4300,"huvudkategori":"Sport and Leisure","kategori":"Movie"},"24":{"id":4400,"huvudkategori":"Sport and Leisure","kategori":"Books"},"25":{"id":4500,"huvudkategori":"Sport and Leisure","kategori":"Games"},"26":{"id":4600,"huvudkategori":"Sport and Leisure","kategori":"Collectables"},"27":{"id":4900,"huvudkategori":"Sport and Leisure","kategori":"Other"},"28":{"id":5000,"huvudkategori":"Clothing and toys","kategori":""},"29":{"id":5100,"huvudkategori":"Clothing and toys","kategori":"Manswear"},"30":{"id":5200,"huvudkategori":"Clothing and toys","kategori":"Ladieswear"},"31":{"id":5300,"huvudkategori":"Clothing and toys","kategori":"Children\u00b4s wear"},"32":{"id":5400,"huvudkategori":"Clothing and toys","kategori":"Toys and children\u00b4s product"},"33":{"id":5900,"huvudkategori":"Clothing and toys","kategori":"Other"},"34":{"id":6000,"huvudkategori":"Animals and Accessories","kategori":""},"35":{"id":6010,"huvudkategori":"Animals and Accessories","kategori":"Fishes"},"36":{"id":6020,"huvudkategori":"Animals and Accessories","kategori":"Birds"},"37":{"id":6030,"huvudkategori":"Animals and Accessories","kategori":"Rodents"},"38":{"id":6040,"huvudkategori":"Animals and Accessories","kategori":"Dogs"},"39":{"id":6050,"huvudkategori":"Animals and Accessories","kategori":"Horses"},"40":{"id":6060,"huvudkategori":"Animals and Accessories","kategori":"Ferrets"},"41":{"id":6070,"huvudkategori":"Animals and Accessories","kategori":"Insects"},"42":{"id":6080,"huvudkategori":"Animals and Accessories","kategori":"Rabbits"},"43":{"id":6090,"huvudkategori":"Animals and Accessories","kategori":"Cats"},"44":{"id":6100,"huvudkategori":"Animals and Accessories","kategori":"Cavy"},"45":{"id":6110,"huvudkategori":"Animals and Accessories","kategori":"Reptiles"},"46":{"id":6120,"huvudkategori":"Animals and Accessories","kategori":"Pigs"},"47":{"id":6900,"huvudkategori":"Animals and Accessories","kategori":"Other"}};
		// alert(kats.j1.kategori);
		// for(var key in kats) {
			// if (kats.hasOwnProperty(key)) {
				// alert("11 första id: "+kats[key].id);
			// }
		// };

		$.ajax({
			type: "GET",
			dataType: "json",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
			//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
			url: weburl+"/include/get_kategori_ajax.php?nocachex="+nocachex,
			success: function (data) {

				// alert("json:"+ data);
				var opt = document.createElement('option');
				opt.disabled = true;
				opt.selected = true;
				opt.value = 0;
				opt.innerHTML = $.t("add.2bvaljkategori");
				// katSelect.empty().appendChild(opt);
				// $("#dwglaggtillkategorier").append(opt);
				var opt2 = '<option value="0">'+$.t("add.2bvaljkategori")+'</option>';
				
				for(var key in data) {
					// if (data.hasOwnProperty(key)) {
						// alert("första id: "+data[key].id); // Eftersom vi har keys som endast är siffror ("0":{,,} etc) så måste det anropas så här data[key].id istället för key.id
					// }
					if(data[key].kategori==''){ // Om kategori är tomt har vi en huvudkategori
						var opt = document.createElement('option');
						opt.disabled = true;  // Huvudkategorier skall inte gå att välja
						opt.value = data[key].id;
						opt.innerHTML = data[key].huvudkategori + ":";
						//katSelect.appendChild(opt);
						// $("#dwglaggtillkategorier").append(opt);
						opt2 = opt2+'<option  disabled="disabled" value="'+ data[key].id +'">'+data[key].huvudkategori + ':' + '</option>';
					}else{
						var opt = document.createElement('option');
						opt.disabled = false; // Man skall kunna välja dessa
						opt.value = data[key].id;
						opt.innerHTML = data[key].kategori;
						// katSelect.appendChild(opt);
						// $("#dwglaggtillkategorier").append(opt);
						opt2 = opt2+'<option value="'+ data[key].id +'">'+data[key].kategori + '</option>';
					}
					// // for (var key in setOfKategori) {
						// // if(laggtSubject.indexOf(key)>-1){ $('#dwglaggtillkategorier').val(autoselcategory[key]).selectmenu('refresh'); }
						// // katSelect
					// // }

				};

				// var lanen=data.split('|');
				// for (i=1; i<lanen.length; i++) {
					// var id_lan=lanen[i].split(';'); // We send values as |23;Goteborg|24;Stockholm|...etc
					// var opt = document.createElement('option');
					// opt.value = id_lan[0];
					// opt.innerHTML = id_lan[1];
					// katSelect.appendChild(opt);
				// }
				// katSelect.appendChild(opt2);
				// $("#dwglaggtillkategorier").attr('data-native-menu',false);

				$("#dwglaggtillkategorier").append(opt2).selectmenu('refresh', true);
				// $('#dwglaggtillkategorier').selectmenu('refresh', true);
				// $(currentPage).trigger('create');
				// setTimeout(function(){ $("#laggtill").trigger("create").trigger("refresh"); },1600); // .selectmenu('refresh', true);;
				// $('#dwglaggtillkategorier').selectmenu('refresh', true);
			}, // --end success
			error: function (jqXHR, textStatus, errorThrown) {
			} // --end error
		});
	}
	
	

	// Rotate the photo  - Används inte nu men släng inte då denna funktion är mycket snygg och fungerar. 
	function rotatePhoto90deg(){
		picRotation=picRotation+90;
		if(picRotation==360){picRotation=0;}
		var degree=picRotation;
		var img = document.getElementById('dwgImage'); 
		var imgframe = document.getElementById('laggtillfotoram');
		var width = img.clientWidth;		// Den visade bildens storlek - MYCKET ANVÄNDBART KOMMANDO
		var height = img.clientHeight;		// Den visade bildens storlek - MYCKET ANVÄNDBART KOMMANDO
		$("#dwgImage").css({
			'-moz-transform': 'rotate('+degree+'deg)',
			'-webkit-transform': 'rotate('+degree+'deg)',
			'-o-transform': 'rotate('+degree+'deg)',
			'transform': 'rotate('+degree+'deg)'
			});
		switch(degree){
		case 90:
			// $("#laggtillfotoram").css({'width':height+'px'});
			$("#laggtillfotoram").css({'height':width+'px'});
		  break;
		case 270:
			// $("#laggtillfotoram").css({'width':height+'px'});
			$("#laggtillfotoram").css({'height':width+'px'});
		  break;
		case 180:
			$("#laggtillfotoram").css({'height':height+'px'});
		  break;
		case 0:
			$("#laggtillfotoram").css({'height':height+'px'});
		  break;
		}
		
		// $( "#laggtillfotoram" ).trigger("create");
		$( "#laggtillfotoram" ).trigger("refresh");

		//  Rotate image
		// canvas.setAttribute('width', cw);
		// canvas.setAttribute('height', ch);
		// cContext.rotate(degree * Math.PI / 180);
		// cContext.drawImage(img, cx, cy);
		
		// screenwidth=$(window).width();
		// screenwidth=screenwidth-4;
		// $("#dwgImage").css({'width':screenwidth + 'px'});
		// $("#dwgImage").focus();
		// document.getElementById('laggtillfotoram').html=document.getElementById('laggtillfotoram').html+'<br>hejsannnkk jsjks js jksj ksj jsj skjsj skjsj sjs kj<br>';
		
		// var element2 = document.getElementById('laggtilldivhiddenuntilphoto')
		// var n = document.createTextNode(' ');
		// var disp = element2.style.display;  // don't worry about previous display style
		// element2.appendChild(n);
		// element2.style.display = 'none';
		// setTimeout(function(){
			// element2.style.display = disp;
			// n.parentNode.removeChild(n);
		// },2000); // you can play with this timeout to make it as short as possible
		
		
		// $("#dwgImage").rotate(90);
		// $("#dwgImage").trigger("create");
		// setTimeout( function() { $("#dwgImage").trigger("refresh"); },1000);
		$("#laggtill").enhanceWithin(); // Det ser ganska knäppt ut annars
		// $("#laggtilldivhiddenuntilphoto").trigger("refresh"); // Det ser ganska knäppt ut annars
		// $("#laggtillfotoram").trigger("create");
		// $("#laggtillfotoram").trigger("refresh");
		// $("#laggtill").trigger("create");
		// $("#laggtill").trigger("refresh");
		// $(window).trigger("throttledresize");
		// $.mobile.refresh();
		// dwgalert("hej");
	}
	
	
    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);

      // Get image handle
      //
      // var smallImage = document.getElementById('smallImage'); 
      // Unhide image elements
      // smallImage.style.display = 'block';
      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      // smallImage.src = "data:image/jpeg;base64," + imageData;
	  	var dwgImage = document.getElementById('dwgImage');
		dwgImage.style.display = 'block';
		// dwgImage.src = "data:image/jpeg;base64," + imageData;
		var nocachex=dwgguid();
		dwgImage.src = imageData + '?cachx='+nocachex; // Kanske kan lösa problemet med att när man tar flera foton i rad så visar den förra fotot trots camera.CleanUp().
		$("#laggtilldivfirstbuttons").hide();
		$("#laggtilldivhiddenuntilphoto").show();
		$('#laggtillresetbtn').closest('.ui-btn').show();
		getlatlong();
    }


    // A button will call this function
    //  https://github.com/apache/cordova-plugin-camera/blob/master/doc/index.md
    function getPhoto(source) {
		picRotation=0;
		navigator.camera.cleanup();
      // Retrieve image file location from specified source
		// navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 90,
		// destinationType: Camera.DestinationType.FILE_URI,
		// sourceType:	source }); Detta gick inge vidare.
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80, allowEdit: false,
		destinationType: navigator.camera.DestinationType.FILE_URI,		// NOTE: Photo resolution on newer devices is quite good. Photos selected from the device's gallery are not downscaled to a lower quality, even if a quality parameter is specified. To avoid common memory problems, set Camera.destinationType to FILE_URI rather than DATA_URL.
		sourceType:	source, 
		targetWidth: 1280,
		targetHeight: 1280,
		correctOrientation: true }); 
	}

    // Called if something bad happens.
    //
    function onFail(message) {
		// alert('Foto misslyckades. Felmed: ' + message);   <-- Ibland väljer användaren att skita i att ta kortet (Cancel) det bör inte ge ett synligt fel då han ändå inte kommer vidare.
    }

	
// While typing check some stuff....
	function onChangeCheckLaggTill(autoselect){
		laggtSubject=document.getElementById('dwgrubrik').value.toLowerCase();
		laggtDetails=document.getElementById('dwgbeskrivning').value.toLowerCase();
		// categorySelection=document.getElementById('dwglaggtillkategorier').value();
		categorySelection=$('#dwglaggtillkategorier').val();
		
		// Autoselect kategori
		// if(autoselectcategory==true){
			// if(laggtSubject.indexOf("soff")>-1 ||  laggtSubject.indexOf("bord")>-1 || laggtSubject.indexOf("skåp")>-1 || laggtSubject.indexOf("hylla")>-1 || laggtSubject.indexOf("stol")>-1 || laggtSubject.indexOf("säng")>-1 || laggtSubject.indexOf("fåtö")>-1 || laggtSubject.indexOf("möbl")>-1){ $('#dwglaggtillkategorier').val(3100).selectmenu('refresh'); }
			// else if(laggtSubject.indexOf("tv ")>-1 ||  laggtSubject.indexOf("tv.")>-1 || laggtSubject.indexOf("tum")>-1 || laggtSubject.indexOf("video")>-1 || laggtSubject.indexOf("dvd")>-1){ $('#dwglaggtillkategorier').val(2100).selectmenu('refresh'); }			
			// else if(laggtSubject.indexOf("kisse")>-1 ||  laggtSubject.indexOf("katt")>-1){ $('#dwglaggtillkategorier').val(6090).selectmenu('refresh'); }			
			// else if(laggtSubject.indexOf("cykel")>-1 ||  laggtSubject.indexOf("moped")>-1){ $('#dwglaggtillkategorier').val(1100).selectmenu('refresh'); }			
			// else if(laggtSubject.indexOf("piano")>-1 ||  laggtSubject.indexOf("orgel")>-1){ $('#dwglaggtillkategorier').val(4200).selectmenu('refresh'); }			
			// else if(laggtSubject.indexOf("kyl")>-1 ||  laggtSubject.indexOf("frys")>-1 ||  laggtSubject.indexOf("maskin")>-1 ||  laggtSubject.indexOf("tvätt")>-1 ||  laggtSubject.indexOf("kök")>-1){ $('#dwglaggtillkategorier').val(3200).selectmenu('refresh'); }			
		// }
		
		// for (var i = 0; i < autoSelCategory.length; i++) {
		if(autoselect==true){
			for (var key in autoselcategory) {
				if(laggtSubject.indexOf(key)>-1){ $('#dwglaggtillkategorier').val(autoselcategory[key]).selectmenu('refresh'); }
			}
		}
		
		if(laggtSubject.length > 3 && laggtDetails.length > 8 && categorySelection>1){
			$('#laggtillklarbtn').prop('disabled', false);
		}else{
			// $('#laggtillklarbtn').prop('disabled', true); <-- Blir kanske för mycket tjöt. Vi checkar ändå innan vi skickar tycker jag.
		}
	}

	// When done typing rubrik or details check if we are selling or wishing etc...
	function typevalidation(){
		// dwgalert("blurred");
		var laggtSubject=document.getElementById('dwgrubrik').value.toLowerCase();
		var laggtDetails=document.getElementById('dwgbeskrivning').value.toLowerCase();
		var annonstypselectswitchval = $("#annonstypselectswitch").val();
		
		// if((laggtSubject.indexOf('önska') > -1 || laggtSubject.indexOf('söke') > -1 || laggtDetails.indexOf('önska') > -1 || laggtDetails.indexOf('söke') > -1) && document.getElementById('laggtillannonstyp').value==1 && typevalidationmsg==0){
		if((laggtSubject.indexOf("önska")>-1 || laggtSubject.indexOf("söke")>-1 || laggtDetails.indexOf("önska")>-1 || laggtDetails.indexOf("söke")>-1) && annonstypselectswitchval==1 && typevalidationmsg==0){
			// alert('Notera om din annons avser att önska sig något måste du också välja det som "Annonstyp" annars riskerar du banning från Bortskänkes.se.');
			dwgalert($.t("add.msg_observe_choose_correct_type")); //'Observera: Om din annons avser att önska sig något väljer du "önskas" iställes för "skänkes" bredvid rubriken. Mvh Bortskänkes.');
			typevalidationmsg=1;
			// laggtillannonstyp.focus();
		}
		// if((laggtSubject.indexOf('till salu') > -1 || laggtSubject.indexOf('säljes') > -1 || laggtSubject.indexOf('pris') > -1 || laggtSubject.indexOf('köpa') > -1 || laggtSubject.indexOf('billig') > -1 || laggtDetails.indexOf('till salu') > -1 || laggtDetails.indexOf('säljes') > -1 || laggtDetails.indexOf('pris') > -1 || laggtDetails.indexOf('köpa') > -1 || laggtDetails.indexOf('billig') > -1) && kategori.value<6000 && animalvalidationmsg==0){
		if((laggtSubject.indexOf('till salu') > -1 || laggtSubject.indexOf('säljes') > -1 || laggtSubject.indexOf('pris') > -1 || laggtSubject.indexOf('köpa') > -1 || laggtSubject.indexOf('billig') > -1 || laggtDetails.indexOf('till salu') > -1 || laggtDetails.indexOf('säljes') > -1 || laggtDetails.indexOf('pris') > -1 || laggtDetails.indexOf('köpa') > -1 || laggtDetails.indexOf('billig') > -1) && animalvalidationmsg==0){
			dwgalert($.t("add.msg_note_only_allowed_sell_animals")); //'Notera att endast Djurannonser skall ha symboliska priser. Allt annat gods skall skänkas kostnadsfritt på Bortskänkes.se.');
			animalvalidationmsg=1;
		}
	}
	// $('#dwgrubrik').blur(typevalidation());
	// $('#dwgbeskrivning').blur(typevalidation());
	
	// var testtext1="x "+"kölksökdlkslkjlkj";
	// var skjs323=testtext1.match(/ /g).length / testtext1.length;
	// var passingeywuyu=(testtext1.match(/ /g).length / testtext1.length)>0.05;
	// alert(skjs323+" dkdjk antal space:"+testtext1.match(/ /g).length +" Denna passerade vår 0.05 gräns:"+passingeywuyu);	

	
	function annonstypflipped(){
	// SHOW A ONETIME MESSAGE ABOUT ÖNSKAS ANNONSER:
		if(onskeannonsermsg==0){
			onskeannonsermsg=1;
			setTimeout( function() {  // Ge den en liten stund så man ser knappen visa "önskas" innan vi poppar upp meddelandet.
					dwgalert($.t("add.msg_type1_is_free_type2_costs")); //'Skänka är gratis, att önska något kostar 25:- SEK. All sponsring är mycket uppskattad. Mvh Bortskänkes.se');	
			},600);
		}
	}
	
	
	
// SKICKA ANNONSEN ------------------------------------------------------------------------------------	
	function laggtillUploadAnnons() {
		// alert("laggtillUploadAnnons");
		var isuserregistered=userisregistered();
		if(isuserregistered == true){
			// alert("isuserregistered = yes");

			laggtSubject=document.getElementById('dwgrubrik').value;
			laggtDetails=document.getElementById('dwgbeskrivning').value;
			categorySelection=$('#dwglaggtillkategorier').val();
			
			var testtext17="x "+laggtDetails;
			var passedthespacetest=(testtext17.match(/ /g).length / testtext17.length)>0.05; // Var tjugonde bokstav är ett mellanslag
			
			if(laggtSubject.length == 0){
				dwgalert($.t("add.msg_all_ads_must_have_title")); //"Alla annonser måste börja med en rubrik!");
				$( "#dwgrubrik" ).focus();
			}else if(laggtSubject.length < 4){
				dwgalert($.t("add.msg_work_on_title")); //"Jobba lite mer på rubriken först...");
				$( "#dwgrubrik" ).focus();
			}else if(laggtDetails.length == 0){
				dwgalert($.t("add.msg_description_more_details")); //"Beskriv gärna ditt gods med lite detaljer också...");
				$( "#dwgbeskrivning" ).focus();
			}else if(laggtDetails.length < 21){
				dwgalert($.t("add.msg_description_too_few_chars")); //"Jag ser att du försökt... men fyll gärna ut beskrivningen med lite fler ord.");
				$( "#dwgbeskrivning" ).focus();
			}else if(!passedthespacetest){  // DENNA MÅSTE TILL FÖR ATT HINDRA ANNONSER MED BARA URL SOM SCAMHAMMER ANNARS PLOCKAR (var 15e bokstav är ett mellanrum.
				dwgalert($.t("add.msg_description_more_words")); //"Försök fylla ut beskrivningen med lite mer ord.");
			}else if(laggtDetails.length > 1500){
				dwgalert($.t("add.msg_description_too_many_chars")); //"Wow! Du är mycket ambitiös. Tyvärr är vi nog tvungna att be dig korta ner det hela bara liite granna.");
				$( "#dwgbeskrivning" ).focus();
			}else if(categorySelection<2 || dwgempty(categorySelection)){
				dwgalert($.t("add.msg_choose_a_category")); //"Välj också en passande kategori innar du postar din annons.");
			}else if(laggtSubject.length > 3 && laggtDetails.length > 20 && categorySelection>1){
				// alert("Vi skickar...");
				// laggtillUploadPhoto();
				firstGetAnnonsEditIdAndCode();
			}else{
				dwgalert($.t("add.msg_choose_a_category2")); //"Välj också en passande kategori för din annons.");
			}
		}else{
			dwgalert($.t("add.msg_please_first_register4")); //"Din profil verkar inte vara komplett. Vänligen kontrollera email och postnr under knappen 'Min profil/Mina uppgifter' (både email och postnr).");
		}
	}
	function firstGetAnnonsEditIdAndCode(){
		// alert("getting an id");
		// laggtill_uploadstatus.innerHTML = '<div style="background-color: silver !important;"><div style="width: 2% !important; height: 3px !important; background-color: #60915e !important;"> </div></div>';
		dwgurl=weburl+'/mob_'+appver+'/app_getannonsid.php';
		$.ajax({
			url        : dwgurl,
			type	   : 'GET',
			timeout	   : 3000,
			dataType   : "json",
			success    : function(dwgdata4) {
				// alert("got id; "+dwgdata4);
				annonsidcodeajax.parseJSON(dwgdata4);
				laggtillUploadPhoto(); // Gå sedan vidare till nästa steg;
			},
			error      : function() {
				dwgalert($.t("add.msg_could_not_conn4")); //'Kunde inte skapa en anslutning. Prova igen!');                  
			}
		});
		var annonsidcodeajax = {  
			parseJSON:function(resultidcode){
				$.each(resultidcode, function(i, dwgeditidcodes) {
					// alert('Each Json');
					annonseditid		= dwgeditidcodes.annonseditid;
					annonscode1			= dwgeditidcodes.code1;
					annonscode2			= dwgeditidcodes.code2;
					//  savelatlong();
				});
			}
		};	
	}
	
	function laggtillUploadPhoto() {
		// alert("laggtillUploadPhoto");
		// var server = "http://www.bortskankes.se/phonegapupload.php";
		var server = weburl+"/include/ajaxupload.php";
		server = server + "?annonseditid="+annonseditid+"&code1="+annonscode1+"&deviceuuid="+userdeviceuuid;
		var img = document.getElementById('dwgImage');
		var imageURI = img.src;
		
		var win = function (r) {
			// alert("Code = " + r.responseCode + "Response = " + r.response + "Sent = " + r.bytesSent);
			// console.log("Code = " + r.responseCode);
			// console.log("Response = " + r.response);
			// console.log("Sent = " + r.bytesSent);
			
			// laggtillUploadIsCompleted();
			if(r.response.indexOf("Uppladdningsfel")>-1){   // Om det trots lyckad uppladdning ändå gick fel på serversidan... (leta efter text i HTML texten ajaxupload skickar beroende på resultat)
				// Detta fungerar skitsnyggt!!! Men kom ihåg att det bertyder att om en mobilmodell inte kan ladda upp bilder då kommer heller aldrig nån fil att laddas upp. 
				dwgalert($.t("add.msg_conn_photoupl_lost_retry")); //'Anslutningen för fotouppladdning avbröts! Prova igen eller maila vår support om det inte löser sig.');
				laggtill_uploadstatus.innerHTML = "";
			}else{
				sendDataAfterPhoto();
			}
		};
		var fail = function (error) {
			dwgalert($.t("add.msg_conn_photoupl_canc_retry")); //'Anslutningen för fotouppladdning avbröts! Prova igen.');
			laggtill_uploadstatus.innerHTML = "";
			// alert("An error has occurred: Code = " + error.code + ", source: " + error.source + ", target: " + error.target);
			// console.log("upload error source " + error.source);
			// console.log("upload error target " + error.target);
		};
			// Specify transfer options
		var options = new FileUploadOptions();
		// options.fileKey="file";
		options.fileKey="filename";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="image/jpeg";
		options.headers = {
			Connection: "close"
		};
		options.chunkedMode = false;

		// One additional thing that is often overlooked: This section on the client js file:
		// 	options.fileKey="file";																			<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------- NOTERA DETTA!!!!
		// 	Must match this part on the server side:
		// 	$_FILES["file"]
		// Otherwise, you'll get an error that would not point to this fact. This may sound obvious for some, but it could save others an hour or two of pulling hairs.
	// ON SERVER SIDE:
	// $filename = strip_tags($_REQUEST['filename']);
	// $maxSize = strip_tags($_REQUEST['maxSize']);
	// $maxW = strip_tags($_REQUEST['maxW']);
	// $fullPath = strip_tags($_REQUEST['fullPath']);
	// $relPath = strip_tags($_REQUEST['relPath']);
	// $colorR = strip_tags($_REQUEST['colorR']);
	// $colorG = strip_tags($_REQUEST['colorG']);
	// $colorB = strip_tags($_REQUEST['colorB']);
	// $maxH = strip_tags($_REQUEST['maxH']);
	// $filesize_image = $_FILES[$filename]['size'];

		// 2015-01-17 Removed these parameters according to excel sheet bugfixes
		// var params ={};
		// params.filename ="file"; // <<- Jepp! Kan INTE vara "filename" detta ("file") är korrekt. Nu tar ajaxupload.php emot den och gör thumbnail. =)    <<< JAAAAA! Eftersom det står options.fileKey="file"; lite högre upp!!!
		// params.fullPath ="http://www.bortskankes.se/foton/";
		// params.relPath ="../foton/";
		// params.maxSize ="9999999999";
		// params.maxW ="800";
		// params.maxH ="600";
		// params.colorR ="255";
		// params.colorG ="255";
		// params.colorB ="255";
		// params.annonseditid = annonseditid;
		// params.code1 = annonscode1;
		// params.rotation = picRotation;
		// params.deviceuuid = userdeviceuuid;
		// options.params = params;
		

		var ft = new FileTransfer();
		// alert("created ft, now setting onprogress");

		ft.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
				// laggtill_uploadstatus.innerHTML = perc + "% loaded...";
				laggtill_uploadstatus.innerHTML = '<div style="background-color: silver !important;"><div style="width: ' +perc + '% !important; height: 3px !important; background-color: #60915e !important;"> </div></div>';
			} else {
				if(laggtill_uploadstatus.innerHTML == "") {
					laggtill_uploadstatus.innerHTML = "Loading";
				} else {
					laggtill_uploadstatus.innerHTML += ".";
				}
			}
		};

		ft.upload(imageURI, encodeURI(server), win, fail, options, true);	
	}
	function sendDataAfterPhoto(){
		// alert("sendDataAfterPhoto");
		dwgposlevel=0;
		if(!dwgempty(userlat)){
			dwgtmplat=userlat;
			dwgtmplong=userlong;
			dwgposlevel=2;
		}else if(!dwgempty(userwebpostnrlat)){
			dwgtmplat=userwebpostnrlat;
			dwgtmplong=userwebpostnrlong;
			dwgposlevel=3;
		}
	
	
		// annonseditid;
		// annonscode1;
		// annonscode2;
		annonsrubrik = document.getElementById('dwgrubrik').value;
		annonsbeskrivning = document.getElementById('dwgbeskrivning').value;
		annonskategori = document.getElementById('dwglaggtillkategorier').value;
		// annonstyp = 1;
		annonstyp = $("#annonstypselectswitch").val();
		annonskommun = userwebplatsid;
		annonsnamn = userwebnamn;
		annonsemail = useremail;
		annonstelefon = userwebtelefon;
		annonsmobil = userwebmobil;
		annonspostnr = userwebpostnr;
		annonslat = dwgtmplat;
		annonslong = dwgtmplong;
	
		annonsObjData = {
			annonsid: annonseditid,
			code1: annonscode1,
			code2: annonscode2,
			rubrik: annonsrubrik,
			beskrivning: annonsbeskrivning,
			kategori: annonskategori,
			typ: annonstyp,
			kommun: annonskommun,
			namn: annonsnamn,
			email: annonsemail,
			telefon: annonstelefon,
			mobil: annonsmobil,
			postnr: annonspostnr,
			latitude: annonslat,
			longitude: annonslong,
			positionlevel: dwgposlevel,
			deviceuuid: userdeviceuuid
		};

		
		// var jsonAnnonsData = JSON.stringify(annonsArrayData);
		// var formAnnonsData = {annonseditid:"1234543",code1:annonscode1,code2:annonscode2}; < -- FUNKAR!!! :)
		
		$.ajax({
			url: weburl+'/mob_'+appver+"/app_update_do.php",
			type: "POST",
			data: annonsObjData,
			dataType: "text",
			// contentType is the header sent to the server, specifying a particular format.
				// Example: I'm sending json or XML
			// dataType is you telling jQuery what kind of response to expect.
				// Expecting JSON, or XML, or HTML, etc....the default it for jQuery to try and figure it out.
			success: function(data, textStatus, jqXHR)
			{
				if(data.indexOf("Not an active user")>-1){   // Leta efter text i svarstexten.
					// Detta betyder oftast att användaren är en SCAMMER som låsts.
					dwgalert($.t("add.msg_conn_photoupl_canc_severside")); //'Anslutningen avbröts från serversidan! Prova igen eller maila vår support om det inte löser sig.');
					laggtill_uploadstatus.innerHTML = "";
				}else{
					annonspayid = data;
					laggtillUploadIsCompleted();
					// alert(data);
				}
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				dwgalert($.t("add.msg_conn_canc_try_again")); //'Anslutningen avbröts! Prova igen.');
				laggtill_uploadstatus.innerHTML = "";
			}
		});
		
	}
	
	
	
	
	
	function laggtillUploadIsCompleted() {
		annonseditid		= "";
		annonscode1			= "";
		annonscode2			= "";
		 // Visa "Annons skickad" och dölj och rensa upp de andra.
		$("#laggtilldivfirstbuttons").hide();
		$("#laggtilldivhiddenuntilphoto").hide(); 
		if(annonstyp==2){
			// OM ÖNSKAS-ANNONS SÅ TAR VI DEN PAYID VI FICK TILLBAKA FRÅN SERVERN OCH SLÄNGER UT!
			// Autofill i SMS betalningen funkar numera i iOS o Ansdroid: http://stackoverflow.com/questions/26441690/autofill-sms-message-in-phonegap-cordova-ios-and-android
			// onsktxt='<div style="width: 100% !important; text-align: center !important;">' +
					// '	<img src="img/dwg_ok.svg" style="width: 60% !important;">' +
					// '   <div style="font-size: 26px; color: green; text-align: center;">Köpkod: <b> '+annonspayid+'</b></div>' +
					// '	<p>Din annons blir synlig efter betalning:</p>' +
					// '	<p>Ring <b>0939-1190400</b> ange köpkod: <b>'+annonspayid+'</b><br>' +
					// '   <i>Samtalet kostar 25:- SEK inklusiv moms.</i></p>' +
					// '    <p>Eller sms:a "<b>bort '+annonspayid+'</b>" till <b>72550</b>.<br>' +
					// '   <i>Pris 25:-SEK ink.moms + vanlig sms-kostnad.</i></p>' +
					// '   <a onClick="callSomeoneDWg(\'09391190400\');" style="background: green !important; border: 1px solid #00B800 !important;" data-role="button" data-theme="b" data-icon="phone" data-inline="false">Ring och ange köpkod "'+annonspayid+'"</a>' +
					// '   <a onClick="smsSomeoneDWg(72550,\'bort '+annonspayid+'\');" style="background: green !important; border: 1px solid #00B800 !important;" data-role="button" data-theme="b" data-icon="edit" data-inline="false">SMSa "bort '+annonspayid+'" till 72550</a>' +
					// '	<!-- <button class=" ui-btn ui-btn-a ui-shadow ui-corner-all" data-theme="a" data-form="ui-btn-up-a" onclick="laggtillBorjaOm();"  id="laggtillborjaombtn">Lägg till en ny annons</button> -->' +
					// '</div>';
			onsktxt=$.t("add.3thanksfor2",{payid: annonspayid}); // Här hämtar vi från språkfilen och stoppar in en variabel! :) annonspayid skall ju in.
			$("#laggtillonskasdivwhendone").html(onsktxt);
			$('#laggtillonskasdivwhendone').trigger("create");
		
			$("#laggtillonskasdivwhendone").show();
		}else{
			$("#laggtilldivwhendone").show();
		}
		$('#laggtillresetbtn').closest('.ui-btn').hide();
		// laggtillBorjaOm(); så klart inte här...
		setTimeout( function() { navigator.camera.cleanup(); },600); // Rensa upp efter att allt är klart och success hunnits visats. 
	}
 
	function laggtillBorjaOm() {
		$('#laggtillresetbtn').closest('.ui-btn').hide();
		laggtillResetInputs();
		$("#laggtilldivhiddenuntilphoto").hide(); 
		$("#laggtilldivwhendone").hide();
		$("#laggtillonskasdivwhendone").hide();
		$("#laggtilldivfirstbuttons").show();
		setTimeout( function() { navigator.camera.cleanup(); },600); // Rensa upp efter att allt är klart och success hunnits visats. 
	}
	
	function laggtillResetInputs() {
		// $("#dwgImage").src=''; 
		document.getElementById('dwgImage').src='';
		document.getElementById('dwgrubrik').value='';
		document.getElementById('dwgbeskrivning').value='';
		// $('#laggtillklarbtn').prop('disabled', true);
		laggtill_uploadstatus.innerHTML = "";
		// categorySelection=document.getElementById('dwglaggtillkategorier').value();
		// $('#dwglaggtillkategorier').val('');
		$('#dwglaggtillkategorier').prop('selected', function() {
			return this.defaultSelected;
		});
		$('#dwglaggtillkategorier').prop('selectedIndex',0);
		// $('#dwglaggtillkategorier').val("");
		$('#dwglaggtillkategorier').val(0).selectmenu( "refresh" );
		$('#annonstypselectswitch').val("off").flipswitch("refresh");
		navigator.camera.cleanup();

	}
	
$(document).on('pageshow', '#laggtill', function (event) {
	// getKategorier();

	// Ofta blir bara knappen grön men man kommer inte hit. Provar att ge den lite tid att jobba.
	setTimeout(function(){
		var isuserregistered=userisregistered();
		if(isuserregistered != true) { // HAR ANVÄNDAREN INTE BUNDIT EMAIL ÄNNU. DÅ KAN HAN INTE LÄGGA TILL ANNONSER!
			// $("#laggtilldivfirstbuttons").hide();   <<  Bara jobbigt. Isåfall måste jag senare hantera kontroller för att se om div 2 show then hide div1 etc... 
			// $("#laggtilldivhiddenuntilphoto").hide(); 
			// $("#laggtilldivwhendone").hide();
			if(!userwebactivated){
				dwgalert($.t("add.msg_please_first_register5")); //"Vänligen, fyll först i kontaktuppgifter under 'Min Profil' och bekräfta din email!");
			}else if(!userwebpostnrisok){
				dwgalert($.t("add.msg_please_first_check_postal")); //"Vänligen, kontrollera att du har angivit ett korrekt POSTNR under 'Min Profil'.");
			}else{
				dwgalert($.t("add.msg_please_first_register6")); //"Vänligen, fyll först i kontaktuppgifter under 'Min Profil' eller kontakta support@bortskankes.se om du har fortsatta problem.");
			}
			jQuery.mobile.navigate("#mittkonto");
		}else{
			if($('#laggtilldivhiddenuntilphoto').is(':visible')) {
				$('#laggtillresetbtn').closest('.ui-btn').show();
			}else{
				$('#laggtillresetbtn').closest('.ui-btn').hide();
			}
			if($('#laggtilldivwhendone').is(':visible') || $('#laggtillonskasdivwhendone').is(':visible')) {
				laggtillBorjaOm();  // Om man lagt till annons och gått till annat fönster vid gröbn bock skall det vara resettat när man återvänder.
			}
			// screenwidth=$(window).width() + "px";
			// $("#laggtillfotoram").css({'height':screenwidth});	   
		}

		// var poetictextsArray = ['"En annons utan foto är likt en blomma utan dess kronblad."', '"Ack du abstrusa annons, vare ditt foto hafver tagit vägen?"', '"Ett bild säger mer än tusen annonser..."', '"En drasut föredrar fotofritt framför dvakulantism."','"Så dåven är annonsen utan faksimil av verkligheten."','"Blasfemisk blamage blir blott beskrivning bortom bjärt bild."']; 
		// Mer positiv!
		// var poetictextsArray = ['"En annons utan foto är likt en blomma utan dess kronblad."', '"Ack du abstrusa annons, vare ditt foto hafver tagit vägen?"', '"Ett bild säger mer än tusen annonser..."', '"Wow! Vad fint det är med bilder!!!."','"Så dåven är annonsen utan faksimil av verkligheten."','"Ett annonsfoto bör ha bra ljussättning."','"Tänk vad vackert ett foto förmedlar."']; 
		// var poetictextsArray = ['"En annons utan foto är likt en blomma utan dess kronblad."', '"Ack du abstrusa annons, vare ditt foto hafver tagit vägen?"', '"Ett bild säger mer än tusen annonser..."', '"Wow! Vilka fina bilder!!!."','"Så dåven är annonsen utan faksimil av verkligheten."','"Ett annonsfoto bör ha bra ljussättning."','"Tänk vad vackert ett foto förmedlar."']; 
		var poetictextsArray = $.t("add.1poetsayings").split(';'); // Hämta de olika poetiska citaten från språkfilen och splitta dem till array.
		var text = poetictextsArray[Math.floor(Math.random() * poetictextsArray.length)];	// Sedan slumpa fram en av dessa i arrayen. SÅÅÅÅÅ SNYYYYYGGT!!!
		$("#laggtillfototext").html(text).trigger("create");  //  <-- sätt denna <p> till denna text. 
	},200);

	
	
	
});
	
	
	
	
	
	
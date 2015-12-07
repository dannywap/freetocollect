

var usernamn='';
// var useremail='';
// var usercode='';
var userlat='';
var userlong='';
var userpostnrlat='';
var userpostnrlong='';
var usertelefon='';
var usermobil='';
var userlan='';
var userkommun='';
var userpostnr='';
var userplatsid='';
var userplatsnamn='';
// var userdeviceuuid='';
var userchangedemail=false;
var useremailconfirmed=false;
var startpollemailconfirmation=false;
var startpollemailnrpolls=0;
// var userchangedpostnr=false;
var AnnonsToDeleteIdAndKeys='';
var meddelandeOmEmail='';


function storageReadData(itm){
	var val=window.localStorage.getItem(itm);
	if(val=="true"){val=true;}
	if(val=="false"){val=false;}
	if(val=="null"){val="";}
	if(dwgempty(val)){val="";}
	return val;
}
function storageWriteData(itm,val){
	window.localStorage.setItem(itm,String(val)); // Vi kan BARA spara strängvärden med localStorage.
}


				// <!-- AKTIVERA EMAIL v1.4 - BLIR EJ SÅ HÄR!!! MEN LÄS RESTEN DÅ DET ÄR SÅ HÄR VI GÖR!!!
				
					// Vi hade tänkt att man får börja med bara email och så hämtas aktiveringsstatus och visar sedan övriga fält. Renast och buggfriast, helt online endast. 
					// Men en snabbare analys klargjorde att det ser inte bra ut. Det talar emot användaren att fylla i ett ensamt email-fält då man inte vet vad som kommer sedan.
					// Det är bättre att visa alla fält på en gång och istället försöka följa "helt online"-principen ändå på nedan sätt: 
				       // 1. Användaren måste fylla i alla 3 krav fält innan spara fullbordas. (Vid detta läget är activated=false)
				       // 2. PROBLEM: Vad händer nu om användaren redan har aktiverat email med alla uppgifter på sin iPad? Skall vi skriva över nyligen angiven data med dessa eller webuserdata med de nyligen angivna? 
					   // 3. LÖSNING: Vi får helt enkelt säga: "Du hade redan tidigare uppgifter med denna email som nu har hämtats."
					          // - Men detta föutsätter att de var kompletta (namn, postnr, plats_id måste vara ifyllda). Annars kör vi över uppgifterna med de lokala.
							  // - VID ACTIVATE: { firstregistration=true; uploadlocaldata();  } - Så avgörs resten på server sidan. Se nedan, där framgår detta. 
					   
					// Lättare problem: VID UPPDATERING OCH BYTE AV EMAIL:
					   // 1. Användaren vill byta email och klickar på email. 
					   // 2. Varning säger: Är du säker du vill byta email? Dina öppna annonser och din profil är just nu bundna till denna email "zzz@xxx.ss".
					   // 3. Användaren klickar "Ja!" och useremail (och userloccode) rensas men userlocdeviceuid sparas kvar. Ingen mening att byta och kan vara bra ur felsökningsperspektiv.
					      // - Vi sätter också firstregistration=true som skall skickas med upp. 
					   // 4. Vi kör på nytt en loadprofile och en refreshfields som automatiskt tömmer fälten då inga uppgifter var laddade. Och kravfälten blinkar förföriskt då de vill bli ifyllda. :)
					   // 5. Användaren fyller i en ny email och massa andra uppgifter. 
					   // 6. VID ACTIVATE: Om denna email redan hade uppgifter (namn, postnr, plats_id) så rensas lokala namn, tele, mob, postnr om de var ifyllda och fylls i med de som fanns på webben när denna email aktiveras. 
							  // - Ett meddelande berättar detta: "Du hade redan tidigare uppgifter med denna email som nu har hämtats."
							  // - Nu körs en loadwebuserdata() och en refreshfields() för att visa de nya uppgifterna. (aktiverad email och postnr och ett tidigare plats_id/join kommun som användaren nu kan ändra.
					          // - Vill användaren nu så får han börja om att fylla i nya uppgifter. 
					   // 7. VID ACTIVATE: Om denna email hade tomma uppgifter (på antingen namn, postnr eller plats_id) så laddas den lokala datan som användaren nu fyllt i automatiskt upp och ersätter fälten online. 
							  // - Vid uppladdning av datat (firstregistration=true;) plockas automatiskt plats_id ut för användaren baserat på postnr och fylls i emails-tabellen endast online på servern. 
							  // - Nu körs en loadwebuserdata() och en refreshfields() för att visa de nya uppgifterna. (aktiverad email och postnr och ett förslag på plats_id/join kommun som användaren nu kan ändra.
					
					// KODEN HUR SER DEN UT:
					// Med andra ord sker en hel del vid ACTIVATE. Så vi måste nog spara locdata endast ifall han nu stänger appen. Som kan läsas in vid uppstart av appen då "startpollemailconfirmation" är sparat. 
					// Så när pollemailconfirmation får en "TRUE" / ACTIVATION COMPLETE / (ELLER OCKSÅ EN NORMAL "SPARA") då körs följande:
						// - collect "tmpuploaddata" and send to server. (IF POLLACTIVATION THEN ALSO firstregistration=true;)
						// På server sidan:
							// - if "email+deviceuid==activated": 
								// - if "firstregistration==true"
									// - elseif webuserdata is incomplete then php:replacewebuserdata() och skicka tillbaka json "{result:WEBUSERDATAREPLACED,resulttxt:"Din profil är nu komplett"}"
										// (Detta sker när anv inte ännu aktiverat denna mobbe och email och aldrig aktiverat något device)
									// - elseif webuserdata is already complete then php:loadwebuserdatajson() och skicka tillbaka "{result:LOCUSERDATAREPLACED,resulttxt:"Du hade redan tidigare uppgifter med denna email som nu har hämtats."}.  ...Men vi kör alltid loadwebuserdata efter detta så det syns först då.
										// (Detta sker när användare ännu aktiverat denna mobbe och email MEN har tidigare aktiverat en device)
								// - elseif "firstregistration!=true" then perform NORMAL UPDATE och skicka tillbaka json "{result:WEBUSERDATAUPDATED,resulttxt:"Din profil är nu uppdaterad"}"
									// (Detta sker alltid om email+devicuid redan är aktiverat och användaren helt enkelt bara ändrar en uppgift (eller byter till en redan också på denna device aktiverad email). 
									// (I detta läge kollas alltid om UPLOADPOSTNR<>WEBPOSTNR. Om INTE så körs getdefaultplats_id() och sätter ett nytt default plats_id.
									// NEJ!! DETTA RÄCKER INTE email+deviceuid=activated MÅSTE ALLTID HA SKETT FÖRST INNAN NÅN ÄNDRING KAN SKE. ANNARS KAN ANDRA SKRIVA ÖVER MIN PROFIL!!!!
									// DESSUTOM SKICKAR JU POLLEN INTE NÅGOT FÖRRÄN EFTER ACTIVATED!!!! PUCKO!!! HÄR SKALL ETT ANNAT VÄRDE CHECKAS. TYP "firstregistration=true"
							// - elseif "email+deviceuid != activated" json "{result:NOTACTIVATED,resulttxt:"Din email är inte aktiverad på denna mobil ännu."}"  // DETTA SKALL INTE KUNNA SKE...
						// På klientsidan 
							// on success: 
								// dwgalert(data.resulttxt);
								// loadwebuserdata(); (Om användaren är registrerad så skickas också data.useremailactivated==true (ellerså) tillbaka vilket gör att nästa g man trycker spara pollas det inte. Detta värde laddas alltid från web och sparas inte lokalt.
								// refreshfields();
							// on error:
								// retry 3 times then dwgalert("Vi verkar inte kunna nå servern just nu. Prova igen om en stund. Eller kontakta support@bortskankes.se om problemet kvarstår.") 			
					// KLART!

					// UPPGRADERING v1.x till 1.4 FÖRSTA UPPSTART
					// MEN VID FÖRSTA UPPSTART AV v1.4 OCH VI HAR GAMMALT SKIT LOKALT MEN INTE ONLINE. 
						// -Detta kan kollas genom att ladda de lokala variablarna och se om de finns. Isåfall om useremailconfirmed==true kör vi:
							// - collect "tmpuploaddata" and send to server. (Sätt firstregistration=true; så sker allt automagiskt)
						// -I annat fall om data finns men useremailconfirmed != true då slänger vi skiten. 
							// - emptylocaldata.
					
					// POSTNR UPDATE: 
						// Postnr update sker bara när användare redan är ACTIVATED. Eftersom det finns inte något plats_id förslag förrän POSTNR laddats upp och aktiverats och laddats ner igen (med loadwebuserdata ovan).
						// Och denna är enkel. Antingen klickar man på plats-förslagslänken som fixar saker i bakgrunden själv. 
						// Eller så ändrar man massa uppgifter och denna och trycker på spara då får man automatiskt (IF UPLOADEDPOSTNR <> WEBPOSTNR) ett nytt default plats_id. 
				
				// VAD MÅSTE loadwebuserdata() ALLTID RETURNERA:
					// namn,mob,tel,postnr,plats_id,kommun,postnrlat,postnrlong
					// * Notera lat longen som skall med. 
				// -->
				
				// <!-- 
				// <div id="aktiveraemail">
					// <p style="color: silver !important; font-size:12px !important;">
						// <b style="color:black !important;">Aktivera appen</b><br>
						// Har du använt Bortskänkes.se tidigare använd då samma email. Din email är dold både i appen och på hemsidan.
					// </p>
					// <label for="dwgactivateemail" style="margin-bottom: -6px !important;"><b>Email</b>
					// <div> <! -- To protect entire bg to be set green if something something happends too fast. Then this is parent.div instead of higher up -- >
					// <input name="dwgactivateemail" id="dwgactivateemail" onChange="checkChangedEmail()" maxlength="63" placeholder="Din email..." value="" type="email" required>
					// </div>
					// <div id="mittkontoemailconfirmedtext" data-role="none" style="margin-top:0px !important; padding-top:0 !important; color: silver !important; font-size:12px !important;"></div>
					// <button class=" ui-btn ui-btn-a ui-shadow ui-corner-all" data-theme="a" data-form="ui-btn-up-a" onclick="sendactivationmail();">Skicka aktiveringsmail</button>
				// </div>< !-- slut på aktiveraemail -- >
				// -->

















// LOADUSERDATA laddar det lokala data som behövs för att hämta webuserdata (email+deviceuuid)
function loaduserdata(){
	if(typeof(Storage)!=="undefined"){
		// We have WebStorage
		
		// GET ONLY LOCAL DATA NEEDED TO FETCH WEBUSERDATA (email+userdeviceuuid is the key
		useremail	= storageReadData("useremail");
		userdeviceuuid	= storageReadData("userdeviceuuid");	

		
		// LOAD FLIPSWITCH "SHOW HIDDEN ADS" - Sätt flipswitchen för om vi skall visa annonser eller inte efter det som var sparat sedan sist....
		adhideclosed = storageReadData("adhideclosed"); 
		showclosedadsselectswitchloading=1;
		if(adhideclosed==''){ $('#showclosedadsselectswitch').val("on").flipswitch("refresh"); }else{ $('#showclosedadsselectswitch').val("off").flipswitch("refresh"); }
		showclosedadsselectswitchloading=0;
		
		// OM HELT NY DEVICE:
		if(dwgempty(userdeviceuuid)){ 
			rndguid=dwgguid(); // In case vi inte får mobilens får appen generera en egen.
			// alert("rndguid:"+rndguid);
			userdeviceuuid = device.uuid + "_" + rndguid;
			storageWriteData("userdeviceuuid",userdeviceuuid);
		}

		startpollemailconfirmation = storageReadData("startpollemailconfirmation");
		// alert("poll:"+startpollemailconfirmation+" webuseract:"+userwebactivated+" useremail:"+useremail);
		// if(startpollemailconfirmation && !userwebactivated && !dwgempty(useremail)){  // Dubbelkolla igen vid load/visa om användaren klickat länken i mailet nu.
		if(startpollemailconfirmation && !dwgempty(useremail)){  // Dubbelkolla igen vid load/visa om användaren klickat länken i mailet nu. Ta inte med !userwebactivated eftersom app kanske avstängd när han klickar bekräfta email. Och då sätts detta true vid uppstart igen.
			// dwgalert("Startar pollning efter email-activation igen.");
			// VISA DET TEMPORÄRA DATAT SÅ DET INTE ÄR TOMT MEDAN VI POLLAR:
			// alert("VI SKALL POLLA OCH STARTAR POLLEN NU. LADDAR OCKSÅ IN TMP VÄRDEN.");
			// dwgalert("Appen pollar nu tills din email är bekräftad.");
			tmpusernamn			=	storageReadData("tmpusernamn");
			tmpusermobil		=	storageReadData("tmpusermobil");
			tmpusertelefon		=	storageReadData("tmpusertelefon");
			tmpuserpostnr		=	storageReadData("tmpuserpostnr");
			// useremail			=	storageReadData("useremail"); <-- redan läst ovan.

			document.getElementById('dwgusernamn').value=tmpusernamn;  // DETTA ÄR NOG OK! DESSUTOM VISADE DET SIG LOGISKT MEST FUNGERA HÄR OM DET ÄR POLLING SOM GÄLLER!!!
			document.getElementById('dwguseremail').value=useremail;
			document.getElementById('dwgusermobil').value=tmpusermobil;
			document.getElementById('dwgusertelefon').value=tmpusertelefon;
			document.getElementById('dwguserpostnr').value=tmpuserpostnr;
			checksetemailconfirm2();
			setTimeout(function() { pollemailconfirm(); },6000);  // Och polla vidare om fortfarande inte...
		}

	}else{
		// No WebStorage support
		dwgalert($.t("profile.msg_mob_lack_webstorage_supp")); //"Din telefon saknar Storage support. Vänligen rapportera detta till support@bortskankes.se.");
	}
}

function warnchangeemail(){
	if(!dwgempty(document.getElementById('dwguseremail').value) && (document.getElementById('dwguseremail').value==useremail)){
		dwgconfirm("Är du säker du vill byta email? Dina öppna annonser och din profil är just nu bundna till denna email.","Byta email","JA!,Avbryt",changeemail);
	}
}
function changeemail(buttonIndex){
	if(buttonIndex === 1){			// Om JA:
		emptyalllocaldata();		// Töm all lokal data och fälten i Min Profil omgående. 
	}
}
function emptyalllocaldata(){
	startpollemailconfirmation=false;
	userwebnamn='';
	userwebadress='';
	userwebpostnr='';
	userwebpostnrlat='';
	userwebpostnrlong='';
	userwebplatsid='';
	userwebplatstext='';
	userwebkommun='';
	userwebtelefon='';
	userwebmobil='';
	userwebactivated=false;
	useremail='';
	// userdeviceuuid='';
	// storageWriteData("userdeviceuuid",userdeviceuuid);
	storageWriteData("useremail",useremail);
	storageWriteData("startpollemailconfirmation",startpollemailconfirmation);
	document.getElementById('dwgusernamn').value='';
	document.getElementById('dwguseremail').value='';
	// document.getElementById('mittkontoemailconfirmedtext').value='';
	$("#mittkontoemailconfirmedtext").html("");
	$("#mittkontoemailconfirmedtext").trigger("create");


	document.getElementById('dwgusermobil').value='';
	document.getElementById('dwgusertelefon').value='';
	document.getElementById('dwguserpostnr').value='';
	// document.getElementById('mittkontoplatstext').value='';
	$("#mittkontoplatstext").html("");
	$('#mittkontoplatstext').trigger("create");
	$("#dwguseremail").closest('div').removeClass('dwginputwaiting');
	$("#dwguseremail").closest('div').removeClass('dwginputok');
	$("#dwguserpostnr").closest('div').removeClass('dwginputwaiting');
	$("#dwguserpostnr").closest('div').removeClass('dwginputok');

	// $('#mittkontoplatstext').html(dwgdata9d);
	// $('#mittkontoplatstext').trigger("create");
	refreshmittkontobuttons();
	dwgalert($.t("profile.msg_restored_loc_values")); //"Återställt lokala värden.");
	// setTimeout(function(){
		// document.getElementById('mittkontoemailconfirmedtext').value='';
		// $("#mittkontoemailconfirmedtext").trigger("update");
		// $("#mittkontoemailconfirmedtext").trigger("create");
	// },1000);
}


function saveuserdata(){
// CHECK INPUT FIELDS:
		// document.getElementById('dwguserpostnr').value = document.getElementById('dwguserpostnr').value.replace(/\D/g,''); // VI TILLÅTER NUMERA BOKSTÄVER I POSTNR 2015-09-29 v1.44
		
		if(dwgempty(document.getElementById('dwgusernamn').value) || dwgempty(document.getElementById('dwguseremail').value) || dwgempty(document.getElementById('dwguserpostnr').value)){
			// dwgalert($.t("Vänligen fyll i Namn, Email och Postnummer"));  // Funkar men då måste man ta bort punkter eller göra om keyspacechar och i18next är inte gjort för detta riktigt. Better safe:
			dwgalert($.t("profile.msg_please_enter_req_fields")); //$.t("profile.msg_please_enter_req_fields",{testeee:testeee}));
			return false;
			if(dwgempty(document.getElementById('dwgusernamn').value)){
				setTimeout(function () {$("#lan").closest('dwgusernamn').addClass('highlightdiv'); }, 600);
				setTimeout(function () {$("#lan").closest('dwgusernamn').removeClass('highlightdiv'); }, 2000);
			}
			if(dwgempty(document.getElementById('dwguseremail').value)){
				setTimeout(function () {$("#lan").closest('dwguseremail').addClass('highlightdiv'); }, 600);
				setTimeout(function () {$("#lan").closest('dwguseremail').removeClass('highlightdiv'); }, 2000);
			}
			if(dwgempty(document.getElementById('dwguserpostnr').value)){
				setTimeout(function () {$("#lan").closest('dwguserpostnr').addClass('highlightdiv'); }, 600);
				setTimeout(function () {$("#lan").closest('dwguserpostnr').removeClass('highlightdiv'); }, 2000);
			}
			
		}
		if( !document.getElementById('dwguseremail').value.match(/@/) && !document.getElementById('dwguseremail').value.length()>5 ){   // Minst 5 tecken och ett @-tecken i mejlen.
			dwgalert($.t("profile.msg_please_verify_email")); //"Vänligen kontrollera att Email är en riktig email adress.");
			return false;
		}
		// regex = new Regex(@"^(\d\d\d \d\d|\d\d\d\d\d)$", RegexOptions.None);    <<-- Denna fetfejlar hela appen.
		// if( !regex.Match(document.getElementById('dwguserpostnr').value) ){
			// dwgalert($.t("profile.msg_please_verify_postal")); //"Vänligen kontrollera att postnummer är korrekt.");
			// return false;
		// }
		
		// if(  document.getElementById('dwguserpostnr').value.length<postnrminchars || document.getElementById('dwguserpostnr').value.length>postnrmaxchars){   // Vafalls?!! Har man inte fyllt i 5 siffror här? Sedan 12 maj 1968 är 3 + 2 siffror svensk standard. Vågar inte. Kör på minst 4.
			// dwgalert($.t("profile.msg_please_verify_postal")); //"Vänligen kontrollera att postnummer är korrekt.");
			// return false;
		// }
		
		
// NU KOLLAR VI AT PLATS_ID FINNS ELLER ATT "LÄN, KOMMUN, ORT" ÄR IFYLLT:
		// checkpostnr(); // Om detta går bra drar vi igång setuserdata2
		// checkpostnr().done(function(result) {
			// alert(result);
			// if(result==true){setuserdata2();}
		// });
		checkpostnr( function(result) {
			// alert("now checkpostnr");
			// alert(result);
			if(result==true){setuserdata(); }  // Måste exekveras utan ()  
		});
}

function setuserdata(){
	if(typeof(Storage)!=="undefined"){
		// alert("running setuserdata");
	// We have WebStorage

	// SPARA NER TMP DATAN OAVSETT DIREKTUPPDATERING ELLER POLLNING SÅ VI FÅR EN "ONEWAYTODOIT" I saveuserwebdata();
		userdeviceuuid	=	storageReadData("userdeviceuuid");

		// SKAPANDE AV userdeviceuuid SKER OCKSÅ I loaduserdata OM DEN SKULLE VARA TOM. MEN EN BUGG I MIN KOD RÅKADE TÖMMA DEN NÄR MAN RESETTA EMAIL. SMART DÄR. BLEV FETT CP UTAN devuid. SÅ JAG VÅGAR INTE LÅTA SÅN MISS HÄNDA IGEN. HÄR SKALL DET IN OM DET SAKNAS.
		// SNARARE HÄR ÄN I loaduserdata. MEN DEN BEHÖVS NOG DÄR MED. 
		// OM HELT NY DEVICE:
		if(dwgempty(userdeviceuuid)){ 
			rndguid=dwgguid(); // In case vi inte får mobilens får appen generera en egen.
			// alert("rndguid:"+rndguid);
			userdeviceuuid = device.uuid + "_" + rndguid;
			storageWriteData("userdeviceuuid",userdeviceuuid);
		}

		tmpusernamn		=	document.getElementById('dwgusernamn').value;
		useremail		=	document.getElementById('dwguseremail').value;
		tmpusermobil	=	document.getElementById('dwgusermobil').value;
		tmpusertelefon 	=	document.getElementById('dwgusertelefon').value;
		tmpuserpostnr	=	document.getElementById('dwguserpostnr').value;
		lan			=	document.getElementById('lan').value;
		kommun		=	document.getElementById('kommun').value;
		ort			=	document.getElementById('ort').value;
		storageWriteData("tmpusernamn",tmpusernamn);
		storageWriteData("useremail",useremail);
		storageWriteData("tmpusermobil",tmpusermobil);
		storageWriteData("tmpusertelefon",tmpusertelefon);
		storageWriteData("tmpuserpostnr",tmpuserpostnr);
		storageWriteData("lan",lan);
		storageWriteData("kommun",kommun);
		storageWriteData("ort",ort);

// KOLLA NU OM userwebactivated==true ISÅFALL BARA SKICKA IVÄG DET! INGEN POLLNING BEHÖVS. 
		if(userwebactivated){
			// alert("setuserdata2 körs nu och userwebactivated");
			// - Läs också resultatet json "{result:WEBUSERDATAUPDATED,resulttxt:"Din profil är nu uppdaterad"}" och gör en dwgalert(data.resulttxt);
			firstregistration=false;
			storageWriteData("firstregistration",firstregistration);
			saveuserwebdata();
		}else{
// ANNARS POLLA TILLS ACTIVATED
			// OM userwebactivated==false SÄTT IGÅNG EN POLLNING OCH SÄTT firstregistration=true SOM SKALL SKICKAS MED DATAT.
			// alert("setuserdata2 körs nu och EJ userwebactivated");
			// Men framgår inte firstregistration=true direkt utav "userwebactivated==false"??? Varför måste detta med....
			// JO EFTERSOM användaren KOMMER att klicka på ACTIVATE I POLLNINGEN så när detta når php scriptet är användaren ALLTID ACTIVATED. ANNARS FÅR HAN INTE VARA DÄR O RÖRA!!!! PUCKO!!! :)
			firstregistration	=	true; // Detta skall (alltid? - Jepp) med i AJAX-pollningen. Kan egentligen stå camefrompolling=true eftersom det alltid är sant.
			storageWriteData("firstregistration",firstregistration);
			useremailconfirmed = false;
			startpollemailconfirmation=true;
			startpollemailnrpolls=0; // Reset the counter. Then we will perform a 6x15sek poll (while not activated) giving you 90sek (1.5 mins) to click mail. 
			// storageWriteData("useremailconfirmed",useremailconfirmed); // Behöver vi detta lokalt? Tycker inte det.
			storageWriteData("startpollemailconfirmation",startpollemailconfirmation);
			// OCH SPARA OCKSÅ TMPDATAT LOKALT FÖR POLLNING.
			// BÖRJA SEDAN POLLA:
			checksetemailconfirm2(true); 	// Med "true" menar vi att detta är första gången vi kör och ett mail skall skickas. När vi pollar behöver inte ett mail gå iväg. 
											// I denna funktion skall vi WHEN ACTIVATED också köra:  saveuserwebdata();
		// BERÄTTA ATT VI SKICKAT ETT MAIL (Eftersom oaktiverad användare):
			dwgalert($.t("profile.msg_you_will_get_email_please_confirm")); //"Du får alldeles strax ett bekräftelsemail. Öppna detta mail och bekräfta din email.");
			setTimeout(function() { pollemailconfirm(); },8000);
			
		// DÖLJ MANUALLY SELECTED LAN,KOMMUN,ORT ifall den syntes. 
			// Vi kan inte komplicera det med att ladda namn etc. Det får helt enkelt vara tomt där tills man aktiverat sin mail. 
			document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
		}
	}else{
		// No WebStorage support
		dwgalert($.t("profile.msg_mob_lack_webstorage_supp")); //"Din telefon saknar Storage support. Vänligen rapportera detta till support@bortskankes.se.");
	}
}	// --end setuserdata2

function saveuserwebdata(){
	// alert("saveuserwebdata körs nu");
	
	// AND AWAY IT GOES:
	// Samla först ihop tmp-datat. Email är alltid useremail likaså som deviceuid alltid är userdeviceuuid. Dessa två sparas lokalt och är nycklarna som låser upp.
	// All annan data är bara ett försök till att uppdatera userwebdata. Men det avgörs på serversidan hur vi gör med det. Sedan laddar vi om de lokala fälten och får då se hur resultatet blev där borta.
	
	tmpusernamn			=	storageReadData("tmpusernamn");
	tmpusermobil		=	storageReadData("tmpusermobil");
	tmpusertelefon		=	storageReadData("tmpusertelefon");
	tmpuserpostnr		=	storageReadData("tmpuserpostnr");
	lan				=	storageReadData("lan");
	kommun			=	storageReadData("kommun");
	ort				=	storageReadData("ort");	
	useremail			=	storageReadData("useremail");
	userdeviceuuid		=	storageReadData("userdeviceuuid");
	firstregistration	=	storageReadData("firstregistration");
	var sendData = {
		tmpusernamn: tmpusernamn,
		tmpusermobil: tmpusermobil,
		tmpusertelefon: tmpusertelefon,
		tmpuserpostnr: tmpuserpostnr,
		lan: lan,
		kommun: kommun,
		ort: ort,
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
			// OM VI HAR POLLAT FRAM TILL NU SÅ KAN VI SLUTA MED DET DÅ ALLT ÄR KLART!:
			startpollemailconfirmation=false;
			storageWriteData("startpollemailconfirmation",startpollemailconfirmation);

			
			if(data.isok || data.isok=="true"){
				dwgalert(data.resulttxt); // Och berätta vad som hände på serversidan. :)
				hideSelectLanKommunOrtBox();
				loaduserwebdata(true);		// Denna hämtar bara variablerna. Förutsatt att det är activated. Med (true) så körs automatiskt en refreshmittkontofields vid success.... :)
				// setTimeout(refreshmittkontofields,1000);  // Detta kanske kan krångla... beroende på hur lång tid loadwebuserdata tar... borde istället vara en variabel som sätt och om satt så kör denna från loaduserwebdata vid success.
			}else{
				dwgalert(data.resulttxt); // Och berätta vad som hände på serversidan. :(
			}
		}, // --end success
		error: function (jqXHR, textStatus, errorThrown) {
			dwgalert($.t("profile.msg_could_not_conn6")); //"Vi verkar inte kunna nå servern just nu. Prova igen om en stund eller kontakta support@bortskankes.se om problemet kvarstår.");
			// if(retryloaduserwebdata<4){
				// retryloaduserwebdata++;
				// setTimeout(loaduserwebdata,3000);  // << Utan "()" måste det vara eller så gör man så här: setTimeout(function(){loaduserwebdata()},3000);
			// }else{
				// retryloaduserwebdata=0;   // Relax and reset value for another time.
			// }
		} // --end error
	}); // --end ajax
}

function refreshmittkontofields(){
	if(lastPageClicked=='mittkonto'){   // Annars blir det skräp....
		// userwebnamn;
		// userwebplatsid;
		// userwebmobil;
		// userwebtelefon;
		// userwebadress;
		// userwebpostnr;
		// userwebpostnrlat;
		// userwebpostnrlong;
		// userwebkommun;
		// userwebactivated;
		document.getElementById('dwgusernamn').value=userwebnamn;
		document.getElementById('dwguseremail').value=useremail;
// EMAIL FÄLTET:
		if(userwebactivated){
			setUserEmailConfirmed();  // Se till att den fortsätter vara grön varje gång vi startar om vi har aktiverat. Det är så fint. Och med texten "aktiverad..."
		}
		document.getElementById('dwgusertelefon').value=userwebtelefon;
		document.getElementById('dwgusermobil').value=userwebmobil;
		document.getElementById('dwguserpostnr').value=userwebpostnr;
		//document.getElementById('mittkontoplatstext').value=userwebplatstext;
		// $("#mittkontoplatstext").html(userwebplatstext).trigger("create");
		$("#placetext").html(userwebplatstext).trigger("create");


// POSTNR FÄLTET:
		if(userwebpostnrisok && !dwgempty(userwebpostnr)){
			korrektpostnr();
		}else if(!dwgempty(userwebpostnr)){
			felpostnr();
		}else{
			$("#dwguserpostnr").closest('div').removeClass('dwginputwaiting');
			$("#dwguserpostnr").closest('div').removeClass('dwginputok');
		}
		
		//$('#mittkontoplatstext').trigger("update");

		// Och här skall vi också sätta platsid/kommun i lilla textrutan "mittkontoplatstext" under postnr.
		// Exempeltext1:
		// 	$("#mittkontoplatstext").html("<p style=\"margin-top:0px !important; padding-top:0 !important; color: silver !important; font-size:12px !important;\">Detta verkar vara ett felaktigt postnummer. Kontrollera att det är ett korrekt nummer och består av 5 siffror. Har du fortfarande problem kontakta vår support.</p>");
		// 	$("#mittkontoplatstext").trigger("update");
		// Exmepeltext2:
		//	$("#mittkontoplatstext").html("<p>"+userplatsnamn+"<br><a href=\"#\" onClick=\"selectDwgMyPlats('visa5');\">(Byt kommun...)</a></p>");
		//	$('#mittkontoplatstext').trigger("create");
		// Exempeltext3:
		// 	$('#mittkontoplatstext').html(dwgdata9d);
		//	$('#mittkontoplatstext').trigger("create");
		// Exempeltext4:
		//	$("#mittkontoplatstext").html("<p></p>");
		//	$('#mittkontoplatstext').trigger("create");
	}
}



function pollemailconfirm(){
	if(startpollemailconfirmation && !useremailconfirmed && !dwgempty(useremail) && lastPageClicked=='mittkonto'){  // Fortsätt polla så länge som: -Vi är kvar på sidan, -email!=confirmed och -!empty(useremail)(meningslöst att göra det om email är tomt).
		checksetemailconfirm2();
		if(startpollemailnrpolls<7){
			setTimeout(function() { pollemailconfirm(); },15000);
			// alert(startpollemailnrpolls);
			startpollemailnrpolls++;
		}
	}
}

function dwgempty(v){
	var undef;
	var t = typeof v; return t === 'undefined' || ( t === 'object' ? ( v === null || Object.keys( v ).length === 0 ) : [false, 0, "", "0", "null", "false", undef, null].indexOf( v ) >= 0 );
}

// function dwgempty(mixed_var) {
	// // alert("dwgempty:"+mixed_var);
	// var undef, key, i, len;
	// var emptyValues = [undef, null, false, 0, '', '0', 'null', 'false'];
	// for (i = 0;i<emptyValues.length;i++) {
		// if (mixed_var === emptyValues[i]) {
			// return true;
		// }
	// }
	// if (typeof(mixed_var) === 'object') {
		// for (key in mixed_var) {
			// // TODO: should we check for own properties only?
			// //if (mixed_var.hasOwnProperty(key)) {
			// // return false;
			// //}
		// }
		// return true;
	// }
	// return false;
// }

function clearpostnr(){
			userplatsid = '';
			userplatsnamn = '';
			userwebpostnrlat='';
			userwebpostnrlong='';
			storageWriteData("userplatsid",userplatsid);
			storageWriteData("userplatsnamn",userplatsnamn);
			$("#mittkontoplatstext").html("<p></p>");
			$('#mittkontoplatstext').trigger("create");
}
function felpostnr(){
	if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
		$("#dwguserpostnr").closest('div').addClass('dwginputwaiting');
	}
	$("#mittkontoplatstext").html($.t("profile.html_postal_incorrect")); //"<p style=\"margin-top:0px !important; padding-top:0 !important; color: silver !important; font-size:12px !important;\">Detta verkar vara ett felaktigt postnummer. Kontrollera att det är ett korrekt nummer och består av 5 siffror. Har du fortfarande problem kontakta vår support.</p>");
	$("#mittkontoplatstext").trigger("update");
}
function korrektpostnr(){
	if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
		$("#dwguserpostnr").closest('div').removeClass('dwginputwaiting');
		$("#dwguserpostnr").closest('div').addClass('dwginputok');
	}
}

function dwgguid() {
	function s4() {	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function getlatlong(){
	if(navigator.geolocation){
		// navigator.geolocation.getCurrentPosition(successfullyGotLatLong, failedLatLong, {timeout: 4000});
		navigator.geolocation.getCurrentPosition(successfullyGotLatLong, failedLatLong2);
	}else{
		// No navigator supported
		failedLatLong2();
	}
}
function successfullyGotLatLong(position){
	userlat		= position.coords.latitude;
	userlong	= position.coords.longitude;
	if(userlat>69.0 || userlat<14.6 || userlong>24.8 || userlong < 10.0 ){
		// Utanför Sverige släng in postnrlatlong istället.
		failedLatLong2();
		// userlat=userwebpostnrlat;
		// userlong=userwebpostnrlong;	
	}
	// savelatlong(); Inte från och med v1.4 vi cachear inte detta lokalt
}
function failedLatLong2(){
	// alert("Kunde inte lokalisera din position just nu. Använder ditt postnr istället.");
	userlat=userwebpostnrlat;
	userlong=userwebpostnrlong;
	// if(dwgempty(userlat) || dwgempty(userlong)){  // OM FORTFARANDE TOMT... FEJKA - NÄ.. Annars hamnar alla annonser i GBG utan att nån fattar varför. Detta får inte ske. I karta måste vi ha så där är special. 
		// userlat=57.707616;
		// userlong=11.972690;
	// }
}


function userisregistered(){
	// if(!dwgempty(useremail) && !dwgempty(useremailconfirmed) && !dwgempty(userplatsid) && !dwgempty(userpostnr) && !dwgempty(usernamn)) { // innan v1.4 (2015-04-05)
	if( userwebactivated && userwebpostnrisok ) { // Har email och postnr (platsid lösts upp med latlong etc) blivit bekräftat OK!
		return true;
	}else{
		return false;
	}
}


// function selectDwgMyPlats(urloption){
	// if(dwgempty(userwebpostnrlat)){
		// userwebpostnrlat=userlat;
		// userwebpostnrlong=userlong;
	// }
	// dwgurl=weburl+'/mob_'+appver+'/mittkonto_narmaststad.php?lat='+userwebpostnrlat+'&long='+userwebpostnrlong+'&option='+urloption;
	// // alert(dwgurl);
	// $.ajax({
		// url        : dwgurl,
		// type	   : 'GET',
		// dataType   : 'text',
		// //timeout	   : 3000,
		// // beforeSend : function() {$.mobile.loading('show')},
		// // complete   : function() {$.mobile.loading('hide')},
		// success    : function(dwgdata9d) {
			// if(dwgdata9d.match(/auto:/i)) {  // Om autoselect:
				// // alert("Got auto:"+dwgdata9d);
				// dwgdata9d = dwgdata9d.replace('auto:',''); 
				// // alert("I fixed it:"+dwgdata9d);
				// dwgdata9d2 = dwgdata9d.split(';');
				// setDwgMyPlats(dwgdata9d2[0],dwgdata9d2[1]);
			// }else{
				// // alert("Filling mittkontoplatstext with kommun text from php");
				// $('#mittkontoplatstext').html(dwgdata9d);
				// $('#mittkontoplatstext').trigger("create");
			// }
		// },
		// error      : function() {
			// // alert('Kunde inte skapa en anslutning för att hämta din kommun. Prova igen!');                  
		// }
	// }); 
// }
// function setDwgMyPlats(userplatsidtmp,userplatsnamntmp){
		// // alert('Skall spara din plats: '+userplatsidtmp+' - '+userplatsnamntmp+'.');
	// if(!dwgempty(userplatsidtmp)){
		// var sendData = {
			// useremail: useremail,
			// userdeviceuuid: userdeviceuuid,
			// platsid: userplatsidtmp
		// };
		// var nocachex=dwgguid();
		// $.ajax({
			// type: "POST",
			// dataType: 'json',	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
			// url: weburl+"/mob_"+appver+"/mittkonto_changekommun.php?cachx=" + nocachex, // Saknas nocachex deklarerad så stallar skiten.
			// data: sendData, // Skicka nycklar som låser upp och hämtar userwebdata
			// success: function (data) {
				// // alert("Sidan svarade...");
				// if(data.isok || data.isok=="true"){
					// dwgalert(data.resulttxt); // Och berätta vad som hände på serversidan. :)
					// loaduserwebdata(true);		// Denna hämtar bara variablerna. Förutsatt att det är activated. Med (true) så körs automatiskt en refreshmittkontofields vid success.... :)
					// // setTimeout(refreshmittkontofields,1000);  // Detta kanske kan krångla... beroende på hur lång tid loadwebuserdata tar... borde istället vara en variabel som sätt och om satt så kör denna från loaduserwebdata vid success.
					// $("#mittkontoplatstext").html(data.platstext);
					// $('#mittkontoplatstext').trigger("create");
				// }else{
					// dwgalert(data.resulttxt); // Och berätta vad som hände på serversidan. :(
				// }
			// }, // --end success
			// error: function (jqXHR, textStatus, errorThrown) {
				// dwgalert($.t("profile.msg_could_not_conn6")); //"Vi verkar inte kunna nå servern just nu. Prova igen om en stund eller kontakta support@bortskankes.se om problemet kvarstår.");
			// } // --end error
		// }); // --end ajax
	// }
// }



function refreshmittkontobuttons(){
	// var isuserregistered=userisregistered();
	if(userwebactivated == true){
		var nocachex=dwgguid();
		$("#divminaannonseretc").show(); 	
		$.ajax({
			// beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			// complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			url: weburl+"/mob_"+appver+"/mittkonto_annonser.php?email="+useremail+"&deviceuuid="+userdeviceuuid + "&cachx=" + nocachex,
				type: 'GET',
				error : function (){ 
					// document.title='No connection'; 
					var $collapse_text  = $('#mittkontoooppnaannonser').find('.ui-collapsible-content');
					$collapse_text.html($.t("profile.html_myads_no_conn")); //'<h1>Kunde inte ansluta just nu.</h1>');
					$('#mittkontoooppnaannonser').trigger("create");
				}, 
				success: function (data) {	
					$('#divminaannonseretc').html(data);
					$('#divminaannonseretc').trigger("create");
					// $('#mittkonto').iscrollview("refresh",500);
					// $.mobile.silentScroll(1)
				}
		});
		
	}else{ 
		// Hide allt som har med ett korrekt konto att göra:
		$("#divminaannonseretc").hide(); 	// Göm minaannonser
		// $( "#mittkontoinstallningar" ).collapsible( "expand", "enabled", true );  Funkar jättebra! Men vi tar bort denna collapsible. Såg snyggare ut med allt i rooten.
	}
}

function setAnnonsToDelete(AnnonsToDeleteID){
	// alert("Setting:"+AnnonsToDeleteID);
	AnnonsToDeleteIdAndKeys=AnnonsToDeleteID;
	// $('#mittkontoannonsdelpopup').popup("open");
}
function closeSelectedAnnonsID(successfulOrNot){
	// alert("delete.php?"+AnnonsToDeleteIdAndKeys);
	$('#mittkontoannonsdelpopup').popup("close");
	mailObjData = {
		success: successfulOrNot,
		confirm: 1
	};
	$.ajax({
		url: weburl+"/annons_delete.php?"+AnnonsToDeleteIdAndKeys,
		type: "POST",
		data: mailObjData,
		success: function(data, textStatus, jqXHR)
		{
			// Vi lyckades ta bort annonsen
			dwgalert($.t("profile.msg_ad_is_now_closed_thx")); //'Annonsen är nu stängd! Tack för ditt bidrag.');
			// jQuery.mobile.navigate("#mittkonto");	// ladda om sidan så man också ser att den är borttagen <-- Funkade inte. Mycket komplicerat.
			refreshmittkontobuttons(); // Detta borde fungera mycket bättre!
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			dwgalert($.t("profile.msg_could_non_connect4")); //'Anslutningen misslyckades! Kontrollera internetanslutning och prova igen.');
		}
	});
}

function checksetemailconfirm2(resendmail){
	// Nu bygger vi en lite snyggare och smidigare variant av denna...
	// if(lastPageClicked=='mittkonto'){
		// tmpusernamn			=	storageReadData("tmpusernamn");
		// tmpusermobil		=	storageReadData("tmpusermobil");
		// tmpusertelefon		=	storageReadData("tmpusertelefon");
		// tmpuserpostnr		=	storageReadData("tmpuserpostnr");
		// useremail		=	storageReadData("useremail");
		// userdeviceuuid	=	storageReadData("userdeviceuuid");
		// firstregistration	=	storageReadData("firstregistration");
		// // RITA OCKSÅ UT DEM SÅ LÄNGE OM VI AVBRUTIT POLL OCH KOMMIT TILLBAKA TILL Min Profil....
		// document.getElementById('dwgusernamn').value=tmpusernamn;
		// document.getElementById('dwguseremail').value=useremail;
		// document.getElementById('dwgusermobil').value=tmpusermobil;
		// document.getElementById('dwgusertelefon').value=tmpusertelefon;
		// document.getElementById('dwguserpostnr').value=tmpuserpostnr;
	// }
	
	
	if(!dwgempty(resendmail)){resendmail=1; dwgalert($.t("profile.msg_email_resent"));}
	if(!userwebactivated || startpollemailconfirmation){ // Det kan vara så att vi fortfarande pollar och startar upp appen som blivit emailbekräftad under tiden.
		var nocachex=dwgguid();
		var checkData = {
			// namn: usernamn,
			useremail: useremail,
			resendmail: resendmail,
			appver: appver,
			platform: device.platform,
			model: device.model,
			version: device.version,
			deviceuid: userdeviceuuid,
			useragent: navigator.userAgent
		};
		$.ajax({
			url: weburl+'/mob_'+appver+"/app_mittkonto_emailtomobile.php?cachx=" + nocachex,
			type: 'POST',
			data: checkData,
			// crossDomain:true,
			dataType: 'text',
			error: function (){ 
				// Vi bör nog reagera här
				// useremailconfirmed=false;
				// window.localStorage.setItem("useremailconfirmed",useremailconfirmed);
				// dwgalert("Kunde inte ansluta för att verifiera email!");
				setUserEmailCheckFailed();
				// return false;
			},
			success: function (data) {
					// alert("true="+data.substring(0,4) + "  data:"+data);
				if(data.substring(0,4)=="true"){                                            // <<<<<<<<-------------- VI KAN INTE VARA SÄKRA PÅ ATT DATAT KOMMER SÅ HÄR SPECIELT INTE NÄR VI GLÖMT SPECA FORMAT TEXT OCH INTE json.
					// alert("fick tebaka OK: "+data);
					// usercode=data.substring(5,15);  // true:1234567890  (efter true: som är fem tecken plockar vi den 10tecken långa koden)
					// storageWriteData("usercode",usercode); Den här behöver vi inte längre i v1.4. Vi kör bara på email+deviceuid
					setUserEmailConfirmed();
					// loaduserdata();
					// refreshmittkontofields();
					// WHEN ACTIVATED: 
					saveuserwebdata(); // Denna kommer också trigga en load userdata och då det kom från Spara-knappen så initieras också en refresh av mittkonto-sidan. (Borde kanske vara IF CURRENT PAGE IS MITTKONTO).
				}else{
					// alert("fick tebaka att ejconfirmed: "+data);
					setUserEmailUnconfirmed();
				}
			}
		});	
	}
}




function setUserEmailCheckFailed(){
	useremailconfirmed=false;
	storageWriteData("useremailconfirmed",useremailconfirmed);
	// $("#dwguseremail").css('background-color: #fde3a6 !important;');
	$("#dwguseremail").closest('div').removeClass('dwginputok');
	if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
		$("#dwguseremail").closest('div').addClass('dwginputwaiting');
	}
	$("#mittkontoemailconfirmedtext").html($.t("profile.html_cld_not_verify_email_conn_error")); //"<p>Kunde inte verifiera email på grund av kopplingsproblem. Kontrollera din anslutning.</p>");
	$("#mittkontoemailconfirmedtext").trigger("update");
	meddelandeOmEmail = "Kunde inte ansluta för att verifiera. Vänligen kontrollera anslutning och försök igen.";
}
function setUserEmailUnconfirmed(){
	useremailconfirmed=false;
	storageWriteData("useremailconfirmed",useremailconfirmed);
	// $("#dwguseremail").css('background-color: #fde3a6 !important;');
	$("#dwguseremail").closest('div').removeClass('dwginputok');
	if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
		$("#dwguseremail").closest('div').addClass('dwginputwaiting');
	}
	$("#mittkontoemailconfirmedtext").html($.t("profile.html_email_sent_pls_conf")); //"<p>Ett email har skickats till dig. Klicka på länken i detta email för att bekräfta att denna emailadress är din egen. <a href=\"#\" onClick=\"checksetemailconfirm2(true);dwgalert('Ett nytt bekräftelsemejl har skickats.');\">Skicka om detta email</a></p>");
	$("#mittkontoemailconfirmedtext").trigger("update");
	meddelandeOmEmail = "Du får snart ett email med en aktiveringslänk. Vänligen öppna mailet och klicka länken för att bekräfta din emailadress.";
}

function setUserEmailConfirmed(){
	useremailconfirmed=true;
	storageWriteData("useremailconfirmed",useremailconfirmed);
	// $("#dwguseremail").css('background-color: #fde3a6 !important;');
	$("#dwguseremail").closest('div').removeClass('dwginputwaiting');
	if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
		$("#dwguseremail").closest('div').addClass('dwginputok');
	}
	$("#mittkontoemailconfirmedtext").html($.t("profile.html_email_confirmed")); //"<p style=\"color: silver !important; margin-top:-8px !important; padding-top:0 !important;\"> Emailadress bekräftad.</p>");
	$("#mittkontoemailconfirmedtext").trigger("update");
	meddelandeOmEmail = "";
}


function checkChangedEmail(){
	// alert("useremail:'"+useremail+"' fält:'"+document.getElementById('dwguseremail').value+"' useremailconfirmed:"+useremailconfirmed);
	// Killen har ändrat email - Det kan inte längre stå "Bekräftad" men det kan inte heller stå "Skicka om mail" när man inte sparat.
	if(useremail != document.getElementById('dwguseremail').value || !useremailconfirmed){
		//alert(useremail+"!="+document.getElementById('dwguseremail').value);
		$("#dwguseremail").closest('div').addClass('dwginputwaiting');
		if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
			$("#dwguseremail").closest('div').removeClass('dwginputok');
		}
		$("#mittkontoemailconfirmedtext").html($.t("profile.html_email_not_conf_please_save")); //"<p>Denna email är inte bekräftad. Tryck spara för att gå vidare.</p>");
		$("#mittkontoemailconfirmedtext").trigger("update");
	}
	// Killen ändrar TILLBAKA till sin BEKRÄFTADE email. Onödigt att skicka om då:
	if(useremail == document.getElementById('dwguseremail').value && useremailconfirmed){
		// alert("green ok!");
		$("#dwguseremail").closest('div').removeClass('dwginputwaiting');
		if(lastPageClicked=='mittkonto'){ // Sidan måste finnas utritad. Annars blir det alla andra möjliga divs som får denna.
			$("#dwguseremail").closest('div').addClass('dwginputok');
		}
		$("#mittkontoemailconfirmedtext").html($.t("profile.html_email_confirmed")); //"<p style=\"color: silver !important; margin-top:-8px !important; padding-top:0 !important;\"> Emailadress bekräftad.</p>");
		$("#mittkontoemailconfirmedtext").trigger("update");
	}
}







function skickaRisRos(){
	// var isuserregistered=userisregistered();
	// if(isuserregistered != true){
		// dwgalert("Vänligen fyll först i dina kontaktuppgifter.");
	// }else{
		tmprisrosbodytext=document.getElementById('risrosbodytext').value;
		if(tmprisrosbodytext.length < 20){ 
			dwgalert($.t("profile.msg_ris_ros_please_more_words")); //"Vänligen formulera lite mer ord för att vi skall förstå innebörden...");
		}else{
			var mailObjData = {
				namn: userwebnamn,
				email: useremail,
				appver: appver,
				platform: device.platform,
				model: device.model,
				version: device.version,
				deviceuuid: userdeviceuuid,
				useragent: navigator.userAgent,
				kommentar: tmprisrosbodytext
			};
			$.ajax({
				url: weburl+"/mob_"+appver+"/risros.php",
				type: "POST",
				data: mailObjData,
				success: function(data, textStatus, jqXHR)
				{
					// Vi lyckades maila
					document.getElementById('risrosbodytext').value='';
					dwgalert($.t("profile.msg_thx_ris_ros")); //"Tack så mycket för ditt bidrag. Har du frågor kring samarbete eller närmare frågor om vår tjänst kan dessa formuleras till kontakt@bortskankes.se eller se informations-fliken till vänster. Skulle du uppleva problem med appen kan du mejla support@bortskankes.se.");
					// stäng fliken:
					// $("[data-role=panel]").panel("close");
					$("#panelrisros").panel("close");
				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					dwgalert($.t("profile.msg_could_non_connect4")); //'Anslutningen misslyckades! Kontrollera internetanslutning och prova igen.');
				}
			});
		}  
	// }
}
function funcreturntrue(){
	return true;
}
function funcreturnfalse(){
	return false;
}






// POSTNR 2015 nya RWD test >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
						// $('#divlankommun').trigger("create");
						// --> $('#kommun').selectmenu('refresh', true); // Denna räcker efter varje lan, kommun change....
						// $('#divlankommun').trigger("create");
						// $('#divlankommun').trigger("refresh");

 /* ---------- Select boxes ----------- */	
			
		function getLan(){
			var lanSelect = document.getElementById('lan');
			lanSelect.options.length = 0;
			$("#lan").empty();
			
			// Fixa också till kommun och ort med default värden:
			var kommunSelect = document.getElementById('kommun');
			kommunSelect.options.length = 0;
			$("#kommun").empty();
			var ortSelect = document.getElementById('ort');
			ortSelect.options.length = 0;
			$("#ort").empty();
			
			var opt = document.createElement('option');
			opt.disabled = true;
			opt.selected = true;
			opt.value = '0';
			opt.innerHTML = selectfirstlan;
			kommunSelect.appendChild(opt);
			$('#kommun').selectmenu('refresh', true);
			
			var opt = document.createElement('option');
			opt.disabled = true;
			opt.selected = true;
			opt.value = '0';
			opt.innerHTML = selectfirstkommun;
			ortSelect.appendChild(opt);
			$('#ort').selectmenu('refresh', true);
			
			// - slut på fixa till kommun och ort
			
			var nocachex=dwgguid();
			$.ajax({
				type: "GET",
				dataType: "text",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
				//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
				url: weburl+"/include/get_kommun_ajax.php?nocachex="+nocachex,
				success: function (data) {
					// alert(data);
					var lanen=data.split('|');
						var opt = document.createElement('option');
						opt.disabled = true;
						opt.selected = true;
						opt.value = '';
						opt.innerHTML = selectnowlan;
						lanSelect.appendChild(opt);

					for (i=1; i<lanen.length; i++) {
						var id_lan=lanen[i].split(';'); // We send values as |23;Goteborg|24;Stockholm|...etc
						var opt = document.createElement('option');
						opt.value = id_lan[0];
						opt.innerHTML = id_lan[1];
						lanSelect.appendChild(opt);
					}
					$('#lan').selectmenu('refresh', true);
					// setTimeout(function () {$("#lan").closest('div').addClass('highlightdiv'); }, 600);
					// setTimeout(function () {$("#lan").closest('div').removeClass('highlightdiv'); }, 2000);
				}, // --end success
				error: function (jqXHR, textStatus, errorThrown) {
				} // --end error
			});
		}

		function valjerLan(){
			var lan=document.getElementById('lan').value;
			if(!dwgempty(lan)) {
				var kommunSelect = document.getElementById('kommun');
				kommunSelect.options.length = 0;
				$.ajax({
					type: "GET",
					dataType: "text",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
					//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
					url: weburl+"/include/get_kommun_ajax.php?lan=" + lan,
					success: function (data) {
						var kommuner=data.split('|');
							var opt = document.createElement('option');
							opt.disabled = true;
							opt.selected = true;
							opt.value = '';
							opt.innerHTML = selectnowkommun;
							kommunSelect.appendChild(opt);

						for (i=1; i<kommuner.length; i++) {
							var id_kommun=kommuner[i].split(';'); // We send values as |23;Goteborg|24;Stockholm|...etc
							var opt = document.createElement('option');
							opt.value = id_kommun[0];
							opt.innerHTML = id_kommun[1];
							kommunSelect.appendChild(opt);
						}
						$('#kommun').selectmenu('refresh', true);

						// När vi väljer om Län resetta då också ort (kommun resettas automatiskt genom att fyllas).
						var ortSelect = document.getElementById('ort');
						ortSelect.options.length = 0;
						ortSelect.options[0] = new Option (selectfirstkommun, "");
						ortSelect.options[0].selected="true";
						$('#ort').selectmenu('refresh', true);

						setTimeout(function () {$("#kommun").closest('div').addClass('highlightdiv'); }, 600);
						setTimeout(function () {$("#kommun").closest('div').removeClass('highlightdiv'); }, 2000);
					}, // --end success
					error: function (jqXHR, textStatus, errorThrown) {
					} // --end error
				});
			}
		}
		
		function valjerKommun(){
			var kommun=document.getElementById('kommun').value;
			if(!dwgempty(kommun)) {
				var ortSelect = document.getElementById('ort');
				ortSelect.options.length = 0;
				$.ajax({
					type: "GET",
					dataType: "text",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
					//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
					url: weburl+"/include/get_kommun_ajax.php?kommun=" + kommun,
					success: function (data) {
						var kommuner=data.split('|');
							var opt = document.createElement('option');
							opt.disabled = true;
							opt.selected = true;
							opt.value = '';
							opt.innerHTML = selectnowort;
							ortSelect.appendChild(opt);

						for (i=1; i<kommuner.length; i++) {
							var id_kommun=kommuner[i].split(';'); // We send values as |23;Goteborg|24;Stockholm|...etc
							var opt = document.createElement('option');
							opt.value = id_kommun[0];
							opt.innerHTML = id_kommun[1];
							ortSelect.appendChild(opt);
						}
						$('#ort').selectmenu('refresh', true);
						setTimeout(function () {$("#ort").closest('div').addClass('highlightdiv'); }, 600);
						setTimeout(function () {$("#ort").closest('div').removeClass('highlightdiv'); }, 2000);
					}, // --end success
					error: function (jqXHR, textStatus, errorThrown) {
					} // --end error
				});
			}
		}
		
		
		
		/* ----------- show divs ---------------- */

		function visaSelectLanKommunOrtBox(){
			getLan();
			$("#placetext").html("").trigger("create");
			document.getElementById("divlankommun").style.display = 'block'; // Show lan/kommun/etc
			
			
			
			// Åk också neråt annars ser man inte hur fint det blinkar:
			setTimeout(function () { $('html, body').animate({ scrollTop: $(document).height() }, "easeOutQuint" );},300);

			// Set the default options (if something else been choosen before).
			var lanSelect = document.getElementById('lan');
			lanSelect.value = '';
			var kommunSelect = document.getElementById('kommun');
			kommunSelect.options.length = 0;
			kommunSelect.options[0] = new Option (selectfirstlan, "");
			kommunSelect.options[0].selected="true";
			// kommunSelect.options[kommunSelect.options.length] = new Option(data.kommun, data.kommun_id, true, true);
			var ortSelect = document.getElementById('ort');
			ortSelect.options.length = 0;
			ortSelect.options[0] = new Option (selectfirstkommun, "");
			ortSelect.options[0].selected="true";
			
			// Och blinka till län så man förstår man måste välja den också:
			setTimeout(function () {$("#lan").closest('div').addClass('highlightdiv'); }, 600);
			setTimeout(function () {$("#lan").closest('div').removeClass('highlightdiv'); }, 2000);
		}
		function hideSelectLanKommunOrtBox(){
			// WE NEED TO CLEAR WHEN HIDING ELSE IT WILL BE VALUES HERE WHEN CHECKING NEXT TYPED POSTNR EVEN IF HIDDEN. 
			var lanSelect = document.getElementById('lan');
			lanSelect.options.length = 0;
			var kommunSelect = document.getElementById('kommun');
			kommunSelect.options.length = 0;
			var ortSelect = document.getElementById('ort');
			ortSelect.options.length = 0;
			
			$("#placetext").html("").trigger("create");
			document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
		}
		function changingPostNr(){
			// WE NEED TO CLEAR WHEN HIDING ELSE IT WILL BE VALUES HERE WHEN CHECKING NEXT TYPED POSTNR EVEN IF HIDDEN. 
			var lanSelect = document.getElementById('lan');
			lanSelect.options.length = 0;
			lanSelect.value = '';
			var kommunSelect = document.getElementById('kommun');
			kommunSelect.options.length = 0;
			var ortSelect = document.getElementById('ort');
			ortSelect.options.length = 0;
			document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
		}
		
		
		/* ---- POSTNR ------ */
		function checkpostnr(callback){
			var postnr = document.getElementById("dwguserpostnr").value.replace(" ", "");
			// var sendData = {	
				// postnr: postnr
			// };
			if(postnr.length>=postnrminchars && postnr.length<=postnrmaxchars){ // Gör inget förrän antal tecken för postnr är ifyllt, gör heller inget om det är för många tecken.
				$.ajax({
					type: "GET",
					dataType: "json",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
					//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
					url: weburl+"/include/ajaxpostnr.php?postnr=" + postnr,
					success: function (data) {
						// alert(data.status);
						if(data.status=="ok"){ // VI FICK TAG I KORREKT DATA!!! :D
							// alert(data);
							// Set the options from postnr. POST DATA:
							var lanSelect = document.getElementById('lan');
							lanSelect.value = data.lan_id;
							var kommunSelect = document.getElementById('kommun');
							kommunSelect.options[kommunSelect.options.length] = new Option(data.kommun, data.kommun_id, true, true);
							if(usingort){
								var ortSelect = document.getElementById('ort');
								ortSelect.options[ortSelect.options.length] = new Option(data.ort, data.ort_id, true, true);
							}

							document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
							
							if(data.manual){	var reselectmanual = '<div style="cursor: pointer;" onClick="javascript:reselectmanualpostnr()"><a href="#" onclick="javascript:reselectmanualpostnr()">'+isthisaddressincorrect+'</a></div>' }else{ var reselectmanual = '';}
							
							if(data.ort == data.kommun || dwgempty(data.ort)){				
								//$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.kommun+", "+data.lan+"</div><input type=\"hidden\" name=\"lan\" value=\""+data.lan_id+"\"><input type=\"hidden\" name=\"kommun\" value=\""+data.kommun_id+"\">").trigger("create");
								$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.kommun+", "+data.lan+reselectmanual+"</div>").trigger("create").trigger("refresh");
							}else{
								//$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.ort+", "+data.kommun+", "+data.lan+"</div><input type=\"hidden\" name=\"lan\" value=\""+data.lan_id+"\"><input type=\"hidden\" name=\"kommun\" value=\""+data.kommun_id+"\">").trigger("create");
								$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.ort+", "+data.kommun+", "+data.lan+reselectmanual+"</div>").trigger("create").trigger("refresh");
							}
							callback(true);
							// setuserdata2();  // OK FINNEMANG DÅ ÄR VI KLARA OCH KAN GÅ VIDARE!
						}else{	// DET SKET SIG. VISA LÄN, KOMMUN.       |-/
							if(document.getElementById("divlankommun").style.display == 'block'){
								if (!dwgempty(document.getElementById('kommun')[document.getElementById('kommun').selectedIndex].value) && usingort==false ){
									// Vi har redan visat "visaSelectLanKommunOrtBox" en gång och den är nu ifylld!
									// alert("kommun: "+document.getElementById('kommun').value + " value: "+document.getElementById('kommun')[document.getElementById('ort').selectedIndex].value);
									callback(true);
								}else if (!dwgempty(document.getElementById('ort')[document.getElementById('ort').selectedIndex].value) && usingort==true ){
									// Vi har redan visat "visaSelectLanKommunOrtBox" en gång och den är nu ifylld!
									// alert("ort: "+document.getElementById('ort').value + " value: "+document.getElementById('ort')[document.getElementById('ort').selectedIndex].value);
									callback(true);
								}
							}else{
								visaSelectLanKommunOrtBox();
								return false;
							}
						}
						// return false; // We don't want to post a submit on form!
					}, // --end success
					error: function (jqXHR, textStatus, errorThrown) {
						// alert(textStatus); 
						// $("#placetext").html("<div class=\"alert alert-warning\">Kunde ej verifieras.</div>").trigger("create");
						// document.getElementById("divlankommun").style.display = 'block'; // Show lan/kommun/etc
						visaSelectLanKommunOrtBox();
						return false;
					} // --end error
				}); // --end ajax
				// return false;
			}else if(postnr.length>0){
				$("#placetext").html("<div class=\"alert alert-danger\" style=\"padding: 4px 8px 4px 8px;\">"+pleaseverifypostnrformat+"</div>");
				document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
				return false;
			}else{
				$("#placetext").html("").trigger("create"); // Om fält tomt rensa varningen eller adressen.
				document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
				return false;
			}

		}
		
		
		function reselectmanualpostnr(){
			visaSelectLanKommunOrtBox();
			// Prep för ett nytt manuellt postnr:
			var postnr = document.getElementById("dwguserpostnr").value;
			$.ajax({
				type: "POST",
				dataType: "text",	// Kan också vara "text" och parsea i success istället om man vill. Men lyckas det inte är det nog för att man får [{}] istället för {} från PHP pga pushdata() till array.
				//url: "<?=L::app_weburl;?>/include/ajaxpostnr.php?postnr=" + postnr,  <-- NEJ DETTA SKAPAR CROSS SITE SCRIPTING PROBLEMS I RÄTT KONFADE BROWSERS! 
				url: weburl+"/include/ajaxpostnr.php?selectnew=yes&postnr=" + postnr,
				success: function (data) {
				}, // --end success
				error: function (jqXHR, textStatus, errorThrown) {
				} // --end error
			});
		}

// /POSTNR 2015 nya RWD test >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function loadPostnr(){
	// Ungefär så här måste det se ut när vi laddar datat. På hemsidan sker detta med PHP men här måste vi ha ytterligare en JS funktion. 
	document.getElementById("divlankommun").style.display = 'none'; // Hide lan/kommun/etc
	if(data.manual){	var reselectmanual = '<div style="cursor: pointer;" onClick="javascript:reselectmanualpostnr()"><a href="#" onclick="javascript:reselectmanualpostnr()">'+isthisaddressincorrect+'</a></div>' }else{ var reselectmanual = '';}
	if(data.ort == data.kommun || dwgempty(data.ort)){				
		//$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.kommun+", "+data.lan+"</div><input type=\"hidden\" name=\"lan\" value=\""+data.lan_id+"\"><input type=\"hidden\" name=\"kommun\" value=\""+data.kommun_id+"\">").trigger("create");
		$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.kommun+", "+data.lan+reselectmanual+"</div>").trigger("create").trigger("refresh");
	}else{
		//$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.ort+", "+data.kommun+", "+data.lan+"</div><input type=\"hidden\" name=\"lan\" value=\""+data.lan_id+"\"><input type=\"hidden\" name=\"kommun\" value=\""+data.kommun_id+"\">").trigger("create");
		$("#placetext").html("<div class=\"alert alert-success\" style=\"padding: 4px 8px 4px 8px;\">"+data.ort+", "+data.kommun+", "+data.lan+reselectmanual+"</div>").trigger("create").trigger("refresh");
	}
}








$(document).on('pageshow', '#mittkonto', function (event) {
	lastPageClicked='mittkonto';
	
	
	// DETTA ÄR EN MYCKET VIKTIGT TEST SOM BEKRÄFTAR KONSEKVENT KORREKT HANTERING AV BOOLESKA FUNKTIONER. NÅGOT JAG VAR MYCKET OROLIG INTE VAR KONSEKVENT ETT TAG.
	// RESULTATEN HAR VISAT ATT JS ÄR MYCKET KONSEKVENT OCH JAG KAN LITA PÅ BOOLESKA OPERATIONER OCH MIN NYA EMPTY() FUNC.
	// var vartrue=true;
	// var varfalse=false;
	// var emptystr='';
	// var nonemptystr='  d';
	// var emptyint=0;
	// var emptynull=null;
	// var emptyarr=[];
	// storageWriteData("vartrue",vartrue)
	// storageWriteData("varfalse",varfalse)
	// storageWriteData("varint",1234)
	// alert("read vartrue:"+storageReadData("vartrue"));
	// alert("read varfalse:"+storageReadData("varfalse"));
	// alert("read varint:"+storageReadData("varint"));
	// alert("vartrue:"+vartrue+" varfalse:"+varfalse); // Såg rätt ut i A4.3, A4.4.2, A4.1.2, iPad Air iOS7
	// if(vartrue){
		// alert("han tycker vartrue är true"); // A4.3, A4.4.2, A4.1.2, iPad Air iOS7
	// }
	// if(varfalse){
		// alert("han tycker varfalse är true"); 
	// }
	// if(vartrue==true){
		// alert("han tycker vartrue==true");  // A4.3, A4.4.2, A4.1.2, iPad Air iOS7
	// }
	// if(varfalse==false){
		// alert("han tycker varfalse==false");  // A4.3, A4.4.2, A4.1.2, iPad Air iOS7
	// }
	// if(varfalse==true){
		// alert("han tycker varfalse==true"); 
	// }
	// if(funcreturntrue()){
		// alert("han tycker funcreturntrue är true");  // A4.3, A4.4.2, A4.1.2, iPad Air iOS7
	// }
	// if(funcreturnfalse()){
		// alert("han tycker funcreturnfalse är true"); 
	// }
	// if(!funcreturnfalse()){
		// alert("han tycker !funcreturnfalse är true");   // A4.3, A4.4.2, A4.1.2, iPad Air iOS7
	// }
	// if(dwgempty(emptystr)){
		// alert("han tycker emptystr är empty"); // A4.3
	// }
	// if(dwgempty(nonemptystr)){
		// alert("han tycker nonemptystr är empty");
	// }
	// if(dwgempty(emptyint)){
		// alert("han tycker emptyint är empty"); // A4.3
	// }
	// if(dwgempty(emptynull)){
		// alert("han tycker emptynull är empty"); // A4.3
	// }
	// if(dwgempty(emptyarr)){
		// alert("han tycker emptyarr är empty"); // A4.3
	// }
	// if(!dwgempty(emptystr)){
		// alert("han tycker !emptystr är true");
	// }
	// if(!dwgempty(nonemptystr)){
		// alert("han tycker !nonemptystr är true"); // A4.3
	// }
	// if(!dwgempty(emptyint)){
		// alert("han tycker !emptyint är true");
	// }
	// if(!dwgempty(emptynull)){
		// alert("han tycker !emptynull är true");
	// }
	// if(!dwgempty(emptyarr)){
		// alert("han tycker !emptyarr är true");
	// }
	
	
	
	
	
	// //var isuserregistered=userisregistered();
	// if(!userisregistered()){
		// $("#mittkontotitle").text("Kontaktuppgifter");
		// setTimeout(function () { loaduserdata(); },200); // För att ge mer responskänsla i navbar
		// setTimeout(function () { refreshmittkontobuttons();},600);  // NOTERA: Använd aldrig "()" vid settimeout. Eller gör en function(){...} som här.

		// // Bara checkar... DENNA Skall INTE ligga här:
		// $("#dwgactivateemail").closest('div').addClass('highlightdiv');   // Blinka till en gång för att locka mer till skrivning.

	// }else{
		// $("#mittkontotitle").text("Aktivera email");
		// $("#dwgactivateemail").closest('div').addClass('highlightdiv');   // Blinka till en gång för att locka mer till skrivning.
	// }
	
	
	// loaduserwebdata(true); // Varje g vi kommer in här skall denna köras. Annars riskerar vi tex vid pollning som avbryts om man byter sida att det aldrig ser aktiverat ut om man lämnar min profil och kommer tillbaka.  
	
	if(!userwebactivated || startpollemailconfirmation){   // null och false fungerar både och för att returnera !userwebactivated. =) Gött att null inte stökar till det. NULL=FALSE klart slut. 
		setTimeout(function () {$("#dwgusernamn").closest('div').addClass('highlightdiv'); }, 600);			// Blinka till en gång för att locka mer till skrivning.
		setTimeout(function () {$("#dwguseremail").closest('div').addClass('highlightdiv'); }, 1200);		// Blinka till en gång för att locka mer till skrivning.
		setTimeout(function () {$("#dwguserpostnr").closest('div').addClass('highlightdiv'); }, 1800);		// Blinka till en gång för att locka mer till skrivning.
		
		setTimeout(function () {$("#dwgusernamn").closest('div').removeClass('highlightdiv'); }, 2600);			
		setTimeout(function () {$("#dwguseremail").closest('div').removeClass('highlightdiv'); }, 3200);		
		setTimeout(function () {$("#dwguserpostnr").closest('div').removeClass('highlightdiv'); }, 3800);		
		
		// checksetemailconfirm2();
		pollemailconfirm(); // Måste också köra denna manuellt här if polling interupted. (Denna checkar om pollning skall göras och rockar på isåfall.  Sker redan i loadusersettings eller vad den heter men måste med här med. 
	}else{
		// Vi är aktiverade och sista biten har skickats upp. Fyll i och visa.
		$("#dwgusernamn").closest('div').removeClass('highlightdiv'); // Annars blinkar de alltid. Det är därför de blinkar samtidigt när man kommer tillbaka. 
		$("#dwguseremail").closest('div').removeClass('highlightdiv');
		$("#dwguserpostnr").closest('div').removeClass('highlightdiv');
		refreshmittkontofields();
		refreshmittkontobuttons();
	}
	
	
	
	// Oavsett så skall paneler synas och fixas till...
	// aboutus = '<img src="img/_logo.png" style="width: 100%">' + aboutus;
	// aboutus = aboutus + $.t("profile.aboutusbody");
	// aboutus = aboutus + '<p>'+$.t("profile.aboutushemsida")+':<br>';
	// aboutus = aboutus + '<a href="#" onClick="openExtLink(\''+$.t("app.weburl")+'\')">'+$.t("app.weburl")+'</a>';
	// aboutus = aboutus + '<p>Facebook:<br>'+
	// aboutus = aboutus + '<a href="#" onClick="openExtLink(\'http://facebook.com/bortskankes\')">http://facebook.com/bortskankes</a></p>';

	$("#panelomosscontent").html(aboutus + aboutus_appver).trigger("create").trigger("refresh");
	// $("#panelomosscontent").trigger("create");
	// $("#panelomosscontent").trigger("refresh");
	
	// var element = document.getElementById('dwgdeviceinfodiv');
	// element.innerHTML = devinfo + 
					// 'App version: '    + appver     + '<br />' + 
					// 'User code:   '  + usercode  + '<br />';
	
	// Hmmmm...
	$("#mittkontoannonsdelpopup").on("popupbeforeposition", function () {
		blurit();
	}).on( "popupafterclose", function () {
		unblurit();
	});		
});




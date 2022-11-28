$(document).ready(function() {
	main();
	for(xi=0;xi<turmArten.length;xi++) {
		document.getElementById("preis"+xi).innerHTML=turmArten[xi][6]+" (UP: "+turmArten[xi][6]*3+")";
	}

});



function reset() {
	strFelder = new Array();
	bauFelder = new Array();
	tuerme = new Array();
	gegner = new Array();
	projektile = new Array();
	wellen = new Array();
	dekoarr= new Array();
	spiel.gegnerSchlange = new Array();

		Spiel.wellenNr=0;
}



function ladeLevel(datei, ladewert) {
	$.getJSON("levels/"+lvlArray[datei]+".json", function(daten) {
		spieler = new Spieler(daten.spielerLeben, daten.spielerGeld);
		for(var i = 0; i < daten.strFelder.length; i++)
			strFelder.push(new StrFeld(daten.strFelder[i].x, daten.strFelder[i].y));
		for(var i = 0; i < daten.bauFelder.length; i++)
			bauFelder.push(new BauFeld(daten.bauFelder[i].x, daten.bauFelder[i].y));
		wellen = daten.wellen;
		spiel.wellenNr=0;
		geladen = 1;
		//console.log('level geladen: ' + datei);
				//dekoarr = new Array();
				for(x=0;x<16;x++) {
					for(y=0;y<12;y++) {
						leer=1;
				//console.log("Strassen-Felder: "+strFelder.length);
				for(i=0;i<strFelder.length;i++) {
					//console.log("Strasse bei "+strFelder[i].positionX+"|"+strFelder[i].positionY);
					if(strFelder[i].positionX==x&&strFelder[i].positionY==y) {
						leer=0;
					}
				}
				//console.log("Bau-Felder: "+bauFelder.length);
				for(j=0;j<bauFelder.length;j++) {
					//console.log("Bau bei "+bauFelder[i].positionX+"|"+bauFelder[i].positionY);
					if(bauFelder[j].positionX==x&&bauFelder[j].positionY==y) {
						leer=0;
					}
				}
				if(leer>0) {
					if(Math.random()<0.2) {
						//console.log("Baue Deko");
						rand = Math.random();
						if(rand<0.6) {
							//BAUM
							bildi=Math.floor(Math.random() * (35 - 33 + 1)) + 33;
						}
						else if(rand<0.95) {
							//HAUS
							bildi=Math.floor(Math.random() * (38 - 36 + 1)) + 36;
						}
						else {
							bildi=40;
						}
						dekoarr.push(new Deko(x,y,bildi));
					}
					
				}
			}
		}
	});


};

function newGame() {
	lvl=1;
	$("#end-screen").hide();
	$("#game-end").hide();
	reset();
	ladeLevel(0,1);
}


function nextLevel() {
	
	//console.log("aktuelles Level "+lvl);
	lvl++;
	if(lvl<=lvlArray.length) {
	reset();
	//console.log("lade Level "+lvl);
	ladeLevel(lvl-1,1);
	$("#end-screen").hide();
	$("#lvl-end").hide();
	}
	else {
		$("#lvl-end").hide();
		$("#lose").hide();
		$("#game-end").show();
	}
}

function reloadLevel() {
	console.log("Level neu laden");
	reset();
	ladeLevel(lvl-1,1);
	$("#end-screen").hide();
	$("#lose").hide();
}


function main() {
	lvl=1;
	// reichweite, feuerrate, schaden, bild, proj geschw , proj bild, kosten
	turmArten = [[3, 500, 1, 3, 0.5, 8, 10], [2, 600, 0.5, 5, 0.5, 10, 26], [2, 600, 1, 6, 0.5, 11, 26], [4, 750, 2, 4, 0.5, 9, 128], [3, 1000, 3, 7, 0.5, 12, 82]];
	// leben, geschw, geld, bild
	gegnerArten = [[8, 0.14, 2, 13],[30, 0.08, 6, 19],[50, 0.12, 10, 25]];
	feldGroesse = 80;
	drawContext = document.getElementById('canvas').getContext('2d');
	lvlArray=["lvl1","lvl2"];
	geladen = 0;
	spiel = new Spiel(turmArten);
	bilder = new Array();
	sounds = new Array();
	strFelder = new Array();
	bauFelder = new Array();
	tuerme = new Array();
	gegner = new Array();
	projektile = new Array();
	wellen = new Array();
	xdiffs = new Array();
	ydiffs = new Array();
	zeit1 = new Date();
	zeit2 = new Date();
	dekoarr = new Array();
	frames = 0;
	time = 0;
	strxdiff_a=0;
	strydiff_a=0;
	strxdiff_b=0;
	strydiff_b=0;
	gegnertime=0;
	muteSound = false;
	muteMusic = true;



	var ladeBild = function(datei, ladewert) {
		var img = new Image();
		img.onload = function() {
			geladen += ladewert;
			//console.log('bild geladen: ' + datei);
		};
		img.src = datei;
		bilder.push(img);
	};

	var ladeSound = function(datei, ladewert) {
		var sound = new Audio();
		sound.onloadeddata = function() {
			geladen += ladewert;
			//console.log('sound geladen: ' + datei);
		};
		sound.src = datei;
		sounds.push(sound);
	};





	var ladeSpiel = function() {

		ladeBild('img/0.png', 0.0082);
		ladeBild('img/1.png', 0.0041);
		ladeBild('img/2.png', 0.00015);
		ladeBild('img/3.png', 0.002);
		ladeBild('img/4.png', 0.0023);
		ladeBild('img/5.png', 0.0022);
		ladeBild('img/6.png', 0.0023);
		ladeBild('img/7.png', 0.0023);
		ladeBild('img/8.png', 0.0009);
		ladeBild('img/9.png', 0.0009);
		ladeBild('img/10.png', 0.0009);
		ladeBild('img/11.png', 0.0009);
		ladeBild('img/12.png', 0.001);
		ladeBild('img/13.png', 0.0021);
		ladeBild('img/14.png', 0.0021);
		ladeBild('img/15.png', 0.0021);
		ladeBild('img/16.png', 0.0021);
		ladeBild('img/17.png', 0.0021);
		ladeBild('img/18.png', 0.0021);
		ladeBild('img/19.png', 0.0023);
		ladeBild('img/20.png', 0.0023);
		ladeBild('img/21.png', 0.0024);
		ladeBild('img/22.png', 0.0023);
		ladeBild('img/23.png', 0.0022);
		ladeBild('img/24.png', 0.0024);
		ladeBild('img/25.png', 0.0034);
		ladeBild('img/26.png', 0.0034);
		ladeBild('img/27.png', 0.0034);
		ladeBild('img/28.png', 0.0031);
		ladeBild('img/29.png', 0.0031);
		ladeBild('img/30.png', 0.0031);
		ladeBild('img/31.png', 0.0042);
		ladeBild('img/32.png', 0.0059);
		ladeBild('img/33.png', 0.0013);
		ladeBild('img/34.png', 0.0015);
		ladeBild('img/35.png', 0.0018);
		ladeBild('img/36.png', 0.0023);
		ladeBild('img/37.png', 0.002);
		ladeBild('img/38.png', 0.002);
		ladeBild('img/39.png', 0.0008);
		ladeBild('img/40.png', 0.0011);



		ladeSound('sounds/bg_music.ogg', 0.738);
		ladeSound('sounds/kaufen_tower.ogg', 0.0112);
		ladeSound('sounds/round_start.ogg', 0.0049);
		ladeSound('sounds/wurst_tower.ogg', 0.0035);
		ladeSound('sounds/pizza_tower.ogg', 0.0065);
		ladeSound('sounds/taco_tower.ogg', 0.0105);
		ladeSound('sounds/eis_tower.ogg', 0.0024);
		ladeSound('sounds/burger_tower.ogg', 0.0035);
		ladeSound('sounds/sterben_Kind.ogg', 0.0061);
		ladeSound('sounds/sterben_Mann.ogg', 0.0154);
		ladeSound('sounds/sterben_Scooter.ogg', 0.0085);
		ladeSound('sounds/game_over.ogg', 0.0152);
		ladeSound('sounds/upgrade_tower.ogg',0.0025);
		ladeSound('sounds/abriss_tower.ogg', 0.0055);


		ladeLevel(0, 0.0057);

		/*ladeBild('img/bebaubar.png', 0.1);
		ladeBild('img/strasse.png', 0.1);
		ladeBild('img/tower.png', 0.1);
		ladeBild('img/gegner.png', 0.2);
		ladeBild('img/Projektil.png',0.1);*/
	};

	var update = function() {
		
		

		if(Math.ceil(geladen*1000)/1000 >= 1) {

			zeit1 = zeit2;
			zeit2 = new Date();
			time_diff = zeit2.getTime()-zeit1.getTime();
			//gegnertime+=time_diff;
			
			spiel.nextOne(time_diff);
			
			//hintergrund
			drawContext.drawImage(bilder[0], 0, 0);
			//deko
			for(var i=0;i <dekoarr.length;i++) {
				x = dekoarr[i].positionX * feldGroesse;
				y = dekoarr[i].positionY * feldGroesse;
				drawContext.drawImage(bilder[dekoarr[i].bild], x, y);
			}

			//straße
			//drawContext.rotate(0);
			//0 Oben-Unten
			//90*Math.PI/180 Rechts-Links
			//
			//
			for(var i = 0; i < strFelder.length; i++) {
				x = strFelder[i].positionX * feldGroesse;
				y = strFelder[i].positionY * feldGroesse;
				drawContext.save();
				drawContext.translate(x,y);
				drawContext.translate(feldGroesse/2,feldGroesse/2);
				if(i-1>=0) {
					strxdiff_a = strFelder[i].positionX-strFelder[i-1].positionX;
					strydiff_a= strFelder[i].positionY-strFelder[i-1].positionY;
				}
				if(i+1<strFelder.length) {
					strxdiff_b = strFelder[i].positionX-strFelder[i+1].positionX;
					strydiff_b= strFelder[i].positionY-strFelder[i+1].positionY;
				}
				stueck=1;

				if(i==strFelder.length-1) {
					
					stueck=32;
				}
				else {

					if(strxdiff_a>0 && strxdiff_b<0 && strydiff_a==0 && strydiff_b==0) {
					//links nach rechts
					drawContext.rotate(90*Math.PI/180);
					stueck=1;
				}
				else if(strxdiff_a<0 && strxdiff_b>0 && strydiff_a==0 && strydiff_b==0) {
					//rechts nach links
					drawContext.rotate(-90*Math.PI/180);
					stueck=1;
				}
				else if(strxdiff_a==0 && strxdiff_b==0 && strydiff_a>0 && strydiff_b<0) {
					//oben nach unten
					drawContext.rotate(180*Math.PI/180);
					stueck=1;
				}
				else if(strxdiff_a==0 && strxdiff_b==0 && strydiff_a<0 && strydiff_b>0) {
					//unten nach oben
					drawContext.rotate(0*Math.PI/180);
					stueck=1;
				}
				else if(strxdiff_a>0 && strxdiff_b==0 && strydiff_a==0 && strydiff_b<0) {
					//Kurve links-rechts nach oben-unten
					drawContext.rotate(90*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a==0 && strxdiff_b<0 && strydiff_a<0 && strydiff_b==0) {
					drawContext.rotate(0*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a==0 && strxdiff_b>0 && strydiff_a>0 && strydiff_b==0) {
					drawContext.rotate(180*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a>0 && strxdiff_b==0 && strydiff_a==0 && strydiff_b>0) {
					drawContext.rotate(180*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a<0 && strxdiff_b==0 && strydiff_a==0 && strydiff_b<0) {
					drawContext.rotate(0*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a==0 && strxdiff_b<0 && strydiff_a>0 && strydiff_b==0) {
					drawContext.rotate(-90*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a==0 && strxdiff_b>0 && strydiff_a<0 && strydiff_b==0) {
					drawContext.rotate(90*Math.PI/180);
					stueck=31;
				}
				else if(strxdiff_a<0 && strxdiff_b==0 && strydiff_a==0 && strydiff_b>0) {
					drawContext.rotate(-90*Math.PI/180);
					stueck=31;
				}

			}



				//bilder[1].style.transform="rotate(90deg)";
				drawContext.drawImage(bilder[stueck], -feldGroesse/2, -feldGroesse/2);
				//drawContext.translate(0,0);
				//drawContext.rotate(0);
				drawContext.restore();

			}
			drawContext.rotate(0);
			//baufelder
			for(var i = 0; i < bauFelder.length; i++) {
				if(bauFelder[i].baubar) {
					drawContext.drawImage(bilder[2], bauFelder[i].positionX * feldGroesse, bauFelder[i].positionY * feldGroesse);
				}
			}
			//türme
			for(var i = 0; i < tuerme.length; i++) {
				tuerme[i].schiessen(time_diff);
				drawContext.drawImage(bilder[tuerme[i].bild], tuerme[i].positionX * feldGroesse, tuerme[i].positionY * feldGroesse);
				if(tuerme[i].upgrade>0) {
					drawContext.drawImage(bilder[39], tuerme[i].positionX * feldGroesse, tuerme[i].positionY * feldGroesse);
				}
			}
			//gegner
			drawArray = new Array();
			for(var i = 0; i < gegner.length; i++) {
				gegner[i].gehen(time_diff);
				if(gegner[i].strPosition<strFelder.length-1) {
					xdiffs[i] = strFelder[gegner[i].strPosition].positionX*feldGroesse-strFelder[gegner[i].strPosition+1].positionX*feldGroesse;
					ydiffs[i] = strFelder[gegner[i].strPosition].positionY*feldGroesse-strFelder[gegner[i].strPosition+1].positionY*feldGroesse;

				}
				if(gegner[i].strPosition<strFelder.length) {

					flip=0;				
					if(xdiffs[i]<0) {
						x=strFelder[gegner[i].strPosition].positionX*feldGroesse+gegner[i].strecke;
						y=strFelder[gegner[i].strPosition].positionY*feldGroesse-feldGroesse*0.6;
					//drawContext.drawImage(bilder[gegner[i].bild], x, y);
				}
				else if(xdiffs[i]>0) {
					x=strFelder[gegner[i].strPosition].positionX*feldGroesse-gegner[i].strecke;
					y=strFelder[gegner[i].strPosition].positionY*feldGroesse-feldGroesse*0.6;
					flip=1;
					//drawContext.drawImage(bilder[gegner[i].bild], strFelder[gegner[i].strPosition].positionX*feldGroesse-gegner[i].strecke, strFelder[gegner[i].strPosition].positionY*feldGroesse-feldGroesse*0.6);
				}
				else if(ydiffs[i]<0) {
					x=strFelder[gegner[i].strPosition].positionX*feldGroesse;
					y=strFelder[gegner[i].strPosition].positionY*feldGroesse+gegner[i].strecke-feldGroesse*0.6;
					//drawContext.drawImage(bilder[gegner[i].bild], strFelder[gegner[i].strPosition].positionX*feldGroesse, strFelder[gegner[i].strPosition].positionY*feldGroesse+gegner[i].strecke-feldGroesse*0.6);
				}
				else if(ydiffs[i]>0) {
					x=strFelder[gegner[i].strPosition].positionX*feldGroesse;
					y=strFelder[gegner[i].strPosition].positionY*feldGroesse-gegner[i].strecke-feldGroesse*0.6;
					//drawContext.drawImage(bilder[gegner[i].bild], strFelder[gegner[i].strPosition].positionX*feldGroesse, strFelder[gegner[i].strPosition].positionY*feldGroesse-gegner[i].strecke-feldGroesse*0.6);
				}

				gegner[i].bildZaehler+=time_diff;
				bildi = gegner[i].akkBild;
				while(gegner[i].bildZaehler>=100) {
					gegner[i].akkBild++;
					gegner[i].bildZaehler-=100;
				}
				while(gegner[i].akkBild>gegner[i].bild+2) {
					gegner[i].akkBild-=2;
				}

				if(gegner[i].slow>0) {
					bildi+=3;
				}

				drawArray.push(new Array(x,y,bildi,i,flip));
				/*
				drawContext.drawImage(bilder[bildi],x,y);
				
				drawContext.fillStyle="#e53939";
				if(gegner[i].dot>0) {
					drawContext.fillStyle="#39e55e";
				}

				balkenhoehe=5;
				drawContext.fillRect(x+feldGroesse/6,y+balkenhoehe*2,gegner[i].leben/gegner[i].maxLeben*(2*feldGroesse/3),balkenhoehe);
				*/
			}
				/*if(xdiffs[i]>0) {
					gegnerdivs[i].style.left = strFelder[gegner[i].strPosition].positionX*feldGroesse+gegner[i].strecke+"px";
					gegnerdivs[i].style.top = strFelder[gegner[i].strPosition].positionY*feldGroesse+"px";
					drawContext.drawImage(bilder[gegner[i].bild], strFelder[gegner[i].strPosition].positionX*feldGroesse+gegner[i].strecke, strFelder[gegner[i].strPosition].positionY*feldGroesse);
				}
				else {
					gegnerdivs[i].style.left = strFelder[gegner[i].strPosition].positionX*feldGroesse+"px";
					gegnerdivs[i].style.top = strFelder[gegner[i].strPosition].positionY*feldGroesse+gegner[i].strecke+"px";
					drawContext.drawImage(bilder[gegner[i].bild], strFelder[gegner[i].strPosition].positionX*feldGroesse, strFelder[gegner[i].strPosition].positionY*feldGroesse+gegner[i].strecke);
				}
				*/
				//drawContext.drawImage(bilder[gegner[i].bild], strFelder[gegner[i].strPosition].positionX * 50, strFelder[gegner[i].strPosition].positionY * 50);

			}


			drawArray.sort(function(a,b){if(a[1]>b[1]) {return 1;} if(a[1]<b[1]) {return -1} return 0;});
			for(j=0;j<drawArray.length;j++) {
				x=drawArray[j][0];
				y=drawArray[j][1];
				bildi=drawArray[j][2];
				ri=drawArray[j][3];	
				flip=drawArray[j][4];
				if(flip<=0) {
					drawContext.drawImage(bilder[bildi],x,y);	
				}
				else {
					drawContext.save();
					canv = document.getElementById("canvas");
					drawContext.translate(canv.width,0);
					drawContext.scale(-1,1);
					//drawContext.translate(canv.width,canv.height);
					drawContext.drawImage(bilder[bildi],canv.width-x-feldGroesse,y);
					drawContext.restore();
				}
				drawContext.scale(1,1);
				drawContext.translate(0,0);
				drawContext.fillStyle="#e53939";
				if(gegner[ri].dot>0) {
					drawContext.fillStyle="#bf39e5";
				}

				balkenhoehe=5;
				drawContext.fillRect(x+feldGroesse/6,y+balkenhoehe*2,gegner[ri].leben/gegner[ri].maxLeben*(2*feldGroesse/3),balkenhoehe);
				
			}


			
			for(var i = 0; i < gegner.length; i++) {
				if(gegner[i].fertig > 0) {
					gegner.splice(i, 1);
				}
			}
			//projektile
			for(var i = 0; i < projektile.length; i++) {
				projektile[i].flugbahnBerechnen(time_diff);
				drawContext.drawImage(bilder[projektile[i].bild], projektile[i].positionX, projektile[i].positionY);
				if(projektile[i].fertig > 0)
					projektile.splice(i, 1);
			}
			//interface
			spiel.updateInterface();

			time+=time_diff;
			frames++;

		} else {
			drawContext.fillStyle = '#ffffff';
			drawContext.fillRect(0, 0, 1280, 960);
			drawContext.fillStyle = '#000000';
			drawContext.fillText('loading...', 20, 20);
			drawContext.fillText(geladen * 100.0 + '%', 20, 40);
		}
		//console.log('update');

		window.setTimeout(function() {update()},0);
	}

	//setInterval(update, 50);
	ladeSpiel();
	//tuerme.push(new Turm(5, 6, 500, 10, 8, 3, 0.7, 11));
	//tuerme.push(new Turm(5, 3, 400, 5, 11, 3, 0.2, 8));
	//tuerme.push(new Turm(5, 4, 1000, 5, 8, 6, 0.2, 9));
	//tuerme.push(new Turm(5, 4, 1500, 5, 5, 3, 0.2, 9));
	sounds[0].loop = true;
	sounds[0].play();
	//gegner.push(new Gegner(50, 0.10, 10, 13));
	//gegner.push(new Gegner(50, 0.11, 10, 13));
	//gegner.push(new Gegner(50, 0.12, 10, 25));
	//gegner.push(new Gegner(50, 0.13, 10, 19));
	update();
}

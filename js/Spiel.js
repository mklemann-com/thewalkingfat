function Spiel(turmArten) {
	this.wellenNr = 0;
	this.gegnerSchlange = new Array();
	this.schlangei=0;
	this.gegnerTimer=0;
	this.turmArten=turmArten;
	this.turmArray=new Array();
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

Spiel.prototype.baueTurm = function(typ, x, y) {
	if(spieler.geld < turmArten[typ][6]) {
		$('<p id="error-note">Nicht genug Geld!</p>').hide().appendTo('#build-menu').fadeIn().delay(1000).fadeOut();
		return 0;
	}
	for(var i = 0; i < bauFelder.length; i++) {
		if(x == bauFelder[i].positionX && y == bauFelder[i].positionY)
			if(bauFelder[i].baubar) {
				if(muteSound == false){
					soundClone = sounds[1].cloneNode();
					soundClone.play();
				}
				tuerme.push(new Turm(turmArten[typ][0], turmArten[typ][3], turmArten[typ][1], turmArten[typ][2], x, y, turmArten[typ][4], turmArten[typ][5], turmArten[typ][6]));
				bauFelder[i].baubar = false;
				spieler.geld -= turmArten[typ][6];
				$('#build-menu').hide();
				return 0;
			} else {
				//console.log('feld bebaut!');
			}
	}
	//console.log('fehler beim turmbau');
}

Spiel.prototype.update = function(x, y){
	for(var i =  0; i < tuerme.length; i++) {
		if (tuerme[i].positionX == x && tuerme[i].positionY == y) {
			if((spieler.geld - tuerme[i].kosten*3)>=0&&tuerme[i].upgrade==0){
				tuerme[i].upgraden();
				spieler.geld -= tuerme[i].kosten*3;
				$('#demolish-menu').hide();
			}
			else
				$('<p id="error-note">Nicht genug Geld!</p>').hide().appendTo('#demolish-menu').fadeIn().delay(1000).fadeOut();
		};
	}
}


Spiel.prototype.reisseAb = function(x, y){
	for(var i =  0; i < tuerme.length; i++) {
		if (tuerme[i].positionX == x && tuerme[i].positionY == y) {
			if(muteSound == false){
				soundClone = sounds[13].cloneNode();
				soundClone.play();
			}
			tuerme.splice(i,1);
		};
	}
	$('#demolish-menu').hide();
	for(var j = 0; j < bauFelder.length; j++){
		if ((x == bauFelder[j].positionX) && (y == bauFelder[j].positionY)) {
			bauFelder[j].baubar = true;
		};
	}
}

Spiel.prototype.istBebaubar = function(x, y) {
	//console.log('feld: ' + x + ', ' + y);
	for(var i = 0; i < bauFelder.length; i++) {
		if((x == bauFelder[i].positionX) && (y == bauFelder[i].positionY)) {
			return bauFelder[i].baubar;
		}
	}
	return false;
}

Spiel.prototype.istBebaut = function(x, y) {
//	console.log('feld: ' + x + ', ' + y);
	for(var i = 0; i < bauFelder.length; i++) {
		if((x == bauFelder[i].positionX) && (y == bauFelder[i].positionY)) {
			if(bauFelder[i].baubar != true)
				return true;
			else
				return false;
		}
	}
	return false;
}

Spiel.prototype.erstelleWelle = function() {
	this.schlangei=0;
	tempgegnerSchlange=new Array();
	if(this.wellenNr<wellen.length) {
		//Audio
		if(muteSound == false){
			soundClone = sounds[2].cloneNode();
			soundClone.play();
		}

	for(var i = 0; i < 3; i++) {
		for(var j = 0; j < wellen[this.wellenNr][i]; j++) {
			tempgegnerSchlange.push(new Gegner(gegnerArten[i][0], gegnerArten[i][1], gegnerArten[i][2], gegnerArten[i][3]));
		}
	}
	tempgegnerSchlange=shuffle(tempgegnerSchlange);
	this.gegnerSchlange=this.gegnerSchlange.concat(tempgegnerSchlange);
	this.wellenNr++;
	}
	else {
		if(gegner.length<=0&&this.gegnerSchlange.length<=0) {
			$("#end-screen").show();
			$("#lvl-end").show();
			$("#lose").hide();
			//alert("Gewonnen");
		}
	}
}

Spiel.prototype.nextOne = function(tdiff) {
	if(this.gegnerSchlange.length>0) {
	this.gegnerTimer+=tdiff;
	}
vari=1500;
while(this.gegnerTimer>=vari/Math.sqrt(this.wellenNr)&&this.gegnerSchlange.length>0) {
	this.gegnerTimer-=vari/Math.sqrt(this.wellenNr);
gegner.push(this.gegnerSchlange[0]);

this.gegnerSchlange.splice(0,1);

}

}

Spiel.prototype.updateInterface = function() {
	$('#money #value').html(spieler.geld);
	$('#wave #value').html(spiel.wellenNr);
	$('#leben3').attr("src","img/herz.png");
	$('#leben2').attr("src","img/herz.png");
	$('#leben1').attr("src","img/herz.png");
	switch(spieler.leben) {
		case 0:
			$('#leben1').attr("src","img/keinherz.png");
		case 1:
			$('#leben2').attr("src","img/keinherz.png");
		case 2:
			$('#leben3').attr("src","img/keinherz.png");
	}
	if(spieler.leben<0) {
		$('#leben3').attr("src","img/keinherz.png");
		$('#leben2').attr("src","img/keinherz.png");
		$('#leben1').attr("src","img/keinherz.png");
	}
}

Spiel.prototype.muteMusic = function() {
	if(muteMusic == true){
		sounds[0].muted = true;
		muteMusic = false;
		$('#music-img').attr('src', 'img/eighthnotemuted.png');
	}else{
		sounds[0].muted = false;
		muteMusic = true;
		$('#music-img').attr('src', 'img/eighthnote.png');
	}
}

Spiel.prototype.muteSound = function() {
	if(muteSound == false){
		muteSound = true;
		$('#sound-img').attr('src', 'img/muted.png');
	}else{
		muteSound = false;
		$('#sound-img').attr('src', 'img/raise.png');
	}
}

$(document).ready(function() {
	/*$('html').click(function() {
		$('#build-menu').hide();
		alert('klick');
	});*/
	var canvas = document.getElementById('canvas');
	canvas.onclick = function(event) {
		var mausX = event.clientX + window.pageXOffset - canvas.offsetLeft;
		var mausY = event.clientY + window.pageYOffset - canvas.offsetTop;
	//	console.log("mausX: " + mausX + " mausY: " + mausY);
		feldX = Math.floor(mausX/feldGroesse);
		feldY = Math.floor(mausY/feldGroesse);
		if(spiel.istBebaubar(feldX, feldY)){
			$('#build-menu').css({'left': mausX + canvas.offsetLeft, 'top': mausY + canvas.offsetTop}).show();
			$('#demolish-menu').hide();
		}
		else if(!spiel.istBebaubar(feldX, feldY)){
			$('#build-menu').hide();
			if(spiel.istBebaut(feldX, feldY))
				$('#demolish-menu').css({'left': mausX + canvas.offsetLeft, 'top': mausY + canvas.offsetTop}).show();
			else
				$('#demolish-menu').hide();
		}
	};

});
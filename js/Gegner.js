
function Gegner(leben, geschwindigkeit, beute, bild){

	this.leben = leben;
	this.maxLeben = leben;
	this.geschwindigkeit = geschwindigkeit;				
	this.beute = beute;
	this.bild = bild;
	this.strPosition = 0;
	this.strecke = 0;
	this.fertig= 0;
	this.slow = 0;
	this.dot = 0;
	this.zaehlerSlow = 0;
	this.zaehlerDot = 0;
	this.akkBild=bild;
	this.bildZaehler=0;
	this.dotDamage = 0.01;

	this.gehen = function(zeitdiff){
		//console.log(this.strPosition+" "+this.strecke);
		this.strecke += (this.geschwindigkeit*zeitdiff);
		if(this.strecke>=feldGroesse){		
			this.strPosition+=Math.floor(this.strecke/feldGroesse);
			if(this.strPosition>=strFelder.length-1){
				this.amZiel();
			}
			this.strecke=this.strecke-Math.floor((this.strecke/feldGroesse))*feldGroesse;
		}
		/*---------------Status effekte-----------*/
		if(this.slow == 1 && this.zaehlerSlow <= 100){
			this.zaehlerSlow++;
		}
		else if(this.slow == 1 && this.zaehlerSlow>100){
			this.slow=0;
			this.zaehlerSlow =0;
			this.geschwindigkeit=this.geschwindigkeit*2;    					//slowness zurücksetzten
		}
		if(this.dot == 1 && this.zaehlerDot <= 200){
			this.getroffen(this.dotDamage,0);							//schaden muss angepasst werden
			this.zaehlerDot++;
		}
		else if(this.dot == 1 && this.zaehlerDot >200){
			this.dot=0;
			this.zaehlerDot = 0;
		}
	}
}

Gegner.prototype.sterben = function(){
	spieler.geld+= this.beute;
	for(var kind=13; kind <= 18; kind++){
		if(this.bild == kind){
			if(muteSound == false){
				soundClone = sounds[8].cloneNode();
				soundClone.play();
			}
		}
	}
	for(var fetter=19; fetter <= 24; fetter++){
		if(this.bild == fetter){
			if(muteSound == false){
				soundClone = sounds[9].cloneNode();
				soundClone.play();
			}
		}
	}
	for(var scooter=25; scooter <= 30; scooter++){
		if(this.bild == scooter){
			if(muteSound == false){
				soundClone = sounds[10].cloneNode();
				soundClone.play();
			}
		}
	}
	//console.log("Gestorben!");
	this.fertig=1;
}

Gegner.prototype.getroffen = function(schaden, effekt, pUpgrade){			//effekt = 8, 9, 12 noraler schaden.  
	//console.log(this.leben+" GETROFFEN");
	this.leben = this.leben - schaden;
	if(effekt==11){
		this.slow = 1;
		if(this.zaehlerSlow==0){
			if(pUpgrade==0){
			 	this.geschwindigkeit=this.geschwindigkeit/2;
			 	}
			 if(pUpgrade==1){
			 	this.geschwindigkeit=this.geschwindigkeit/3;
			 }  					  //slowness anpassen
		 }  
		this.zaehlerSlow = 0;
	}
	if(effekt==10){
		this.dot = 1;
		this.zaehlerDot =0;
		if(pUpgrade==0){
			this.dotDamage = 0.01;
		}
		if(pUpgrade==1){
			this.dotDamage =this.dotDamage*2;		}
	}

	if(this.leben<=0){
		this.sterben();
	}
}

Gegner.prototype.amZiel = function(){
	//console.log("amZiel");
	spieler.getroffen();   							// Spieler muss immer spieler heißen sonst Fehler/ undefined
	this.fertig=1;
}

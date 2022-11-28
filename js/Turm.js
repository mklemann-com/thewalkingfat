	function Turm (reichweite,bild,feuerrate,schaden,positionX,positionY,projektilGeschwindigkeit,projektilBild, kosten){
		this.reichweite=reichweite;
		this.bild=bild; //turmunterscheidung
		this.feuerrate=feuerrate;
		this.schaden=schaden;
		this.positionX=positionX;
		this.positionY=positionY;
		this.projektilGeschwindigkeit=projektilGeschwindigkeit;
		this.projektilBild=projektilBild;
		this.zuletztgefeuert = feuerrate;
		this.kosten = kosten;
		this.upgrade = 0;
	}

	Turm.prototype.gegnerReichweite=function(){
		if (typeof this.gegner=== "undefined"){
			return false;
		}
		if (this.gegner.strPosition<strFelder.length){
		if (Math.sqrt((strFelder[this.gegner.strPosition].positionX- (this.positionX)) * (strFelder[this.gegner.strPosition].positionX- (this.positionX)) 
			+ (strFelder[this.gegner.strPosition].positionY - (this.positionY)) * (strFelder[this.gegner.strPosition].positionY - (this.positionY))) <= this.reichweite){
			//console.log("In Reichweite");
			return true;
	}
}
	return false;		

}



	Turm.prototype.schiessen =function(zeitDiff){
		if ((typeof this.gegner !== "undefined" )) {
			if(this.feuerrate <= this.zuletztgefeuert && this.gegner.fertig <= 0 && this.gegnerReichweite()){

					//Audio
					if(muteSound == false){
						soundClone = sounds[this.bild].cloneNode();
						soundClone.play();
					}
					//console.log("FEUER");
					switch(this.bild){
						case 4: 	
						if ((Math.random()*100)+1>80){
							var neuerSchuss = new Projektil(this.positionX,this.positionY,this.projektilGeschwindigkeit,this.projektilBild,(this.schaden*2),this.gegner, this.upgrade);
							projektile.push(neuerSchuss);
						} else {
							var neuerSchuss = new Projektil(this.positionX,this.positionY,this.projektilGeschwindigkeit,this.projektilBild,this.schaden,this.gegner, this.upgrade);
							projektile.push(neuerSchuss);
							
						}
						break;
						default:          			//Tower 3-7 (Normal, crit, gift, eis, aoe)
						var neuerSchuss = new Projektil(this.positionX,this.positionY,this.projektilGeschwindigkeit,this.projektilBild,this.schaden,this.gegner, this.upgrade);
						projektile.push(neuerSchuss);
					}

					
					/*var neuerSchuss = new Projektil(this.positionX,this.positionY,this.projektilGeschwindigkeit,this.projektilBild,this.schaden,this.gegner);
					projektile.push(neuerSchuss);*/
					//console.log("gefeuert" + this.zuletztgefeuert);		
					this.zuletztgefeuert = 0;
				} else{
					this.zuletztgefeuert+=zeitDiff;
					if(!this.gegnerReichweite()||this.gegner.fertig>0) {
					this.sucheGegner();
					}
					//console.log("zuklein" + this.zuletztgefeuert);
				}
			} else {
				//console.log("SUCHE");
				//console.log("Suche nach erstem Gegner");
				this.sucheGegner();
				this.zuletztgefeuert+=zeitDiff;
				//console.log("kein gegner" + this.zuletztgefeuert);
			}

		}

		Turm.prototype.sucheGegner=function(){
			//console.log("SUCHE GEGNER");
			var kannErreichen = new Array();
			//console.log("reichweite unsere" + this.reichweite);
			for(var zaehler3 = 0; zaehler3 < strFelder.length; zaehler3++){
		/*		console.log("entfernung" + Math.sqrt((strFelder[zaehler3].positionX - this.positionX) * (strFelder[zaehler3].positionX - this.positionX) 
			+ (strFelder[zaehler3].positionY - this.positionY) * (strFelder[zaehler3].positionY - this.positionY)));*/
	if(Math.sqrt((strFelder[zaehler3].positionX - (this.positionX)) * (strFelder[zaehler3].positionX - (this.positionX)) 
		+ (strFelder[zaehler3].positionY - (this.positionY)) * (strFelder[zaehler3].positionY - (this.positionY))) <= this.reichweite){
					//console.log("Feld "+zaehler3+" in Reichweite");
					kannErreichen.push(zaehler3); //vll. +1
				}
			}
			forfertig=0;
			for(var zaehler4 = kannErreichen.length-1; zaehler4 >= 0 && forfertig<1; zaehler4--){ 
				for (var zaehler2=0; zaehler2<gegner.length && forfertig<1;zaehler2++ ){
					if (typeof gegner[zaehler2]!== "undefined"){
						if(gegner[zaehler2].strPosition==kannErreichen[zaehler4] && gegner[zaehler2].fertig<=0) {
							//console.log("Hat Gegner");
							this.gegner=gegner[zaehler2];
							forfertig=1;
						}
						
					
					}
				}

			}
	}

Turm.prototype.upgraden = function(){
		if(this.upgrade==0){
			if(muteSound == false){
				soundClone = sounds[12].cloneNode();
				soundClone.play();
			}
			this.feuerrate = this.feuerrate/1.5;
			this.schaden = this.schaden*2;
			this.upgrade = 1;
		}
	
}




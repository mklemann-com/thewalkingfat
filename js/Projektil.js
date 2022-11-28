function Projektil(positionX,positionY,geschwindigkeit,bild,schaden,mygegner, upgrade) {
	this.positionX=positionX*feldGroesse;
	this.positionY=positionY*feldGroesse;
	this.geschwindigkeit=geschwindigkeit;
	this.bild=bild;
	this.schaden=schaden;
	this.mygegner=mygegner;
	this.rotation=0;
	this.fertig=0;
	this.xdiff=0;
	this.ydiff=0;
	this.tUpgrade = upgrade;
	this.getGegnerPos = function() {
		rstrFelder = new Array();
		if(this.mygegner.strPosition<strFelder.length-1) {
			this.xdiff = strFelder[this.mygegner.strPosition].positionX*feldGroesse-strFelder[this.mygegner.strPosition+1].positionX*feldGroesse;
			this.ydiff = strFelder[this.mygegner.strPosition].positionY*feldGroesse-strFelder[this.mygegner.strPosition+1].positionY*feldGroesse;

		}
		xplus = 0;
		yplus = 0;

		if(this.xdiff<0) {
			xplus=this.mygegner.strecke;
		}
		else if(this.xdiff>0) {
			xplus=-this.mygegner.strecke;	
		}
		else if(this.ydiff<0) {
			yplus=this.mygegner.strecke;	
		}
		else if(this.ydiff>0) {
			yplus=-this.mygegner.strecke;	
		}

		/*if(this.xdiff>0) {
			xplus+=this.mygegner.strecke;
		}
		else {
			yplus+=this.mygegner.strecke;
		}*/
		if(this.mygegner.strPosition<strFelder.length-1) {
			rstrFelder.push(strFelder[this.mygegner.strPosition].positionX*feldGroesse+xplus);
			rstrFelder.push(strFelder[this.mygegner.strPosition].positionY*feldGroesse+yplus);
		}
		else {
			rstrFelder.push(0);
			rstrFelder.push(0);
			this.fertig=1;
		}
		//console.log("Gegner-Strecke: "+this.mygegner.strecke+" xdiff: "+this.xdiff+" ydiff: "+this.ydiff);
		return rstrFelder;
	};
	this.treffer = function() {
		//console.log("Getroffen");
		//console.log(gegner.length);
		if(this.bild == 12){
			for(var i = 0; i < gegner.length; i++){
			//	console.log(this.mygegner.strPosition +"this gegner"+ gegner[i].strPosition+"gegnerstr." );
				if(gegner[i].strPosition == this.mygegner.strPosition){
					gegner[i].getroffen(this.schaden, this.bild, this.tUpgrade);
				}

			}			
		}else{
			this.mygegner.getroffen(this.schaden, this.bild, this.tUpgrade);
		}
		this.fertig=1;
	}
	this.flugbahnBerechnen = function(zeitdiff) {
		//console.log("Bahn");
		//console.log("Projektil auf "+this.positionX+"|"+this.positionY+"; Gegner auf "+this.getGegnerPos()[0]+"|"+this.getGegnerPos()[1]);
		rgeschwindigkeit=this.geschwindigkeit*zeitdiff;
		if(this.mygegner.fertig>0) {
			this.fertig=1;
		}
		var x_diff = this.getGegnerPos()[0]-this.positionX;
		var y_diff = this.getGegnerPos()[1]-this.positionY;
		var strecke = Math.sqrt(x_diff*x_diff+y_diff*y_diff);
		if(x_diff<feldGroesse/4 && x_diff>-feldGroesse/4 && y_diff<feldGroesse/4 && y_diff>-feldGroesse/4) 			{
			this.treffer();
		}
		else {
			var x_step = rgeschwindigkeit*x_diff/strecke;
			var y_step = rgeschwindigkeit*y_diff/strecke;
			if(strecke<rgeschwindigkeit) {
				x_step=x_diff;
				y_step=y_diff;
			}
			//console.log("x_step="+x_step+" | y_step="+y_step);
			//console.log("x_diff="+x_diff+" | y_diff="+y_diff);
			this.positionX=this.positionX+x_step;
			this.positionY=this.positionY+y_step;
			//console.log("Neue Position des Projektils ist: "+this.positionX+"|"+this.positionY);
		}
	}
}

function Spieler(leben,geld){
	this.leben = leben;
	this.geld = geld;
}

Spieler.prototype.getroffen = function(){
	this.leben = this.leben-1;
	this.sterben();
}

Spieler.prototype.sterben = function(){
	console.log("Aktuelles Leben: "+this.leben);
	if(this.leben <= 0){
		if(muteSound == false && this.leben == 0){
			soundClone = sounds[11].cloneNode();
			soundClone.play();
		}
		$('#end-screen').show();
		$('#lose').show();
	}
}
$(document).ready(function() {
	centerWrapper();
	$(window).resize(centerWrapper);
});

function centerWrapper() {
	var margin = ($(window).height()-$('#wrapper').height())/2;
	if(margin > 25)
		$('#wrapper').css('margin', margin + 'px auto');
	else
		$('#wrapper').css('margin', '25px auto');
}
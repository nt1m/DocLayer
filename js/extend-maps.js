//map insertion used in menu.js

$(".map-dialog").hide();

function mapdialogopen() {
	        var input = "<iframe class='mapplaceholder'/>"; //add a placeholder to mark the cursor position
        pasteHtmlAtCaret(input, false);
$(".map-lat-chooser").val(""); //reset the value
$(".map-long-chooser").val(""); //reset the value
$(".map-dialog").fadeIn(100);
$(".dialog-overlay").fadeIn(100);
}

function mapdialogclose() {
	$(".map-dialog").fadeOut(100);
	$(".dialog-overlay").fadeOut(100);
	$(".mapplaceholder").remove();
}

function insertmapfromdialog() {
	var lat = $(".map-lat-chooser").val();
	var long = $(".map-long-chooser").val();
	var placeholder = $(".mapplaceholder");
	placeholder.attr("src", "extend-maps/map.html#" + lat + "," + long);
	placeholder.removeClass("mapplaceholder").addClass("extend-block").addClass("map-extend-block"); //use the placeholder to add a map
	mapdialogclose();
}

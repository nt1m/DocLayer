//show and hide the stuff we don't wan initially

$(".start-menu").hide();
$(".image-dialog").hide();

function showstartmenu() {
	$(".start-menu").fadeIn(200);
}

function hidestartmenu() {
	$(".start-menu").hide();
}

$(".start-button").hover(showstartmenu);

$(document.body).click(hidestartmenu);

//bind functions using carat.api.js

function insertheading() {
        var input = "<h1>Heading</h1>";
        pasteHtmlAtCaret(input, false);
}

function insertsubheading() {
        var input = "<h2>Subheading</h2>";
        pasteHtmlAtCaret(input, false);
}

function insertmap() {
	        var input = "<iframe src='extend-maps/map.html#40.7127,-74.0059' class='map-extend-block'></iframe>"; //default coordinates are NYC
        pasteHtmlAtCaret(input, false);
}

//bind button events - use mousedown so that the buttons can't steal the focus

$("#heading-insert").mousedown(insertheading);
$("#subheading-insert").mousedown(insertsubheading);
$("#map-insert").mousedown(insertmap);

//these are defined in extend-images.js
$("#image-insert").mousedown(imagedialogopen);
$("#imagechooser-okay-button").click(insertimagefromdialog); //this doesn't need focus, you can use a regular click event
$("#imagechooser-cancel-button").click(imagedialogclose); //this doesn't need focus, you can use a regular click event
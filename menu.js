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

function imagedialogopen() {
$(".image-url-chooser").val(""); //reset the value
$(".image-dialog").fadeIn(100);
}

function insertimagefromdialog() {
	var newimage = $(".image-url-chooser").val();
	var imagetemplate = '<img src="imageval" class="img-extend-block"/>'
	imagetemplate = imagetemplate.replace("imageval", newimage);
	$("#document-editor").append(imagetemplate);
	$(".image-dialog").fadeOut(100);
}
//bind button events - use mousedown so that the buttons can't steal the focus

$("#heading-insert").mousedown(insertheading);
$("#subheading-insert").mousedown(insertsubheading);
$("#image-insert").mousedown(imagedialogopen);
$("#imagechooser-okay-button").mousedown(insertimagefromdialog);
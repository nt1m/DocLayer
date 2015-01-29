//image insertion used in menu.js

function imagedialogopen() {
	        var input = "<img class='imageplaceholder'/>"; //add a placeholder to mark the cursor position
        pasteHtmlAtCaret(input, false);
$(".image-url-chooser").val(""); //reset the value
$(".image-dialog").fadeIn(100);
$(".dialog-overlay").fadeIn(100);
}

function imagedialogclose() {
	$(".image-dialog").fadeOut(100);
	$(".dialog-overlay").fadeOut(100);
	$(".imageplaceholder").remove();
}

function insertimagefromdialog() {
	var newimage = $(".image-url-chooser").val();
	
	//format the url
	
	    if (!newimage.match("^(http://|https://|mailto:)")) {
      newimage = "http://" + newimage;
    }

	var placeholder = $(".imageplaceholder");
	placeholder.attr("src", newimage);
	placeholder.removeClass("imageplaceholder").addClass("extend-block").addClass("img-extend-block"); //use the placeholder to add an image
	$(".image-dialog").fadeOut(100);
}

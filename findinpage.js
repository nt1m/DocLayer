//basic find in page feature

/*

TODO:
-show # matches
-fuzzy search?
-replace/replace all

*/

function startsearch() {
	e.preventDefault();
$("#findinpage-input").show().css("width", "0px").animate({width: "200px"}, 70).focus();
}

function endsearch() {
	$("#findinpage-input").hide().val("");
		$("#document-editor").removeHighlight();
}

function highlightmatches() {
		$("#document-editor").removeHighlight();
	$("#document-editor").highlight($("#findinpage-input").val());
}

$("#findinpage-input").hide();

$("#findinpage-button").click(startsearch);

$("#findinpage-input").blur(endsearch);

$("#findinpage-input").keyup(highlightmatches);
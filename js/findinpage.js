//basic find in page feature

/*

TODO:
-show # matches
-fuzzy search?
-replace/replace all

*/

var findinpageinput = $("#findinpage-input");
var editor = $("#document-editor");

function startsearch() {
findinpageinput.show().css("width", "0px").animate({width: "200px"}, 70).focus();
}

function endsearch() {
	findinpageinput.hide().val("");
	editor.removeHighlight();
}

function highlightmatches() {
	editor.removeHighlight();
	editor.highlight(findinpageinput.val());
}

findinpageinput.hide();

$("#findinpage-button").click(startsearch);

findinpageinput.blur(endsearch);

findinpageinput.keyup(highlightmatches);
//basic find in page feature

/*

TODO:
-show # matches
-fuzzy search?
-replace/replace all

*/

var findinpagecontainer = $(".findinpage");
var findinpageinput = $("#findinpage-input");
var editor = $("#document-editor");
var findinpagecount = $(".findinpage-count");

function startsearch() {
findinpagecount.html("");
findinpagecontainer.show().css("width", "0px").animate({width: "200px"}, 70);
findinpageinput.focus();
}

function endsearch() {
	findinpagecontainer.hide().css("width", "0px");
	findinpageinput.val("");
	editor.removeHighlight();
}

function highlightmatches() {
	editor.removeHighlight();
	editor.highlight(findinpageinput.val());
	findinpagecount.html($(".highlight").length);
}

findinpagecontainer.hide();

$("#findinpage-button").click(startsearch);

findinpageinput.blur(endsearch);

findinpageinput.keyup(highlightmatches);
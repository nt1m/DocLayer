scratchpad.editor = $("#document-editor");

//DO NOT remove core moduels
var core = ["keybindings", "ui", "caret", "editortooltip"];
core.forEach(function (value) {
	scratchpad.modules.load("editor/js/" + value + ".js");
});

var modulesToLoad = ["menu", "editor", "images", "maps", "videos", "embeds", "revisions", "findinpage", "research", "charts", "imageEditor", "spellcheck", "contentimport"];
$(window).load(function () {
	$(".splashscreen.loading").hide();
	modulesToLoad.forEach(function (value) {
		scratchpad.modules.load("editor/js/" + value + ".js");
	});
});
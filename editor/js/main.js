scratchpad.editregion = $("#document-editor");

//DO NOT remove core moduels
var core = ["keybindings", "ui", "caret", "editortooltip"];
core.forEach(function (value) {
	scratchpad.modules.load("editor/js/" + value + ".js");
});

//there are some disabled modules that aren't included - videos and comments

var modulesToLoad = ["menu", "editor", "images", "maps", "embeds", "revisions", "sharing", "findinpage", "research", "charts", "imageEditor", "spellcheck", "contentimport", "drawings"];
$(window).load(function () {
	$(".splashscreen.loading").hide();
	modulesToLoad.forEach(function (value) {
		scratchpad.modules.load("editor/js/" + value + ".js");
	});
});
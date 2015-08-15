docLayer.editregion = $("#document-editor");

//DO NOT remove core moduels
var core = ["keybindings", "ui", "caret", "editortooltip"];
core.forEach(function (value) {
	docLayer.modules.load("editor/js/" + value + ".js");
});

var lastCoreModule = core[core.length - 1]

//there are some disabled modules that aren't included - videos and comments

var modulesToLoad = ["menu", "editor", "images", "maps", "embeds", "revisions", "sharing", "findinpage", "research", "charts", "imageEditor", "spellcheck", "contentimport", "drawings"];

$(document.body).on("moduleload", function (e, parameters) {
	if (parameters.name == lastCoreModule) {
		setTimeout(function () { //let the stylesheets for the core modules finish loading before removing the splash
			$(".splashscreen.loading").remove();
			modulesToLoad.forEach(function (name) {
				docLayer.modules.load("editor/js/" + name + ".js");
			});
		}, 280);
		lastCoreModule = undefined;
	}
});

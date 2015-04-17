var scratchpad = {
	ismobilesafari: (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
	editor: $("#document-editor"),
	modules: {
		load: function (name) {
			var scriptEl = $("<script async>").attr("src", "js/" + name + ".js");
			scriptEl.appendTo("body");
			scriptEl.on("error", function () {
				console.log("[scratchpad.modules.load] Failed to load module: " + name);
			});
		},
		define: function (name, code) {
			scratchpad[name] = code;
			if (scratchpad[name].hasOwnProperty("html")) {
				$(document.body).append(scratchpad[name].html);
			}
			if (scratchpad[name].css != false) { //this is loaded at define because it needs to access the css property of the module
				var stylesheet = $("<link>").attr("rel", "stylesheet").attr("href", "css/" + name + ".css");
				stylesheet.appendTo("body");
			}
			if (scratchpad[name].hasOwnProperty("init")) {
				scratchpad[name].init();
			}
		}
	},
	init: function () {

		if (scratchpad.ismobilesafari) {
			$(document.body).addClass("mobilesafari");
		}

		var starttime = Date.now(); // start performance logging

		//DO NOT remove core moduels
		var core = ["keybindings", "ui", "caret", "editortooltip", "darktheme"]; //the darktheme is core to reduce the white flash before loading
		core.forEach(function (value) {
			scratchpad.modules.load(value);
		});
		var modulesToLoad = ["menu", "editor", "images", "maps", "videos", "embeds", "findinpage", "research", "charts", "comments", "imageEditor", "spellcheck", "contentimport"];
		$(window).load(function () {
			$(".splashscreen.loading").hide();
			modulesToLoad.forEach(function (value) {
				scratchpad.modules.load(value);
			});
		});
		//performance logging
		var endtime = Date.now();
		var diff = endtime - starttime;
		console.log("modules loaded in " + diff + " ms");
	}
}
$(function () {
	scratchpad.init();
});
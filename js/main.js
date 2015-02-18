var scratchpad = {
	modules: {
		load: function(name) {
			var scriptEl = $("<script async>").attr("src", "js/" + name + ".js");
			scriptEl.appendTo("body");
			scriptEl.on("error", function() {
				console.log("[scratchpad.modules.load] Failed to load module: " + name);
			});
		},
		define: function(name, code) {
			scratchpad[name] = code;
			if(scratchpad[name].hasOwnProperty("init")) {
				scratchpad[name].init();
			}
		}
	},
	init: function() {
		var starttime = Date.now(); // start performance logging

		//DO NOT remove core moduels
		var core = ["keybindings", "caret", "editortooltip", "darktheme"]; //the darktheme is core to reduce the white flash before loading
		core.forEach(function(value) {
			scratchpad.modules.load(value);
		});
		var modulesToLoad = ["editor", "ui", "images", "maps", "videos", "embeds", "findinpage", "research" ];
		$(window).load(function() {
			modulesToLoad.forEach(function(value) {
				scratchpad.modules.load(value);
			});
		});
		//performance logging
		var endtime = Date.now();
		var diff = endtime - starttime;
		console.log("modules loaded in " + diff + " ms");
	}
}
$(function() {
	scratchpad.init();
});
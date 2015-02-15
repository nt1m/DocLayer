var scratchpad = {
	modules: {
		load: function(name) {
			var scriptEl = $("<script>").attr("src", "js/" + name + ".js");
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

		// The modules are loaded in the order they are specified
		var modulesToLoad = ["keybindings", "editor", "caret", "ui", "darktheme", "images", "maps", "videos", "embeds", "findinpage", "research", "editortooltip" ];
		modulesToLoad.forEach(function(value) {
			scratchpad.modules.load(value);
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
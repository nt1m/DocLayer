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
		// The modules are loaded in the order they are specified
		var modulesToLoad = ["editor", "caret", "ui", "darktheme", "images", "maps", "findinpage" ];
		modulesToLoad.forEach(function(value) {
			scratchpad.modules.load(value);
		});
	}
}
$(function() {
	scratchpad.init();
});
var scratchpad = {
	ismobilesafari: (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
	modules: {
		load: function (path) {
			var scriptEl = $("<script async>").attr("src", config.basepath + path);
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
		config.core_modules.forEach(function (path) {
			scratchpad.modules.load(path);
		});
	}
}
$(function () {
	scratchpad.init();
});
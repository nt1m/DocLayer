var scratchpad = {
	ismobilesafari: (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
	modules: {
		load: function (path) {
			/*
			jQuery treats scripts like this as AJAX requests, and prevents them from being cached. If jQuery is not used, the scripts are cached, and the editor loads twice as quickly.
			*/

			var script = document.createElement("script");
			script.async = true;
			script.src = config.basepath + path;
			document.body.appendChild(script);
			script.onerror = function () {
				console.log("[scratchpad.modules.load] Failed to load module: " + name);
			}
		},
		define: function (name, code) {
			scratchpad[name] = code;

			if (scratchpad[name].hasOwnProperty("html")) {
				body.append(scratchpad[name].html);
			}
			if (scratchpad[name].css != false) { //this is loaded at define because it needs to access the css property of the module
				var stylesheet = $("<link>").attr("rel", "stylesheet").attr("href", config.basepath + "editor/css/" + name + ".css");
				stylesheet.appendTo("body");
			}
			if (scratchpad[name].hasOwnProperty("init")) {
				scratchpad[name].init();
			}
			console.log(name, performance.now());
			body.trigger("moduleload", {
				name: name
			});
		}
	},
	init: function () {
		if (scratchpad.ismobilesafari) {
			body.addClass("mobilesafari");
		}
		config.core_modules.forEach(function (path) {
			scratchpad.modules.load(path);
		});
	}
}
$(function () {
	scratchpad.init();
});

var docLayer = {
	ismobilesafari: (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
	modules: {
		load: function (path) {
			/*
			jQuery treats scripts like this as AJAX requests, and prevents them from being cached. If jQuery is not used, the scripts are cached, and the editor loads twice as quickly.
			*/

			var script = document.createElement("script");
			script.async = false;
			script.src = config.basepath + path;
			document.body.appendChild(script);
			script.onerror = function () {
				console.log("[docLayer.modules.load] Failed to load module: " + name);
			}
		},
		define: function (name, code) {
			docLayer[name] = code;

			if (docLayer[name].hasOwnProperty("html")) {
				body.append(docLayer[name].html);
			}
			if (docLayer[name].css != false) { //this is loaded at define because it needs to access the css property of the module
				var stylesheet = $("<link>").attr("rel", "stylesheet").attr("href", config.basepath + "editor/css/" + name + ".css");
				stylesheet.appendTo("body");
			}
			if (docLayer[name].hasOwnProperty("init")) {
				docLayer[name].init();
			}
			console.log(name, performance.now());
			body.trigger("moduleload", {
				name: name
			});
		}
	},
	init: function () {
		if (docLayer.ismobilesafari) {
			body.addClass("mobilesafari");
		}
		config.core_modules.forEach(function (path) {
			docLayer.modules.load(path);
		});
	}
}
$(function () {
	docLayer.init();
});

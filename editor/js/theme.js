var theme_module = {
	css: false,
	checktheme: function () {
		var d = new Date();

		var curr_hour = d.getHours();

		if (curr_hour < 6 || curr_hour > 20) {
			$(document.body).addClass("dark-theme");
		} else {
			$(document.body).removeClass("dark-theme");
		}

	},
	disableThemeSwitching: function () {
		clearInterval(this.interval);
		this.interval = null;
	},
	enableThemeSwitching: function () {
		this.interval = setInterval(this.checktheme, 30000);
	},
	init: function () {
		this.checktheme();
		this.interval = setInterval(this.checktheme, 30000);
	}
}

if(window.scratchpad && window.scratchpad.modules) {
	scratchpad.modules.define("theme", theme_module);
} else {
	window.theme = theme_module;
	theme.init();
}
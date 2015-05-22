var theme_module = {
	css: false,
	checktheme: function () {
		var d = new Date();

		var curr_hour = d.getHours();

		if (curr_hour < 6 || curr_hour > 20) {
			this.switchToTheme("dark");
		} else if (this.selectedTheme && this.selectedTheme != "dark") {
			this.switchToTheme(this.selectedTheme);
		}

	},
	switchToTheme: function (themeName) {
		this.selectedTheme = themeName;
		$("#themestyle").remove();
		if (themeName == "default") {
			$(document.body).removeClass("dark-theme");
		} else if (themeName == "dark") {
			$(document.body).addClass("dark-theme");
		} else {
			$(document.body).removeClass("dark-theme");
			$("<link rel='stylesheet' id='themestyle'>").attr("href", "../global/themes/" + themeName + ".css").appendTo(document.body);
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
		var _ = this;
		this.checktheme = this.checktheme.bind(this);
		this.switchToTheme = this.switchToTheme.bind(this);
		this.checktheme();
		this.enableThemeSwitching();

		getPref("theme", function (theme) {
			if (theme) { //the pref has a value
				_.switchToTheme(theme);
				_.selectedTheme = theme;
			}
		});
	}
}

if (window.scratchpad && window.scratchpad.modules) {
	scratchpad.modules.define("theme", theme_module);
} else {
	window.theme = theme_module;
	theme.init();
}
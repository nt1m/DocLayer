scratchpad.modules.define("theme", {
	css: false,
	checktheme: function () {
		var _ = this;
		var d = new Date();

		var curr_hour = d.getHours();

		if (curr_hour < 6 || curr_hour > 20) {
			this.switchToTheme("dark");
		} else {
			getPref("theme", function (theme) {
				_.switchToTheme(theme);
			});
		}

	},
	switchToTheme: function (themeName) {
		this.selectedTheme = themeName;
		if (themeName == "default") {
			$(document.body).removeClass("dark-theme");
			$("#themestyle").remove();
		} else if (themeName == "dark") {
			$(document.body).addClass("dark-theme");
			$("#themestyle").remove();
		} else {
			$(document.body).removeClass("dark-theme");
			var previousThemeSource = $("#themestyle").attr("href");
			var newThemeSource = "../global/themes/" + themeName + ".css";
			if (previousThemeSource != newThemeSource) {
				$("#themestyle").remove();
				$("<link rel='stylesheet' id='themestyle'>").attr("href", "../global/themes/" + themeName + ".css").appendTo(document.body);
			}
		}
	},
	disableThemeSwitching: function () {
		clearInterval(this.interval);
		this.interval = null;
	},
	enableThemeSwitching: function () {
		this.checktheme();
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
});
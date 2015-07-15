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
	switchToolbarBackground: function (image) {
		if (image) {
			$(".toolbar").css({
				"background-image": "url(" + image + ")",
				"background-size": "cover",
				"background-attachment": "fixed",
				"background-position": "center center",
			});
		} else {
			$(".toolbar").css({
				"background-image": "",
				"background-size": "",
				"background-attachment": "",
				"background-position": "",
			});
		}
	},
	init: function () {
		var _ = this;
		this.checktheme = this.checktheme.bind(this);
		this.switchToTheme = this.switchToTheme.bind(this);

		getPref("theme.autoswitch", function (autoswitch) {
			if (autoswitch != false) {
				_.enableThemeSwitching();
			}
		});

		getPref("theme", function (theme) {
			if (theme) { //the pref has a value
				_.switchToTheme(theme);
				_.selectedTheme = theme;
			}
		});

		getPref("theme.toolbarBackground", function (image) {
			_.switchToolbarBackground(image);
		});

		if (window.definePref) { //we're in the preferences view
			definePref({
				category: "Appearance",
				description: "Theme",
				pref: "theme",
				values: ["default", "dark", "modern", "book"],
				defaultValue: "default",
			});
			definePref({
				category: "Appearance",
				description: "Automatically switch to the dark theme at night",
				pref: "theme.autoswitch",
				values: [true, false],
				defaultValue: true,
			});
			definePref({
				category: "Appearance",
				description: "Toolbar background image",
				pref: "theme.toolbarBackground",
				values: ["input:text:Enter a URL"],
				defaultValue: "",
			});
		}
		$(document).on("prefschange", function () {
			getPref("theme", function (theme) {
				_.switchToTheme(theme);
				_.selectedTheme = theme;
			});
			getPref("theme.toolbarBackground", function (image) {
				_.switchToolbarBackground(image);
			});
		});
	}
});
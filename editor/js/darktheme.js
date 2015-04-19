scratchpad.modules.define("darktheme", {
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
		var _ = this;
		this.checktheme();
		this.interval = setInterval(this.checktheme, 30000);
	}
});
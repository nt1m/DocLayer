scratchpad.modules.define("menu", {
	html: '\
		<div noprint id="start-menu-container">\
			<div class="start-menu">\
			</div>\
			<button title="Add a new item" class="fab theme-accent-color start-button">\
				<i class="icon-add"></i>\
			</button>\
	</div>\
	',
	addItem: function (options) {
		var button = $("<a>");
		button.addClass("fab").addClass("small");
		button.addClass("color-" + options.color).addClass("bg-" + options.background);
		button.attr("id", options.name + "-insert");
		button.attr("title", options.name);
		button.on("mousedown", options.fn);
		var icon = $("<i>");
		icon.addClass(options.icon);
		icon.appendTo(button);
		button.appendTo(this.menu);
	},
	init: function () {
		this.menu = $(".start-menu");
	}
});
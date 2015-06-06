config.preference_modules.forEach(function (value) {
	scratchpad.modules.load(value);
});

var prefs_container = $(".preferences-container");
var inputs_generated = 0;

var canDestroyMenu;

function getSwitch() {
	inputs_generated++;
	var switch_html = '\
			<div class="switch float-right">\
				<input type="checkbox" id="%switch-id%" />\
				<label for="%switch-id%"></label>\
			</div>\
	';

	switch_html = switch_html.replace(/%switch-id%/g, inputs_generated);
	return $(switch_html);
}

function definePref(options) {
	getPref(options.pref, function (currentValue) {
		options.currentValue = currentValue;
		//check if the category already exists. If not, create a new container.
		if ($("#preference-category-" + options.category)[0]) {
			var group_container = $("#preference-category-" + options.category);
		} else {
			var group_container = $("<div class='card'>").attr("id", "preference-category-" + options.category);
			group_container.appendTo(prefs_container);
			var heading = $("<h1>").text(options.category);
			group_container.before(heading);
		}

		var pref_container = $("<div class='preference-container'>");
		pref_container.text(options.description);

		if (options.values[0] == true) { //this is a true/false pref, we should show a switch
			var prefInput = getSwitch();
			var innerInput = prefInput.find("input");

			if (options.currentValue == undefined) {
				innerInput.attr("checked", options.defaultValue);
			} else {
				innerInput.attr("checked", options.currentValue);
			}

			innerInput.on("change", function () {
				setPref(options.pref, innerInput.is(":checked"));
				$(document).trigger("prefschange");
			});

			prefInput.prependTo(pref_container);

		} else { //generic preferences view
			var button = $("<button class='button float-right'>");

			if (options.currentValue) {
				button.text(options.currentValue);
			} else {
				button.text(options.defaultValue);
			}

			button.on("click", function () {

				canDestroyMenu = false;
				$(".preference-menu").remove(); //remove any previous menus
				//generate the menu
				var offset = button.offset();
				var height = button[0].getBoundingClientRect().height; //jQuery reports the height as incorrect for some reason
				var menu = $(' <ul class="menu preference-menu"> </ul>');
				menu.css({
					position: "absolute",
					top: (offset.top + height + 5) + "px",
					left: offset.left + "px",
				});

				//add the menu items
				options.values.forEach(function (value) {
					var item = $('<li ripple><a>' + value + '</a></li>');
					item.children().on("click", function () {
						setPref(options.pref, $(this).text());
						button.text($(this).text());
						$(document).trigger("prefschange");
					});
					item.appendTo(menu);
				});

				//add the menu
				menu.appendTo(document.body);

				setTimeout(function () {
					canDestroyMenu = true;
				}, 50);
			});

			button.prependTo(pref_container);
		}
		pref_container.appendTo(group_container);

		$(".splashscreen.loading").hide();

	});
}

$(document.body).on("click", function () {
	if (canDestroyMenu) {
		console.log("destroying menu");
		$(".preference-menu").remove();
	}
});
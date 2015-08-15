if (!client.isAuthenticated()) {
	window.location = config.basepath;
}

config.preference_modules.forEach(function (value) {
	docLayer.modules.load(value);
});

var prefs_container = $(".preferences-container");
var inputs_generated = 0;

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

		} else if (options.values[0].indexOf("input:") == 0) { //can be any value. show a user input, using the value after the : as the input type. (ex. "input:text", "input:number", etc.)
			var inputOptions = options.values[0].split(":");

			var prefInput = $("<input class='float-right'>");
			prefInput.attr("type", inputOptions[1]);

			if (inputOptions[1] == "range") {
				prefInput.addClass("slider");
			} else {
				prefInput.addClass("text-input");
			}

			prefInput.attr("placeholder", inputOptions[2] || options.defaultValue || "");

			prefInput.val(options.currentValue || "");

			prefInput.on("focus", function () {
				prefInput.select();
			});

			prefInput.on("change", function () {
				setPref(options.pref, prefInput.val());
				$(document).trigger("prefschange");
			});

			prefInput.prependTo(pref_container);

		} else { //generic preferences view
			var dropdown = $("<select class='dropdown-menu float-right'>");

			options.values.forEach(function (option) {
				$("<option>").text(option).appendTo(dropdown);
			});

			dropdown.val(options.currentValue || options.defaultValue);

			dropdown.on("change", function () {
				setPref(options.pref, dropdown.val());
				$(document).trigger("prefschange");
			})

			dropdown.prependTo(pref_container);
		}
		pref_container.appendTo(group_container);

		$(".splashscreen.loading").hide();

	});
}
scratchpad.modules.define("maps", {
	html: '\
		<div noprint class="dialog map-dialog" hidden>\
		<span class="dialog-title">Choose map location</span>\
		<div class="dialog-content">\
			<input title="Choose a map location" type="text" id="map-search" class="text-input" placeholder="Enter an address"/>\
			<ul id="map-results" class="list">\
			</ul>\
		<span class="secondary-text">Data provided by MapQuest, <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and contributors, <a href="http://wiki.openstreetmap.org/wiki/Legal_FAQ#3a._I_would_like_to_use_OpenStreetMap_maps._How_should_I_credit_you.3F">ODbL </a></span>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="map-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
			</span>\
		</div>\
	</div>\
	',
	geolocation_options: {
		enableHighAccuracy: false,
		maximumAge: 60000,
		timeout: 10000
	},
	ondialogopen: function () {
		var input = "<iframe sandbox='allow-scripts' class='mapplaceholder'/>"; //add a placeholder to mark the cursor position
		scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function () {
		$(".mapplaceholder").remove();
	},
	getIconFromType: function (type) {
		var icon;
		switch (type) {
		case "bus_stop":
		case "bus_station":
			icon = "icon-directions-bus";
			break;
		case "subway":
		case "tram_stop":
			icon = "icon-directions-subway";
			break;
		case "ferry_terminal":
			icon = "icon-directions-ferry";
			break;
		case "pharmacy":
			icon = "icon-pharmacy";
			break;
		case "aerodrome":
			icon = "icon-airport";
			break;
		case "car":
			icon = "icon-directions-car";
			break;
		case "parking":
			icon = "icon-parking";
			break;
		case "station":
		case "railway":
			icon = "icon-directions-train";
			break;
		case "bank":
			icon = "icon-account-balance";
			break;
		case "bakery":
			icon = "icon-cake";
			break;
		case "bar":
			icon = "icon-bar";
			break;
		case "deli":
		case "restaurant":
		case "supermarket":
		case "grocery":
		case "greengrocer":
			icon = "icon-restaurant";
			break;
		case "cafe":
			icon = "icon-cafe";
			break;
		case "library":
		case "books":
			icon = "icon-library";
			break;
		case "retail":
		case "mall":
		case "marketplace":
		case "shop":
		case "clothes": //TODO find a better icon for this
			icon = "icon-offer";
			break;
		case "park":
		case "nature_reserve":
			icon = "icon-landscape";
			break;
		case "florist":
			icon = "icon-florist";
			break;
		case "cinema":
			icon = "icon-movie";
			break;
		case "theatre":
		case "musical_instrument":
			icon = "icon-audiotrack";
			break;
		case "fuel":
			icon = "icon-gas-station";
			break;
		case "computer":
			icon = "icon-laptop";
			break;
		default:
			icon = "icon-place";
			break;
		}
		return icon;
	},
	insertMap: function (lat, lon) {

		var placeholder = $(".mapplaceholder");
		placeholder.attr("src", "extend-maps/map.html#" + lat + "," + lon);
		placeholder.removeClass("mapplaceholder").addClass("extend-block").addClass("map-extend-block"); //use the placeholder to add a map
		scratchpad.ui.dialogs.hide(this.dialogEl);
	},
	setToCurrentLocation: function () {
		var _ = this;
		navigator.geolocation.getCurrentPosition(function (position) {
			_.insertMap(position.coords.latitude, position.coords.longitude);
		}, null, this.geolocation_options);
	},
	updateResults: function (searchterm) { //shows the results
		var _ = this;
		$.ajax("https://open.mapquestapi.com/nominatim/v1/search.php?format=json&limit=10&q=" + encodeURIComponent(searchterm))
			.done(function (results) {
				_.resultsList.html(""); //clear any previous results
				results.forEach(function (r) {
					var name_address_array = r.display_name.replace(", ", "///").split("///"); //the address and name are mixed together seperated by a comma, split them up

					//extract the item type
					var itemtype = r.type;
					if (itemtype == "yes") { //sometimes, the class contains the actual info and the type is just "yes"
						itemtype = r.class;
					}

					//add the item to the list
					var item = $("<li ripple>");
					$("<i class='item-action'>").addClass(_.getIconFromType(itemtype)).attr("title", itemtype).appendTo(item); //add the icon
					var title = $("<span class='item-text'>");
					title.text(name_address_array[0]);
					var addressbox = $("<span class='secondary-text'>");
					addressbox.text(name_address_array[1]);
					addressbox.appendTo(title);
					title.appendTo(item);
					item.appendTo(_.resultsList);

					//click event
					item.on("click", function () {
						_.insertMap(r.lat, r.lon);
					});
				});
				if (results.length == 0) {
					_.resultsList.append("<span class='secondary-text'>No results found.</span")
				}
			})
			.fail(function () {
				_.resultsList.html(""); //clear any previous results
				_.resultsList.append("<span class='secondary-text'>Error finding places.</span")
			})
	},
	init: function () {
		var _ = this;
		this.insertMap = this.insertMap.bind(this);
		this.setToCurrentLocation = this.setToCurrentLocation.bind(this);
		this.updateResults = this.updateResults.bind(this);
		this.dialogEl = $(".map-dialog");
		this.resultsList = $("#map-results");

		scratchpad.menu.addItem({
			color: "white",
			background: "green-500",
			name: "map",
			icon: "icon-map",
			fn: function () {
				scratchpad.ui.dialogs.show(_.dialogEl);
			}
		});

		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);

		if ("geolocation" in navigator) {
			this.dialogEl.find(".dialog-footer").prepend('<button id="map-geolocation-button" class="button color-accent-color">Use my location</button>');
		}
		$("#map-geolocation-button").on("click", function () {
			_.setToCurrentLocation();
		});
		$("#map-search").on("change", function () {
			_.updateResults($(this).val());
		});
	}
});
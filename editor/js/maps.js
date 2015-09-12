docLayer.modules.define("maps", {
	html: '\
		<div noprint class="dialog map-dialog" hidden>\
		<span class="dialog-title">Choose map location</span>\
		<div class="dialog-content">\
			<input title="Choose a map location" type="text" id="map-search" class="text-input" placeholder="Enter an address"/>\
			<ul id="map-results" class="list">\
			</ul>\
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
	sendThemeToFrame: function (t) {
		$(".map-extend-block").each(function () {
			this.contentWindow.postMessage(docLayer.theme.selectedTheme, config.basepath);
		});
	},
	ondialogopen: function () {

		//workaround for a mobile safari bug in which the dialog gets bigger every time it is opened, eventually leading to the dialog going off the screen.
		if (docLayer.ismobilesafari || docLayer.maps.debugsafari == true) {
			var height = $(window).height() * 0.6;
			height = Math.max(320, height);
			height = Math.min(850, height);

			$(".map-dialog").css("height", height + "px");
		}

		var input = "<iframe class='mapplaceholder'/>"; //add a placeholder to mark the cursor position
		docLayer.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function () {
		$(".mapplaceholder").remove();
	},
	insertMap: function (loc, lat, lon) {

		var placeholder = $(".mapplaceholder");
		loc = btoa(loc)
		placeholder.attr("src", config.basepath + "editor/extend-maps/map.html#" + loc + ((lon) ? "," + lat + "," + lon : ""));
		placeholder.removeClass("mapplaceholder").addClass("extend-block").addClass("map-extend-block"); //use the placeholder to add a map
		docLayer.ui.dialogs.hide(this.dialogEl);
	},
	setToCurrentLocation: function () {
		var _ = this;
		navigator.geolocation.getCurrentPosition(function (position) {

			_.insertMap("", position.coords.latitude, position.coords.longitude);
		}, null, this.geolocation_options);
	},
	updateResults: function (searchterm) { //shows the results
		var _ = this;
		if (searchterm != "") {
			$.ajax("https://api.mapbox.com/v4/geocode/mapbox.places/{query}.json?access_token=".replace("{query}", encodeURIComponent(searchterm)) + config.mapbox)
				.done(function (results) {
					_.resultsList.html(""); //clear any previous results
					results.features.forEach(function (r) {
						//extract the item type

						//add the item to the list
						var item = $("<li ripple>");
						$("<i class='item-action'>").addClass("icon-place").appendTo(item); //add the icon
						var title = $("<span class='item-text'>");
						title.text(r.text);
						var addressbox = $("<span class='secondary-text'>");
						addressbox.text(r.place_name);
						addressbox.appendTo(title);
						title.appendTo(item);
						item.appendTo(_.resultsList);

						//click event
						item.on("click", function () {
							_.insertMap(r.place_name);
						});
					});
					if (searchterm && results.features.length == 0) {
						_.resultsList.append("<span class='secondary-text'>No results found.</span")
					}
				})
				.fail(function () {
					_.resultsList.html(""); //clear any previous results
					_.resultsList.append("<span class='secondary-text'>Error finding places.</span")
				})
		}
	},
	init: function () {
		var _ = this;
		this.insertMap = this.insertMap.bind(this);
		this.setToCurrentLocation = this.setToCurrentLocation.bind(this);
		this.updateResults = this.updateResults.bind(this);
		this.dialogEl = $(".map-dialog");
		this.resultsList = $("#map-results");

		docLayer.menu.addItem({
			color: "white",
			background: "green-500",
			name: "map",
			icon: "icon-map",
			fn: function () {
				docLayer.ui.dialogs.show(_.dialogEl);
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
		var searchBox = $("#map-search");
		var previousEntry = "";

		setInterval(function () {
			if (searchBox.val() != previousEntry) {
				previousEntry = searchBox.val();
				_.updateResults(searchBox.val());
			}
		}, 1250);

		//update the maps theme

		setTimeout(_.sendThemeToFrame, 2500);
		setInterval(_.sendThemeToFrame, 12000);
	}
});

//grab the synced data and create a map with it

var hash = window.location.hash.replace("#", "");
var options = hash.split(",");
var placeName = options[0]
placeName = atob(placeName);
var lat = options[1]
var lon = options[2];
var minimalUI = options[3];
var zoomOut = options[4];

if (minimalUI == "true") {
	$("body").addClass("minimalUI");
}

var zoom = 14;

if (zoomOut == "true") {
	zoom = 10;
}

var mapillary_popup = $(".mapillary-image-viewer");
var mapillary_renderer = $("#mapillary-image");
var mapillary_close_button = $(".mapillary-quit");

var tabs = {
	satellite: $("[mode=satellite]"),
	map: $("[mode=regular]"),
}

L.mapbox.accessToken = config.mapbox
var map = L.mapbox.map('map-main'),
		geocoder = L.mapbox.geocoder('mapbox.places'),
		mapLayer = L.mapbox.tileLayer('mapbox.streets');

if(placeName) {

geocoder.query(placeName, function(error, data) {
    if (data.lbounds) {
        map.fitBounds(data.lbounds);
    } else if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], zoom);
				L.marker([data.latlng[0], data.latlng[1]]).addTo(map);
    }
});
	
} else {
	        map.setView([lat, lon], zoom);
					var marker = L.marker([lat, lon]).addTo(map)
					
}


mapLayer.addTo(map);

tabs.map.on("click", function () {
	if (satelliteLayer) {
		map.addLayer(mapLayer);
		map.removeLayer(satelliteLayer);
	}
	tabs.satellite.removeClass("selected");
	tabs.map.addClass("selected");
});

tabs.satellite.on("click", function () {
	if (!window.satelliteLayer) { //there isn't a satellite layer yet, create one
		window.satelliteLayer = L.mapbox.tileLayer('mapbox.satellite');
	}

	map.addLayer(satelliteLayer);
	map.removeLayer(mapLayer);
	tabs.satellite.addClass("selected");
	tabs.map.removeClass("selected");
});


map.on("click", function (e) {
	console.log(e);
	var lat = e.latlng.lat;
	var lon = e.latlng.lng;
	var maxDistance = (19 - map.getZoom()) * 12 + 15;
	console.log("distance is", maxDistance);
	$.ajax({
			url: "https://api.mapillary.com/v1/im/close",
			data: {
				lat: lat,
				lon: lon,
				distance: maxDistance,
				limit: 1,
			}
		})
		.done(function (data) {
			console.log(data);
			if (data.length > 0) {
				var image = data[0];
				var imagelat = image.lat;
				var imagelon = image.lon;
				var src = "https://d1cuyjsrcm0gby.cloudfront.net/" + image.key + "/thumb-640.jpg";
				var image = $("<img class='mapillary-image-thumb'>").attr("src", src)[0].outerHTML;
				var popup = L.popup({
						className: "mapillary-popup",
					})
					.setLatLng([imagelat, imagelon])
					.setContent(image + "<div class='popup-infotext'>Imagery by <a target='_blank' href='http://mapillary.com'>Mapillary</a></div>")
					.openOn(map);

				//recalculate the size of the popup when the image loads
				$(".mapillary-image-thumb").on("load", function () {
					popup.update();
				});
			} else {
				createToast("No ground imagery available for this location.");
			}

		});
});

mapillary_close_button.on("click", function () {
	mapillary_popup.attr("hidden", "true");
});

function enableMapillaryLayer() { //show where there are mapillary images. Not accessible through the UI, but useful for debugging.
	L.tileLayer("http://{s}.tiles.mapillary.com/{z}/{x}/{y}").addTo(map);
}

//postmessage theme

var theme = "default";

window.addEventListener('message', function (e) {
	if (e.data != theme) {
		if (e.data == "dark") {
			map.removeLayer(mapLayer);
			mapLayer = L.mapbox.tileLayer("mapbox.dark").addTo(map);
			$(document.body).addClass("dark-theme");
		} else {
			map.removeLayer(mapLayer);
			mapLayer = L.mapbox.tileLayer("mapbox.streets").addTo(map);
			$(document.body).removeClass("dark-theme");
		}
		theme = e.data;
	}
}, false);

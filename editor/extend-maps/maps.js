//grab the synced data and create a map with it

var hash = window.location.hash.replace("#", "");
var coords = hash.split(",");
var lat = coords[0]
var lon = coords[1];

var mapillary_popup = $(".mapillary-image-viewer");
var mapillary_renderer = $("#mapillary-image");
var mapillary_close_button = $(".mapillary-quit");

var tabs = {
	satellite: $("[mode=satellite]"),
	map: $("[mode=regular]"),
}

var map = L.map('map-main').setView([lat, lon], 14);
var mapLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
	maxZoom: 18,
	subdomains: '1234',
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. &copy; OpenStreetMap contributors (<a href="http://www.openstreetmap.org/copyright" target="_blank">license</a>)'
});

mapLayer.addTo(map);

var marker = L.marker([lat, lon]).addTo(map);

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
		window.satelliteLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
			maxZoom: 18,
			subdomains: '1234',
			attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
		});
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
				limit: 3,
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
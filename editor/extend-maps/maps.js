//grab the synced data and create a map with it

var hash = window.location.hash.replace("#", "");
var coords = hash.split(",");
var lat = coords[0]
var lon = coords[1]

var tabs = {
	satellite: $("[mode=satellite]"),
	map: $("[mode=regular]"),
}

var map = L.map('map-main').setView([lat, lon], 13);
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
})
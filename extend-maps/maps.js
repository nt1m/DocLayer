//grab the synced data and create a map with it

var hash = window.location.hash.replace("#", "");
var coords = hash.split(",");
var lat = coords[0]
var long = coords[1]

var map = L.map('map-main').setView([lat, long], 13);
			L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    subdomains: '1234',
	attribution: "&copy; 2015 MapQuest"
}).addTo(map);
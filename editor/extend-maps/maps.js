//grab the synced data and create a map with it

var hash = window.location.hash.replace("#", "");
var coords = hash.split(",");
var lat = coords[0]
var lon = coords[1]

var map = L.map('map-main').setView([lat, lon], 13);
L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
	maxZoom: 18,
	subdomains: '1234',
	attribution: "Data, imagery and map information provided by MapQuest, <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> and contributors, <a href='http://wiki.openstreetmap.org/wiki/Legal_FAQ#3a._I_would_like_to_use_OpenStreetMap_maps._How_should_I_credit_you.3F'>ODbL </a>"
}).addTo(map);

var marker = L.marker([lat, lon]).addTo(map);
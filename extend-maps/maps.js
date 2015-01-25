//grab the synced data and create a map with it

var hash = window.location.hash.replace("#", "");
var coords = hash.split(",");
var lat = coords[0]
var long = coords[1]

var map = L.map('map-main').setView([lat, long], 13);
			L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    maxZoom: 18,
    subdomains: '1234'
}).addTo(map);		

//update the data fields

$(".lat-controller").val(lat);
$(".long-controller").val(long);

$(".data-controller").change(function() {
	
	var lat = $(".lat-controller").val();
	var long = $(".long-controller").val();
	map.panTo( [lat, long] );
	window.location.hash = lat + "," + long; //for syncing with the main document
})
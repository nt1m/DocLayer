//switch to the dark theme at night

function checktheme() {
var d = new Date();

var curr_hour = d.getHours();

if(curr_hour < 6 || curr_hour > 20) {
	$(document.body).addClass("dark-theme");
}
else {
	$(document.body).removeClass("dark-theme");
}
}

checktheme();

setInterval(checktheme, 30000);
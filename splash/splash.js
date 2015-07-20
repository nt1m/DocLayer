document.addEventListener("touchstart", function () {}, false); //ios ripple

var client = new Dropbox.Client({
	key: config.dropbox,
});

// Try to use cached credentials.
client.authenticate({
	interactive: false
}, function (error, client) {
	if (error) {
		return console.log(error);
	}
	if (client.isAuthenticated()) {
		window.location = config.basepath + "doclist";
	} else {

		$(document).ready(function () {
			$(".signin-button").on("click", function () {
				// The user will have to click an 'Authorize' button.
				client.authenticate(function (error, client) {
					if (error) {
						return console.log(error);
					}
					window.location = config.basepath + "doclist";
				});
			});
			$("#details").on("click", function () {
				$("html").animate({
					scrollTop: $(window).height() * 0.82
				}, '500');
			})
		});

	}
});
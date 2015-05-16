document.addEventListener("touchstart", function () {}, false); //ios ripple

var client = new Dropbox.Client({
	key: config.dropbox,
});

// Try to use cached credentials.
client.authenticate({
	interactive: false
}, function (error, client) {
	if (error) {
		return handleError(error);
	}
	if (client.isAuthenticated()) {
		window.location = config.basepath + "doclist";
	} else {
		$(".signin-button").on("click", function () {
			// The user will have to click an 'Authorize' button.
			client.authenticate(function (error, client) {
				if (error) {
					return handleError(error);
				}
				window.location = config.basepath + "doclist";
			});
		});
	}
});
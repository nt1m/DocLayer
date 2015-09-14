$(".signout-button").on("click", function () {
	client.signOut({}, function () {
		window.location = config.basepath;
	});
});

var overlay = $(".dialog-overlay");
var menu = $("#user-menu");

// menu events

$(".menu-button").on("click", function () {
	overlay.removeAttr("hidden");
	overlay.attr("aria-hidden", false);
	menu.removeAttr("hidden");
	menu.attr("aria-hidden", false);
});

overlay.on("click", function () {
	overlay.attr("hidden", "true");
	overlay.attr("aria-hidden", true);
	menu.attr("hidden", "true");
	menu.attr("aria-hidden", true);
});

//show account data in the menu

setTimeout(function () {

	client.getAccountInfo({
		httpCache: true
	}, function (error, data) {
		if (error) {
			console.log("error getting account data", error);
			return createToast("An error occured.");
		}
		$("#userdata-name").text(data.name);
		$("#userdata-email").text(data.email);
	})
}, 2000);

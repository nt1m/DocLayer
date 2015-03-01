var client = new Dropbox.Client({key: "DROPBOX_APP_KEY"});

// Try to finish OAuth authorization.
client.authenticate({interactive: false}, function (error) {
    if (error) {
        console.log('Authentication error: ' + error);
    }
});

if (client.isAuthenticated()) {
    window.location = "https://standaert.net/scratchpad/doclist";
}

$(".signin-button").on("click", function() {
	client.authenticate();
});
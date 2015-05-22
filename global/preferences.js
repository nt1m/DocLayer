var client = new Dropbox.Client({
	key: config.dropbox
});

client.authenticate({
	interactive: false
}, function (error) {
	if (error) {
		createError({
			error: 'Authentication error: ' + error,
			action: "please log in to Dropbox and try again"
		});
	}
});

function getPref(prefName, callback) {
	if (!window.preferences) { //there aren't cached preferences
		client.readFile("/userdata/preferences.json",
			function (error, data) {
				if (error) { //this assumes the error is that there is no preferences file
					client.writeFile("/userdata/preferences.json", "{}");
					window.preferences = {};
				} else {
					window.preferences = JSON.parse(data);
				}

				callback(window.preferences[prefName]);
			});
	} else { //there are cached preferences
		callback(window.preferences[prefName]);
	}
}

/* this assumes getPref has been called first, which is usually true */

function setPref(prefName, value) {
	window.preferences[prefName] = value;
	client.writeFile("/userdata/preferences.json", JSON.stringify(window.preferences));
}
var titleinput = $(".doc-name");
var editregion = $("#document-editor");

function getAbstract(html) { //get a text string representative of the document
	var removed = $("<span>" + html + "</span>").remove("div").remove("iframe").remove("script"); //strip out the interactive stuff - we just want a text string
	removed = removed[0].textContent;
	var abstract = removed.substring(0, 175); //the length of the abstract to return
	if (abstract) {
		return abstract;
	} else {
		return "";
	}
}

function getPosterImage(html) {
	var content = $("<span>" + html + "</span>");
	var images = content.find("img");
	var posterImage = $(images[0]).attr("src");
	return posterImage;
};

var currentTime = (new Date).getTime();
var document_id = window.location.hash.replace("#", "");
var baseWindowTitle = document.title;


var client = new Dropbox.Client({
	key: config.dropbox
});

// Try to finish OAuth authorization.
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

if (client.isAuthenticated()) {
	client.readFile("/metadata/metadata.json", function (error, data) { //first, we need the metadata
		if (error) {
			return createError({
				error: 'Error loading metadata: ' + error,
				action: "please try again in a few minutes"
			});
		}

		window.metadata = JSON.parse(data);

		if (document_id && metadata[document_id]) { //this document already exists - load it
			client.readFile("/documents/" + document_id + ".html", function (error, data) {
				if (error) {
					return createError({
						error: 'Error loading document: ' + error,
						action: "please try again in a few minutes"
					});
				}
				titleinput.val(metadata[document_id].title);
				editregion.html(data);
				document.title = metadata[document_id].title + " | " + baseWindowTitle;

				window.cachedDocument = {
					title: metadata[document_id].title,
					content: editregion.html(),
				}
			});

		} else if (document_id) { //we have a hash, but it isn't in the metadata. Probably not owned by the user
			return createError({
				error: "Document does not exist.",
				action: "This document does not exist, or you do not have permission to view it."
			});

		} else { //there is no hash - create a document
			document_id = currentTime; //update this so we can save the document later
			metadata[document_id] = {
				title: "Untitled Document",
				abstract: "",
				posterImage: "",
				created: (new Date).getTime(),
				modified: (new Date).getTime(),
			}

			window.cachedDocument = {
				title: "Untitled Document",
				content: "",
			}

			client.writeFile("/documents/" + document_id + ".html", "", function (error, stat) {}); //create a new file
			client.writeFile("/metadata/metadata.json", JSON.stringify(window.metadata), function (error, stat) {}); //and also update the metadata
			window.location.hash = document_id; //and also update the URL
		}

		//save the document periodically

		function saveDocument() {
			if (titleinput.val() != window.cachedDocument.title || editregion.html() != window.cachedDocument.content) { //to prevent conflicts, we only save the document when content is added in the current window
				client.readFile("/metadata/metadata.json", function (error, data) { //we can't cache this
					if (error) {
						return createToast("Document could not be saved. Please make sure you are connected to the internet and try again.");
					}
					window.metadata = JSON.parse(data);
					//update the metadata
					metadata[document_id].title = titleinput.val();
					metadata[document_id].abstract = getAbstract(editregion.html());
					metadata[document_id].posterImage = getPosterImage(editregion.html());
					metadata[document_id].modified = (new Date).getTime();

					if (!metadata[document_id].title) { //if the title is empty, use the default
						metadata[document_id].title = "Untitled Document";
						titleinput.val("Untitled Document");
					}

					window.cachedDocument = {
						title: metadata[document_id].title,
						content: editregion.html(),
					}


					document.title = metadata[document_id].title + " | " + baseWindowTitle;

					client.writeFile("/metadata/metadata.json", JSON.stringify(metadata), function (error, stat) {
						if (error) {
							return createToast("Document could not be saved. Please make sure you are connected to the internet and try again.");
						}
					}); //update the metadata
					client.writeFile("/documents/" + document_id + ".html", editregion.html(), function (error, stat) {
						if (error) {
							return createToast("Document could not be saved. Please make sure you are connected to the internet and try again.");
						}
					}); //write file contents
				});
				removeToasts(); //clear any previous offiline errors, since the document saved successfully
			} else {}
		}

		window.refreshIfNeeded = function () {
			client.readFile("/documents/" + document_id + ".html", function (error, data) {
				if (error) {
					return createToast("An error occured.");
				}
				if (window.cachedDocument.content != data) { //only refresh if the document has changed
					window.cachedDocument.content = data; //update cached
					editregion.html(data);
					client.readFile("/metadata/metadata.json", function (error, data) { //also update metadata
						if (error) { //we don't want to parse the metadata if an error occured
							return createToast("An error occured.");
						}
						window.metadata = JSON.parse(data);
						document.title = metadata[document_id].title + " | " + baseWindowTitle;
						titleinput.val(metadata[document_id].title);
					});
				}
			});
		}

		setInterval(refreshIfNeeded, 17500);

		setInterval(saveDocument, 5500);

		window.onbeforeunload = function () {
			if (saveDocument()) {
				return "Your changes have not been saved yet. Are you sure you want to leave?"
			}
		}
	});

} else {
	window.location = config.basepath;
}
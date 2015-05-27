var window_hash = window.location.hash.replace("#", "");
var mode;

var doclist = $(".doclist");
var dialog_overlay = $(".dialog-overlay");
var deletion_dialog = $("#confirm-delete-dialog");
var mode_switcher = $("#mode-switch-button");

function changeSwitcherIcon() {
	if (mode == "list") {
		mode_switcher.html('<i class="icon-view-module"></i>').attr("title", "Switch to grid view");
	} else {
		mode_switcher.html('<i class="icon-view-list"></i>').attr("title", "Switch to list view");
	}
}

function goToDocument(id) {
	window.location = config.basepath + "editor/#" + id;
}

function deleteItem(e) {
	e.stopPropagation(); //prevent the document from loading into the editor
	$(e.target).parents(".document-item").addClass("deletion-candidate");
	dialog_overlay[0].hidden = false;
	dialog_overlay.attr("aria-hidden", "false");
	deletion_dialog[0].hidden = false;
	deletion_dialog.attr("aria-hidden", "false");
}

function addItem(data) {
	if (mode == "grid") {
		doclist.addClass("grid-list");
		var card = $("<div ripple='circle' class='tile document-tile document-item'>");
		card.on("click", function () {
			goToDocument(data.id);
		});
		card.attr("id", data.id); //this is needed to delete documents
		var background = $("<div class='tile-background'>");

		if (data.image) { //make sure there actually is a background before trying to load it
			$("<img>").attr("src", data.image).on("load", function () { //webkit will freeze and sometimes crash if the image is added directly as a background before it is loaded, so we need to lazyload it first
				background.css("background-image", "url(" + data.image + ")");
			});
		} else {
			background.addClass("no-background");
		}
		background.appendTo(card);

		var footer = $("<div class='tile-footer'>");
		var heading = $("<span class='item-text'>").text(data.title);

		var subheading = $("<span class='secondary-text'>");
		var createdRelativeTime = moment(data.createdAt).fromNow();
		subheading.text("Created " + createdRelativeTime);

		heading.appendTo(footer);
		subheading.appendTo(heading);

		var deletebutton = $('<i class="icon-delete item-action"></i>');
		deletebutton.on("click", deleteItem);

		deletebutton.appendTo(footer);
		footer.appendTo(card);
		card.prependTo(doclist);

	} else {
		var item = $("<li ripple class='document-item'>");
		item.attr("id", data.id);
		var icon = $("<i class='icon-drive-file item-action'>");
		var titlebox = $("<span class='item-text'>").text(data.title);
		var descriptionbox = $("<span class='secondary-text'>").text(data.description);
		var deletionbutton = $("<i title='Delete this document' class='icon-delete item-action'>");
		deletionbutton.on("click", deleteItem);
		icon.appendTo(item);
		titlebox.appendTo(item);
		descriptionbox.appendTo(titlebox);
		deletionbutton.appendTo(item);

		item.on("click", function () {
			goToDocument(data.id);
		});
		item.prependTo(doclist);
	}
}


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

	if (client.isAuthenticated()) {


		//retrieve the document data

		window.createDoclist = function () {

			client.readFile("/metadata/metadata.json", function (error, data) {
				if (error && error.status != Dropbox.ApiError.NOT_FOUND) {
					createError({
						error: "Error loading documents: " + error,
						action: "Please try again in a few minutes."
					});
					return;
				}

				if (error && error.status == Dropbox.ApiError.NOT_FOUND) { //there isn't a metadata file yet - create one
					client.writeFile("/metadata/metadata.json", "{}", function (error, stat) {
						if (error) {
							createError({
								error: "Error initializing documents: " + error,
								action: "Please try again in a few minutes."
							});
						}
					});
				}

				doclist.html(""); //clear any previous document listings
				var documents = JSON.parse(data);
				for (var document in documents) {
					addItem({
						title: documents[document].title,
						description: documents[document].abstract,
						id: document,
						image: documents[document].posterImage,
						createdAt: documents[document].created,
					});
				}

				$(".splashscreen.loading").hide();

				if ($.isEmptyObject(documents) || window_hash == "simulate_onboard") {
					doclist.append('<span id="no-documents" class="error secondary-text">You don\'t have any documents yet - when you do, they\'ll show up here.</span>');
				}
			});
		}

		getPref("doclist.mode", function (value) {
			if (value == "grid") {
				mode = "grid";
			} else {
				mode = "list";
			}
			createDoclist();
			changeSwitcherIcon();
		})

		$("#delete-cancel").on("click", function () {
			$(".deletion-candidate").removeClass("deletion-candidate");
			dialog_overlay[0].hidden = true;
			dialog_overlay.attr("aria-hidden", "true");
			deletion_dialog[0].hidden = true;
			deletion_dialog.attr("aria-hidden", "true");
		});

		$("#delete-confirm").on("click", function () {
			var document_id = $(".deletion-candidate").attr("id");

			client.readFile("/metadata/metadata.json", function (error, data) { //we can't use a cached version because documents might have been added on other devices, and we don't want to accidently remove documents from metadata
				if (error) {
					return ({
						error: "Error accessing metadata while attempting to delete document: " + error,
						action: "Please try again in a few minutes."
					});
				}

				var documents = JSON.parse(data);
				delete documents[document_id];
				client.writeFile("/metadata/metadata.json", JSON.stringify(documents));

			});

			client.delete("/documents/" + document_id + ".html", function () {
				$(".deletion-candidate").remove();
				dialog_overlay[0].hidden = true;
				dialog_overlay.attr("aria-hidden", "true");
				deletion_dialog[0].hidden = true;
				deletion_dialog.attr("aria-hidden", "true");
			});

		});


	} else {
		window.location = config.basepath;
	}

});


$("#document-create-button").on("click", function () {
	window.location = config.basepath + "editor";
});

$(".signout-button").on("click", function () {
	client.signOut({}, function () {
		window.location = config.basepath;
	});
});

mode_switcher.on("click", function () {
	if (mode == "list") {
		mode = "grid";
		setPref("doclist.mode", "grid");
		createDoclist();
		changeSwitcherIcon();
	} else {
		mode = "list";
		setPref("doclist.mode", "list");
		createDoclist();
		changeSwitcherIcon();
	}
});
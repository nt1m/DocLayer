var window_hash = window.location.hash.replace("#", "");
var mode = "list";
if (window_hash == "grid") {
	mode = "grid";
}

var doclist = $(".doclist");
var dialog_overlay = $(".dialog-overlay");
var deletion_dialog = $("#confirm-delete-dialog");
var mode_switcher = $("#mode-switch-button");

function goToDocument(id) {
	window.location = "https://standaert.net/scratchpad/editor/#" + id;
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
		})
		item.prependTo(doclist);
	}
}


var client = new Dropbox.Client({
	key: "DROPBOX_APP_KEY"
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


	//retrieve the document data

	var datastoreManager = client.getDatastoreManager();
	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if (error) {
			createError({
				error: "Error opening datastore: " + error,
				action: "Please try again in a few minutes."
			});
		}

		var documentTable = datastore.getTable('documents');

		window.createDoclist = function () {
			doclist.html(""); //clear any previous document listings
			var documents = documentTable.query();

			if (documents.length < 1 || window_hash == "simulate_onboard") {
				doclist.append('<span id="no-documents" class="error secondary-text">You don\'t have any documents yet - when you do, they\'ll show up here.</span>');
			}

			documents.forEach(function (value) {
				addItem({
					title: value.get('title'),
					description: value.get('abstract'),
					id: value.getId(),
					image: value.get("posterImage"),
					createdAt: value.get("created"),
				});
			});
		}

		createDoclist();
		$(".splashscreen.loading").hide();

		$("#delete-cancel").on("click", function () {
			$(".deletion-candidate").removeClass("deletion-candidate");
			dialog_overlay[0].hidden = true;
			dialog_overlay.attr("aria-hidden", "true");
			deletion_dialog[0].hidden = true;
			deletion_dialog.attr("aria-hidden", "true");
		});

		$("#delete-confirm").on("click", function () {
			var document_id = $(".deletion-candidate").attr("id");
			var documentDelete = documentTable.get(document_id);
			documentDelete.deleteRecord();

			$(".deletion-candidate").remove();
			dialog_overlay[0].hidden = true;
			dialog_overlay.attr("aria-hidden", "true");
			deletion_dialog[0].hidden = true;
			deletion_dialog.attr("aria-hidden", "true");
		});


	});


} else {
	window.location = "https://standaert.net/scratchpad";
}


$("#document-create-button").on("click", function () {
	window.location = "https://standaert.net/scratchpad/editor";
});

$(".signout-button").on("click", function () {
	client.signOut({}, function () {
		window.location = "https://standaert.net/scratchpad";
	});
});

mode_switcher.on("click", function () {
	if (mode == "list") {
		mode = "grid";
		mode_switcher.html('<i class="icon-view-headline"></i>');
		createDoclist();
	} else {
		mode = "list";
		mode_switcher.html('<i class="icon-view-module"></i>');
		createDoclist();
	}
});
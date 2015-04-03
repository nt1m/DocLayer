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

var document_id = window.location.hash.replace("#", "");
var baseWindowTitle = document.title;


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


	var datastoreManager = client.getDatastoreManager();
	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if (error) {
			createError({
				error: "Error opening datastore: " + error,
				action: "Please try again in a few minutes."
			});
		}

		var documentTable = datastore.getTable('documents');

		documentTable.setResolutionRule('content', 'sum');

		if (!document_id) {
			var currentDocument = documentTable.insert({
				title: "Untitled Document",
				content: "",
				abstract: "&nbsp;",
				created: new Date(),
				modified: new Date()
			});

			window.location.hash = currentDocument.getId(); //if someone reloads the page, the hash should not still be "new"

		} else {
			try {
				var currentDocument = documentTable.get(document_id);
			} catch (e) {
				createError({
					error: "Document does not exist.",
					action: "This document does not exist, or you do not have permission to view it."
				});
			}
		}

		if (!currentDocument) { //the document doesn't exist
			createError({
				error: "Document does not exist.",
				action: "This document does not exist, or you do not have permission to view it."
			});
		}
		var savedContent = currentDocument.get("content");
		var savedTitle = currentDocument.get("title");

		document.title = savedTitle + " | " + baseWindowTitle;

		$(".doc-name").val(currentDocument.get("title"));

		$("#document-editor").html(currentDocument.get("content"));

		function saveDocument() {
			if ($("#document-editor").html() != savedContent || $(".doc-name").val() != savedTitle) {

				if ($(".doc-name").val() != "") {
					var docTitle = $(".doc-name").val();
				} else {
					var docTitle = "Untitled Document";
				}
				console.log("syncing to dropbox");

				savedContent = $("#document-editor").html(); //in order for recordsChanged to work correctly, these need to update before the actual records
				savedTitle = $(".doc-name").val();
				document.title = savedTitle + " | " + baseWindowTitle; //update the title to reflect the most recent document title

				if (savedContent.length > 99000) {
					$(document.body).prepend('<div class="toast floating-message document-too-long"><label class="toast-label">This document is too long. Changes you make to it may not be saved.</label></div>');
				} else {
					$(".floating-message.document-too-long").remove();
				}
				currentDocument.set('title', docTitle);
				currentDocument.set("content", $("#document-editor").html());
				currentDocument.set("modified", new Date());
				currentDocument.set("abstract", getAbstract($("#document-editor").html()));
				return true;
			} else { //end if savedcontent
				return null;
			}
		}

		setInterval(saveDocument, 4000);
		window.onbeforeunload = function () {
			if (saveDocument()) {
				return "Your changes have not been saved yet. Are you sure you want to leave?"
			}
		}

		datastore.recordsChanged.addListener(function (event) {
			setTimeout(function () { //there's a lag in how fast the api updates - adjust for that
				if (currentDocument.get("content") != savedContent || currentDocument.get("title") != savedTitle) { //make sure this was a remote change
					$(".doc-name").val(currentDocument.get("title"));
					$("#document-editor").html(currentDocument.get("content"));
					savedContent = $("#document-editor").html();
					savedTitle = $(".doc-name").val();
				}
			}, 1750); //end settimeout
		});
	});


} else {
	window.location = "https://standaert.net/scratchpad";
}
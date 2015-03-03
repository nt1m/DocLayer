function getAbstract(html) { //get a text string representative of the document
	var removed = $("<span>" + html + "</span>").remove("div").remove("iframe").remove("script"); //strip out the interactive stuff - we just want a text string
	removed = removed[0].textContent;
	var brTemplate = '<br>';
	var re = new RegExp(brTemplate, 'g');
	removed = removed.replace(re, '');
	var abstract = removed.substring(0, 175); //the length of the abstract to return
	if(abstract) {
		return abstract;
	} else {
		return "";
	}
}

var document_id = window.location.hash.replace("#", "");


var client = new Dropbox.Client({
	key: "DROPBOX_APP_KEY"
});

// Try to finish OAuth authorization.
client.authenticate({
	interactive: false
}, function (error) {
	if (error) {
		alert('Authentication error: ' + error);
	}
});

if (client.isAuthenticated()) {


	var datastoreManager = client.getDatastoreManager();
	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if (error) {
			alert('Error opening default datastore: ' + error);
		}

		var documentTable = datastore.getTable('documents');

		documentTable.setResolutionRule('content', 'sum');

		if (document_id == "new") {
			var currentDocument = documentTable.insert({
				title: "Untitled Document",
				content: "",
				abstract: "&nbsp;",
				created: new Date(),
				modified: new Date()
			});

		} else {
			var currentDocument = documentTable.get(document_id);
		}

		var savedContent = currentDocument.get("content");
		var savedTitle = currentDocument.get("title");

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

				currentDocument.set('title', docTitle);
				currentDocument.set("content", $("#document-editor").html());
				currentDocument.set("modified", new Date());
				currentDocument.set("abstract", getAbstract($("#document-editor").html()));
				return true;
			} else {//end if savedcontent
				return null;
			}
		}

		setInterval(saveDocument, 4000);
		window.onbeforeunload = function() {
			if(saveDocument()) {
				return "Your changes have not been saved yet. Are you sure you want to leave?"
			}
		}
	});


} else {
	window.location = "https://standaert.net/scratchpad";
}
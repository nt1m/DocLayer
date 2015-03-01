function getAbstract(html) { //get a text string representative of the document
	var removed = $("<span>" + html + "</span>").remove("div").remove("iframe").remove("script"); //strip out the interactive stuff - we just want a text string
	removed.children().each(function() { //flatten the dom into something usable
														 $(this)[0].insertAdjacentHTML("beforebegin", " " + $(this).html() + " ");
															$(this).remove();
														});
	removed = removed.html();
	var brTemplate = '<br>';
	var re = new RegExp(brTemplate, 'g');
	removed = removed.replace(re, '');
	var abstract = removed.substring(0, 150); //the length of the abstract to return
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
				abstract: "",
				created: new Date(),
				modified: new Date()
			});

		} else {
			var currentDocument = documentTable.get(document_id);
		}

		var savedContent = currentDocument.get("content");

		$(".doc-name").val(currentDocument.get("title"));

		$("#document-editor").html(currentDocument.get("content"));

		setInterval(function () {

			if ($("#document-editor").html() != savedContent) {

				if ($(".doc-name").val() != "") {
					var docTitle = $(".doc-name").val();
				} else {
					var docTitle = "Untitled Document";
				}
				console.log("syncing to dropbox");
				
				
				currentDocument.set('title', docTitle);
				currentDocument.set("content", $("#document-editor").html());
				currentDocument.set("modified", new Date());
				currentDocument.set("abstract", getAbstract($("#document-editor").html()));
				savedContent = $("#document-editor").html();
			} //end if savedcontent
		}, 4000);
	});


} else {
	window.location = "https://standaert.net/scratchpad";
}
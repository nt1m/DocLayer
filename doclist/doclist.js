function addItem(data) {
	$(".doclist").prepend("<li ripple id='" + data.id + "'><i class='icon-drive-file item-action'></i><span class='item-text'>" + data.title + "<span class='secondary-text'>" + data.description + "</span></span><i class='icon-open-in-browser item-action'></i></li>");
}

//switch the user to the appropriate page

var client = new Dropbox.Client({
	key: "DROPBOX_APP_KEY"
});

// Try to finish OAuth authorization.
client.authenticate({
	interactive: false
}, function (error) {
	if (error) {
		console.log('Authentication error: ' + error);
	}
});

if (client.isAuthenticated()) {


	//retrieve the document data



	var datastoreManager = client.getDatastoreManager();
	datastoreManager.openDefaultDatastore(function (error, datastore) {
		if (error) {
			console.log('Error opening default datastore: ' + error);
		}

		// Now you have a datastore. The next few examples can be included here.

		var documentTable = datastore.getTable('documents');
		/*	var newDocument = documentTable.insert({
	title: 'Example document',
	content: "<span>document content</span>",
	created: new Date()
}); */

		var documents = documentTable.query();
		if (documents.length < 1) {
			$(".doclist").append('<span id="no-documents" class="error secondary-text">You don\'t have any documents yet - when you do, they\'ll show up here.</span>');
		}
		documents.forEach(function (value) {
			addItem({
				title: value.get('title'),
				description: value.get('abstract'),
				id: value.getId()
			});
		});
	});


} else {
	window.location = "https://standaert.net/scratchpad";
}


$(".doclist").on("click", "li", function (e) {
	var id = $(this).attr("id");
	window.location = "https://standaert.net/scratchpad/editor/index.html#" + id;
});

function showsearch() {
	$(document.body).addClass("find-in-page");
	$("#search-input").val("").focus();
}

function highlightmatches() {
	var searchterm = $("#search-input").val();
	var matches = 0;
	$(".doclist li").each(function () {
		if ($(this).html().toUpperCase().replace(/\s/g, '').indexOf(searchterm.toUpperCase().replace(/\s/g, '')) > -1 || !searchterm) {
			$(this).show();
			matches++;
		} else {
			$(this).hide();
		}
	});
	if (matches == 0) {
		$("#search-no-matches").show();
	} else {
		$("#search-no-matches").hide();
	}

}

function hidesearch() {
	setTimeout(function() { //give the user time to click on a search result
	$(document.body).removeClass("find-in-page");
	$(".doclist li").show();
	$("#search-no-matches").hide();
		}, 750);
}

$("#search-button").click(showsearch);

$("#search-input").keyup(highlightmatches);

$("#search-input").blur(hidesearch);

$("#document-create-button").on("click", function () {
	window.location = "https://standaert.net/scratchpad/editor/index.html#new";
});

$(".signout-button").on("click", function () {
	client.signOut({}, function () {
		window.location = "https://standaert.net/scratchpad";
	});
});
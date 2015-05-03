function showsearch() {
	$(document.body).addClass("find-in-page");
	$("#search-input").val("").focus();
}

function highlightmatches(e) {
	var searchterm = $("#search-input").val();
	var matches = 0;
	$(".document-item").each(function () {
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
	/* pressing return will take you to the first search result */
	if (e.keyCode == 13) {
		$(".document-item:visible").first().trigger("click");
	}
}

function hidesearch() {
	setTimeout(function () { //give the user time to click on a search result
		$(document.body).removeClass("find-in-page");
		$(".documnt-item").show();
		$("#search-no-matches").hide();
	}, 750);
}

$(document.body).on("keydown", function () {
	if (document.activeElement.id != "search-input") { //if we're not in the search box and a key is entered, show the search box
		showsearch();
	}
});

$("#search-button").click(showsearch);

$("#search-input").keyup(highlightmatches);

$("#search-input").blur(hidesearch);
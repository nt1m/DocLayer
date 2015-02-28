function addItem(data) {
	$(".doclist").append("<li ripple><span class='item-text'>" + data + "<span class='secondary-text'>" + data + "</span></span><i class='icon-open-in-browser item-action'></i></li>");
}

var names = [];

names.forEach(function(value) {
				addItem(value);
							});

if(names.length < 1) {
	$(".doclist").append('<span id="no-documents" class="error secondary-text">You don\'t have any documents yet - when you do, they\'ll show up here.</span>');
}


function showsearch() {
	$(document.body).addClass("find-in-page");
	$("#search-input").val("").focus();
}

function highlightmatches() {
	var searchterm = $("#search-input").val();
	var matches = 0;
	$(".doclist li").each(function() {
		if($(this).html().indexOf(searchterm) > 0 || !searchterm) {
			$(this).show();
			matches++;
		} else {
			$(this).hide();
		}
	});
	if(matches == 0) {
		$("#search-no-matches").show();
	} else {
		$("#search-no-matches").hide();
	}

}

function hidesearch() {
	$(document.body).removeClass("find-in-page");
	$(".doclist li").show();
	$("#search-no-matches").hide();
}

$("#search-button").click(showsearch);

$("#search-input").keyup(highlightmatches);

$("#search-input").blur(hidesearch);
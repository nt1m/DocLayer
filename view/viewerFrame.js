//prevent "undefined is not a function" errors

function getPref() {
	return;
}

function setPref() {
	return;
}

$(document).on("ready", function () {
	//setup
	docLayer.editregion = $("#document-editor");

	docLayer.modules.load("editor/js/keybindings.js");
	docLayer.modules.load("editor/js/ui.js");
	docLayer.modules.load("editor/js/research.js");

	var documentData = docLayer.editregion.html();
	var formattedData = documentData.replace("<br>", " ");
	var documentText = $("<div>").html(formattedData).text();

	var entities = nlp.spot(documentText, {});
	console.log("found entities", entities);

	entities.forEach(function (entity) {
		if (entity.pos_reason.indexOf("fallback") == -1) { //ignore fallback guesses, since they produce a lot of false positives
			var newData = $("<span>").text(entity.text).addClass("entity")[0].outerHTML;
			documentData = documentData.replace(entity.text, newData)
		}
	});

	docLayer.editregion.html(documentData);

	//make sure we don't have nested entities

	$(".entity > .entity").contents().unwrap();

	docLayer.editregion.on("click", "span.entity", function () {
		docLayer.research.show($(this).text());
	});

});
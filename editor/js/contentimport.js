/* convert pasted text from google docs/word */

scratchpad.modules.define("contentimport", {
	css: false,
	import: function (e) {
		var data = e.originalEvent.clipboardData;
		var content = data.getData('text/html');
		if (!content) { //there is no html data, try to get as plaintext instead
			content = data.getData('text/plain');
		}
		var boxset = $("<div>" + content + "</div>");
		boxset.find("span").each(function () { //remove google docs formatting spans
			var $this = $(this);
			var style = $this.attr("style");
			var contents = $this.contents();
			contents.unwrap(); //remove the old span
			if (style.indexOf("font-weight:bold") > -1) {
				contents.wrap("<b>");
			}
			if (style.indexOf("font-style:italic") > -1) {
				contents.wrap("<i>");
			}
			if (style.indexOf("text-decoration:underline") > -1) {
				contents.wrap("<u>");
			}
		});
		boxset.find("*").removeAttr("style").removeAttr("id").removeAttr("class"); //remove gogle docs inline styles and docs-internal-guid's
		boxset.find("img").addClass("extend-block").addClass("img-extend-block").removeAttr("width").removeAttr("height");
		boxset.find("table").remove(); //these aren't supported correctly
		boxset.find("meta").remove(); //these are useless
		boxset.find("style").remove(); //these are useless
		boxset.find("link").remove(); //these are useless
		boxset.find("h2 > b, h3 > b").contents().unwrap(); //subheadings are normally bolded, but we don't want then like that
		var htmlstring = boxset[0].innerHTML;
		document.execCommand("insertHTML", false, htmlstring);
	},
	init: function () {
		var _ = this;
		$("#document-editor").on("paste", function (e) {
			e.preventDefault();
			_.import(e);
		});
	}
});
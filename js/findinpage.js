//basic find in page feature

/*

TODO:
-show # matches
-fuzzy search?
-replace/replace all

*/
scratchpad.modules.define("findinpage", {
	findinpagecontainer: $(".findinpage"),
	findinpageinput: $("#findinpage-input"),
	editor: $("#document-editor"),
	findinpagecount: $(".findinpage-count"),

	startsearch: function() {
		this.findinpagecount.html("");
		this.findinpagecontainer.show().css("width", "0px").animate({width: "200px"}, 70);
		this.findinpageinput.focus();
	},

	endsearch: function() {
		this.findinpagecontainer.hide().css("width", "0px");
		this.findinpageinput.val("");
		this.editor.removeHighlight();
	},

	highlightmatches: function() {
		this.editor.removeHighlight();
		this.editor.highlight(this.findinpageinput.val());
		this.findinpagecount.html($(".highlight").length);
	},

	init: function() {
		// Bind functions
		this.startsearch = this.startsearch.bind(this);
		this.endsearch = this.endsearch.bind(this);
		this.highlightmatches = this.highlightmatches.bind(this);

		// Event listeners
		this.findinpagecontainer.hide();
		$("#findinpage-button").click(this.startsearch);
		this.findinpageinput.blur(this.endsearch);
		this.findinpageinput.keyup(this.highlightmatches);
	}
});
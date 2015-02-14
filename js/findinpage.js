//basic find in page feature

/*

TODO:
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
		this.findinpageinput.val("");
			this.findinpageinput.removeClass("no-matches");
		this.findinpagecontainer.show().css("width", "0px").animate({width: "200px"}, 70);
		this.findinpageinput.focus();
		if(window.location.hash != "#debug") {
			this.editor.attr("contenteditable", "false"); //temp fix for firefox bug
			}
	},

	endsearch: function() {
		this.findinpagecontainer.hide().css("width", "0px");
		this.editor.removeHighlight();
		this.editor.attr("contenteditable", "true"); //temp fix for firefox bug
	},

	highlightmatches: function() {
		this.editor.removeHighlight();
		this.editor.highlight(this.findinpageinput.val());
		var matches = $(".highlight").length
		this.findinpagecount.html(matches);
		if(matches == 0 && this.findinpageinput.val() != "") {
			this.findinpageinput.addClass("no-matches")
		} else {
			this.findinpageinput.removeClass("no-matches");
		}
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
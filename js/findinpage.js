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
		if(window.location.hash != "#debug") {
		  this.editor.attr("contenteditable", "false"); //temp fix for firefox bug
			}
	},

	endsearch: function() {
		this.findinpagecontainer.hide().css("width", "0px");
		this.findinpageinput.val("");
		this.editor.removeHighlight();
		this.editor.attr("contenteditable", "true"); //temp fix for firefox bug
	},

	highlightmatches: function() {
		this.editor.removeHighlight();
		this.editor.highlight(this.findinpageinput.val());
		this.findinpagecount.html($(".highlight").length);
	},
  
  showinfo: function() {
    var search = this.findinpageinput.val();
    var cardbox = $(".infocard-shell");
    cardbox.html("");
            infocard = new InfoCard({
            query: search,
            container: cardbox[0]
        });
  },
  
  hideinfo: function() {
    $(".infocard-shell").html("");
  },

	init: function() {
		// Bind functions
		this.startsearch = this.startsearch.bind(this);
		this.endsearch = this.endsearch.bind(this);
		this.highlightmatches = this.highlightmatches.bind(this);
		this.showinfo = this.showinfo.bind(this);
		this.hideinfo = this.hideinfo.bind(this);

		// Event listeners
		this.findinpagecontainer.hide();
		$("#findinpage-button").click(this.startsearch);
		this.editor.mousedown(this.endsearch);
		this.findinpageinput.keyup(this.highlightmatches);
    this.findinpageinput.keyup(this.showinfo);
    this.editor.mousedown(this.hideinfo);
	}
});
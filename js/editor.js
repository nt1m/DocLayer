scratchpad.modules.define("editor", {
	deletionButton: $(".deletion-button"),
	insertItem: function(item) {
		switch(item) {
			case "divider":
				var input = "<hr class='extend-block fullwidth divider'></hr>";
				break;
		}
		scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	showDeletion: function(item) {
		var button = this.deletionButton;
		var offset = item.offset();
		button.css({top: offset.top, left: offset.left});
		button.show();
		button.off();
		button.on("click", function() {
			item.remove();
			button.hide();
		});
	},
	hideDeletion: function() {
		this.deletionButton.hide();
	},
	starParagraph: function(e) {
		var target = $(e.target);
		if(e.pageX < target.offset().left) {
			if(target.attr("starred")) {
				target.removeAttr("starred");
			} else {
				target.attr("starred", "true");
			}
		}
	},
	init: function() {
		var _ = this;
		$("#divider-insert").on("mousedown", function() {
			_.insertItem("divider");
		});
		$("#document-editor").on( "mouseover", ".extend-block", function() {
			_.showDeletion($(this));
		});
		$("#document-editor").on("click", function() {
			_.hideDeletion();
		});
		$("#document-editor").on("click", "p", function(e) {
			_.starParagraph(e);
		})
	}
});
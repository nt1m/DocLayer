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
	}
});
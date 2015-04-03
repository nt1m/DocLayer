scratchpad.modules.define("editor", {
	insertItem: function(item) {
		switch(item) {
			case "divider":
				var input = "<hr class='divider'></hr>";
				break;
		}
		scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	showDeletion: function(item) {
		var button = this.deletionButton;
		var offset = item.offset();
		var itemwidth = item.width();

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
	starItem: function(e) {
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
		$(document.body).append('<div noprint class="deletion-button small fab color-red-500" title="Remove"><i class="icon-delete"></i></div>'); //add the deletion button
		this.deletionButton = $(".deletion-button");

		scratchpad.menu.addItem({
			color: "black",
			background: "white",
			name: "divider",
			icon: "icon-border-horizontal",
			fn: function() {
			_.insertItem("divider");
			}
		});

		$("#document-editor").on( "mouseover", ".extend-block", function() {
			_.showDeletion($(this));
		});
		$("#document-editor").on("click", function() {
			_.hideDeletion();
		});
		$("#document-editor").on("click", function(e) {
			_.starItem(e);
		});
		scratchpad.keybindings.addBinding("tab", function() {
			document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"); //TODO make this use real tabs (would require wrapping the editor in a <pre> block)
		});
	}
});
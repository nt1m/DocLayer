scratchpad.modules.define("editor", {
  deletionButton: $(".deletion-button"),
	insertItem: function(item) {
		switch(item) {
			case "divider":
				var input = "<hr class='extend-block fullwidth divider'></hr>";
				break;

			case "h1":
				var input = "<h1>Heading</h1>";
				break;

			case "h2":
				var input = "<h2>Sub-heading</h2>";
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
		grande.bind(document.querySelectorAll("article"));
		$("#heading-insert").on("mousedown", function() {
			_.insertItem("h1");
		});
		$("#subheading-insert").on("mousedown", function() {
			_.insertItem("h2");
		});
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
scratchpad.modules.define("images", {
	dialogEl: $(".image-dialog"),
	launchButton: $("#image-insert"),
	ondialogopen: function() {
		var input = "<img class='imageplaceholder'/>"; //add a placeholder to mark the cursor position
				scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
		$(".imageplaceholder").remove();
	},
	insertimagefromdialog: function() {
		var newimage = $(".image-url-chooser").val();
		if (!newimage.match("^(http://|https://|mailto:)")) {
				newimage = "http://" + newimage;
			}

		var placeholder = $(".imageplaceholder");
		placeholder.attr("src", newimage);
		placeholder.removeClass("imageplaceholder").addClass("extend-block").addClass("img-extend-block"); //use the placeholder to add an image
		scratchpad.ui.dialogs.hide($(this));
	},
	init: function() {
		var _ = this;
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertimagefromdialog)
	}
});
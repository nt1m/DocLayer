scratchpad.modules.define("embeds", {
	dialogEl: $(".embed-dialog"),
	launchButton: $("#embed-insert"),
	ondialogopen: function() {
		var input = "<iframe allowfullscreen sandbox='allow-forms allow-same-origin allow-scripts' class='embedplaceholder'/>"; //add a placeholder to mark the cursor position (also add some sandbox attributes)
				scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
		$(".embedplaceholder").remove();
	},
	insertembedfromdialog: function() {
		var embed = $(".embed-url-chooser").val();
		if (!embed.match("^(http://|https://)")) {
				embed = "http://" + embed;
			}

		var placeholder = $(".embedplaceholder");
		placeholder.attr("src", embed);
		placeholder.removeClass("embedplaceholder").addClass("extend-block").addClass("embed-extend-block"); //use the placeholder to add an image
		scratchpad.ui.dialogs.hide($(this));
	},
	init: function() {
		var _ = this;
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertembedfromdialog)
	}
});
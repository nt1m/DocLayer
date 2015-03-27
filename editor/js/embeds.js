scratchpad.modules.define("embeds", {
	html: '\
		<div noprint class="dialog embed-dialog small-dialog" hidden>\
		<span class="dialog-title">Choose a URL to embed</span>\
		<div class="dialog-content">\
			<input type="text" class="embed-url-chooser text-input" placeholder="Paste a URL here"/>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="embed-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="embed-okay-button" class="button dialog-confirm color-accent-color">Add url</button>\
			</span>\
		</div>\
	</div>\
	',
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
		if(embed.indexOf("<iframe") > -1) { //if the user accidently pasted in the whole iframe
			embed = $(embed).attr("src");
		}
		if (!embed.match("^(http://|https://)")) {
				embed = "https://" + embed; //auto-https may cause issues for some websites, but is needed to prevent mixed content from being blocked
			}

		var placeholder = $(".embedplaceholder");
		placeholder.attr("src", embed);
		placeholder.removeClass("embedplaceholder").addClass("extend-block").addClass("embed-extend-block"); //use the placeholder to add an image
		scratchpad.ui.dialogs.hide($(this));
	},
	init: function() {
		var _ = this;
		this.dialogEl = $(".embed-dialog");
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertembedfromdialog)
	}
});
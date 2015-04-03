scratchpad.modules.define("images", {
	html: ' \
		<div noprint class="dialog image-dialog small-dialog" hidden>\
		<span class="dialog-title">Choose an image</span>\
		<div class="dialog-content">\
			<input type="text" class="image-url-chooser text-input" placeholder="Paste a URL here"/>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="imagechooser-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="imagechooser-okay-button" class="button color-blue-500 dialog-confirm color-accent-color">Choose image</button>\
			</span>\
		</div>\
	</div>\
	',
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
		placeholder.removeClass("imageplaceholder").addClass("extend-block").addClass("image-extend-block"); //use the placeholder to add an image
		scratchpad.ui.dialogs.hide($(this));
	},
	init: function() {
		var _ = this;
		this.dialogEl = $(".image-dialog");
		
		scratchpad.menu.addItem({
			color: "white",
			background: "blue-500",
			name: "image",
			icon: "icon-image",
			fn: function() {
				scratchpad.ui.dialogs.show(_.dialogEl);
			}
		});

		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertimagefromdialog)
	}
});
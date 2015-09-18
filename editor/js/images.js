docLayer.modules.define("images", {
	html: ' \
		<div noprint class="dialog image-dialog url-input-dialog" hidden>\
		<span class="dialog-title">Choose an image</span>\
		<div class="dialog-content">\
			<input title="Choose an image source" type="text" class="image-url-chooser text-input" placeholder="Paste a URL here"/>\
			<div id="image-preview"></div>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="imagechooser-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="imagechooser-okay-button" class="button color-blue-500 dialog-confirm color-accent-color">Choose image</button>\
			</span>\
		</div>\
	</div>\
	',
	ondialogopen: function () {
		var input = "<img class='imageplaceholder'/>"; //add a placeholder to mark the cursor position
		docLayer.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function () {
		$(".imageplaceholder").remove();
	},
	processImageUrl: function (newimage) {
		if (!newimage.match("^(http://|https://)")) {
			newimage = "https://" + newimage;
		}

		newimage = newimage.replace("http://", "https://");
		return newimage;
	},
	insertimagefromdialog: function () {
		var newimage = $(".image-url-chooser").val();
		newimage = this.processImageUrl(newimage);

		var placeholder = $(".imageplaceholder");
		placeholder.attr("src", newimage);
		placeholder.removeClass("imageplaceholder").addClass("extend-block").addClass("image-extend-block"); //use the placeholder to add an image
		docLayer.ui.dialogs.hide(this.dialogEl);
	},
	updatePreview: function (text) {
		var _ = this;
		if (text) {
			var pImage = $("<img>").on("error", function () {
				_.previewEl.html("");
				$("<span class='secondary-text'>").text("This image can't be found. Please try a different image.").appendTo(_.previewEl);
			});
			pImage.on("load", function () {
				_.previewEl.html("");
				$("<img>").attr("src", _.processImageUrl(text)).appendTo(_.previewEl);
			});
			pImage.attr("src", this.processImageUrl(text))
		} else {
			_.previewEl.html("");
		}
	},
	init: function () {
		var _ = this;
		this.updatePreview = this.updatePreview.bind(this);
		this.insertimagefromdialog = this.insertimagefromdialog.bind(this);
		this.dialogEl = $(".image-dialog");
		this.previewEl = $("#image-preview");
		this.input = $(".image-url-chooser");

		this.input.on("keyup", function (e) {
			return _.updatePreview(e.target.value);
		});

		docLayer.menu.addItem({
			color: "white",
			background: "blue-500",
			name: "image",
			icon: "icon-image",
			fn: function () {
				docLayer.ui.dialogs.show(_.dialogEl);
			}
		});

		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertimagefromdialog)
	}
});

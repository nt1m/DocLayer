scratchpad.modules.define("embeds", {
	html: '\
		<div noprint class="dialog embed-dialog url-input-dialog" hidden>\
		<span class="dialog-title">Choose a URL to embed</span>\
		<div class="dialog-content">\
			<input title="Choose a URL to embed" type="text" class="embed-url-chooser text-input" placeholder="Paste a URL here"/>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="embed-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="embed-okay-button" class="button dialog-confirm color-accent-color">Add url</button>\
			</span>\
		</div>\
	</div>\
	',
	ondialogopen: function () {
		var input = "<iframe allowfullscreen sandbox='allow-forms allow-same-origin allow-scripts' class='embedplaceholder'/>"; //add a placeholder to mark the cursor position (also add some sandbox attributes)
		scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function () {
		$(".embedplaceholder").remove();
	},
	insertembedfromdialog: function () {
		var embed = $(".embed-url-chooser").val();
		if (embed.indexOf("<iframe") > -1) { //if the user accidently pasted in the whole iframe
			embed = $(embed).attr("src");
		}
		if (!embed.match("^(http://|https://)")) {
			embed = "https://" + embed; //auto-https may cause issues for some websites, but is needed to prevent mixed content from being blocked
		}

		embed = embed.replace("http://", "https://"); //in order to prevent mixed content blocking, we need to load everything as https. This may cause some websites to not work correctly.


		var placeholder = $(".embedplaceholder");
		placeholder.attr("src", embed);
		placeholder.removeClass("embedplaceholder").addClass("extend-block").addClass("embed-extend-block"); //use the placeholder to add an image
		scratchpad.ui.dialogs.hide($(this));
	},
	showOpenButton: function (item) {
		var _ = this;
		var button = this.openButton;
		var offset = item.offset();
		var itemwidth = item.width();
		button.css({
			top: offset.top,
			left: offset.left + itemwidth
		});
		button.show();
		button.off();
		button.on("click", function () {
			window.open(item.attr("src"), '_blank');
			button.hide();
		});
	},
	init: function () {
		var _ = this;
		this.showOpenButton = this.showOpenButton.bind(this);
		this.dialogEl = $(".embed-dialog");

		scratchpad.menu.addItem({
			color: "white",
			background: "pink-500",
			name: "embed",
			icon: "icon-drive-code",
			fn: function () {
				scratchpad.ui.dialogs.show(_.dialogEl);
			}
		});

		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertembedfromdialog);

		$(document.body).append('<div noprint class="embed-open-button edit-button small fab color-black" title="Open in new tab"><i class="icon-open-in-browser"></i></div>'); //add the open in new tab button
		this.openButton = $(".embed-open-button");
		$("#document-editor").on("mouseover", ".extend-block.embed-extend-block", function () {
			_.showOpenButton($(this));
		});
	}
});
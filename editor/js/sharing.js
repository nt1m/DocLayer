docLayer.modules.define("sharing", {
	html: '\
			<div noprint class="dialog share-dialog url-input-dialog" hidden>\
		<span class="dialog-title">Share this document</span>\
		<div class="dialog-content">\
			<label class="sharing-dialog-label">\
				Let others view this document using the link below.\
				<input title="Share this link with others to let them view this document" type="text" class="sharing-url-display text-input"/>\
			</label>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="embed-cancel-button" class="button dialog-cancel color-accent-color">Close</button>\
			</span>\
		</div>\
	</div>\
	',
	customhtml: '\
					<button title="Share this document" class="icon-button float-right" id="sharing-button"><i class="icon-person-add"></i></button>\
	',
	showSharingLink: function () {
		var _ = this;
		client.makeUrl("/documents/" + document_id + ".html", {
			downloadHack: true
		}, function (error, data) {
			if (error) {
				return createToast("Error sharing document.");
			}
			var address = data.url.replace("https://dl.dropboxusercontent.com/s", "").replace(".html?dl=0", "");
			address = config.basepath + "view/#" + address;
			_.outputBox.val(address).select();
		});
	},
	init: function () {
		$(".editor-toolbar").append(this.customhtml);

		var _ = this;
		this.button = $("#sharing-button");
		this.dialogEl = $(".share-dialog");
		this.outputBox = $(".sharing-url-display");

		this.showSharingLink = this.showSharingLink.bind(this);

		this.button.on("click", function () {
			docLayer.ui.dialogs.show(_.dialogEl);
			_.showSharingLink();
		})
	}
});
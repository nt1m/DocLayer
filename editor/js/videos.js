scratchpad.modules.define("videos", {
	html: '\
		<div noprint class="dialog video-dialog small-dialog" hidden>\
		<span class="dialog-title">Choose a video</span>\
		<div class="dialog-content">\
			<input type="text" class="video-url-chooser text-input" placeholder="Paste a URL here"/>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="video-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="video-okay-button" class="button dialog-confirm color-accent-color">Choose video</button>\
			</span>\
		</div>\
	</div>',
	ondialogopen: function() {
		var input = "<video controls class='videoplaceholder'/>"; //add a placeholder to mark the cursor position
				scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
		$(".videoplaceholder").remove();
	},
	insertvideofromdialog: function() {

		//add prefixes when needed
		var video = $(".video-url-chooser").val();
		if (!video.match("^(http://|https://)")) {
				video = "http://" + video;
			}

		//detect the video type
		if (video.indexOf("webm") > 0 ) {
			var type = "video/webm"
			var codecs = "vp8,vorbis"
		} else if (video.indexOf("ogv") > 0) {
			var type = "video/ogg"
			var codecs = "theora,vorbis"
		} else if (video.indexOf("mp4") > 0 ) {
			var type = "video/mp4"
			var codecs = "" //there isn't really a standard codec for this
		}

		//insert the video
		var placeholder = $(".videoplaceholder");
		var source = "<source type='" + type + "' codecs='" + codecs + "' src='" +	video + "'></source>";
		placeholder.html(source);
		placeholder.removeClass("videoplaceholder").addClass("extend-block").addClass("video-extend-block"); //use the placeholder to add a video
		scratchpad.ui.dialogs.hide($(this));
	},
	init: function() {
		var _ = this;
		this.dialogEl = $(".video-dialog");

		scratchpad.menu.addItem({
			color: "white",
			background: "grey-800",
			name: "video",
			icon: "icon-videocam",
			fn: function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
			}
		});

		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertvideofromdialog)
	}
});
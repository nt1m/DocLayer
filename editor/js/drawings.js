docLayer.modules.define("drawings", {
	html: ' \
		<script src="../lib/signature_pad/signature_pad.js"></script>\
		<div noprint class="dialog drawing-dialog" hidden>\
		<span class="dialog-title">Create drawing</span>\
		<div class="dialog-content">\
			<canvas id="drawing-editor-canvas" width="250" height="250"></canvas>\
			<div id="drawing-editor-colors"></div>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="imagechooser-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="imagechooser-okay-button" class="button color-blue-500 dialog-confirm color-accent-color">Save</button>\
			</span>\
		</div>\
	</div>\
	',
	penWidths: {
		minWidth: 0.75,
		maxWidth: 2,
	},
	colors: ["#000000", "#ffffff", "#f44336", "#e91e63", "#9c27b0", "#2196f3", "#4caf50", "#ff5722", "#607d8b"],
	ondialogopen: function () {
		//resize canvas to window
		this.canvas.attr("width", Math.max($(window).width() * 0.6, 260));
		this.canvas.attr("height", Math.max($(window).height() * 0.6, 295));

		this.signaturePad.clear(); //empty the canvas

		if (this.drawingData) { //we have data to show, show it
			this.signaturePad.fromDataURL(this.drawingData);
			this.drawingData = null; //we don't want to show this data again in the future
		}

		if (!$(".drawing-edit-target")[0]) { //we're not editing anything, we should add a placeholder
			var input = "<img class='drawingplaceholder'/>"; //add a placeholder to mark the cursor position
			docLayer.caret.pasteHtmlAtCaret(input, false);
		}
	},
	ondialogcancel: function () {
		$(".drawingplaceholder").remove();
	},
	insertdrawingfromdialog: function () {
		var newimage = this.signaturePad.toDataURL();

		//if we have a placeholder, use that
		var placeholder = $(".drawingplaceholder");

		placeholder.attr("src", newimage);
		placeholder.removeClass("drawingplaceholder").addClass("extend-block").addClass("drawing-extend-block"); //use the placeholder to add an image


		//do the same thing with an edit target
		var target = $(".drawing-edit-target");

		target.attr("src", newimage);
		target.removeClass("drawing-edit-target").addClass("extend-block").addClass("drawing-extend-block"); //load the changes
		docLayer.ui.dialogs.hide($(this.dialogEl));
	},
	showEditButton: function (item) {
		var _ = this;
		var button = this.editButton;
		var offset = item.offset();
		var itemwidth = item.width();
		button.css({
			top: offset.top,
			left: offset.left + itemwidth
		});
		button.show();
		button.off();
		button.on("click", function () {
			item.addClass("drawing-edit-target");
			_.drawingData = item.attr("src");
			docLayer.ui.dialogs.show(_.dialogEl);
		});
	},
	init: function () {
		var _ = this;
		this.dialogEl = $(".drawing-dialog");
		this.colorPicker = $("#drawing-editor-colors");

		this.insertdrawingfromdialog = this.insertdrawingfromdialog.bind(this);
		this.ondialogopen = this.ondialogopen.bind(this);
		this.showEditButton = this.showEditButton.bind(this);

		docLayer.menu.addItem({
			color: "white",
			background: "deep-purple-500",
			name: "drawing",
			icon: "icon-drive-drawing",
			fn: function () {
				docLayer.ui.dialogs.show(_.dialogEl);
			}
		});

		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertdrawingfromdialog);

		this.canvas = $("#drawing-editor-canvas");
		this.signaturePad = new SignaturePad(this.canvas[0], this.penWidths);

		$(document.body).append('<div noprint class="drawing-edit-button edit-button small fab color-green-500" title="Edit"><i class="icon-create"></i></div>'); //add the edit button
		this.editButton = $(".drawing-edit-button");
		docLayer.editregion.on("mouseover", ".extend-block.drawing-extend-block", function () {
			_.showEditButton($(this));
		});

		this.colors.forEach(function (color) {
			$("<div ripple>").css("background-color", color).appendTo(_.colorPicker).on("click", function () {
				var chosenColor = $(this).css("background-color");
				if (chosenColor == "rgb(255, 255, 255)") { //white should have a larger pen width than other colors, since it functions as an eraser
					_.signaturePad.minWidth = _.penWidths.minWidth * 3.2;
					_.signaturePad.maxWidth = _.penWidths.maxWidth * 3.8;
				} else {
					_.signaturePad.minWidth = _.penWidths.minWidth;
					_.signaturePad.maxWidth = _.penWidths.maxWidth;
				}
				_.signaturePad.penColor = chosenColor
			});
		});
	}
});

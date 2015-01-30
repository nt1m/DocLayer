scratchpad.modules.define("maps", {
	dialogEl: $(".map-dialog"),
	launchButton: $("#map-insert"),
	ondialogopen: function() {
	    var input = "<iframe class='mapplaceholder'/>"; //add a placeholder to mark the cursor position
        scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
		$(".mapplaceholder").remove();
	},
	insertmapfromdialog: function() {
		var lat = $(".map-lat-chooser").val();
		var long = $(".map-long-chooser").val();
		var placeholder = $(".mapplaceholder");
		placeholder.attr("src", "extend-maps/map.html#" + lat + "," + long);
		placeholder.removeClass("mapplaceholder").addClass("extend-block").addClass("map-extend-block"); //use the placeholder to add a map
		scratchpad.ui.dialogs.hide($(this));
	},
	init: function() {
		var _ = this;
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertmapfromdialog)
	}
});
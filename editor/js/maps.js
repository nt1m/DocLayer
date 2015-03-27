scratchpad.modules.define("maps", {
	html: '\
		<div noprint class="dialog map-dialog" hidden>\
		<span class="dialog-title">Choose map coordinates</span>\
		<div class="dialog-content">\
			<input type="text" class="map-lat-chooser text-input" placeholder="Latitude"/>\
			<input type="text" class="map-long-chooser text-input" placeholder="Longitude"/>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="map-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="map-okay-button" class="button dialog-confirm color-accent-color">Add map</button>\
			</span>\
		</div>\
	</div>\
	',
	launchButton: $("#map-insert"),
	ondialogopen: function() {
			var input = "<iframe sandbox='allow-scripts' class='mapplaceholder'/>"; //add a placeholder to mark the cursor position
				scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
		$(".mapplaceholder").remove();
	},
	parseCoordinateToInteger: function(point) { //turns any standard latitude/longitude formatted string and turns it into an integer
		var parsed = point.toUpperCase(); //get any letters in uppercase
		parsed = parsed.replace("°", ""); //strip out the degrees symbol
		parsed = parsed.replace(/\s/g, ""); //remove whitespace
		if(parsed.indexOf("S") > -1 || parsed.indexOf("W") > -1) { //these will be a negative number
			var is_negative_number = true;
		}
		parsed = parsed.replace(/[A-Z]/g, ""); //strip out any letters
		parsed = parseFloat(parsed); //we might need to multiply this
		if(is_negative_number) {
			parsed = parsed * -1;
		}
		return parsed;
	},
	insertmapfromdialog: function() {
		var lat = this.parseCoordinateToInteger($(".map-lat-chooser").val());
		var long = this.parseCoordinateToInteger($(".map-long-chooser").val());
		
		var placeholder = $(".mapplaceholder");
		placeholder.attr("src", "extend-maps/map.html#" + lat + "," + long);
		placeholder.removeClass("mapplaceholder").addClass("extend-block").addClass("map-extend-block"); //use the placeholder to add a map
		scratchpad.ui.dialogs.hide(this.dialogEl);
	},
	init: function() {
		var _ = this;
		this.insertmapfromdialog = this.insertmapfromdialog.bind(this);
		this.dialogEl = $(".map-dialog");
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertmapfromdialog)
	}
});
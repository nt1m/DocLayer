scratchpad.modules.define("charts", {
	html: '\
		<div noprint class="dialog chart-dialog large-dialog" hidden>\
		<span class="dialog-title">Add a Chart</span>\
		<div class="dialog-content">\
			<div class="chart-type-chooser">\
			<div class="item"> <div class="radio"> <input autoselect="" id="pie" name="charts" checked="" type="radio"> <label for="pie"></label> </div> Pie </div>\
			<div class="item"><div class="radio"> <input id="doughnut" name="charts" type="radio"> <label for="doughnut"></label> </div> Doughnut</div>\
			<div class="item"><div class="radio"> <input id="line" name="charts" type="radio"> <label for="line"></label> </div> Line</div>\
			<div class="item"><div class="radio"> <input id="scatter" name="charts" type="radio"> <label for="scatter"></label> </div> Scatter</div>\
			<div class="item"><div class="radio"> <input id="column-bar" name="charts" type="radio"> <label for="column-bar"></label> </div> Bar</div>\
			<div class="item"><div class="radio"> <input id="bubble" name="charts" type="radio"> <label for="bubble"></label> </div> Bubble</div>\
			<div class="item"><div class="radio"> <input id="table" name="charts" type="radio"> <label for="table"></label> </div> Table</div>\
			</div>\
\
 <ul class="tabs chart-tabs"> \
	 <li ripple class="selected" id="chart-edit">edit</a></li> \
	 <li ripple id="chart-preview">preview</li> \
		</ul>\
<div class="table-editor">\
<table class="table">\
<thead class="table-head-region">\
<tr>\
<th contenteditable="true" spellcheck="false"></th>\
<th contenteditable="" spellcheck="false"></th>\
</tr>\
</thead>\
<tbody><tr>\
<td contenteditable="true" spellcheck="false"></td>\
<td contenteditable="" spellcheck="false"></td></tr></tbody>\
</table>\
<div class="add-button add-column">+</div>\
<div class="add-button add-row">+</div>\
		</div>\
	<iframe class="chart-preview-field"></iframe>\
		</div>\
		<div class="dialog-footer">\
			<span class="float-right">\
				<button id="charts-cancel-button" class="button dialog-cancel color-accent-color">Cancel</button>\
				<button id="charts-okay-button" class="button dialog-confirm color-accent-color">Add Chart</button>\
			</span>\
		</div>\
	</div>\
	',
	launchButton: $("#chart-insert"),
	getFMScriptSource: function(type) {
				switch(type) {
			case "pie":
				 return '<link rel="stylesheet" href="https://factmint.io/pie.css"/><script src="https://factmint.io/pie.js"></script>';
				break;
			case "doughnut":
				 return '<link rel="stylesheet" href="https://factmint.io/doughnut.css"/><script src="https://factmint.io/doughnut.js"></script>';
				break;
			case "line":
				 return '<link rel="stylesheet" href="https://factmint.io/line.css"/><script src="https://factmint.io/line.js"></script>';
				break;
			case "column-bar":
				 return '<link rel="stylesheet" href="https://factmint.io/column-bar.css"><script src="https://factmint.io/column-bar.js"></script>';
				break;
			case "scatter":
				 return '<link rel="stylesheet" href="https://factmint.io/scatter.css"><script src="https://factmint.io/scatter.js"></script>';
				break;
			case "bubble":
				 return '<link rel="stylesheet" href="https://factmint.io/bubble.css"><script src="https://factmint.io/bubble.js"></script>';
				break;
			case "table":
				 return '<style>table {font-family:sans-serif;}th,td {padding:0.66em}</style><link rel="stylesheet" href="https://factmint.io/fallback-table.css">';
				break;
		}
	},
	renderChart: function(tabledata, type, el) {
		var chartdata = "<table class='fm-" + type + "'>" + tabledata + "</table>";
		var scripts = this.getFMScriptSource(type);
		el.attr("srcdoc", chartdata + scripts);
		el.removeClass("chartplaceholder").addClass("extend-block").addClass("chart-extend-block").attr("data-table", tabledata); 
	},
	editTable: function(el) {
		var table = el;
    var columns = table.rows[0].cells.length;
		$(".table td").attr("contenteditable", "true");
		$(".add-row").click(function() {
			var rowtemplate = "<td contenteditable spellcheck='false'></td>"
			var rowinnerhtml = ""
			for(var i=0; i < columns; i++) {
				rowinnerhtml += rowtemplate
			}
			$(".table").append("<tr>" + rowinnerhtml + "</tr>");
		});

		$(".add-column").click(function() {
			var template = "<td contenteditable  spellcheck='false'></td>"
			var htemplate = "<th contenteditable  spellcheck='false'></th>"
			$(".table tbody tr").append(template);
			$(".table thead tr").append(htemplate);
			columns++;
		});
	},
	ondialogopen: function() {
		var input = "<iframe sandbox='allow-scripts allow-same-origin' class='chartplaceholder'> </iframe>"; //add a placeholder to mark the cursor position
		scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
			$(".chartplaceholder").remove();
	},
	insertChart: function() {
		var tabledata = $(".table").html().replace(/contenteditable/g, 'data-previous-contenteditable-state');
		var selectedchart = $('input:radio[name=charts]:checked').attr("id");
		var placeholder = $(".chartplaceholder");
		this.renderChart(tabledata, selectedchart, placeholder);
		scratchpad.ui.dialogs.hide($(this.dialogEl));
	},
	switchToMode: function(mode) {
		if(mode == "edit") {
			this.dialogEl.addClass("edit-mode").removeClass("preview-mode");
			$("#chart-edit").addClass("selected");
			$("#chart-preview").removeClass("selected");
		} else if (mode == "preview") {
			this.dialogEl.addClass("preview-mode").removeClass("edit-mode");
			$("#chart-preview").addClass("selected");
			$("#chart-edit").removeClass("selected");
			this.renderChart($(".table").html().replace(/contenteditable/g, 'data-previous-contenteditable-state'), $('input:radio[name=charts]:checked').attr("id"), $(".chart-preview-field"));
		}
	},
	init: function() {
		var _ = this;
		this.dialogEl = $(".chart-dialog");
		this.insertChart = this.insertChart.bind(this);
		this.switchToMode = this.switchToMode.bind(this);
		this.editTable($(".table")[0]);
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		$("#chart-preview").on("click", function() {
			_.switchToMode("preview");
		});
		$("#chart-edit").on("click", function() {
			_.switchToMode("edit");
		});
		$(".chart-type-chooser").on("click", ".item", function() { //update the chart in case the user is in preview mode
			_.renderChart($(".table").html().replace(/contenteditable/g, 'data-previous-contenteditable-state'), $('input:radio[name=charts]:checked').attr("id"), $(".chart-preview-field"));
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertChart);
	}
});
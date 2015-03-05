scratchpad.modules.define("charts", {
	dialogEl: $(".chart-dialog"),
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
		if($(".chartplaceholder").html() == "") {
			$(".chartplaceholder").remove();
		}
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
		})
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertChart);
	}
});
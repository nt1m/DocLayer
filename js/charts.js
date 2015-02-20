scratchpad.modules.define("charts", {
	dialogEl: $(".chart-dialog"),
	launchButton: $("#chart-insert"),
	getFMScriptSource: function(type) {
				switch(type) {
			case "pie":
				 return '<link rel="stylesheet" href="http://factmint.io/pie.css"/><script src="http://factmint.io/pie.js"></script>';
				break;
			case "doughnut":
				 return '<link rel="stylesheet" href="http://factmint.io/doughnut.css"/><script src="http://factmint.io/doughnut.js"></script>';
				break;
			case "line":
				 return '<link rel="stylesheet" href="http://factmint.io/line.css"/><script src="http://factmint.io/line.js"></script>';
				break;
			case "table":
				 return '';
				break;
		}
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
			$(".table tr").append(template);
			columns++;
		});
	},
	ondialogopen: function() {
		var input = "<div class='chartplaceholder'> </div>"; //add a placeholder to mark the cursor position
		scratchpad.caret.pasteHtmlAtCaret(input, false);
	},
	ondialogcancel: function() {
		if($(".chartplaceholder").html() == "") {
			$(".chartplaceholder").remove();
		}
	},
	insertChart: function() {
		var tabledata = $(".table").html();
		var selectedchart = $('input:radio[name=charts]:checked').attr("id");
		var chartdata = "<table class='fm-" + selectedchart + "'>" + tabledata + "</table>";
		var placeholder = $(".chartplaceholder");
		var scripts = this.getFMScriptSource(selectedchart);
		placeholder.html(chartdata + scripts);
		placeholder.removeClass("chartplaceholder").addClass("extend-block").addClass("chart-extend-block").attr("contenteditable", "false").attr("data-table", tabledata); 
		scratchpad.ui.dialogs.hide($(this.dialogEl));
	},
	init: function() {
		var _ = this;
		this.insertChart = this.insertChart.bind(this);
		this.editTable($(".table")[0]);
		this.launchButton.on("mousedown", function() {
			scratchpad.ui.dialogs.show(_.dialogEl);
		});
		this.dialogEl.on("dialog-shown", this.ondialogopen);
		this.dialogEl.on("dialog-cancel", this.ondialogcancel);
		this.dialogEl.on("dialog-confirm", this.insertChart);
	}
});
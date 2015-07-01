/* convert pasted text from google docs/word */

scratchpad.modules.define("contentimport", {
	css: false,
	import: function (e) {
		var data = e.originalEvent.clipboardData;
		var content = data.getData('text/html');
		
		if(content) { //we have content, so it has html formatting. Convert it to scratchpad format
		var boxset = $("<div>" + content + "</div>");
		boxset.find("span").each(function () { //remove google docs formatting spans and replace with correct tags
			var $this = $(this);
			var style = $this.attr("style")
			var contents = $this.contents();
			contents.unwrap(); //remove the old span
			if (style) {
				style = style.replace(/\s/g, "");
				if (style.indexOf("font-weight:bold") > -1) {
					contents.wrap("<b>");
				}
				if (style.indexOf("font-style:italic") > -1) {
					contents.wrap("<i>");
				}
				if (style.indexOf("text-decoration:underline") > -1) {
					contents.wrap("<u>");
				}
				if (style.indexOf("line-through") > -1) {
					contents.wrap("<strike>");
				}
			}
		});

		boxset.find("p").each(function () { //paragraph alignment
			var $this = $(this);
			var style = $this.attr("style");
			if (style) {
				style = style.replace(/\s/g, "");
				if (style.indexOf("text-align:center") > -1) {
					$this.attr("align", "center");
				}
				if (style.indexOf("text-align:right") > -1) {
					$this.attr("align", "right");
				}
			}

		});
		boxset.find("*").removeAttr("style").removeAttr("id"); //remove gogle docs inline styles and docs-internal-guid's
		boxset.find("img").addClass("extend-block").addClass("image-extend-block").removeAttr("width").removeAttr("height");

		boxset.find("li > p").contents().unwrap(); //this causes issues with starring items

		//create tables using the charts, if the module is loaded

		if (scratchpad.charts) {
			boxset.find("table colgroup").remove(); //these are useless
			boxset.find("table td *").contents().unwrap(); //remove formatting that won't work
			boxset.find("table td").attr("data-previous-contenteditable-state", "true"); //hack to get the chart editor to work correctly with imported tables
			//convert the tables
			boxset.find("table").each(function () {
				var tabledata = $(this).html();
				var chartbox = $("<iframe/>");
				scratchpad.charts.renderChart(tabledata, "table", chartbox);
				$(this).replaceWith(chartbox);
			});
		} else { //we don't have a way to add tables
			boxset.find("table").remove();
		}
		boxset.find("meta").remove(); //these are useless
		boxset.find("style").remove(); //these are useless
		boxset.find("link").remove(); //these are useless
		boxset.find("h2 > b, h3 > b").contents().unwrap(); //subheadings are normally bolded, but we don't want then like that
		var importeddata = boxset[0].innerHTML;
		document.execCommand("insertHTML", false, importeddata);

		} else { //the content isn't html, use plaintext instead
			importeddata = data.getData('text/plain');
			document.execCommand("insertText", false, importeddata);
		}
	},
	init: function () {
		var _ = this;
		scratchpad.editregion.on("paste", function (e) {
			e.preventDefault();
			_.import(e);
		});
	}
});
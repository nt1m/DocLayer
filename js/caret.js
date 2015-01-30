//carat pasting api. from http://jsbin.com/aqAYUwu/5 and http://stackoverflow.com/questions/19620439/javascript-get-cursor-position-in-contenteditable-div

scratchpad.modules.define("caret", {
	pasteHtmlAtCaret: function(html, selectPastedContent) {
		var sel, range;
		if(document.activeElement.id == "document-editor") {
			if (window.getSelection) {
				// IE9 and non-IE
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();

					var el = document.createElement("div");
					el.innerHTML = html;
					var frag = document.createDocumentFragment(), node, lastNode;
					while (node = el.firstChild) {
						lastNode = frag.appendChild(node);
					}
					var firstNode = frag.firstChild;
					range.insertNode(frag);
				}
			}
			else if ((sel = document.selection) && sel.type != "Control") {
				var originalRange = sel.createRange();
				originalRange.collapse(true);
				sel.createRange().pasteHTML(html);
				if (selectPastedContent) {
					range = sel.createRange();
					range.setEndPoint("StartToStart", originalRange);
					range.select();
				}
			}
		} // end focus check
		else {
			$("#document-editor").append(html);
			var elem = document.getElementsByClassName('page-container')[0]; //scroll to the bottom so the user knows that something was added
			elem.scrollTop = elem.scrollHeight;
		}
	}
});
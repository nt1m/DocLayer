//caret pasting api

scratchpad.modules.define("caret", {
	css: false,
	editor: $("#document-editor"),
	pasteHtmlAtCaret: function (html, selectPastedContent) {
		var origHTML = this.editor.html();
		document.execCommand("insertHTML", false, html);
		//if the caret isn't in the editor, we want to append the html instead. however, there are cases where activeElement is not the editor even though the caret is in the editor, so instead we check if the html was changed by the execCommand and if not append the data instead.
		if (origHTML == this.editor.html()) {
			this.editor.append(html);
		}
	},
	pasteHtmlAfterCaret: function (html) { //http://stackoverflow.com/a/3599599/4603285
		var sel, range, expandedSelRange, node;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = window.getSelection().getRangeAt(0);
				expandedSelRange = range.cloneRange();
				range.collapse(false);

				// Range.createContextualFragment() would be useful here but is
				// non-standard and not supported in all browsers (IE9, for one)
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(),
					node, lastNode;
				while ((node = el.firstChild)) {
					lastNode = frag.appendChild(node);
				}
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode) {
					expandedSelRange.setEndAfter(lastNode);
					sel.removeAllRanges();
					sel.addRange(expandedSelRange);
				}
			}
		} else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			expandedSelRange = range.duplicate();
			range.collapse(false);
			range.pasteHTML(html);
			expandedSelRange.setEndPoint("EndToEnd", range);
			expandedSelRange.select();
		}
	}
});

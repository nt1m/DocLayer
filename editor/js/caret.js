//caret pasting api

scratchpad.modules.define("caret", {
	editor: $("#document-editor"),
	pasteHtmlAtCaret: function(html, selectPastedContent) {
		 	var origHTML = this.editor.html();
			document.execCommand("insertHTML", false, html);
			//if the caret isn't in the editor, we want to append the html instead. however, there are cases where activeElement is not the editor even though the caret is in the editor, so instead we check if the html was changed by the execCommand and if not append the data instead.
			if(origHTML == this.editor.html()) {
				this.editor.append(html);
			}
	}
});

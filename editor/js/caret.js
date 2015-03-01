//caret pasting api

scratchpad.modules.define("caret", {
	pasteHtmlAtCaret: function(html, selectPastedContent) {
			document.execCommand("insertHTML", false, html); //TODO add fallback if this is unsupported by using the old caret api
	}
});

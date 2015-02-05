//carat pasting api. from http://jsbin.com/aqAYUwu/5 and http://stackoverflow.com/questions/19620439/javascript-get-cursor-position-in-contenteditable-div

scratchpad.modules.define("caret", {
	pasteHtmlAtCaret: function(html, selectPastedContent) {
		var sel, range;
		if(document.activeElement.id == "document-editor") {
			document.execCommand("insertHTML", false, html); //TODO add fallback if this is unsupported by using the old caret api
		} // end focus check
		else {
			$("#document-editor").append(html);
			var elem = document.getElementsByClassName('page-container')[0]; //scroll to the bottom so the user knows that something was added
			elem.scrollTop = elem.scrollHeight;
		}
	}
});

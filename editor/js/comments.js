//http://stackoverflow.com/questions/3597116/insert-html-after-a-selection

function insertHtmlAfterSelection(html) {
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
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
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

scratchpad.modules.define("comments", {
	template: "<span contenteditable='false'><comment contenteditable class='extend-block inline'>comment</comment></span>", //span needed to get :focus to work correctly
	add: function(message) {
		insertHtmlAfterSelection(this.template);
	},
	init: function() {
	}
});




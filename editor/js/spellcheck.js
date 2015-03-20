scratchpad.modules.define("spellcheck", {
	editor: $("#document-editor"),
	html: "<script src='lib/spellcheck.js/spellcheck.js'></script>",
	replace: function (from, to) { //http://stackoverflow.com/questions/29067342/inline-autocorrect-with-contenteditable/29067657#29067657
		var sel = document.getSelection(),
			nd = sel.anchorNode,
			text = nd.textContent.slice(0, sel.focusOffset),
			newText = text.replace(from, to),
			wholeNew = nd.textContent.replace(text, newText),
			range = document.createRange();

		nd.textContent = wholeNew;
		range.setStart(nd, newText.length);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		nd.parentNode.focus();

	},
	correct: function () {
		var _ = this;
		var words = document.getSelection().anchorNode.textContent.split(" "); //only check the currently selected node for performance
		for (var i = 0; i < words.length; i++) {
			var value = words[i];
			if (!checkSpelling(value)) { //the word is misspelled
				_.replace(value, "");
				document.execCommand("insertHTML", false, "<span class='misspelling'>" + value + "</span>&nbsp;"); //this assumes the user just types the misspelled word - could be a problem when copy/pasting or when the ruleset changes
			}
		}
	},
	showMenu: function (el) { //creates a context menu for a misspelling element
		$(".spellcheck-menu").remove(); //remove any previous menus
		var _ = this;
		var offset = el.offset();
		var word = el.html();
		var suggestionList = getSuggestions(word);
		var menu = $(' <ul class="menu spellcheck-menu"> </ul>');
		menu.css({
			position: "absolute",
			top: offset.top + 20 + "px",
			left: offset.left + "px",
		});
		suggestionList.forEach(function (value) {
			var item = $('<li ripple><a>' + value + '</a></li>');
			item.children().on("click", function () {
				_.autocorrect(el, $(this).html());
				$(".spellcheck-menu").hide();
			});
			item.appendTo(menu);
		});
		menu.appendTo(document.body);
	},
	autocorrect: function (el, replacement) { //replace the misspelling with the correct form
		var span = $(el);
		var word = span.html();
		if (!replacement) {
			span.html(getBestReplacement(word).value);
		} else {
			span.html(replacement);
		}
		span.contents().unwrap();
	},
	regrade: function (el) { //recheck all the misspellings to see if they have been changed and are now spelled correctly
		$(".misspelling").each(function () {
			var span = $(this);
			var content = span.text();
			if (checkSpelling(content) || content.indexOf(" ") > -1) { //the word is now spelled correctly, or it now contains multiple words and will not be parsed correctly
				span.remove();
				document.execCommand("insertHTML", false, span.html());
			}
		});
	},
	enable: function () {
		var _ = this;
		this.correct = this.correct.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.editor.attr("spellcheck", "false");
		this.editor.on("keyup", function (e) {
			if (e.keyCode == 32) {
				_.correct();
			}
		});
		this.editor.on("click", ".misspelling", function (e) {
			_.autocorrect(e.target);
		});
		this.editor.on("keyup", function () {
			if ($(document.getSelection().anchorNode.parentNode).hasClass("misspelling")) {
				_.regrade();
			}
		});

		this.editor.on("contextmenu", ".misspelling", function (e) { //show a misspelling menu
			e.preventDefault();
			_.showMenu($(e.target));
		});
		$(document.body).on("click", function () {
			$(".spellcheck-menu").remove();
		});
	},

	init: function () {
		this.enable();
	}

});
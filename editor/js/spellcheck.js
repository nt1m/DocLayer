scratchpad.modules.define("spellcheck", {
	html: "<script src='../lib/spellcheck.js/spellcheck.js'></script><script async defer src='../lib/spellcheck.js/dictionary.js'></script>",
	autocorrectWords: [],
	customDictionary: [],
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
		var spellingIsFixed;

		for (var i = 0; i < words.length; i++) {
			var value = words[i];
			if (!spellcheck.checkSpelling(value) && _.customDictionary.indexOf(value) < 0) { //the word is misspelled, and it isn't overriden by the custom dictionary
				for (var z = 0; z < _.autocorrectWords.length; z++) { //check if we should autocorrect, or show a misspelling
					var autocorrect = _.autocorrectWords[z];
					if (value == autocorrect.from) {
						_.replace(value, autocorrect.to);
						spellingIsFixed = true;
					}
				}

				if (!spellingIsFixed) {
					_.replace(value, "");
					document.execCommand("insertHTML", false, "<span class='misspelling'>" + value + "</span>&nbsp;"); //this assumes the user just types the misspelled word - could be a problem when copy/pasting or when the ruleset changes
				}
			}
		}
	},
	showMenu: function (el) { //creates a context menu for a misspelling element

		//we don't need performance to be very good, so we can adjust the skip_interval downwards from the default
		spellcheck.skip_interval = 3;

		var _ = this;
		$(".spellcheck-menu").remove(); //remove any previous menus
		var _ = this;
		var offset = el.offset();
		var word = el.text();
		var suggestion = spellcheck.getBestReplacement(word);
		var menu = $(' <ul class="menu spellcheck-menu"> </ul>');
		menu.css({
			position: "absolute",
			top: (offset.top + el.height() + 5) + "px",
			left: offset.left + "px",
		});

		var suggestionItem = $('<li ripple><a>' + suggestion + '</a></li>');
		suggestionItem.children().on("click", function () {
			_.replaceSpelling(el, suggestion);
			$(".spellcheck-menu").hide();
		});
		suggestionItem.appendTo(menu);

		menu.append("<li class='divider'></li>");

		var alwaysCorrectItem = $('<li ripple><a>' + 'Always correct to "' + suggestion + '"</a></li>');
		alwaysCorrectItem.children().on("click", function () {
			_.replaceSpelling(el, suggestion);
			_.autocorrectWords.push({
				from: word,
				to: suggestion
			});
			setPref("spellcheck.autocorrect", _.autocorrectWords);
			$(".spellcheck-menu").hide();
		});
		alwaysCorrectItem.appendTo(menu);

		var addToDictionaryItem = $('<li ripple><a>Add to dictionary</a></li>');
		addToDictionaryItem.children().on("click", function () {
			_.customDictionary.push(word);
			el.contents().unwrap(); //remove the misspelling underline
			setPref("spellcheck.dictionary", _.customDictionary);
			$(".spellcheck-menu").hide();
		});
		addToDictionaryItem.appendTo(menu);

		menu.appendTo(document.body);
	},
	replaceSpelling: function (el, replacement) { //replace the misspelling with the correct form
		$(el).html(replacement).contents().unwrap();
	},
	regrade: function (el) { //recheck all the misspellings to see if they have been changed and are now spelled correctly
		var _ = this;
		var span = $(el);
		var content = span.text();
		if (spellcheck.checkSpelling(content) || content.indexOf(" ") > -1 || _.customDictionary.indexOf(content) > -1) { //the word is now spelled correctly, or it now contains multiple words and will not be parsed correctly, or it has been added to the custom dictionary
			span.remove();
			document.execCommand("insertHTML", false, span.html());
		}
	},
	init: function () {
		var _ = this;
		this.correct = this.correct.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.regrade = this.regrade.bind(this);

		scratchpad.editregion.attr("spellcheck", "false");
		scratchpad.editregion.on("keyup", function (e) {
			if (e.keyCode == 32) {
				_.correct();
			}
		});

		scratchpad.editregion.on("keyup", function () {
			if ($(document.getSelection().anchorNode.parentNode).hasClass("misspelling")) {
				_.regrade(document.getSelection().anchorNode.parentNode);
			}
		});

		scratchpad.editregion.on("contextmenu touchend", ".misspelling", function (e) { //show a misspelling menu
			e.preventDefault();
			_.showMenu($(e.target));
		});
		$(document.body).on("click", function () {
			$(".spellcheck-menu").remove();
		});

		getPref("spellcheck.autocorrect", function (value) {
			if (value) {
				_.autocorrectWords = value;
			}
		});
		getPref("spellcheck.dictionary", function (value) {
			if (value) {
				_.customDictionary = value;
			}
		});
	}

});
docLayer.modules.define("spellcheck", {
	html: "<script src='../lib/spellcheck.js/spellcheck.js'></script><script async defer src='../lib/spellcheck.js/dictionary.js'></script>",
	autocorrectWords: [],
	customDictionary: [],
	shouldCheckSpelling: true,
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
	focusElement: function (p) { //http://stackoverflow.com/a/16863913/4603285
		var s = window.getSelection(),
			r = document.createRange();
		p.innerHTML = '\u00a0';
		r.selectNodeContents(p);
		s.removeAllRanges();
		s.addRange(r);
		document.execCommand('delete', false, null);
	},
	correct: function () {
		var _ = this;
		var words = document.getSelection().anchorNode.textContent.split(" "); //only check the currently selected node for performance
		var spellingIsFixed;

		for (var i = 0; i < words.length; i++) {
			//split() works differently in webkit, so there might be an extra space after the word that needs to be removed.
			var value = words[i].replace(/\s/g, "");
			if (!spellcheck.checkSpelling(value) && _.customDictionary.indexOf(value) < 0) { //the word is misspelled, and it isn't overriden by the custom dictionary
				for (var z = 0; z < _.autocorrectWords.length; z++) { //check if we should autocorrect, or show a misspelling
					var autocorrect = _.autocorrectWords[z];
					if (value == autocorrect.from) {
						_.replace(value, autocorrect.to);
						spellingIsFixed = true;
					}
				}

				if (!spellingIsFixed) {
					document.execCommand("insertHTML", false, "<span id='cursor-target'>a</span>");
					$("#cursor-target").get(0).focus();

					var oldHTML = docLayer.editregion.html();
					var regex = new RegExp(value, "g");
					var newHTML = oldHTML.replace(regex, "<span class='misspelling'>" + value + "</span>");
					docLayer.editregion.html(newHTML);
					_.focusElement($("#cursor-target").get(0));
					$("#cursor-target").contents().unwrap();
					$(".misspelling > .misspelling").contents().unwrap();
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

		if (window.definePref) {
			definePref({
				category: "Editing",
				description: "Check spelling as you type",
				pref: "editor.spellcheck.enabled",
				values: [true, false],
				defaultValue: true,
			});
			return; //we aren't in the editor, don't try to run editor setup
		}

		getPref("editor.spellcheck.enabled", function (value) {
			if (value == false) {
				_.shouldCheckSpelling = false;
			}
		});

		this.correct = this.correct.bind(this);
		this.showMenu = this.showMenu.bind(this);
		this.regrade = this.regrade.bind(this);

		docLayer.editregion.attr("spellcheck", "false");
		docLayer.editregion.on("keyup", function (e) {
			if (e.keyCode == 32 && _.shouldCheckSpelling) {
				_.correct();
			}
		});

		docLayer.editregion.on("keyup", function () {
			if ($(document.getSelection().anchorNode.parentNode).hasClass("misspelling")) {
				_.regrade(document.getSelection().anchorNode.parentNode);
			}
		});

		docLayer.editregion.on("contextmenu touchend", ".misspelling", function (e) { //show a misspelling menu
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

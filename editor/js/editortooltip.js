docLayer.modules.define("editortooltip", {
	html: '<div noprint id="editortooltip-menu" class="themeable"></div>',
	toggleFormatBlock: function (tag1, tag2) {
		if (this.getCommonSelectionNode().tagName != tag1) {
			document.execCommand("formatBlock", false, tag1);
		} else {
			document.execCommand("formatBlock", false, tag2);
		}
	},
	getCommonSelectionNode: function () { //this returns the common selection node, but doesn't include text ranges
		var sel = window.getSelection().getRangeAt(0);
		var el = sel.commonAncestorContainer;
		if (el.nodeType == 3) { //if the common node is a text node, the node should actually be the parent of the text node
			el = el.parentNode;
		}
		return el;
	},
	createButton: function (options) {
		var _ = this;

		//create the button
		var btn = $("<div ripple>");
		btn.html(options.content);
		btn.attr("title", options.name);

		//if the section doesn't exist yet, create a new one

		if (!this.menu.find("#section-" + options.section)[0]) {
			$("<div>").addClass("menu-group").attr("id", "editortooltip-section-" + options.section).appendTo(this.menu);
		}
		btn.appendTo("#editortooltip-section-" + options.section);

		//bind events - mouseup is used because focus is stolen by the time click occurs
		btn.on("mousedown", function (e) {
			options.fn(e);
			docLayer.editregion.trigger("selectionchange"); //the function might have changed the text position, so the menu bounds need to be updated
		});
	},
	toggleMenu: function () {

		var _ = this;
		var range = window.getSelection().getRangeAt(0); //sometimes webkit throws an error this for unknown reasons - it doesn't seem to harm anything though

		if (!range.collapsed && docLayer.editregion.is(":focus")) { //if there is actually some selected text

			//show the menu
			_.menu.removeAttr("hidden");

			//move the menu to the correct position
			var bounds = range.getBoundingClientRect();
			_.menu.css({
				top: bounds.top - _.menu.height() - 15 + "px",
				left: bounds.left + (bounds.width / 2.75) + "px",
			});

		} else {
			_.menu.attr("hidden", "true");
		}
	},
	init: function () {
		var _ = this;
		this.createButton = this.createButton.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.toggleFormatBlock = this.toggleFormatBlock.bind(this);

		this.menu = $("#editortooltip-menu");

		//at intervals, update the menu to match a possible selection change

		setInterval(function () {
			_.toggleMenu();
		}, 150);

		docLayer.editregion.on("selectionchange", _.toggleMenu);

		//formatting default butons

		this.createButton({
			name: "Italics",
			content: "<i class='icon-italics'></i>",
			section: "format",
			fn: function () {
				document.execCommand("italic", false);
			},
		});
		this.createButton({
			name: "Bold",
			content: "<i class='icon-bold'></i>",
			section: "format",
			fn: function () {
				document.execCommand("bold", false);
			},
		});
		this.createButton({
			name: "Underline",
			content: "<i class='icon-underline'></i>",
			section: "format",
			fn: function () {
				document.execCommand("underline", false);
			},
		});
		this.createButton({
			name: "Strikethrough",
			content: "<i class='icon-strikethrough'></i>",
			section: "format",
			fn: function () {
				document.execCommand("strikeThrough", false);
			},
		});

		//heading default buttons

		this.createButton({
			name: "Heading 1",
			content: "h1",
			section: "headings",
			fn: function () {
				_.toggleFormatBlock("H1", "P");
			},
		});
		this.createButton({
			name: "Heading 2",
			content: "h2",
			section: "headings",
			fn: function () {
				_.toggleFormatBlock("H2", "P");
			},
		});
		this.createButton({
			name: "Heading 3",
			content: "h3",
			section: "headings",
			fn: function () {
				_.toggleFormatBlock("H3", "P");
			},
		});

		//alignment default buttons

		this.createButton({
			name: "Align Left",
			content: "<i class='icon-align-left'></i>",
			section: "align",
			fn: function () {
				document.execCommand("justifyLeft", false);
			},
		});
		this.createButton({
			name: "Align Center",
			content: "<i class='icon-align-center'></i>",
			section: "align",
			fn: function () {
				document.execCommand("justifyCenter", false);
			},
		});
		this.createButton({
			name: "Align Right",
			content: "<i class='icon-align-right'></i>",
			section: "align",
			fn: function () {
				document.execCommand("justifyRight", false);
			},
		});

		//quote button

		this.createButton({
			name: "Quote",
			content: "<i class='icon-quote'></i>",
			section: "quote",
			fn: function () {
				_.toggleFormatBlock("BLOCKQUOTE", "P");
			},
		});

		//keyboard shortcuts

		docLayer.keybindings.addBinding("mod+b", function () {
			document.execCommand("bold", false);
		});
		docLayer.keybindings.addBinding("mod+i", function () {
			document.execCommand("italic", false);
		});
		docLayer.keybindings.addBinding("mod+u", function () {
			document.execCommand("underline", false);
		});
		docLayer.keybindings.addBinding("option+shift+5", function () {
			document.execCommand("strikeThrough", false);
		});
		docLayer.keybindings.addBinding("mod+option+1", function () {
			_.toggleFormatBlock("H1", "P");
		});
		docLayer.keybindings.addBinding("mod+option+2", function () {
			_.toggleFormatBlock("H2", "P");
		});
		docLayer.keybindings.addBinding("mod+option+3", function () {
			_.toggleFormatBlock("H3", "P");
		});

	}

});

docLayer.modules.define("editor", {
	insertItem: function (item) {
		switch (item) {
		case "divider":
			var input = "<hr class='divider'></hr>";
			break;
		}
		docLayer.caret.pasteHtmlAtCaret(input, false);
	},
	destroyUndoable: function (element) { //destroys an element using execCommand so that it is undoable. from http://stackoverflow.com/a/29759439/4603285
		var el = element[0];
		var range = document.createRange();
		range.selectNode(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		document.execCommand("delete", false, null);
	},
	showDeletion: function (item) {
		var _ = this;
		var button = this.deletionButton;
		var offset = item.offset();
		var itemwidth = item.width();

		button.css({
			top: offset.top,
			left: offset.left
		});
		button.show();
		button.off();
		button.on("click", function () {
			_.destroyUndoable(item);
			button.hide();
		});
	},
	starItem: function (e) {
		var target = $(e.target);
		if (e.pageX < target.offset().left) {
			if (target.attr("starred")) {
				target.removeAttr("starred");
			} else {
				target.attr("starred", "true");
			}
		}
	},
	shouldInsertLists: true,
	doesNeedListInsert: function () {
		if (!this.shouldInsertLists) { //we shouldn't do anything
			return;
		}
		var node = window.getSelection().focusNode;
		var text = node.textContent.replace(/\s/g, "");
		if (text[0] == "*" || text[0] == "-") {
			node.textContent = ""; //clear the list text that was entered
			//this is a really terrible way of getting around a firefox bug where NS_ERROR_FAILURE: occurs, or the list is suddenly deleted for no reason
			document.execCommand("insertHTML", false, "<ul><li id='listfocus'></li></ul>");
			$("#listfocus").removeAttr("id").get(0).focus();
		}
		//same thing, but for ordered lists
		if (text.indexOf("1.") == 0) {
			node.textContent = ""; //clear the list text that was entered
			//this is a really terrible way of getting around a firefox bug where NS_ERROR_FAILURE: occurs, or the list is suddenly deleted for no reason
			document.execCommand("insertHTML", false, "<ol><li id='listfocus'></li></ol>");
			$("#listfocus").removeAttr("id").get(0).focus();
		}
	},
	init: function () {
		var _ = this;
		this.doesNeedListInsert = this.doesNeedListInsert.bind(this);

		if (window.definePref) {
			definePref({
				category: "Editing",
				description: "Automatically insert lists",
				pref: "editor.lists.autoinsert",
				values: [true, false],
				defaultValue: true,
			});
			return; //we aren't in the editor, don't try to run editor setup
		}

		getPref("editor.lists.autoinsert", function (value) {
			if (value == false) {
				_.shouldInsertLists = false;
			}
		});

		$(document.body).append('<div noprint class="deletion-button small fab color-red-500" data-tooltip="Remove this item" aria-label="Remove this item"><i class="icon-delete"></i></div>'); //add the deletion button
		this.deletionButton = $(".deletion-button");

		docLayer.menu.addItem({
			color: "black",
			background: "white",
			name: "divider",
			icon: "icon-border-horizontal",
			fn: function () {
				_.insertItem("divider");
			}
		});

		docLayer.keybindings.addBinding("mod+enter", function () {
			_.insertItem("divider");
		});

		docLayer.editregion.on("mouseover touchstart", ".extend-block", function () {
			_.showDeletion($(this));
		});

		//hide all block modifier buttons
		docLayer.editregion.on("click", function () {
			$(".edit-button, .deletion-button").hide();
		});

		docLayer.editregion.on("click", function (e) {
			_.starItem(e);
		});
		docLayer.editregion.on("keyup", function () {
			_.doesNeedListInsert();
		});
		docLayer.keybindings.addBinding("tab", function () {
			document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"); //TODO make this use real tabs (would require wrapping the editor in a <pre> block)
		});
	}
});
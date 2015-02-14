scratchpad.modules.define("editortooltip", {
	init: function() {
	
	var EDGE = -999,
			editableNodes = document.querySelectorAll("#document-editor"),
			editNode = editableNodes[0], // TODO: cross el support for imageUpload
			isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
			options = {
				animate: true
			},
			textMenu,
			optionsNode,
			urlInput,
			previouslySelectedText,

			tagClassMap = {
				"b": "bold",
				"i": "italic",
				"ins": "underline",
				"del": "strikethrough",
				"h1": "header1",
				"h2": "header2",
				"h3": "header3",
				"leftalign": "justifyLeft",
				"centeralign": "justifyCenter",
				"rightalign": "justifyRight",
				"a": "url",
				"blockquote": "quote",
				"research": "research"
			};
		
		
							attachToolbarTemplate();
					bindTextSelectionEvents();
					bindTextStylingEvents();
		

	function attachToolbarTemplate() {
		var div = document.createElement("div"),
				toolbarTemplate = "<div class='options'> \
					<span class='no-overflow'> \
						<span class='ui-inputs'> \
							<div class='category'>\
							<button title='Bold' class='bold'>B</button> \
							<button title='Italic' class='italic'>i</button> \
							<button title='Underline' class='underline'><i class='icon-format-underline'></i></button> \
							<button title='Strikethrough' class='strikethrough'><i class='icon-format-strikethrough'></i></button> \
							</div> \
							<div class='category'>\
							<button title='Heading 1' class='header1'>h1</button> \
							<button title='Heading 2' class='header2'>h2</button> \
							<button title='Heading 3' class='header3'>h3</button> \
							</div> \
							<div class='category'>\
							<button title='Left Align' class='justifyLeft'><i class='icon-align-left'></i></button> \
							<button title='Center Align' class='justifyCenter'><i class='icon-align-center'></i></button> \
							<button title='Right Align' class='justifyRight'><i class='icon-align-right'></i></button> \
							</div> \
							<button title='Quote' class='quote'><i class='icon-quote'></i></button> \
							<button title='Link' class='url'><i class='icon icon-link'></i></button> \
							<button title='Research' class='research'><i class='icon icon-book'></i></button> \
							<input class='url-input' type='text' placeholder='Paste or type a link'/> \
						</span> \
					</span> \
				</div>",
				toolbarContainer = document.createElement("div");
		toolbarContainer.className = "g-body";
		document.body.appendChild(toolbarContainer);

		div.className = "text-menu hide";
		div.innerHTML = toolbarTemplate;

		if (document.querySelectorAll(".text-menu").length === 0) {
			toolbarContainer.appendChild(div);
		}

		textMenu = document.querySelectorAll(".text-menu")[0];
		optionsNode = document.querySelectorAll(".text-menu .options")[0];
		urlInput = document.querySelectorAll(".text-menu .url-input")[0];
	}

	function bindTextSelectionEvents() {
		var i,
				len,
				node;

		// Trigger on both mousedown and mouseup so that the click on the menu
		// feels more instantaneously active
		document.onmousedown = triggerTextSelection;
		document.onmouseup = function(event) {
			setTimeout(function() {
				triggerTextSelection(event);
			}, 1);
		};

		document.onkeydown = preprocessKeyDown;

		document.onkeyup = function(event){
			var sel = window.getSelection();

			// FF will return sel.anchorNode to be the parentNode when the triggered keyCode is 13
			if (sel.anchorNode && sel.anchorNode.nodeName !== "ARTICLE") {
				triggerNodeAnalysis(event);

				if (sel.isCollapsed) {
					triggerTextParse(event);
				}
			}
		};

		// Handle window resize events
		window.onresize = triggerTextSelection;

		urlInput.onblur = triggerUrlBlur;
		urlInput.onkeydown = triggerUrlSet;

			node = editableNodes[0];
			node.contentEditable = true;
			node.onmousedown = node.onkeyup = node.onmouseup = triggerTextSelection;
	}

	function iterateTextMenuButtons(callback) {
		var textMenuButtons = document.querySelectorAll(".text-menu button"),
				i,
				len,
				node,
				fnCallback = function(n) {
					callback(n);
				};

		for (i = 0, len = textMenuButtons.length; i < len; i++) {
			node = textMenuButtons[i];

			fnCallback(node);
		}
	}

	function bindTextStylingEvents() {
		iterateTextMenuButtons(function(node) {
			node.onmousedown = function(event) {
				triggerTextStyling(node);
			};
		});
	}

	function getFocusNode() {
		return window.getSelection().focusNode;
	}

	function reloadMenuState() {
		var className,
				focusNode = getFocusNode(),
				tagClass,
				reTag;

		iterateTextMenuButtons(function(node) {
			className = node.className;

			for (var tag in tagClassMap) {
				tagClass = tagClassMap[tag];
				reTag = new RegExp(tagClass);

				if (reTag.test(className)) {
					if (hasParentWithTag(focusNode, tag)) {
						node.className = tagClass + " active";
					} else {
						node.className = tagClass;
					}

					break;
				}
			}
		});
	}

	function preprocessKeyDown(event) {
		var sel = window.getSelection(),
				parentParagraph = getParentWithTag(sel.anchorNode, "p"),
				p,
				isHr;

		if (event.keyCode === 13 && parentParagraph) {
			prevSibling = parentParagraph.previousSibling;
			isHr = prevSibling && prevSibling.nodeName === "HR" &&
				!parentParagraph.textContent.length;

			// Stop enters from creating another <p> after a <hr> on enter
			if (isHr) {
				event.preventDefault();
			}
		}
	}

	function triggerNodeAnalysis(event) {
		var sel = window.getSelection(),
				anchorNode,
				parentParagraph;

		if (event.keyCode === 13) {

			// Enters should replace it's parent <div> with a <p>
			if (sel.anchorNode.nodeName === "DIV") {
				toggleFormatBlock("p");
			}

			parentParagraph = getParentWithTag(sel.anchorNode, "p");
		
	//for scratchpad, inserting hr is disabled because two line breaks have otehr purposes

		 /* if (parentParagraph) {
				insertHorizontalRule(parentParagraph);
			} */
		}
	}

	function insertHorizontalRule(parentParagraph) {
		var prevSibling,
				prevPrevSibling,
				hr;

		prevSibling = parentParagraph.previousSibling;
		prevPrevSibling = prevSibling;

		while (prevPrevSibling) {
			if (prevPrevSibling.nodeType != Node.TEXT_NODE) {
				break;
			}

			prevPrevSibling = prevPrevSibling.previousSibling;
		}

		if (prevSibling.nodeName === "P" && !prevSibling.textContent.length && prevPrevSibling.nodeName !== "HR") {
			hr = document.createElement("hr");
			hr.contentEditable = false;
			parentParagraph.parentNode.replaceChild(hr, prevSibling);
		}
	}

	function getTextProp(el) {
		var textProp;

		if (el.nodeType === Node.TEXT_NODE) {
			textProp = "data";
		} else if (isFirefox) {
			textProp = "textContent";
		} else {
			textProp = "innerText";
		}

		return textProp;
	}

	function insertListOnSelection(sel, textProp, listType) {
		var execListCommand = listType === "ol" ? "insertOrderedList" : "insertUnorderedList",
				nodeOffset = listType === "ol" ? 3 : 2;

		document.execCommand(execListCommand);
		sel.anchorNode[textProp] = sel.anchorNode[textProp].substring(nodeOffset);

		return getParentWithTag(sel.anchorNode, listType);
	}

	function triggerTextParse(event) {
		var sel = window.getSelection(),
				textProp,
				subject,
				insertedNode,
				unwrap,
				node,
				parent,
				range;

		// FF will return sel.anchorNode to be the parentNode when the triggered keyCode is 13
		if (!sel.isCollapsed || !sel.anchorNode || sel.anchorNode.nodeName === "ARTICLE") {
			return;
		}

		textProp = getTextProp(sel.anchorNode);
		subject = sel.anchorNode[textProp];

		if (subject.match(/^[-*]\s/) && sel.anchorNode.parentNode.nodeName !== "LI") {
			insertedNode = insertListOnSelection(sel, textProp, "ul");
		}

		if (subject.match(/^1\.\s/) && sel.anchorNode.parentNode.nodeName !== "LI") {
			insertedNode = insertListOnSelection(sel, textProp, "ol");
		}

		unwrap = insertedNode &&
						["ul", "ol"].indexOf(insertedNode.nodeName.toLocaleLowerCase()) >= 0 &&
						["p", "div"].indexOf(insertedNode.parentNode.nodeName.toLocaleLowerCase()) >= 0;

		if (unwrap) {
			node = sel.anchorNode;
			parent = insertedNode.parentNode;
			parent.parentNode.insertBefore(insertedNode, parent);
			parent.parentNode.removeChild(parent);
			moveCursorToBeginningOfSelection(sel, node);
		}
	}

	function moveCursorToBeginningOfSelection(selection, node) {
		range = document.createRange();
		range.setStart(node, 0);
		range.setEnd(node, 0);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	function triggerTextStyling(node) {
		var className = node.className,
				sel = window.getSelection(),
				selNode = sel.anchorNode,
				tagClass,
				reTag;

		for (var tag in tagClassMap) {
			tagClass = tagClassMap[tag];
			reTag = new RegExp(tagClass);

			if (reTag.test(className)) {
				switch(tag) {
					case "b":
						if (selNode && !hasParentWithTag(selNode, "h1") && !hasParentWithTag(selNode, "h2")) {
							document.execCommand(tagClass, false);
						}
						return;
					case "i":
					case "del":
					case "ins":
						document.execCommand(tagClass, false);
						return;

					case "h1":
					case "h2":
					case "h3":
					case "blockquote":
						toggleFormatBlock(tag);
						return;

					case "leftalign":
					case "centeralign":
					case "rightalign":
						document.execCommand(tagClass, false);
						return;

					case "a":
						toggleUrlInput();
						optionsNode.className = "options url-mode";
						return;
					case "research":
						scratchpad.research.show(window.getSelection());
						return;

				}
			}
		}

		triggerTextSelection();
	}

	function triggerUrlBlur(event) {
		var url = urlInput.value;

		optionsNode.className = "options";
		window.getSelection().addRange(previouslySelectedText);

		document.execCommand("unlink", false);

		if (url === "") {
			return false;
		}

		if (!url.match("^(http://|https://|mailto:)")) {
			url = "http://" + url;
		}

		document.execCommand("createLink", false, url);

		urlInput.value = "";
	}

	function triggerUrlSet(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			event.stopPropagation();

			urlInput.blur();
		}
	}

	function toggleFormatBlock(tag) {
		if (hasParentWithTag(getFocusNode(), tag)) {
			document.execCommand("formatBlock", false, "p");
			document.execCommand("outdent");
		} else {
			document.execCommand("formatBlock", false, tag);
		}
	}

	function toggleUrlInput() {
		setTimeout(function() {
			var url = getParentHref(getFocusNode());

			if (typeof url !== "undefined") {
				urlInput.value = url;
			} else {
				document.execCommand("createLink", false, "/");
			}

			previouslySelectedText = window.getSelection().getRangeAt(0);

			urlInput.focus();
		}, 150);
	}

	function getParent(node, condition, returnCallback) {
		if (node === null) {
			return;
		}

		while (node.parentNode) {
			if (condition(node)) {
				return returnCallback(node);
			}

			node = node.parentNode;
		}
	}

	function getParentWithTag(node, nodeType) {
		var checkNodeType = function(node) { return node.nodeName.toLowerCase() === nodeType; },
				returnNode = function(node) { return node; };

		return getParent(node, checkNodeType, returnNode);
	}

	function hasParentWithTag(node, nodeType) {
		return !!getParentWithTag(node, nodeType);
	}

	function getParentHref(node) {
		var checkHref = function(node) { return typeof node.href !== "undefined"; },
				returnHref = function(node) { return node.href; };

		return getParent(node, checkHref, returnHref);
	}

	function triggerTextSelection(e) {
		var selectedText = window.getSelection(),
				range,
				clientRectBounds,
				target = e.target || e.srcElement;

		// The selected text is not editable
		if (!target.isContentEditable) {
			reloadMenuState();
			return;
		}

		// The selected text is collapsed, push the menu out of the way
		if (selectedText.isCollapsed) {
			setTextMenuPosition(EDGE, EDGE);
			textMenu.className = "text-menu hide";
		} else {
			range = selectedText.getRangeAt(0);
			clientRectBounds = range.getBoundingClientRect();

			// Every time we show the menu, reload the state
			reloadMenuState();
			setTextMenuPosition(
				clientRectBounds.top - 5 + window.pageYOffset,
				(clientRectBounds.left + clientRectBounds.right) / 2
			);
		}
	}

	function setTextMenuPosition(top, left) {
		textMenu.style.top = top + "px";
		textMenu.style.left = left + "px";

		if (options.animate) {
			if (top === EDGE) {
				textMenu.className = "text-menu hide";
			} else {
				textMenu.className = "text-menu active";
			}
		}
	}

}
													});

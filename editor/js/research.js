scratchpad.modules.define("research", {
	html: '\
		<script async src="' + config.basepath + 'lib/InfoCards.js/js/infocards.js"></script>\
		<div noprint class="sidebar infocard-shell themeable" hidden>\
    <div class="toolbar theme-main-color">\
        <button class="icon-button panel-close"><i class="icon-close"></i></button>\
        <span class="toolbar-label">Research</span>\
    </div>\
		<div class="infocard-content"></div>\
		<div id="research-images-results"></div>\
		<a id="commons-credit-link" target="_blank" href="http://commons.wikimedia.org/wiki/Main_Page">Images from Wikimedia Commons </a>\
	</div>\
	',
	getImages: function (query) {
		var _ = this;
		$.getJSON("https://commons.wikimedia.org/w/api.php?action=query&list=allimages&format=json&continue=&callback=?", {
			"aifrom": query
		}, function (data) {
			_.imagespanel.html(""); //clear any previous results

			var resultset = data.query.allimages;

			resultset.forEach(function (result) {
				var title = result.title.replace("File:", "").replace(".JPG", "").replace(".JPEG", "").replace(".PNG", "").replace(".SVG", "").replace(".jpg", "").replace(".jpeg", "").replace(".png", "").replace(".svg", ""); //replace file endings to generate a readable title

				var box = $("<div>").addClass("image-result");
				var image = $("<img>").attr("src", result.url);
				var titlebox = $("<div>").text(title).addClass("image-title");
				image.appendTo(box);
				titlebox.appendTo(box);
				box.appendTo(_.imagespanel);
			});
		});
	},
	show: function (data) {
		var _ = this;
		_.panel[0].scrollTop = 0; //sometimes firefox uses a previous scroll position and scrolls down at the start, but we always want to start at the top
		$(".infocard-content").html("");

		var infocard = new InfoCard({
			query: data,
			container: $(".infocard-content")[0],
			onEmpty: function (container) {
				container.innerHTML = "<div class='secondary-text error-message'>No results found.</div>"
			},
			onError: function (container) {
				container.innerHTML = "<div class='secondary-text error-message'>An error occured</div>"
			},
			appReferName: "scratchpad",
			onHeadingClick: function (e) {
				if (e.target.tagName == "H2") { //category names for meanings
					_.show(e.target.innerHTML);
				} else { //headers that will just show the same results when clicked
					window.open("https://duckduckgo.com/?q=" + encodeURIComponent(e.target.innerHTML), '_blank');
				}
			},
			horizontalScrolling: false,
			/* makes osx trackpad scrolling not work */
			classNames: {
				"category-item": "themeable",
			},
			protocol: "https"
		});
		scratchpad.ui.sidebars.show(this.panel);
		this.getImages(data);
	},
	imageInsertFlow: function (e) {
		if (!scratchpad.caret) {
			return;
		}
		if (e.target.hasAttribute("noinsert")) {
			return;
		}
		var _ = this;
		var position = $(e.target).offset();
		var shellposition = this.panel.offset();
		var scroll = this.panel.scrollTop();
		this.insertButton.css({
			left: position.left - shellposition.left,
			top: position.top - shellposition.top + scroll
		});
		this.insertButton.show();
		this.insertButton.off();
		this.insertButton.on("mousedown", function () {
			scratchpad.caret.pasteHtmlAtCaret("<img class='extend-block image-extend-block' src='" + e.target.src + "'/>", false);
		});
	},
	init: function () {
		var _ = this;

		this.panel = $(".infocard-shell");
		this.imagespanel = $("#research-images-results");
		this.imageInsertFlow = this.imageInsertFlow.bind(this);
		this.getImages = this.getImages.bind(this);
		this.panel.append('<div noprint hidden class="research-insert-button small fab color-green-500" title="Add image to document"><i class="icon-add"></i></div>');
		this.insertButton = $(".research-insert-button");

		this.panel.on("mouseover", "img", function (e) {
			_.imageInsertFlow(e);
		});

		$(document.body).on("click", function () {
			_.insertButton.hide();
		});

		if (scratchpad.editortooltip) {

			scratchpad.editortooltip.createButton({
				name: "Research",
				content: "<i class='icon-book'></i>",
				section: "research",
				fn: function () {
					_.show(window.getSelection().toString()); //convert the selection object to a string
				},
			});

		}

		scratchpad.keybindings.addBinding("mod+option+shift+i", function () {
			scratchpad.research.show(window.getSelection());
		});
		scratchpad.keybindings.addBinding("esc", function () {
			scratchpad.ui.sidebars.hide();
		});
	}
});
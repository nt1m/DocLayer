scratchpad.modules.define("research", {
	html: '\
		<div noprint class="infocard-shell themeable" hidden>\
    <div class="toolbar theme-accent-color">\
        <button id="research-close-button" class="icon-button"><i class="icon-close"></i></button>\
        <span class="toolbar-label">Research</span>\
    </div>\
		<div class="images-results"></div>\
		<div id="googleimages-branding">Powered by <img noinsert alt="Google" src="css/google-logo.png"/></div>\
		<div class="infocard-content"></div>\
	</div>\
	',
	getImages: function (query) {
		var imageSearch;

		function searchComplete() {
			var contentDiv = $(".images-results");
			contentDiv.html("");
			if (!imageSearch.results && imageSearch.results.length < 0) {
				return;
			}
			var results = imageSearch.results;
			results.forEach(function (value) {
				var imgContainer = $("<div>");
				var title = $("<div>");
				imgContainer.addClass("gimage-result-container");
				title.addClass("gimage-result-title themeable");
				title.html(value.titleNoFormatting);
				var newImg = $("<img>");
				// a lot of the images don't exist any more, get rid of them
				newImg.on("error", function (e) {
					newImg.parent().remove(); //remove the container for images that don't exist
				});
				newImg.attr("src", value.url);
				imgContainer.append(title);
				imgContainer.append(newImg);
				contentDiv.append(imgContainer);
			});
		}
		imageSearch = new google.search.ImageSearch();
		imageSearch.setSearchCompleteCallback(this, searchComplete, null);
		imageSearch.execute(query);
	},
	show: function (data) {
		var _ = this;
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
			protocol: window.location.protocol.replace(":", "")
		});
		this.panel.show();
		this.getImages(data);
	},
	generateImage: function (input) {
		var imagetemplate = "<img class='extend-block image-extend-block' src='" + input + "'/>"
		scratchpad.caret.pasteHtmlAtCaret(imagetemplate, false);
	},
	imageInsertFlow: function (e) {
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
			_.generateImage(e.target.src);
		});
	},
	init: function () {
		var _ = this;

		this.panel = $(".infocard-shell");
		this.imageInsertFlow = this.imageInsertFlow.bind(this);
		this.panel.append('<div noprint hidden class="research-insert-button small fab color-green-500" title="Add image to document"><i class="icon-add"></i></div>');
		this.insertButton = $(".research-insert-button");

		this.panel.on("mouseover", "img", function (e) {
			_.imageInsertFlow(e);
		});

		$(document.body).on("click", function () {
			_.insertButton.hide();
		});
		$("#research-close-button").on("click", function () {
			_.panel.hide();
		});

		scratchpad.editortooltip.createButton({
			name: "Research",
			content: "<i class='icon-book'></i>",
			section: "research",
			fn: function () {
				_.show(window.getSelection());
			},
		});

		scratchpad.keybindings.addBinding("mod+option+shift+i", function () {
			scratchpad.research.show(window.getSelection());
		});
		scratchpad.keybindings.addBinding("esc", function () {
			_.panel.hide();
		});
	}
});
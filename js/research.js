scratchpad.modules.define("research", {
	show: function(data) {
		var _ = this;
		$(".infocard-content").html("");
		var infocard = new InfoCard({
			query: data,
			container: document.querySelector(".infocard-content"),
			onEmpty: function(container) {
				container.innerHTML="<div class='secondary-text error-message'>No results found.</div>"
			},
			onError: function(container) {
				container.innerHTML="<div class='secondary-text error-message'>An error occured</div>"
			},
			appReferName: "scratchpad",
			onHeadingClick: function(e) {
				if (e.target.tagName == "H2") { //category names for meanings
				_.show(e.target.innerHTML);
				} else { //headers that will just show the same results when clicked
					window.open("https://duckduckgo.com/?q=" + encodeURIComponent(e.target.innerHTML),'_blank');
				}
			}
			});
			$(".infocard-shell").show();
	},
	generateImage: function(input) {
		var imagetemplate = "<img class='extend-block image-extend-block small' src='" + input + "'/>"
		scratchpad.caret.pasteHtmlAtCaret(imagetemplate, false);
	},
	imageInsertFlow: function(e) {
		var _ = this;
		var position = $(e.target).offset();
		$(".research-insert-button").css({left: position.left, top: position.top});
		$(".research-insert-button").show();
		$(".research-insert-button").off();
		$(".research-insert-button").on("mousedown", function() {
			_.generateImage(e.target.src);
		});
	},
	init: function() {
		var _ = this;
		this.imageInsertFlow = this.imageInsertFlow.bind(this);
		$(document.body).append('<div noprint hidden class="research-insert-button small fab color-green-500" title="Add image to document"><i class="icon-add"></i></div>');
		$(".infocard-shell").on("mouseover", "img", function(e) {
			_.imageInsertFlow(e);
		});
		$(document.body).on("click", function() {
			$(".research-insert-button").hide();
		});
		scratchpad.keybindings.addBinding("mod+option+shift+i", function() {
			scratchpad.research.show(window.getSelection());
		});
		scratchpad.keybindings.addBinding("esc", function() {
			$(".infocard-shell").hide();
		});
	}
});
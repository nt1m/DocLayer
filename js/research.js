scratchpad.modules.define("research", {
	show: function(data) {
		$(".infocard-content").html("");
		var infocard = new InfoCard({
			query: data,
			container: document.querySelector(".infocard-content"),
			onEmpty: function(container) {
				container.innerHTML="<div class='secondary-text error-message'>No results found.</div>"
			}
			});
			$(".infocard-shell").show();
			$("#ddg-attr-result").attr("href", "http://duckduckgo.com/?q=" + encodeURIComponent(data) + "&t=scratchpad");
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
		$(".infocard-shell").on("click", "h2", function(e) {
			_.show(e.target.innerHTML);
		});
		$(document.body).on("click", function() {
			$(".research-insert-button").hide();
		});
		scratchpad.keybindings.addBinding(115, function() {
			scratchpad.research.show(window.getSelection());
		});
		window.addEventListener("keypress", function(e) {
			if(e.keyCode == 27) {
				$(".infocard-shell").hide();
			}
		});
	}
});
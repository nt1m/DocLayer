scratchpad.modules.define("research", {
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
	}
});
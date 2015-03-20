scratchpad.modules.define("ui", {
	dialogs: {
		overlayEl: $(".dialog-overlay"),
		show: function(dialog) {
			this.overlayEl[0].hidden = false
			dialog[0].hidden = false;
			dialog.find(".text-input").val("");
			dialog.trigger("dialog-shown");
		},
		hide: function(dialog) {
			this.overlayEl[0].hidden = true;
			dialog[0].hidden = true;
			dialog.trigger("dialog-hidden");
		},
		init: function() {
			$(document.body).on("click", ".dialog-confirm", function() {
				var dialog = $(this).parent().parent().parent(".dialog");
				dialog.trigger("dialog-confirm");
			});
			$(document.body).on("click", ".dialog-cancel",  function() {
				var dialog = $(this).parent().parent().parent(".dialog");
				dialog.trigger("dialog-cancel");
				scratchpad.ui.dialogs.hide(dialog);
			});
		}
	},
	init: function() {
		this.dialogs.init();
	}
});
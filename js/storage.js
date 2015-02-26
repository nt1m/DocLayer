scratchpad.modules.define("storage", {
	editor: $("#document-editor"),
	get: function() {
		if(localStorage.getItem("saved-document")) {
			return localStorage.getItem("saved-document");
		} else {
			return "";
		}
	},
	saveData: function(data) {
		localStorage.setItem("saved-document", data);
	},
	save: function() {
		var html = this.editor.html();
		if(this.get() != html) {
			this.saveData(html);
		}
		return localStorage.getItem("saved-document");
	},
	init: function() {
	this.editor.html(this.get());
	var _ = this;
	setInterval(function() {
		_.save();
	}, 5000);
}
});
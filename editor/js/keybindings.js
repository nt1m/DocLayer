//keybinding api

/* example:

		docLayer.keybindings.addBinding(102, function() {
			_.startsearch();
		})
		
		(note that the keycodes are keypress - see http://asquare.net/javascript/tests/KeyCode.html) 
		
		*/

docLayer.modules.define("keybindings", {
	css: false,
	addBinding: function(keyset, eventFunction) {
		Mousetrap.bind(keyset, function(e) {
			eventFunction();
			return false;
		});
	}
});
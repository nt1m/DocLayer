//keybinding api

/* example:

		scratchpad.keybindings.addBinding(102, function() {
			_.startsearch();
		})
		
		(note that the keycodes are keypress - see http://asquare.net/javascript/tests/KeyCode.html) 
		
		*/

scratchpad.modules.define("keybindings", {
addBinding: function(keycode, eventFunction) {
	window.addEventListener("keypress", function(e) {
		if	((e.charCode == keycode && e.metaKey) || (e.charCode && e.ctrlKey)) {
			e.preventDefault();
			eventFunction(e);
		}
	});
},
	init: function() {
		console.log("initialized keyboard shortcuts module");
	}
});
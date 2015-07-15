scratchpad.modules.define("findinpage", {
	/* this needs to be appended to the navbar, not the body, so it needs a custom insert */
	customhtml: '\
			<span class="findinpage-to-right">\
				<button title="Back to document" class="icon-button" id="findinpage-exit"><i class="icon-arrow-back"></i></button>\
				<span id="findinpage-inputs">\
					<span class="findinpage-input-area">\
						<input title="Enter text to find" type="text" id="find-input" class="text-input findinpage-input" placeholder="Find something..."/>\
						<span class="findinpage-count"></span>\
					</span>\
					<span class="findinpage-input-area">\
						<input title="Replace text" type="text" id="replace-input" class="text-input findinpage-input" placeholder="Replace with..."/>\
					</span>\
				</span>\
				<button title="Search for text in the document" class="icon-button" id="findinpage-button"><i class="icon-search"></i></button>\
			</span>\
	',

	startsearch: function () {
		this.findinpagecount.html("");
		this.inputs.find.val("");
		this.inputs.replace.val("");
		this.inputs.find.removeClass("no-matches");
		$(document.body).addClass("find-in-page");
		this.inputs.find.focus();
		scratchpad.editregion.attr("contenteditable", "false"); //temp fix for firefox bug
	},

	endsearch: function () {
		$(document.body).removeClass("find-in-page");
		scratchpad.editregion.removeHighlight();
		scratchpad.editregion.attr("contenteditable", "true"); //temp fix for firefox bug
		scratchpad.editregion.get(0).focus(); //the jquery focus method doesn't work on contenteditable, so the native method must be used instead
	},

	highlightmatches: function () {
		scratchpad.editregion.removeHighlight();
		scratchpad.editregion.highlight(this.inputs.find.val());
		var highlights = $(".highlight");
		var matches = highlights.length
		this.findinpagecount.html(matches);
		if (matches == 0 && this.inputs.find.val() != "") {
			this.inputs.find.addClass("no-matches")
		} else {
			this.inputs.find.removeClass("no-matches");
		}
		//scroll to the closest match
		var $window = $(window);
		var closestEl;
		var distance = 99999999999;
		var windowscroll = $window.scrollTop();
		highlights.each(function () {
			var $this = $(this);
			var newdistance = Math.abs($this.position().top - windowscroll);
			if (newdistance < distance) {
				distance = newdistance;
				closestEl = $this;
			}
		});
		if (closestEl) { //make sure we don't throw an error if there are no highlights
			$(window).scrollTop(closestEl.offset().top - 100);
		}
	},
	replace: function () {
		this.highlightmatches();
		$(".highlight").text(this.inputs.replace.val());
		scratchpad.editregion.removeHighlight();
		this.endsearch();
	},

	init: function () {
		var _ = this;
		$(".editor-toolbar").append(this.customhtml);

		//cache elements
		this.button = $("#findinpage-button");
		this.findinpagecontainer = $(".findinpage");
		this.inputs = {};
		this.inputs.find = $("#find-input");
		this.inputs.replace = $("#replace-input");
		this.findinpagecount = $(".findinpage-count");

		// Bind functions
		this.startsearch = this.startsearch.bind(this);
		this.endsearch = this.endsearch.bind(this);
		this.highlightmatches = this.highlightmatches.bind(this);
		this.replace = this.replace.bind(this);

		// Event listeners

		this.button.click(this.startsearch);
		scratchpad.editregion.click(this.endsearch);
		$("#findinpage-exit").click(this.endsearch);
		this.inputs.find.keyup(this.highlightmatches);
		this.inputs.replace.keyup(function (e) {
			if (e.keyCode == 13) {
				_.replace();
			}
		});
		scratchpad.keybindings.addBinding("mod+f", function () {
			_.startsearch();
		});
	}
});
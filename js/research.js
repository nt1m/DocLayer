scratchpad.modules.define("research", {
	getImages: function(query) {
			var imageSearch;
		     function searchComplete() {
          var contentDiv = document.querySelector(".images-results");
          contentDiv.innerHTML = '';
        if (imageSearch.results && imageSearch.results.length > 0) {

          var results = imageSearch.results;
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var imgContainer = document.createElement('div');
            var title = document.createElement('div');
            imgContainer.classList.add("gimage-result-container");
						title.classList.add("gimage-result-title");
            title.innerHTML = result.titleNoFormatting;
            var newImg = document.createElement('img');
						//a lot of the images don't exist any more, get rid of them
						newImg.onerror = function(e) {
																					e.target.parentNode.remove();
																				}
            newImg.src=result.url;
            imgContainer.appendChild(title);
            imgContainer.appendChild(newImg);

            contentDiv.appendChild(imgContainer);
          }

        }
      }

		imageSearch = new google.search.ImageSearch();
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    imageSearch.execute(query);

	},
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
			this.getImages(data);
	},
	generateImage: function(input) {
		var imagetemplate = "<img class='extend-block image-extend-block small' src='" + input + "'/>"
		scratchpad.caret.pasteHtmlAtCaret(imagetemplate, false);
	},
	imageInsertFlow: function(e) {
		if(!e.target.hasAttribute("noinsert")) {
		var _ = this;
		var position = $(e.target).offset();
		var shellposition = $(".infocard-shell").offset();
		var scroll = $(".infocard-shell").scrollTop();
		$(".research-insert-button").css({left: position.left - shellposition.left, top: position.top - shellposition.top + scroll });
		$(".research-insert-button").show();
		$(".research-insert-button").off();
		$(".research-insert-button").on("mousedown", function() {
			_.generateImage(e.target.src);
		});
		}
	},
	init: function() {
		var _ = this;
		this.imageInsertFlow = this.imageInsertFlow.bind(this);
		$(".infocard-shell").append('<div noprint hidden class="research-insert-button small fab color-green-500" title="Add image to document"><i class="icon-add"></i></div>');
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
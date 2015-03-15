//make ripples work in ios
document.addEventListener("touchstart", function() {}, false);

function createError(options) {
			console.log("creating message for error: " + options.error);
			$(document.body).append('<div class="splashscreen themeable error" style="">\
															<div style="position: relative; float: left;" class="logo-card bg-teal-500"><i class="icon-book"></i> \
																<div class="corner"> \
																	<div class="folded-corner"></div> \
																</div> \
															</div> \
															<div style="" class="error-info"> \
																<h1>Something went wrong.</h1> \
																<div class="secondary-text"> error-action </div> \
																<a id="issue-report-link" target="_blank">Report an issue</a> \
															</div> \
														</div>)'.replace("error-action", options.action));
			$("#issue-report-link").attr("href", "https://github.com/PalmerAL/scratchpad/issues/new?title=error: " + options.error + "&body=actions%20to%20reproduce%20the%20error:");
		}
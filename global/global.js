var body = $(document.body);

//make ripples work in ios
document.addEventListener("touchstart", function () {}, false);

function parseError(error) {
	return JSON.stringify({
		method: error.method,
		status: error.status,
		response: error.response,
	});
}

function createError(options) {

	if (options.api_response && typeof options.api_response == "object") { //the error is a dropbox API error object, we only want the relevant data
		options.api_response = parseError(options.api_response);
	}

	console.log("creating message for error: " + options.error + "(api response): " + options.api_response);
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
	$("#issue-report-link").attr("href", "https://github.com/PalmerAL/scratchpad/issues/new?title=error: " + options.error + " - api response: " + options.api_response + "&body=actions%20to%20reproduce%20the%20error:");
}

function createToast(message) {
	$(".floating-message").remove();
	$(document.body).prepend('<div class="toast floating-message document-too-long"><label class="toast-label">' + message + '</label></div>');
	setTimeout(removeToasts, 5000);
}

function removeToasts() {
	$(".floating-message").remove();
}

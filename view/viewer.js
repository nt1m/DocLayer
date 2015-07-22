//sanitizer from http://stackoverflow.com/a/28533511/4603285. Not guaranteed to be 100% foolproof, but doesn't need to be either, since the viewer sandbox is fairly strict and doesn't allow same-origin.

var tagWhitelist_ = {
	"BODY": true,
	"HTML": true,
	"HEAD": true,
	"DIV": true,
	"P": true,
	"SPAN": true,
	"B": true,
	"I": true,
	"U": true,
	"STRONG": true,
	"STRIKE": true,
	"IFRAME": true,
	"IMG": true,
	"VIDEO": true,
	"H1": true,
	"H2": true,
	"H3": true,
	"BLOCKQUOTE": true,
	"BR": true,
	"OL": true,
	"UL": true,
	"LI": true,
	"HR": true,
};

var attributeWhitelist_ = {
	//iframe attributes
	"sandbox": true,
	"srcdoc": true,
	//general attributes
	"class": true,
	"src": true,
	"starred": true,
	//paragraph alignment
	"align": true,
};

function sanitizeHtml(input) {
	var iframe = document.createElement('iframe');
	if (iframe['sandbox'] === undefined) {
		alert('Your browser does not support sandboxed iframes. Please upgrade to a modern browser.');
		return '';
	}
	iframe['sandbox'] = 'allow-same-origin';
	iframe.style.display = 'none';
	document.body.appendChild(iframe); // necessary so the iframe contains a document
	iframe.contentDocument.body.innerHTML = input;

	function makeSanitizedCopy(node) {
		if (node.nodeType == Node.TEXT_NODE) {
			var newNode = node.cloneNode(true);
		} else if (node.nodeType == Node.ELEMENT_NODE && tagWhitelist_[node.tagName]) {
			newNode = iframe.contentDocument.createElement(node.tagName);
			for (var i = 0; i < node.attributes.length; i++) {
				var attr = node.attributes[i];
				if (attributeWhitelist_[attr.name]) {
					newNode.setAttribute(attr.name, attr.value);
				}
			}
			for (i = 0; i < node.childNodes.length; i++) {
				var subCopy = makeSanitizedCopy(node.childNodes[i]);
				newNode.appendChild(subCopy, false);
			}
		} else {
			newNode = document.createDocumentFragment();
		}
		return newNode;
	};

	var resultElement = makeSanitizedCopy(iframe.contentDocument.body);
	document.body.removeChild(iframe);
	return resultElement.innerHTML;
};


var window_hash = window.location.hash.replace("#", "");
var viewer = $("#viewer");

var documentSource = "https://dl.dropboxusercontent.com/s" + window_hash + ".html?dl=0";

//stylesheets needed to render the document - global.css, editor.css, ui.css, material.css
var template = "<link rel='stylesheet' href='" + config.basepath + "global/global.css'/><link rel='stylesheet' href='" + config.basepath + "editor/css/editor.css'/><link rel='stylesheet' href='" + config.basepath + "editor/css/ui.css'/><link rel='stylesheet' href='" + config.basepath + "lib/material-framework/css/material.css'/>";

$.ajax(documentSource)
	.done(function (data) {
		window.originalData = data; //having these as global variables makes debugging easier (because you can use them from the console)
		window.sanitizedData = sanitizeHtml(data);
		viewer[0].setAttribute("srcdoc", "<!DOCTYPE html><html><head>" + template + "</head><body id='document-editor'>" + sanitizedData + "</html>");
		viewer.focus();
	})
	.fail(function () {
		viewer.attr("srcdoc", "<!DOCTYPE html><html><head>" + template + "</head><body><span class='secondary-text'>An error occured while loading this document.</span></body></html>");
	});
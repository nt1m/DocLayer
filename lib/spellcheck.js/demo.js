var input = document.querySelector("#input");
var output = document.querySelector("#output");
var correct_display = document.querySelector("#correct");


input.onkeyup = function () {
	output.innerHTML = spellcheck.getBestReplacement(input.value);
	correct_display.innerHTML = spellcheck.checkSpelling(input.value);
}
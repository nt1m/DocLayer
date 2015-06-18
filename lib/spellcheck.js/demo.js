var input = document.querySelector("#input");
var output = document.querySelector("#output");
var correct_display = document.querySelector("#correct");


input.onkeyup = function () {
	output.innerHTML = spellcheck.getBestReplacement(input.value);
	correct_display.innerHTML = spellcheck.checkSpelling(input.value);
}

var area = document.querySelector("#speller-ta-input");
var area_output = document.querySelector("#speller-ta-output");

area.onchange = function () {
	var value = area.value;
	var words = value.split(" ");
	words.forEach(function (word) {
		if (!spellcheck.checkSpelling(word)) {
			value = value.replace(word, "<span style='color:red'>" + word + "</span>");
		}
	});
	area_output.innerHTML = value;
}
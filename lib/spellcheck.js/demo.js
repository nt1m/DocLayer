var input = document.querySelector("#input");
var output = document.querySelector("#output");
var suggestions = document.querySelector("#suggestions");
var correct_display = document.querySelector("#correct");


input.onkeyup = function() {
    output.innerHTML = getBestReplacement(input.value).value;
    suggestions.innerHTML = getSuggestions(input.value);
    correct_display.innerHTML = checkSpelling(input.value);
}
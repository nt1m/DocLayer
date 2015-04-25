//sift4 from http://siderite.blogspot.com/2014/11/super-fast-and-accurate-string-distance.html

function sift4(s1, s2, maxOffset, maxDistance) {
	var maxOffset = 6;
	var maxDistance = 10;
	if (!s1 || !s1.length) {
		if (!s2) {
			return 0;
		}
		return s2.length;
	}

	if (!s2 || !s2.length) {
		return s1.length;
	}

	var l1 = s1.length;
	var l2 = s2.length;

	var c1 = 0; //cursor for string 1
	var c2 = 0; //cursor for string 2
	var lcss = 0; //largest common subsequence
	var local_cs = 0; //local common substring
	var trans = 0; //number of transpositions ('ab' vs 'ba')
	var offset_arr = []; //offset pair array, for computing the transpositions

	while ((c1 < l1) && (c2 < l2)) {
		if (s1.charAt(c1) == s2.charAt(c2)) {
			local_cs++;
			while (offset_arr.length) { //see if current match is a transposition
				if (c1 <= offset_arr[0][0] || c2 <= offset_arr[0][1]) {
					trans++;
					break;
				} else {
					offset_arr.splice(0, 1);
				}
			}
			offset_arr.push([c1, c2]);
		} else {
			lcss += local_cs;
			local_cs = 0;
			if (c1 != c2) {
				c1 = c2 = Math.min(c1, c2); //using min allows the computation of transpositions
			}
			//if matching characters are found, remove 1 from both cursors (they get incremented at the end of the loop)
			//so that we can have only one code block handling matches 
			for (var i = 0; i < maxOffset; i++) {
				if ((c1 + i < l1) && (s1.charAt(c1 + i) == s2.charAt(c2))) {
					c1 += i - 1;
					c2--;
					break;
				}
				if ((c2 + i < l2) && (s1.charAt(c1) == s2.charAt(c2 + i))) {
					c1--;
					c2 += i - 1;
					break;
				}
			}
		}
		c1++;
		c2++;
		if (maxDistance) {
			var temporaryDistance = Math.max(c1, c2) - lcss + trans / 2;
			if (temporaryDistance >= maxDistance) return Math.round(temporaryDistance);
		}
	}
	lcss += local_cs;
	return Math.round(Math.max(l1, l2) - lcss + trans / 2); //remove half the number of transpositions from the lcss
}

var dictionary = ["the", "be", "and", "of", "a", "in", "to", "have", "it", "I", "that", "for", "you", "he", "with", "on", "do", "say", "this", "they", "at", "but", "we", "his", "from", "not", "n't", "by", "she", "or", "as", "what", "go", "their", "can", "who", "get", "if", "would", "her", "all", "my", "make", "about", "know", "will", "up", "one", "time", "there", "year", "so", "think", "when", "which", "them", "some", "me", "people", "take", "out", "into", "just", "see", "him", "your", "come", "could", "now", "than", "like", "other", "how", "then", "its", "our", "two", "more", "these", "want", "way", "look", "first", "also", "new", "because", "day", "more", "use", "no", "man", "find", "here", "thing", "give", "many", "well", "only", "those", "tell", "very", "even", "back", "any", "good", "woman", "through", "us", "life", "child", "work", "down", "may", "after", "should", "call", "world", "over", "school", "try", "last", "ask", "need", "too", "feel", "three", "state", "never", "become", "between", "high", "really", "something", "most", "another", "much", "family", "own", "leave", "put", "old", "while", "mean", "keep", "student", "why", "let", "great", "same", "big", "group", "begin", "seem", "country", "help", "talk", "where", "turn", "problem", "every", "start", "hand", "might", "American", "show", "part", "against", "place", "such", "again", "few", "case", "week", "company", "where", "system", "each", "right", "program", "hear", "question", "during", "play", "government", "run", "small", "number", "off", "always", "move", "night", "live", "Mr.", "point", "believe", "hold", "today", "bring", "happen", "next", "without", "before", "large", "million", "must", "home", "under", "water", "room", "write", "mother", "area", "national", "money", "story", "young", "fact", "month", "different", "lot", "right", "study", "book", "eye", "job", "word", "though", "business", "issue", "side", "kind", "four", "head", "far", "black", "long", "both", "little", "house", "yes", "since", "long", "provide", "service", "around", "friend", "important", "father", "sit", "away", "until", "power", "hour", "game", "often", "yet", "line", "political", "end", "among", "ever", "stand", "bad", "lose", "however", "member", "pay", "law", "meet", "car", "city", "almost", "include", "continue", "set", "later", "community", "much", "name", "five", "once", "white", "least", "president", "learn", "real", "change", "team", "minute", "best", "several", "idea", "kid", "body", "information", "nothing", "ago", "right", "lead", "social", "understand", "weather", "watch", "together", "follow", "around", "parent", "stop", "face", "anything", "create", "public", "already", "speak", "others", "read", "level", "allow", "add", "office", "spend", "door", "health", "person", "art", "sure", "such", "war", "history", "party", "within", "grow", "result", "open", "change", "morning", "walk", "reason", "low", "win", "research", "girl", "guy", "early", "food", "moment", "himself", "air", "teacher", "force", "offer", "enough", "both", "education", "across", "although", "remember", "foot", "second", "boy", "maybe", "toward", "able", "age", "off", "policy", "everything", "love", "process", "music", "including", "consider", "appear", "actually", "buy", "probably", "an", "which", "rich", "much", "such", "touch", "bachelor", "attach", "sandwich", "ostrich", "cheaply", "vein", "protein", "height", "weird", "seize", "neighbor", "their", "flatly", "greatly", "neatly", "fatly", "squatly", "platesful", "tablesful", "ancient"];

var commonMisspellings = [
	["lll", "ll"],
	["uc ", "uc "],
	["acc ", "acc "],
	["ucc ", "ucc "],
	["ecc ", "ecc "],
	["ei", "ie"],
	["cie", "cei"],
	["ccy", "cy"],
	["geu", "geu"],
	["vv", "v"],
	["jj", "j"],
	["kk", "k"],
	["ww", "w"],
	["xx", "x"],
	["q", "q"],
	["mision", "mission"],
	["toin", "tion"],
	["akc", "ack"],
	["xs", "xs"],
	["j ", "j "],
	["ii", "i"],
	["aaa", "a"],
	["bbb", "b"],
	["ccc", "c"],
	["ddd", "d"],
	["eee", "e"],
	["fff", "f"],
	["ggg", "g"],
	["hhh", "h"],
	["mmm", "m"],
	["nnn", "n"],
	["ooo", "o"],
	["ppp", "p"],
	["rrr", "r"],
	["sss", "s"],
	["ttt", "t"],
	["uuu", "u"],
	["vvv", "v"],
	["yy", "y"],
	["zzz", "zz"],
	["bl ", "ble "],
	["cie", "cei"],
	["btion", "ption"],
	["bsion", "ption"],
	["hng", "hang"],
	[" xt", " ext"],
	["bd", "bad"],
	["abud", "abd"],
	["ubud", "ubd"],
	["oug ", "ough "],
	["apoi", "appoi"],
	[" sert", " cert"],
	["mx", "max"],
	["lnd", "land"],
	["ms", "mis"],
	["vv", "v"],
	["jj", "j"],
	["kk", "k"],
	["ww", "w"],
	["xx", "x"],
	["pld", "pelled"],
	["ccomo", "ccommo"],
	["accro", "acro"],
	["agres", "aggres"],
	["uem", "um"],
	["sicly", "sically"],
	["buis", "busi"],
	["legue", "league"],
	["iousi", "iosi"],
	["ssap", "sapp"],
	["ssapp", "sapp"],
	["barass", "barrass"],
	["mouro", "moro"],
	["jis", "gis"],
	["aurd", "uard"],
	["atly", "ately"],
	["epera", "epara"],
	["esf", "essf"], //successful
	["shh", "sh"], //threshold
	["wier", "weir"], //weird
]

var cancelers = [ //exceptions to the banned strings above
["ei", "cei"],
	["q", "qu"],
	["hr", "chr"],
	["hr", "thr"],
	["hr", "phr"],
	["bd", "abd"],
	["bd", "ubd"],
	["cie", "scie"],
	["bd", "ubd"]
]

function getVowelRatio(word) {
	return (word.replace(/[^a]/g, "").length + word.replace(/[^e]/g, "").length + word.replace(/[^i]/g, "").length + word.replace(/[^o]/g, "").length + word.replace(/[^u]/g, "").length + word.replace(/[^y]/g, "").length + word.replace(/[^1]/g, "").length + word.replace(/[^2]/g, "").length + word.replace(/[^3]/g, "").length + word.replace(/[^5]/g, "").length + word.replace(/[^6]/g, "").length + word.replace(/[^6]/g, "").length + word.replace(/[^7]/g, "").length + word.replace(/[^8]/g, "").length + word.replace(/[^9]/g, "").length + word.replace(/[^0]/g, "").length / word.length);
}

function isNegatedByCanceler(word, rule) {
	var isNegated = false;
	cancelers.forEach(function (canceler) {
		if (rule == canceler[0] && word.indexOf(canceler[1].toLowerCase()) > -1) { //the rule is negated by a canceler
			isNegated = true;
		}
	});
	return isNegated;
}

function checkSpelling(word) {
	var input = " " + word.toLowerCase().replace(/\W/g, ""); //ignore punctuation characters
	var correct = true;
	if (input.length > 3) {
		commonMisspellings.forEach(function (misspelling) {
			if (input.indexOf(misspelling[0]) > -1 && !isNegatedByCanceler(input, misspelling[0])) { //it contains a banned string that is not negated
				correct = false;
			}
		});
		if (dictionary.indexOf(word) > -1) { //if it is in the dictionary, it is spelled correctly
			correct = true;
		}
		var syllables = input.replace(/\s/g, "").match(/.{1,4}/g); //splits the word into syllable-sized chunks after removing any whitespace
		if (syllables) { //make sure there are actually some syllables to check
			syllables.forEach(function (value) {
				if (getVowelRatio(value) < 0.2 && value.length > 3) { //the word doesn't have a vowel within a syllable-sized chunk of it, so it is probably spelled wrong
					correct = false;
				}
			});
		}

		if (getVowelRatio(input.replace(/\s/g, "")) < 0.2) { //check the overall word, just to be sure
			correct = false;
		}

		return correct;
	} else { //1-letter words should always return true
		return true;
	}
}

function getLinguisticMatch(word) {
	var linguisticMatch = " " + word.toLowerCase() + " ";
	for (var i = 0; i < commonMisspellings.length; i++) {
		var search = new RegExp(commonMisspellings[i][0].toLowerCase(), "g");
		linguisticMatch = linguisticMatch.replace(search, commonMisspellings[i][1].toLowerCase());
	}
	return linguisticMatch.replace(/\s/g, ""); //remove the whitespace we added earlier
}

function getBestReplacement(word) {
	if (word.length < 3) {
		return {
			value: word,
			diff: 0
		};
	} else {
		var newword = "";
		var diff = 99;
		var tempdiff = "";
		dictionary.forEach(function (value) {
			tempdiff = sift4(word.toUpperCase(), value.toUpperCase());
			if (tempdiff / value.length <= diff) {
				diff = tempdiff / value.length;
				newword = value;
			}
		});
		var patternMatch = getLinguisticMatch(word);
		if (patternMatch != word.toLowerCase()) { //if there is a linguistic match, use that
			diff = 0;
			newword = patternMatch;
		}
		return {
			value: newword.replace(/\s/g, ""),
			diff: diff
		};
	}
}

function getSuggestions(word) {
	var suggestionList = [];
	dictionary.forEach(function (value) {
		tempdiff = sift4(word.toUpperCase(), value.toUpperCase());
		if (tempdiff / value.length <= 0.3 || (tempdiff / value.length <= 0.5 && suggestionList.length < 4)) {
			suggestionList.push(value);
		}
	});
	var patternMatch = getLinguisticMatch(word);
	var tempdiff = sift4(word.toUpperCase(), patternMatch.toUpperCase());
	if (tempdiff / patternMatch.length <= 0.5 && patternMatch != word) {
		diff = tempdiff / patternMatch.length;
		suggestionList.push(patternMatch);
	}
	return suggestionList;
}
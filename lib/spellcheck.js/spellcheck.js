var spellcheck = {

	//performance-speed adjustment. Higher numbers mean faster but less accurate.
	min_word_freq: 2,

	//sift4 from http://siderite.blogspot.com/2014/11/super-fast-and-accurate-string-distance.html


	// Sift4 - simplest version
	// online algorithm to compute the distance between two strings in O(n)
	// maxOffset is the number of characters to search for matching letters
	sift4: function (s1, s2) {
		var maxOffset = 5;
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

		while ((c1 < l1) && (c2 < l2)) {
			if (s1.charAt(c1) == s2.charAt(c2)) {
				local_cs++;
			} else {
				lcss += local_cs;
				local_cs = 0;
				if (c1 != c2) {
					c1 = c2 = Math.max(c1, c2); //using max to bypass the need for computer transpositions ('ab' vs 'ba')
				}
				for (var i = 0; i < maxOffset && (c1 + i < l1 || c2 + i < l2); i++) {
					if ((c1 + i < l1) && (s1.charAt(c1 + i) == s2.charAt(c2))) {
						c1 += i;
						local_cs++;
						break;
					}
					if ((c2 + i < l2) && (s1.charAt(c1) == s2.charAt(c2 + i))) {
						c2 += i;
						local_cs++;
						break;
					}
				}
			}
			c1++;
			c2++;
		}
		lcss += local_cs;
		return Math.round(Math.max(l1, l2) - lcss);
	},

	loadDict: function (data) {
		spellcheck.dict = data;
	},

	preprocess: function (word) {
		return word.toLowerCase().replace(/[\.\,\;\!\"\(\)]/g, ""); //ignore punctuation characters.
	},

	checkSpelling: function (word) {

		if (!word) { //there isn't any way to spellcheck an empty string
			return true;
		}
		var input = spellcheck.preprocess(word);

		if (/[\W\d]/g.test(input)) { //non-letter characters we can't check spelling for
			return true;
		}

		if (!spellcheck.dict) {
			return true;
		}

		if (spellcheck.dict[input]) {
			return true;
		}

		return false;
	},
	getBestReplacement: function (word) {
		var input = word.toLowerCase().replace(/\W/g, ""); //ignore punctuation characters
		if (word[0].toUpperCase() == word[0]) {
			var wordIsUppercase = true;
		}

		if (!spellcheck.dict) {
			return word;
		}

		var match = input;
		var diff = 99;

		var diffTies = [];
		for (var word in spellcheck.dict) {
			if (spellcheck.dict[word] >= spellcheck.min_word_freq) {
				var ndiff = spellcheck.sift4(input, word);
				if (ndiff < diff) {
					match = word;
					diff = ndiff;
					diffTies = [];
				} else if (diff == ndiff) {
					diffTies.push(word);
				}
			}
		}

		diffTies.forEach(function (t) {
			if (spellcheck.dict[t] > spellcheck.dict[match]) {
				match = t;
			}
		});

		if (wordIsUppercase) {
			console.log(match[0]);
			match = match.replace(match[0], match[0].toUpperCase());
			console.log(match[0]);

		}

		return match;
	}

}

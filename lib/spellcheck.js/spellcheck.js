var spellcheck = {

	//performance-speed adjustment. Higher numbers mean faster but less accurate.
	skip_interval: 5,

	//misspelings
	commonMisspellings: [
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
	["i ", "i "],
	["u ", "u "],
	["v ", "v "],
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
	["mobl", "mbol"], //symbol
	["ilx", "lix"], //netflix
	["iesu", "eisu"], //leisure
	["lisen", "licen"],
	["atos ", "atoes "], //potatoes, tomatoes
	["tuer", "teur"], //amateur
	["oflag", "ouflag"], //camouflage,
	["oncio", "onscio"], //conscious
	["urgler", "urglar"], //burglar
	["alcho", "alco"], //alcohol
	["yae", "yea"], //year
	["seff", "self"], //yourself
	["efl ", "elf "], //yourself
	["yot", "yout"], //youtube
	["whan", "wan"], //wants
	["irut", "irtu"], //virtual
	["wirt", "writ"], //writing
	["wna", "wan"], //want
	["aht", "hat"], //what
	["ihc", "ich"], //rich, which
	["yuo", "you"], //you
	[" hw", " wh"], //which
	["riet ", "rite "], //write
	["rsa ", "ars "], //years
	[" wup", " sup"], //super
	["teabl", "tabl"], //debateable
],

	cancelers: [ //exceptions to the banned strings above
["ei", "cei"],
	["q", "qu"],
	["hr", "chr"],
	["hr", "thr"],
	["hr", "phr"],
	["bd", "abd"],
	["bd", "ubd"],
	["cie", "scie"],
	["bd", "ubd"],
	["yae", "hyae"], //hyaena
],

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

	//porter-stemmer from https://github.com/jedp/porter-stemmer

	stemmer: function (w) {
		var step2list = {
			"ational": "ate",
			"tional": "tion",
			"enci": "ence",
			"anci": "ance",
			"izer": "ize",
			"bli": "ble",
			"alli": "al",
			"entli": "ent",
			"eli": "e",
			"ousli": "ous",
			"ization": "ize",
			"ation": "ate",
			"ator": "ate",
			"alism": "al",
			"iveness": "ive",
			"fulness": "ful",
			"ousness": "ous",
			"aliti": "al",
			"iviti": "ive",
			"biliti": "ble",
			"logi": "log"
		};

		var step3list = {
			"icate": "ic",
			"ative": "",
			"alize": "al",
			"iciti": "ic",
			"ical": "ic",
			"ful": "",
			"ness": ""
		};

		var c = "[^aeiou]"; // consonant
		var v = "[aeiouy]"; // vowel
		var C = c + "[^aeiouy]*"; // consonant sequence
		var V = v + "[aeiou]*"; // vowel sequence

		var mgr0 = "^(" + C + ")?" + V + C; // [C]VC... is m>0
		var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$"; // [C]VC[V] is m=1
		var mgr1 = "^(" + C + ")?" + V + C + V + C; // [C]VCVC... is m>1
		var s_v = "^(" + C + ")?" + v; // vowel in stem

		var stem;
		var suffix;
		var firstch;
		var re;
		var re2;
		var re3;
		var re4;
		var origword = w;

		if (w.length < 3) {
			return w;
		}

		firstch = w.substr(0, 1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) {
			w = w.replace(re, "$1$2");
		} else if (re2.test(w)) {
			w = w.replace(re2, "$1$2");
		}

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re, "");
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
				if (re2.test(w)) {
					w = w + "e";
				} else if (re3.test(w)) {
					re = /.$/;
					w = w.replace(re, "");
				} else if (re4.test(w)) {
					w = w + "e";
				}
			}
		}

		// Step 1c
		re = /^(.+?)y$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(s_v);
			if (re.test(stem)) {
				w = stem + "i";
			}
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step2list[suffix];
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step3list[suffix];
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			if (re.test(stem)) {
				w = stem;
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(mgr1);
			if (re2.test(stem)) {
				w = stem;
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			re2 = new RegExp(meq1);
			re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
			}
		}

		re = /ll$/;
		re2 = new RegExp(mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re, "");
		}

		// and turn initial Y back to y

		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}

		return w;
	},

	dict: [],

	loadDict: function (data) {
		spellcheck.dict = data;
	},

	isNegatedByCanceler: function (word, rule) {
		var isNegated = false;
		spellcheck.cancelers.forEach(function (canceler) {
			if (rule == canceler[0] && word.indexOf(canceler[1].toLowerCase()) > -1) { //the rule is negated by a canceler
				isNegated = true;
			}
		});
		return isNegated;
	},


	checkSpelling: function (word) {

		if(!word) { //there isn't any way to spellcheck an empty string
			return true;
		}
		var input = spellcheck.stemmer(word.toLowerCase().replace(/[\.\,\;\!\"\'\(\)]/g, "")).replace(/\wi$/g, ""); //ignore punctuation characters. The regex is because porter-stemmer sometimes makes words end in "i" (for example: badly -> badli), so we need just the root

		if (/[\W\d]/g.test(input)) { //non-letter characters we can't check spelling for
			return true;
		}

		for (var i = 0; i < spellcheck.commonMisspellings.length; i++) {
			var misspelling = spellcheck.commonMisspellings[i];
			if (input.indexOf(misspelling[0]) > -1 && !spellcheck.isNegatedByCanceler(input, misspelling[0])) { //it contains a banned string that is not negated
				return false;
			}
		}

		if (!spellcheck.dict) {
			return true;
		}

		var len = spellcheck.dict.length;
		var ilen = input.length;

		for (var i = 0; i < len; i++) {
			if (spellcheck.dict[i] == input) {
				return true;
			}
		}
		return false;
	},

	getLinguisticMatch: function (word) {
		var linguisticMatch = " " + word.toLowerCase() + " ";
		for (var i = 0; i < spellcheck.commonMisspellings.length; i++) {
			var search = new RegExp(spellcheck.commonMisspellings[i][0].toLowerCase(), "g");
			linguisticMatch = linguisticMatch.replace(search, spellcheck.commonMisspellings[i][1].toLowerCase());
		}
		return linguisticMatch.replace(/\s/g, ""); //remove the whitespace we added earlier
	},

	getBestReplacement: function (word) {
		var input = word.toLowerCase().replace(/\W/g, ""); //ignore punctuation characters
		var lm = spellcheck.getLinguisticMatch(input);
		if (lm != input) {
			return lm;
		}

		if (!spellcheck.dict) {
			return word;
		}
		var len = spellcheck.dict.length;

		var match = input;
		var diff = 99;
		for (var i = 0; i < len; i++) {
			if (i % spellcheck.skip_interval == 0) {
				var ndiff = spellcheck.sift4(input, spellcheck.dict[i]);
				if (ndiff < diff) {
					match = spellcheck.dict[i];
					diff = ndiff;
				}
			}
		}
		return match;
	}

}
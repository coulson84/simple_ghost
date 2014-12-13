module.exports = function(grunt) {
	grunt.registerMultiTask('processWords', function() {
		var o = this;
		var start = new Date();
		var shorterMatch = false;
		console.log("Processing word.lst file");
		console.log(start.toLocaleTimeString() + ' ' + start.toLocaleDateString());
		var wordList = grunt.file.read(this.data.src).split('\n');
		var tree = {
			_list: [],
			_w: [],
			_p: [],
			_a: []
		};
		var waste = {};
		var i = wordList.length - 1; // w.lst finishes with an new line break so has a an empty array item at the end we don't want
		var j, m;
		var map = function(branch, word, wordIndex, letterIndex, parent) {
			var sliced = word.slice(0, letterIndex);
			var newBranch, i;
			if (letterIndex < word.length) {
				newBranch = branch[word[letterIndex]] = branch[word[letterIndex]] || {
					_w: [],
					_p: []//,
					//_a: []
				};

				if (word.length % 2 === 1) {
					// _p are preferred words (for the computer) that will result in a win for the computer
					newBranch._p.push([wordIndex, word.length]);
				} else {
					// _w are words that will result in a loss for the computer
					newBranch._w.push([wordIndex, word.length]);
				}
				map(newBranch, word, wordIndex, ++letterIndex, branch);
			}
		};

		if(this.target === 'test') {
			wordList = wordList.slice(1, 500).concat(wordList.slice(-500));
			i = wordList.length
		}

		wordList = wordList.sort(function(a, b) {
			return b.length - a.length;
		});

		while (i--) {
			shorterMatch = false;
			word = wordList[i]
			if (word.length >= 4) {
				// all parsed words are added to the waste object - if a shorter word exists as a 
				// substring of the current string then we don't need to process the word at all
				// originally checked this via an array, using indexOf but this was way faster
				for (j = 4, m = word.length; j < word.length; j++) {
					if (waste[word.slice(0, j)]) {
						shorterMatch = true;
					}
				}

				if (shorterMatch === false) {
					waste[word] = true;
					map(tree, word, tree._list.push(word) - 1, 0);
				}
			}
		}

		console.log("Processing complete - time taken: " + ((new Date().getTime() - start) / 1000).toFixed(2) + 's');
		grunt.file.write(this.data.dest, JSON.stringify(tree));
	});
};
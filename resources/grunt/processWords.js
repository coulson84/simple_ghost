module.exports = function(grunt) {
	grunt.registerMultiTask('processWords', function() {
		var wordsList = grunt.file.read(this.data.src).split('\n');
		var tree = {
			words: wordsList
		};
		var i = wordsList.length - 1; // words.lst finishes with an new line break so has a an empty array item at the end we don't want
		var j, m;
		var map = function(branch, word, wordIndex, letterIndex) {
			var newBranch;
			if(letterIndex < word.length) {
				newBranch = branch[word[letterIndex]] = branch[word[letterIndex]] || {
					words: [],
					preferred: []
				};

				if(word.length%2===1) {
					newBranch.preferred.push(wordIndex);
				} else {
					newBranch.words.push(wordIndex);
				}
				map(newBranch, word, wordIndex, ++letterIndex);
			}
		};

		while (i--) {
			if(wordsList[i].length >= 4) {

				map(tree, wordsList[i], i, 0);
			}
		}
		grunt.file.write(this.data.dest, JSON.stringify(tree));
	});
};
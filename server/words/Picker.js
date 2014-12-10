var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var utils = require('util');

(function() {
	var words = {};
	var wordsLoaded = false;

	function Picker(path) {
		var o = this;

		fs.readFile(path || './server/words/list.json', 'utf8', function(err, list) {
			if (err) {
				return o.emit('loaderror', err);
			}

			o.words = words = JSON.parse(list);
			wordsLoaded = true;
			o.emit('ready');

		});
	}

	utils.inherits(Picker, EventEmitter);

	/**
	 * @method nextLetter
	 * @param str {string}
	 * @return {string}
	 * Fetches a suitable word and returns the next letter
	 */
	Picker.prototype.nextLetter = function(str) {
		if(!str) {
			return;
		}
		var options = this.fetchMatches(str);
		var returned = {};
		var rand = Math.floor(Math.random() * (options && options._p && options._p.length || 0)); // _p are preferred words (i.e. ones for the computer to win);
		var nextWord, nextLetter;


		if (words._list.indexOf(str) >= 0) {
			returned.playerLoses = true;
			return;
		}

		if (options) {
			if (options._p.length) {
				nextWord = words._list[options._p[rand][0]];
			} else {
				nextWord = getRandomMaxLength(options._w); // _w are words for the computer to lose
			}
		}

		return {
			nextLetter: nextWord ? nextWord[str.length] : ''
		};
	};

	/**
	 * @method fetchMatches
	 * @param str {string}
	 * @return {Object}
	 * Descends in to the tree and returns a matching object or undefined if there is no match
	 */

	Picker.prototype.fetchMatches = function(str) {
		var descend = function(i, branch) {
			if (i === str.length || !branch) {
				return branch;
			}
			return descend(i + 1, branch[str[i]]);
		};

		if (str) {
			return descend(0, words);
		}
	};

	/**
	 * @function getRandMaxLength
	 * @param arr {Array} possible word matches
	 * @private
	 * @return {number}
	 * Instead of just picking the last array item (and therefore longest)
	 * this will select randomly from the longest words
	 */
	var getRandomMaxLength = function(arr){
		var range;
		var rands = [];
		var max = 0;
		var i = arr.length;

		while(i--) {
			if(max<arr[i][1]) {
				break;
			}
			rands.push(arr[i][0]);
			max = arr[i][1];
		}

		// set range here and then return the random max length word.
		return rands[Math.floor(Math.random() * (rands.length || 0))];
	};

	module.exports = Picker;
}());
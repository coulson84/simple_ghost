(function() {
	var playArea = document.querySelector('#game');
	var wordArea = playArea.querySelector('#tiles');
	var messages = playArea.querySelector('#messages');
	var controls = playArea.querySelector('#controls');
	var currentScoreEl = playArea.querySelector('#currScore');
	var totalScoreEl = playArea.querySelector('#totalScore');
	var KEY_CODES = {65: 'a',66: 'b',67: 'c',68: 'd',69: 'e',70: 'f',71: 'g',72: 'h',73: 'i',74: 'j',75: 'k',76: 'l',77: 'm',78: 'n',79: 'o',80: 'p',81: 'q',82: 'r',83: 's',84: 't',85: 'u',86: 'v',87: 'w',88: 'x',89: 'y',90: 'z'};
	var LETTER_SCORES = {'a': 1,'b': 3,'c': 3,'d': 2,'e': 1,'f': 4,'g': 2,'h': 4,'i': 1,'j': 8,'k': 5,'l': 1,'m': 3,'n': 1,'o': 1,'p': 3,'q': 10,'r': 1,'s': 1,'t': 1,'u': 1,'v': 4,'w': 4,'x': 8,'y': 4,'z': 10};
	var awaitingResponse = false;
	var gameOver = false;
	var currentScore = 0;
	var totalScore = 0;
	var animating = false;
	var tileQueue = [];
	var fragment = '';
	var mobile = /mobile/i.test(navigator.userAgent);

	var Game = function() {
		window.addEventListener('keyup', playerMove);
		controls.addEventListener('click', clickManager);
		window.addEventListener('resize', resize);
		if(mobile) {
			document.querySelector('.mobile').style.visibility = 'visible';
		}
	};

	var addDiv = function(target, location, content, className) {
		var el = document.createElement('div');
		el.innerHTML = content;
		el.className = className;

		if (className === 'tile') {
			if (animating === false) {
				animating = true;
				wordArea.style.width = (fragment.length * 101) + 'px';
				target.insertAdjacentElement(location, el);
				el.addEventListener('webkitAnimationEnd', function() {
					animating = false;
					if (tileQueue.length) {
						addDiv.apply(null, tileQueue.pop());
					}
				});
			} else {
				tileQueue.unshift([target, location, content, className])
			}
		}

		if (className !== 'tile') {
			target.insertAdjacentElement(location, el);
		}
	};

	var newGame = function() {
		fragment = '';
		wordArea.innerHTML = '';
		score = 0;
		gameOver = false;
		currentScoreEl.innerHTML = formatScore(0);
	};

	var selectMove = function() {
		playerMove(document.querySelector('select.button').value);

	};

	var playerMove = function(event) {
		var letter = typeof event === 'string' ? event : KEY_CODES[event.keyCode];
		if (/^[a-z]$/.test(letter)) {
			if (gameOver === true) {
				newGame();
			}

			if (awaitingResponse) {
				return addDiv(messages, 'afterBegin', 'Hold on - I\'m still thinking', 'message');
			}

			awaitingResponse = true;
			utils.ajax('/game/' + (fragment.length ? 'next' : 'new') + '/' + fragment + letter, {
				complete: playResponse
			});

			fragment += letter;
			addDiv(wordArea, 'beforeEnd', letter, 'tile');
			wordArea.style.width = (fragment.length * 101) + 'px';
			wordArea.style.transform = '';
			resize();
		}
	};

	var playResponse = function(e) {
		var data, letters;

		awaitingResponse = false;

		if (e.status >= 400) {
			return;
		}

		try {
			data = JSON.parse(e.responseText);
		} catch (e) {
			return;
		}

		if (data.nextLetter) {
			fragment += data.nextLetter;
			addDiv(wordArea, 'beforeEnd', data.nextLetter, 'tile');
		}

		if (data.message) {
			addDiv(messages, 'afterBegin', data.message, 'message');
		}

		if (data.invalid) {
			letters = wordArea.querySelectorAll('.tile');
			letters.opacity = 0;
			animating = true;
			setTimeout(function() {
				animating = false;
				letters[letters.length - 1].parentNode.removeChild(letters[letters.length - 1]);
				wordArea.style.width = (fragment.length * 101) + 'px';
			}, 500);
			fragment = fragment.substr(0, fragment.length - 1)
		}

		updateScore(fragment);

		if (data.playerLoses || data.playerWins) {
			gameOver = true;
			addScore(data.playerWins);
		}
		resize();
	};

	var resize = function() {
		var scale = (mobile ? document.documentElement.clientWidth : window.innerWidth) / (fragment.length * 101);
		if (scale<1) {
			wordArea.style.transform = 'scale(' + scale + ')';
			wordArea.style.webkitTransform = 'scale(' + scale + ')';
			wordArea.style.left = '-8px';
		} else {
			wordArea.style.webkitTransform = '';
			wordArea.style.left = 0;
		}
	};

	var updateScore = function(fragment) {
		var i = fragment.length;

		currentScore = 0;
		while (i--) {
			currentScore += LETTER_SCORES[fragment[i]];
		}
		currentScore *= (1 + fragment.length / 10) * 10;
		currScore.innerHTML = formatScore(currentScore);
	};

	var addScore = function(win) {
		if (win) {
			totalScore += currentScore;
			totalScoreEl.innerHTML = formatScore(totalScore);
		}
	};

	var formatScore = function(s) {
		s = Math.floor(s).toString();
		while (s.length - 9 < 0) {
			s = '0' + s;
		};
		return s;
	};


	var clickManager = function(e) {
		var action = e.target.getAttribute('data-action');
		var info = e.target.getAttribute('data-info');
		if (!action) {
			return;
		}

		switch (action) {
			case 'newGame':
				newGame();
			break;
			case 'resetScore':
				totalScoreEl.innerHTML = formatScore(0);
			break;
			case 'playerMoveFromSelect':
				selectMove();
			break;
			default:
				break;
		}
	};

	var game = new Game();
}());
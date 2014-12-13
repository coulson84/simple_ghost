var Picker = require('../words/Picker');

(function(){
	var picker;

	function Game(){
		picker = new Picker();
	}

	Game.prototype.move = function(req, res) {
		var frag = typeof req.params.fragment === 'string' && req.params.fragment || '';
		var nextLetter = picker.nextLetter(frag);
		var response = {};
		if(!frag) {
			return res.send({error: 'no word fragment sent'});
		}

		if(nextLetter.playerLoses) {
			this.endGame(req);
			response.playerLoses = true;
			response.message = 'You lose by spelling "<a href="http://dictionary.reference.com/browse/' + frag + '" target="_blank">' + frag + '</a>" ';
		} else if (nextLetter.word) {
			req.session.fragments = req.session.fragments || [];
			if(req.session.fragments.length && req.session.fragments.indexOf(frag.substr(0, frag.length-1))!==0) {
				nextLetter.cheating = true;
				nextLetter.nextLetter = '';
				req.session.cheating += 1;
				response.message = req.session.cheating===1 ? 'When you cheat, you only cheat yourself' : req.session.cheating === 2 ? 'Please stop cheating - ultimately it will achieve nothind' : 'I have had enough - Game Over!';
				if(req.session.cheating===3) {
					response.playerLoses = true;
					this.endGame();
				}
			}
			req.session.fragments = req.session.fragments ? [frag].concat(req.session.fragments) : [frag];
			req.session.fragments.unshift(nextLetter.word.substr(0, frag.length+1));
			response.nextLetter = nextLetter.nextLetter;
			if(nextLetter.playerWins) {
				response.playerWins = true;
				response.message = 'You won with "<a href="http://dictionary.reference.com/browse/' + nextLetter.word + '" target="_blank">' + nextLetter.word + '</a>." Aren\'t you a clever old chap';
			}
		} else if(!nextLetter.nextLetter) {
			response.invalid = true;
			req.session.wrongGuesses += 1;
			response.message = 'That will never make a word. Try again. ' + (3-req.session.wrongGuesses) + ' left';
			if(req.session.wrongGuesses === 3) {
				this.endGame(req);
				nextLetter = picker.nextLetter(frag.substr(0, frag.length-1));
				response.message = 'You lose after 3 wrong guesses. I was thinking of "<a href="http://dictionary.reference.com/browse/' + nextLetter.word + '" target="_blank">' + nextLetter.word + '</a>"';
				response.word = nextLetter.word;
				response.playerLoses = true;
			}
		}
		res.send(response);
	};

	Game.prototype.endGame = function(req) {
		req.session.fragments = [];
		req.session.cheating = 0;
		req.session.wrongGuesses = 0;
	};

	Game.prototype.newGame = function(req, res) {
		this.endGame(req);
		if(typeof req.params.fragment === 'string' && req.params.fragment.length === 1) {
			this.move(req,res);
		} else {
			res.send({
				message: 'New games can only start with one letter'
			});
		}
	};

	module.exports = Game;
}())
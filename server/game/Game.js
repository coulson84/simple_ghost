var Picker = require('./words/Picker');

(function(){
	var picker;

	function Game(){
		picker = new Picker();
	}

	Game.prototype.move = function(req, res) {
		var frag = req.params.fragment || '';
		var nextLetter = picker.nextLetter(frag);
		
		if(!frag) {
			return res.send({error: 'no word fragment sent'});
		}

		if(nextLetter.playerLoses) {
			req.session.fragments = [];
		} else {
			if(req.session.fragments.indexOf(frag.substr(0, frag.length-1))) {
				nextLetter.cheating = true;
				nextLetter.nextLetter = '';
				req.session.cheating += 1;
			}
			req.session.fragments = req.session.fragments ? req.session.fragments.unshift(frag) : [frag];
		}

		res.send(nextLetter);
	};

	Game.prototype.newGame = function(req, res) {
		req.session.fragments = [];
		req.session.cheating = 0;
	};

	module.exports = Game;
}())
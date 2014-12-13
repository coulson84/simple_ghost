var Server = require('./Server');
var Game = require('./game/Game');

(function() {

	var App = function() {
		var game = new Game();
		this.init = function() {
			var server = new Server(8001);
			
			server.app.use('/game/next/:fragment', game.move.bind(game));
			server.app.use('/game/new/:fragment', game.newGame.bind(game));

			server.start();
		};
	};

	module.exports = App;
}());
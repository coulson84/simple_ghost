var Server = require('./Server');
var Game = require('./game/Game');

(function() {

	var App = function() {
		var game = new Game();
		this.init = function() {
			var server = new Server(8001);
			server.start();
		};
	};

	module.exports = App;
}());
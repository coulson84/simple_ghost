var Server = require('./Server');
var Picker = require('./words/Picker');
var Game = require('./game/Game');

(function() {

	var App = function() {
		var picker = new Picker();
		this.init = function() {
			var server = new Server(8001);
			server.start();
		};
	};

	module.exports = App;
}());
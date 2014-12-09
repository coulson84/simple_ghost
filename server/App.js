var Server = require('./Server.js');
var Picker = require('./words/Picker.js');

(function() {

	var App = function() {
		var picker = new Picker();
		this.init = function() {
			var server = new Server(8001);
			server.start();
		}
	};

	module.exports = App;
}())
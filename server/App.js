var Server = require('./Server.js');


(function() {

	var App = function() {
		this.init = function() {
			var server = new Server(8001);
			server.start();
		}
	};

	module.exports = App;
}())
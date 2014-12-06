var express = require('express');

(function() {

	var Server = function() {
		this.app = express();
	};

	Server.prototype.start = function(port) {
		this.app.use(express.static('public'));
		this.app.listen(port||8001);
	}

	module.exports = Server;
}());
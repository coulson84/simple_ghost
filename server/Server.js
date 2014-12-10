var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

(function() {

	var Server = function() {
		this.app = express();
		this.app.use(session({
            secret: 'g_secret',
            cookie: {
                maxAge: 28800000 // 8 hours
            },
            store: new RedisStore({
                host: '127.0.0.1',
                port: 6379,
                prefix: 'sesh'
            })
        }));
	};

	Server.prototype.start = function(port) {
		this.app.use(express.static('public'));
		this.app.listen(port||8001);
	};

	Server.prototype.use = function(){
		this.app.use.apply(this.app, arguments);
	};

	module.exports = Server;
}());
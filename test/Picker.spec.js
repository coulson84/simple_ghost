var fs = require('fs');
var path = require('path');
var Picker = require('../server/words/Picker.js');

describe('Picker', function() {
	var words = JSON.parse(fs.readFileSync('./server/words/list.json'));

	it('should exist', function() {
		Picker.should.be.a.Function;
	});

	it('should create an event emitter', function(){
		var picker = new Picker();
		picker.on.should.be.a.Function;
		picker.removeListener.should.be.a.Function;
		picker.emit.should.be.a.Function;
	});


	it('should emit a ready event when the list.json file is loaded', function(done){
		var picker = new Picker();
		picker.on('ready', function(){
			picker.should.be.ok;
			done();
		});
	});

	it('should emit a loaderror event if the file load in the constructor errors', function(done){
		var p = new Picker('fail.json');
		p.on('loaderror', function(e){
			e.should.be.ok;
			done();
		});
	});

	it('should be able to load in any JSON encoded file to the words property', function(done){
		var p = new Picker(path.resolve(__dirname, 'files/test.json'));
		p.on('ready', function(){
			done();
		});
		p.on('loaderror', function(e){
			throw new Error(e);
		})
	});

	describe('nextLetter', function(){
		it('should exist', function() {
			var picker = new Picker();
			picker.nextLetter.should.be.a.Function;
		});

		it('should return undefined if no string is passed', function(done){
			var p = new Picker(path.resolve(__dirname, 'files/list.json'));
			p.on('ready', function(){
				(p.nextLetter() === undefined).should.be.ok;
				done();
			});
		});

		it('should only return an letter if a string is passed to it', function(done){
			var p = new Picker(path.resolve(__dirname, 'files/list.json'));
			p.on('ready', function(){
				p.nextLetter('za').should.be.ok;
				done();
			});

			p.on('loaderror', function(e){
				throw new Error(e);
			})
		});
	});

	describe('fetchMatches', function(){
		it('should exist', function(){
			var p = new Picker();
			p.fetchMatches.should.be.a.Function;
		});

		it('should return an object', function(done){
			var p = new Picker();
			p.on('ready', function(){
				p.fetchMatches('a').should.be.a.Object;
				done();
			});
			p.on('loaderror', function(){
				throw new Error('load error');
			})
		});

		it('should return the object that matches the position in the tree according to the string passed to it', function(done){
			var list = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'files/list.json')));
			var p = new Picker(path.resolve(__dirname, 'files/list.json'));
			p.on('ready', function(){
				var res = p.fetchMatches('zan')._w;
				for(var i = res.length-1; i >= 0; i--) {
					res[i][0].should.equal(list.z.a.n._w[i][0]);
				}
				done();
			});

			p.on('loaderror', function(e){
				throw new Error(e);
			})
		});
	});
});
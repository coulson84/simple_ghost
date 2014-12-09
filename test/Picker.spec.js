var name = __filename.split('/')[__filename.split('/').length-1].split('.')[0];
Picker = require('../server/words/Picker.js');

console.log(typeof process[name]);
describe('Picker', function() {
	it('should exist', function() {
		Picker.should.be.a.Function;
	});

	describe('nextLetter', function(){
		it('should exist', function() {
			var picker = new Picker();
			picker.nextLetter.should.be.a.Function;
		});

		it('should return a string', function(){
			var picker = new Picker();
			picker.nextLetter().should.be.a.String
		});
	})
});
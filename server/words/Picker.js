var fs = require('fs');

(function(){

	var words = [];
	var wordsLoaded = false;

	function Picker(){

	}

	fs.readFile('./server/words/list.json', 'utf8', function(err, list){
		var error = function(err){
			console.error('Couldn\'t read words JSON from ' + process.env.PWD, err);
		};

		if(err) {	
			return error(err);
		}

		try {
			words = JSON.parse(list);
			wordsLoaded = true;
		} catch(e) {
			return error(e);
		}
	});

	Picker.prototype.nextLetter = function(){
		return '';
	}

	module.exports = Picker;
}())
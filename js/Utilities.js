(function() {
	var ajaxDefaults = {
		async: true,
		method: 'GET',
		context: window,
		complete: function() {},
		params: null,
		test: function() {}
	};

	var ajax = function(url, settings) {
		var req = new XMLHttpRequest();
		var config = ajaxDefaults;
		var i;

		for (i in config) {
			settings[i] = settings[i] || config[i];
		}

		req.onreadystatechange = function(event) {
			if (req.readyState === 4) {
				settings['complete'].call(settings['context'], req, event, settings['params']);
			}
		};

		if (settings['context']['testMode'] !== true) {
			req.open(settings['method'], url, settings['async']);
			for (i in settings['headers']) {
				req.setRequestHeader(i, settings['headers'][i]);
			}
			req.send();
		} else {
			settings.test.call(settings['context'], settings['params']);
		}
	};

	window.utils = {
		ajax: ajax
	};

}());
var express = require('express'),
	dot = require('dot'),
	config = JSON.parse(
		require('fs').readFileSync('config.json').toString()
	);

// Configuration
module.exports = function (app) {

	app.configure(function () {
		app.set('views', __dirname + '/views');
		app.set('view engine', 'dot');
		app.set('view options', {
		});

		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: config.secret }));
		app.use(require('stylus').middleware({ src: __dirname + '/public' }));
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));

		app.register('.html', {
			compile: function (str, options) {
				return dot.template(str);
			}
		});
	});

	app.configure('development', function () {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	});

	app.configure('production', function () {
		app.use(express.errorHandler()); 
	});

};

module.exports.config = config;

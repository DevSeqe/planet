'use strict';

var express = require('express'),
	dot = require('dot'),
	config = JSON.parse(
		require('fs').readFileSync('config.json').toString()
	),
	secure_paths = require('./lib/middlewares/secure_paths'),
	auth = require('./lib/middlewares/auth');

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
		app.use(express.static(__dirname + '/public'));

		app.use(auth());
		// /admin /admin/ /admin? /admin/* admin?*
		// /^\/admin([\/?].*)?$/
		app.use(secure_paths([ '/admin/*', '/admin' ], '/login'));

		app.use(app.router);
	
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

	dot.templateSettings.evaluate =    /<%([\s\S]+?)%>/g;
	dot.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
	dot.templateSettings.encode =      /<%!([\s\S]+?)%>/g;
	dot.templateSettings.use =         /<%#([\s\S]+?)%>/g; //compile time evaluation
	dot.templateSettings.define =      /<%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#%>/g; //compile time defs
	
	app.config = config;
};

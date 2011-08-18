'use strict';

var express = require('express'),
	dot = require('dot'),
	auth = require('connect-auth'),
	config = JSON.parse(
		require('fs').readFileSync('config.json').toString()
	);

var validatePassword = function (login, password, success_callback, failure_callback) {
	if (login === password)
		success_callback();
	else
		failure_callback();
};


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
		app.use(auth([
			auth.Basic({ validatePassword: validatePassword })
		]));
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
	
	app.config = config;
};

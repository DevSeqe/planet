'use strict';

var express = require('express');

// Routes
module.exports = function (app) {
	app.get('/', function (req, res) {
		var Article = app.db.model('Article');


		res.render('index.html', {
			title: 'Express',
			newses: [
				'a',
				'b',
				'c'
			]
		});
	});

	/*
	 * /admin, /admin/, /admin/*
	 */
	app.get(/\/admin(\/.*)?$/, function (req, res, next) {
		if (req.isAuthenticated()) {
			console.log('serio?');
			next();
		}
		else {
			res.writeHead(303, { 'Location': '/login' });
			res.end('');
		}
	});

	app.get('/login', function (req, res, next) {
		req.authenticate([ 'basic' ], function (err, authenticated) {
			if (authenticated) {
				res.writeHead(303, { 'Location': '/admin' });
				res.end('');
			}
			else {
				next();
			}
		});
	});

	app.get('/admin', function (req, res) {
		res.end('zalogowany: ' + req.isAuthenticated());
	});
};

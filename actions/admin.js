'use strict';

module.exports = function (app) {
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
				console.log('autologin?');
				res.writeHead(303, { 'Location': '/admin' });
				res.end('');
			}
			else {
				next();
			}
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.writeHead(303, { 'Location': '/' });
		res.end('');
	});

	app.get('/admin', function (req, res) {
		res.end('zalogowany: ' + req.isAuthenticated());
	});
};

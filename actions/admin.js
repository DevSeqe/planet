'use strict';

module.exports = function (app) {

	app.redirect('admin', '/admin');

	app.get('/login', function (req, res) {
		res.render('admin/login.html', {
			layout: 'static.html',
			title: 'Zaloguj się'
		});
	});

	app.post('/login', function (req, res) {
		var User = app.db.model('User');

		User.findByLoginAndPassword(req.body.name, req.body.password, function (err, user) {
			if (err) return next(err);

			if (user) {
				req.authenticate(user.login);
				res.redirect('admin');
			}
			else {
				res.end('bledne haslo');
			}
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('homepage');
	});

	app.get('/admin', function (req, res) {
		res.end('zalogowany: ' + req.isAuthenticated());
	});
};

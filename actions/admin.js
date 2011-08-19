'use strict';

module.exports = function (app) {

	app.redirect('admin', '/admin');

	app.get('/login', function (req, res, next) {
		var User = app.db.model('User');

		User.findByLoginAndPassword('reinmar', '1234', function (err, user) {
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

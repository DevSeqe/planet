'use strict';

var _ = require('underscore');

module.exports = function (app) {

	app.redirect('admin', '/admin');

	var opts = function (req, obj) {
		return _.extend(obj || {}, {
			layout: 'layout_static.html',
			_menu_partial: 'admin/_menu.html',
			_user: req.getUser()
		});
	};

	app.get('/login', function (req, res) {
		res.render('admin/login.html', opts(req));
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
				res.end('Błędne hasło');
			}
		});
	});

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('homepage');
	});

	app.get('/admin', function (req, res) {
		res.render('admin/articles.html', opts(req, {
			title: 'Artykuły'
		}));
	});

	app.get('/admin/article/new', function (req, res) {
		var Article = app.db.model('Article');

		res.render('admin/article_new.html', opts(req, {
			title: 'Dodaj artykuł',
			article: new Article()
		}));
	});

	app.post('/admin/article/new', function (req, res) {
		console.log(req.body);
		res.end('');
	});
};

'use strict';

var _ = require('underscore'),
	Form = require('../lib/form'),
	Pager = require('../lib/pager');

module.exports = function (app) {

	app.redirect('admin', '/admin');
	app.redirect('admin_articles_list', '/admin/articles');

	var opts = function (req, obj) {
		return _.extend(obj || {}, {
			layout: 'layout_static.html',
			_menu_partial: 'admin/_menu.html',
			_user: req.getUser(),
			_flash: req.flash()
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
		res.redirect('admin_articles_list');
	});

	app.get('/admin/articles', function (req, res) {
		var Article = app.db.model('Article');
		var pager = new Pager(Article, req.query.page);

		pager.exec(function (err, articles) {
			if (err) {
				console.log(err);
				console.log(articles);
				return res.end('ERROR');
			}
			res.render('admin/articles.html', opts(req, {
				title: 'Artykuły',
				pager: pager,
				articles: articles
			}));
		});
	});

	app.get('/admin/article/new', function (req, res) {
		var Article = app.db.model('Article');
		var article = new Article;

		res.render('admin/article_new.html', opts(req, {
			title: 'Dodaj artykuł',
			article: article,
			form: Form(article)
		}));
	});

	app.post('/admin/article/new', function (req, res) {
		var Article = app.db.model('Article');

		var article = new Article,
			form = Form(article);

		form.bind(req.body.article);
		form.save(function (err) {
			if (err) {
				req.flash('error', 'Błąd podczas zapisywania formularza');
				res.render('admin/article_new.html', opts(req, {
					title: 'Dodaj artykuł',
					article: article,
					form: form
				}));
			}
			else {
				req.flash('notice', 'Dodano artykuł');
				res.redirect('admin_articles_list');
			}
		});
	});
};

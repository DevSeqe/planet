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
		var pager = new Pager(Article, req.query.page, { sort: ['created_at', -1 ] });

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

		res.render('admin/article_edit.html', opts(req, {
			title: 'Dodaj artykuł',
			article: article,
			form: Form(article)
		}));
	});

	app.get('/admin/article/edit/:id', function (req, res) {
		var Article = app.db.model('Article');
		Article.findById(req.params.id, function (err, article) {
			if (err) {
				throw err;
			}

			res.render('admin/article_edit.html', opts(req, {
				title: 'Edytuj artykuł',
				article: article,
				form: Form(article)
			}));
		});
	});

	app.post('/admin/article/save', function (req, res) {
		var Article = app.db.model('Article');
		var save = function (article, form, isNew) {
			form.bind(req.body.article);
			form.save(function (err) {
				if (err) {
					req.flash('error', 'Błąd podczas zapisywania formularza');
					res.render('admin/article_edit.html', opts(req, {
						title: isNew ? 'Dodaj artykuł' : 'Edytuj artykuł',
						article: article,
						form: form
					}));
				}
				else {
					req.flash('notice', isNew ? 'Dodano artykuł' : 'Zapisano artykuł');
					res.redirect('admin_articles_list');
				}
			});
		}

		if (req.body.article._id) {
			Article.findById(req.body.article._id, function (err, article) {
				var form = Form(article);
				save(article, form, false);
			});
		}
		else {
			var article = new Article,
				form = Form(article);
			save(article, form, true);
		}
	});
};

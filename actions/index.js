'use strict';

var express = require('express'),
	module_admin = require('./admin');

// Routes
module.exports = function (app) {

	app.redirect('homepage', '/');

	app.get('/', function (req, res) {
		var Article = app.db.model('Article');
		var User = app.db.model('User');
		/*var u = new User();
		u.password = '123';
		u.login = 'reinmar';
		u.save();*/
	

		res.render('index.html', {
			title: 'Planet',
			user: User.findByLoginAndPassword('reinmar', '123'),
			newses: [
				'a',
				'b',
				/*req.isAuthenticated() ? 'tak' : 'nie'*/
			]
		});
	});

	module_admin(app);
};

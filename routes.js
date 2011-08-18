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
};

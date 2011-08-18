var express = require('express');

// Routes
module.exports = function (app) {
	app.get('/', function (req, res) {
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

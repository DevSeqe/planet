'use strict';

var express = require('express'),
	config = require('./config'),
	db = require('./db'),
	routes = require('./routes');

var app = module.exports = express.createServer();

//exposes app.config
config(app);

//exposes app.db
db(app, function (err) {
	if (err) {
		console.log("Aborting due to DB error:");
		console.log(err);
	}
	else {
		routes(app);

		app.listen(3000);
		console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
	}
});

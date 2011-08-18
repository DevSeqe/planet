'use strict';

var mongoose = require('mongoose'),
	schemas = {
		Article: require('./model/Article'),
		User: require('./model/User')
	},
	db = null;

//support for promises and queries in express
require('express-mongoose');

var registerModels = function (app) {
	for (var n in schemas) {
		db.model(n, schemas[n](app));
	}
};

module.exports = function (app, callback) {
	db = mongoose.createConnection(app.config.db.uri, function (err) {
		registerModels(app);

		app.db = db;

		callback(err);
	});
};

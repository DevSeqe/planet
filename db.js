var mongoose = require('mongoose'),
	schemas = {
		Article: require('./model/Article')
	},
	db = null;

//support for promises and queries in express
require('express-mongoose');

var registerModels = function () {
	for (var n in schemas) {
		db.model(n, schemas[n]);
	}
};


module.exports = function (app, callback) {
	db = mongoose.createConnection(app.config.db.uri, function (err) {
		registerModels();

		app.db = db;

		callback(err);
	});
};

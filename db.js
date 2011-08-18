var mongoose = require('mongoose');

var createSchemas = function () {

};


module.exports = function (app, callback) {
	mongoose.connect(app.config.db.uri, function (err) {
		createSchemas();

		app.db = mongoose.connnection;

		callback(err);
	});
};

'use strict';

var mongoose = require('mongoose'),
	Promise = mongoose.Promise,
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	crypto = require('crypto');

module.exports = function (app) {

	var md5sum = function (v) {
		var h = crypto.createHash('md5');
		h.update(v);
		return h.digest('hex');
	};

	var generateHash = function (salt, password) {
		return md5sum(md5sum(password) + md5sum(salt));
	};


	var User = new Schema({
		login: { type: String, trim: true, required: true },
		password: { type: String },
		salt: { type: String }
	});

	User.path('password').set(function (v) {
		var salt = (Math.random()+'').replace(/\./, '');
		this.salt = salt;
		return generateHash(salt, v);
	});

	/*
	 * @param {Function} callback optional - method returns Promise
	 */
	User.statics.findByLoginAndPassword = function (login, password, callback) {
		var promise = new Promise(callback);

		this.findOne({ login: login }).run(function (err, user) {
			if (err) {
				promise.error(err);
				return;
			}
	
			if (
				!user ||
				generateHash(user.salt, password) !== user.password
			) {
				promise.resolve(err, null);
				return;
			}
				
			promise.resolve(err, user);
		});

		return promise;
	};

	return User;
};

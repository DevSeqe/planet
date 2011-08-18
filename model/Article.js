'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

module.exports = function (app) {

	return new Schema({
		title: { type: String, trim: true },
		created_at: { type: Date, default: Date.now, index: true },
		external_url: { type: String, match: /^https?:\/\//i, trim: true },
		summary: String
	});

};

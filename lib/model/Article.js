'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	PluginUpdatedAt = require('./plugin_updated_at');

module.exports = function (app) {

	var Article = new Schema({
		title: { type: String, trim: true },
		title_urlized: { type: String, validate: /[a-zA-Z0-9\-]/, required: true, unique: true },
		created_at: { type: Date, default: Date.now, required: true, index: true },
		external_url: { type: String, validate: [/^https?:\/\//i, 'Incorrect URL'], required: true, trim: true },
		summary: String
	});
	Article.plugin(PluginUpdatedAt);

	Article.path('title').set(function (v) {
		var reps = {
			ę: 'e',
			ą: 'a',
			ś: 's',
			ł: 'l',
			ż: 'z',
			ź: 'z',
			ć: 'c',
			ń: 'n',
			Ę: 'E',
			Ą: 'A',
			Ś: 'S',
			Ł: 'L',
			Ż: 'Z',
			Ź: 'Z',
			Ć: 'C',
			Ń: 'N',
			' ': '-'
		};

		if (!this.title_urlized) {
			this.title_urlized = v.replace(/[^a-zA-Z0-9\-]/g, function (c) {
				return reps[c] || '';
			});
		}

		return v;
	});

	return Article;

};

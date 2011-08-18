var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var Article = new Schema({
	title: { type: String, trim: true },
	created_at: { type: Date, default: Date.now, index: true },
	external_url: { type: String, match: /^https?:\/\//i, trim: true },
	summary: String
});

module.exports = Article;

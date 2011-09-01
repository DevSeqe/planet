'use strict';

var _ = require('underscore'),
	Promise = require('mongoose').Promise,
	async = require('async');

var default_opts = {
	per_page: 10,				//mongo limit
	sort: [ 'created_at', 'ascending' ],	//mongoose format (TODO fix to mongo format when available)
	query: null,				//mongo format
	fields: null,				//mongo format
};

/*
 * @param {Mongoose.Model} model
 * @param {Number} page (optional) current page number
 * @param {Object} opts (optional) options
 */
var Pager = function Pager(model, page, opts) {
	if (typeof this === 'undefined')
		throw new TypeError('Constructor cannot be called as a function');

	//if page not given
	if (isNaN(+page)) {
		opts = page;
		page = 0;
	}
	opts = _.extend(_.clone(default_opts), opts || {});

	this._model = model;
	this._page = page >= 0 ? page : 0;
	this._per_page = opts.per_page;
	this._sort = opts.sort;
	this._query = opts.query;
	this._fields = opts.fields;

	this._data = null;
	this._count = null;
	this._executed = false;
};

/*
 * @param {Function} callback (optional)
 * @return {Mongoose.Promise}
 */
Pager.prototype.exec = function (callback) {
	var q_data = this._prepareDataQuery(),
		q_count = this._prepareCountQuery();

	var p = new Promise(callback),
		that = this;

	async.parallel([
		function (callback) {
			q_data.exec(function (err, res) {
				callback(err, res);
			});
		},
		function (callback) {
			q_count.count(function (err, res) {
				callback(err, res);
			});
		}
	], function (err, res) {
		if (err) return p.error(err);
		
		that._data = res[0];
		that._count = res[1];
		//fix page number (0 <= page <= last_page)
		var t = this,
			page = t._page;
		this._page = (page >= t.first_page ? (page <= t.last_page ? page : t.last_page) : 0);

		that._executed = true;
		p.resolve(null, that._data);
	});

	return p;
};

Pager.prototype.__defineGetter__('data', function () {
	this._ensureexecuted();
	return this._data;
});

Pager.prototype.__defineGetter__('last_page', function () {
	this._ensureexecuted();
	return ~~(this._count / this._per_page);
});

Pager.prototype.__defineGetter__('first_page', function () {
	this._ensureexecuted();
	return 0; //yeah! :>
});

Pager.prototype.__defineGetter__('current_page', function () {
	this._ensureexecuted();
	return this._page;
});

Pager.prototype._prepareDataQuery = function () {
	var q = this._model.find(this._query)
		.limit(this._per_page)
		.skip(this._per_page * this._page);

	if (this._fields)
		q = q.fields(this._fields);

	if (this._sort)
		q = q.sort.apply(q, this._sort);

	return q;	
};

Pager.prototype._prepareCountQuery = function () {
	return this._model.find(this._query);
};

Pager.prototype._ensureexecuted = function () {
	if (!this._executed) throw new Error('Execute pager before use');	
};






module.exports = Pager;

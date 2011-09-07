'use strict';

var _ = require('underscore'),
	Promise = require('mongoose').Promise,
	async = require('async');

var default_opts = {
	per_page: 20,				//mongo limit
	sort: [ 'created_at', 1 ],	//mongoose format (TODO fix to mongo format when available)
	query: null,				//mongo format
	fields: null,				//mongo format
	list_range: 3				//options around "current" page range (e.g. < 234[5]678 >)
};

/*
 * @param {Mongoose.Model} model
 * @param {Number} page current page number
 * @param {Object} opts (optional) options
 */
var Pager = function Pager(model, page, opts) {
	if (typeof this === 'undefined')
		throw new TypeError('Constructor cannot be called as a function');
	
	if (isNaN(page = +page)) page = 1;
	opts = _.extend(_.clone(default_opts), opts || {});

	this._model = model;
	this._page = page >= 1 ? page : 1;
	this._per_page = opts.per_page;
	this._sort = opts.sort;
	this._query = opts.query;
	this._fields = opts.fields;
	this._list_range = opts.list_range;

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
	this._ensureExecuted();
	return this._data;
});

Pager.prototype.__defineGetter__('needed', function () {
	this._ensureExecuted();
	return this.pages_count > 1;
});

Pager.prototype.__defineGetter__('last_page', function () {
	this._ensureExecuted();
	return ~~((this._count - 1) / this._per_page) + 1;
});

Pager.prototype.__defineGetter__('first_page', function () {
	this._ensureExecuted();
	return 1; //yeah! :>
});

Pager.prototype.__defineGetter__('current_page', function () {
	this._ensureExecuted();
	return this._page;
});

Pager.prototype.__defineGetter__('next_page', function () {
	this._ensureExecuted();
	return Math.min(this.current_page + 1, this.last_page);
});

Pager.prototype.__defineGetter__('prev_page', function () {
	this._ensureExecuted();
	return Math.max(this.current_page - 1, this.first_page);
});

Pager.prototype.__defineGetter__('pages_count', function () {
	this._ensureExecuted();
	return this.last_page;
});

Pager.prototype.__defineGetter__('list', function () {
	var s = Math.max(this.current_page - this._list_range, 1);
	var e = Math.min(this.current_page + this._list_range, this.last_page);

	var a = [];
	for (var i = s; i <= e; ++i) a.push(i);
	return a;
});

Pager.prototype._prepareDataQuery = function () {
	var q = this._model.find(this._query)
		.limit(this._per_page)
		.skip(this._per_page * (this._page-1));

	if (this._fields)
		q = q.fields(this._fields);

	if (this._sort)
		q = q.sort.apply(q, this._sort);

	return q;	
};

Pager.prototype._prepareCountQuery = function () {
	return this._model.find(this._query);
};

Pager.prototype._ensureExecuted = function () {
	if (!this._executed) throw new Error('Execute pager before use');	
};



module.exports = Pager;

'use strict';

var _ = require('underscore');

var Form = function Form(obj) {
	this.obj = obj;
	//error not connected with attributes (e.g. save)
	this._error = null;
};

Form.prototype.bind = function (data) {
	this.obj.set(data);
	return this;
};

Form.prototype.save = function (callback) {
	var that = this;

	this.obj.save(function (err) {
		that._error = err;

		callback(err);
	});

	return this;
};

Form.prototype.__defineGetter__('errors_messages', function () {
	return this.errors.map(function (e) {
		return '[' + (e.path || 'Form') + ']: ' + e.message;
	});
});

Form.prototype.__defineGetter__('errors', function () {
	var errors = [];
	if (this._error) {
		errors.push(this._error);
	}

	return errors.concat(_.toArray(this.obj.errors));
});

Form.prototype.hasErrors = function () {
	return !!this.errors;
};

module.exports = function (obj) {
	return new Form(obj);
};

'use strict';

var parse = require('url').parse;

var ignore = [
	'/favicon.ico'
];

module.exports = function () {
	return function (req, res, next) {
		if (~ignore.indexOf(parse(req.url).pathname)) {
			return next();
		}

		if (!req.session) {
			throw new Error('Session must be available for auth middleware');
		}


		if (!req.session._auth) {
			//can e.g. store additional data... maybe in future
			req.session._auth = {};
		}

		req.isAuthenticated = function () {
			return !!req.session._auth.user;
		};

		req.authenticate = function (user) {
			req.session._auth.user = user;
		};

		req.logout = function () {
			delete req.session._auth.user;
		};

		req.getUser = function () {
			return req.session._auth.user;
		};

		next();
	};
};

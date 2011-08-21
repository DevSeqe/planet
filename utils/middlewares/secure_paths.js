'use strict';

var Route = require('express').Route,
	url = require('url');

module.exports = function (secured_paths, login_path) {
	// Uses express's Route to match paths like in express routes
	var routes = secured_paths.map(function (p) {
		return new Route(
			'', //method - not important
			p
		);
	});
					
	return function (req, res, next) {
		var path = url.parse(req.url).pathname;

		if (routes.some(function (r) { return r.match(path); })) {
			if (req.isAuthenticated()) {
				next();
			}
			else {
				res.writeHead(303, { 'Location': login_path });
				res.end('');
			}		
		}
		else {
			next();
		}
	};
};

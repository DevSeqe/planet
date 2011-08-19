'use strict';

module.exports = function (secured_module, login_path) {
	return function (req, res, next) {
		if (req.url.match(secured_module)) {
			if (req.isAuthenticated()) {
				console.log('serio?');
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

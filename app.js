var express = require('express')
	configure = require('./configure'),
	config = configure.config,
	routes = require('./routes');

var app = module.exports = express.createServer();

configure(app);
routes(app);


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

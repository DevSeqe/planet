require("supervisor").run([
	'-w', 'lib,actions,app.js,config.js,config.json,db.js',
	'-x', 'node4',
	'app.js'
]);

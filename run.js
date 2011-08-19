require("supervisor").run([
	'-w', 'model,actions,utils,app.js,config.js,config.json,db.js',
	'-x', 'node4',
	'app.js'
]);

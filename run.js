require("supervisor").run([
	'-w', 'model,actions,app.js,config.js,config.json,db.js',
	'-x', 'node4',
	'app.js'
]);

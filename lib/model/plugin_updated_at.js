// updated_at

module.exports = exports = function (schema, options) {
	schema.add({ updated_at: Date });

	schema.pre('save', function (next) {
		this.updated_at = new Date;
		next();
	});

	if (options && options.index) {
		schema.path('updated_at').index(options.index);
	}
}

'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var quizreports = require('../../app/controllers/quizreports.server.controller');

	// Quizreports Routes
	app.route('/quizreports')
		.get(quizreports.list)
		.post(users.requiresLogin, quizreports.create);

	app.route('/quizreports/:quizreportId')
		.get(quizreports.read)
		.put(users.requiresLogin, quizreports.hasAuthorization, quizreports.update)
		.delete(users.requiresLogin, quizreports.hasAuthorization, quizreports.delete);

	// Finish by binding the Quizreport middleware
	app.param('quizreportId', quizreports.quizreportByID);
};

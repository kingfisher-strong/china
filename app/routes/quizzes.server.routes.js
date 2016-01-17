'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var quizzes = require('../../app/controllers/quizzes.server.controller');

	// Quizzes Routes
	app.route('/quizzes')
		.get(quizzes.list)
		.post(users.requiresLogin, users.hasAuthorization(['admin']), quizzes.create);	// Quizzes Routes
	
    app.route('/get_quizzes')
		.post(users.requiresLogin, quizzes.get_quizzes);

	app.route('/quizzes/:quizId')
		.get(quizzes.read)
		.put(users.requiresLogin, users.hasAuthorization(['admin']), quizzes.update)
		.delete(users.requiresLogin, users.hasAuthorization(['admin']), quizzes.delete);

	// Finish by binding the Quiz middleware
	app.param('quizId', quizzes.quizByID);
};

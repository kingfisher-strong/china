'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var quizAnswers = require('../../app/controllers/quiz-answers.server.controller');

	// Quiz answers Routes
	app.route('/quiz-answers')
		.get(quizAnswers.list)
		.post(users.requiresLogin, quizAnswers.create);

	app.route('/quiz-answers/:quizAnswerId')
		.get(quizAnswers.read)
		.put(users.requiresLogin, quizAnswers.hasAuthorization, quizAnswers.update)
		.delete(users.requiresLogin, quizAnswers.hasAuthorization, quizAnswers.delete);

	// Finish by binding the Quiz answer middleware
	app.param('quizAnswerId', quizAnswers.quizAnswerByID);
};

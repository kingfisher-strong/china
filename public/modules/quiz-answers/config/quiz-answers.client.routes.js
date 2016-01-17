'use strict';

//Setting up route
angular.module('quiz-answers').config(['$stateProvider',
	function($stateProvider) {
		// Quiz answers state routing
		$stateProvider.

		state('listQuizAnswers', {
			url: '/quiz-answers',
			templateUrl: 'modules/quiz-answers/views/list-quiz-answers.client.view.html'
		}).
		state('createQuizAnswer', {
			url: '/quiz-answers/create',
			templateUrl: 'modules/quiz-answers/views/create-quiz-answer.client.view.html'
		}).
		state('viewQuizAnswer', {
			url: '/quiz-answers/:quizAnswerId',
			templateUrl: 'modules/quiz-answers/views/view-quiz-answer.client.view.html'
		}).
		state('editQuizAnswer', {
			url: '/quiz-answers/:quizAnswerId/edit',
			templateUrl: 'modules/quiz-answers/views/edit-quiz-answer.client.view.html'
		});
	}
]);

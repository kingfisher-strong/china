'use strict';

//Quiz answers service used to communicate Quiz answers REST endpoints
angular.module('quiz-answers').factory('QuizAnswers', ['$resource',
	function($resource) {
		return $resource('quiz-answers/:quizAnswerId', { quizAnswerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
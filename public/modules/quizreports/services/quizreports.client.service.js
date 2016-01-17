'use strict';

//Quizreports service used to communicate Quizreports REST endpoints
angular.module('quizreports').factory('Quizreports', ['$resource',
	function($resource) {
		return $resource('quizreports/:quizreportId', { quizreportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
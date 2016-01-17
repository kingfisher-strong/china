'use strict';

//Setting up route
angular.module('quizreports').config(['$stateProvider',
	function($stateProvider) {
		// Quizreports state routing
		$stateProvider.
		state('listQuizreports', {
			url: '/quizreports',
			templateUrl: 'modules/quizreports/views/list-quizreports.client.view.html'
		}).
		state('createQuizreport', {
			url: '/quizreports/create',
			templateUrl: 'modules/quizreports/views/create-quizreport.client.view.html'
		}).
		state('viewQuizreport', {
			url: '/quizreports/:quizreportId',
			templateUrl: 'modules/quizreports/views/view-quizreport.client.view.html'
		}).
		state('editQuizreport', {
			url: '/quizreports/:quizreportId/edit',
			templateUrl: 'modules/quizreports/views/edit-quizreport.client.view.html'
		});
	}
]);
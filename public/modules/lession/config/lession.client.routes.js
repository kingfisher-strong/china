'use strict';

//Setting up route
angular.module('lesson').config(['$stateProvider',
	function($stateProvider) {
		// Lesson state routing
		$stateProvider.
		state('lesson', {
			url: '/lesson/:lessonId',
			templateUrl: 'modules/lesson/views/lesson.client.view.html'
		})
		.state('proveMastery', {
			url: '/prove_mastery',
			templateUrl: 'modules/lesson/views/prove_mastery.client.view.html'
		});
	}
]);

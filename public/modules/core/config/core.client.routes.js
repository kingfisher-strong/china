'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		})
		.state('index2', {
			url: '/index2',
			templateUrl: 'modules/core/views/front_page.html'
		})
		.state('setup_keyboard', {
			url: '/setup_keyboard',
			templateUrl: 'modules/core/views/setup_keyboard.client.view.html'
		})
		.state('subscribe', {
			url: '/subscribe',
			templateUrl: 'modules/core/views/subscribe.client.view.html'
		})
		.state('lesson_mastery', {
			url: '/lesson_mastery/:lessonId',
			templateUrl: 'modules/core/views/lesson_mastery.client.view.html'
		})
		.state('level_mastery', {
			url: '/level_mastery',
			templateUrl: 'modules/core/views/level_mastery.client.view.html'
		})
		.state('thankyou', {
			url: '/thankyou',
			templateUrl: 'modules/core/views/thankyou.client.view.html'
		})
        .state('passed_lesson', {
			url: '/passed_lesson',
			templateUrl: 'modules/core/views/passed_lesson.client.view.html'
		})
        .state('failed_lesson', {
			url: '/failed_lesson',
			templateUrl: 'modules/core/views/failed_lesson.client.view.html'
		})
        .state('passed_level', {
			url: '/passed_level',
			templateUrl: 'modules/core/views/passed_level.client.view.html'
		})
        .state('failed_level', {
			url: '/failed_level',
			templateUrl: 'modules/core/views/failed_level.client.view.html'
		})
		.state('leave_feedback', {
			url: '/leave_feedback',
			templateUrl: 'modules/core/views/leave_feedback.client.view.html'
		});
	}
]);

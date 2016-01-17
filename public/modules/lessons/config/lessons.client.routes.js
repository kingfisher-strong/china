'use strict';

//Setting up route
angular.module('lessons').config(['$stateProvider', '$validationProvider',
	function($stateProvider, $validationProvider) {
		// Lessons state routing
		$stateProvider.
		state('listLessons', {
			url: '/lessons',
			templateUrl: 'modules/lessons/views/list-lessons.client.view.html'
		}).
		state('createLesson', {
			url: '/lessons/create',
			templateUrl: 'modules/lessons/views/create-lesson.client.view.html'
		}).
		state('viewLesson', {
			url: '/lessons/:lessonId',
			templateUrl: 'modules/lessons/views/view-lesson.client.view.html'
		}).
		state('viewLessonVideo', {
				url: '/lessons/:lessonId/video/:videoId',
				templateUrl: 'modules/lessons/views/view-lesson.client.view.html'
			}).
		state('editLesson', {
			url: '/lessons/:lessonId/edit',
			templateUrl: 'modules/lessons/views/edit-lesson.client.view.html'
		});

		var defaultMsg,
			expression;

		$validationProvider.showSuccessMessage = false; // or true(default)
		$validationProvider.showErrorMessage = true; // or true(default)

		/**
		 * Range Validation
		 */
		$validationProvider
			.setExpression({
				range: function (value, scope, element, attrs) {
					if (value >= parseInt(attrs.min) && value <= parseInt(attrs.max)) {
						return value;
					}
				}
			})
			.setDefaultMsg({
				range: {
					error: 'Lesson number should between 1-20',
					success: 'good'
				}
			});


	}
]);

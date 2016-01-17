'use strict';

//Setting up route
angular.module('streaks').config(['$stateProvider',
	function($stateProvider) {
		// Streaks state routing
		$stateProvider.
		state('listStreaks', {
			url: '/streaks',
			templateUrl: 'modules/streaks/views/list-streaks.client.view.html'
		}).
		state('createStreak', {
			url: '/streaks/create',
			templateUrl: 'modules/streaks/views/create-streak.client.view.html'
		}).
		state('viewStreak', {
			url: '/streaks/:streakId',
			templateUrl: 'modules/streaks/views/view-streak.client.view.html'
		}).
		state('editStreak', {
			url: '/streaks/:streakId/edit',
			templateUrl: 'modules/streaks/views/edit-streak.client.view.html'
		});
	}
]);
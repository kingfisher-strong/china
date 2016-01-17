'use strict';

//Streaks service used to communicate Streaks REST endpoints
angular.module('streaks').factory('Streaks', ['$resource',
	function($resource) {
		return $resource('streaks/:streakId', { streakId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
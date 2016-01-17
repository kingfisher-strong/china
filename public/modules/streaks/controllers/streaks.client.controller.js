'use strict';

// Streaks controller
angular.module('streaks').controller('StreaksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Streaks',
	function($scope, $stateParams, $location, Authentication, Streaks) {
		$scope.authentication = Authentication;

		// Create new Streak
		$scope.create = function() {
			// Create new Streak object
			var streak = new Streaks ({
				name: this.name
			});

			// Redirect after save
			streak.$save(function(response) {
				$location.path('streaks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Streak
		$scope.remove = function(streak) {
			if ( streak ) { 
				streak.$remove();

				for (var i in $scope.streaks) {
					if ($scope.streaks [i] === streak) {
						$scope.streaks.splice(i, 1);
					}
				}
			} else {
				$scope.streak.$remove(function() {
					$location.path('streaks');
				});
			}
		};

		// Update existing Streak
		$scope.update = function() {
			var streak = $scope.streak;

			streak.$update(function() {
				$location.path('streaks/' + streak._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Streaks
		$scope.find = function() {
			$scope.streaks = Streaks.query();
		};

		// Find existing Streak
		$scope.findOne = function() {
			$scope.streak = Streaks.get({ 
				streakId: $stateParams.streakId
			});
		};
	}
]);
'use strict';
/*global public_url:false */
/*global toastr:false */
/*global jQuery:false */
// Levels controller
angular.module('levels').controller('LevelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Levels', '$timeout',
	function($scope, $stateParams, $location, Authentication, Levels, $timeout) {
		$scope.authentication = Authentication;

		// Create new Level
		$scope.create = function() {
			// Create new Level object
			var level = new Levels ({
				name: this.name,
				order: this.order,
				description: this.description,
				introduction: this.introduction,
				words: this.words
			});

			// Redirect after save
			level.$save(function(response) {
				toastr.success('A level has been created');
				
				$timeout(function() {
					// Clear form fields
					$scope.name = '';
					$scope.description = '';
					$scope.words = '';
					$scope.introduction = '';
					$scope.order = 1;
					$location.path('levels/' + response._id);
			    }, 2000);
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Level
		$scope.remove = function(level) {
			if ( level ) { 
				level.$remove();

				for (var i in $scope.levels) {
					if ($scope.levels [i] === level) {
						$scope.levels.splice(i, 1);
					}
				}
			} else {
				$scope.level.$remove(function() {					
					toastr.success('The lesson has been deleted');
					$timeout(function() {
						$location.path('levels');
				    }, 2000);
				});
			}
		};

		// Update existing Level
		$scope.update = function() {
			var level = $scope.level;

			level.$update(function() {
				toastr.success('The lesson has been updated');

				$timeout(function() {
					$location.path('levels/' + level._id);
			    }, 2000);
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Levels
		$scope.find = function() {
			$scope.levels = Levels.query();
		};

		// Find existing Level
		$scope.findOne = function() {
			$scope.level = Levels.get({ 
				levelId: $stateParams.levelId
			});
		};
	}
]);

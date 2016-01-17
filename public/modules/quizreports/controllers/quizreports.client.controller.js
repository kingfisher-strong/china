'use strict';

// Quizreports controller
angular.module('quizreports').controller('QuizreportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Quizreports',
	function($scope, $stateParams, $location, Authentication, Quizreports) {
		$scope.authentication = Authentication;

		// Create new Quizreport
		$scope.create = function() {
			// Create new Quizreport object
			var quizreport = new Quizreports ({
				description: this.description
			});

			// Redirect after save
			quizreport.$save(function(response) {
				$location.path('quizreports/' + response._id);

				// Clear form fields
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Quizreport
		$scope.remove = function(quizreport) {
			if ( quizreport ) { 
				quizreport.$remove();

				for (var i in $scope.quizreports) {
					if ($scope.quizreports [i] === quizreport) {
						$scope.quizreports.splice(i, 1);
					}
				}
			} else {
				$scope.quizreport.$remove(function() {
					$location.path('quizreports');
				});
			}
		};

		// Update existing Quizreport
		$scope.update = function() {
			var quizreport = $scope.quizreport;

			quizreport.$update(function() {
				$location.path('quizreports/' + quizreport._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Quizreports
		$scope.find = function() {
			$scope.quizreports = Quizreports.query();
		};

		// Find existing Quizreport
		$scope.findOne = function() {
			$scope.quizreport = Quizreports.get({ 
				quizreportId: $stateParams.quizreportId
			});
		};
	}
]);

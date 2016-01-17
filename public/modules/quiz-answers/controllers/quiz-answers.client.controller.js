'use strict';

// Quiz answers controller
angular.module('quiz-answers').controller('QuizAnswersController', ['$scope', '$stateParams', '$location', 'Authentication', 'QuizAnswers',
	function($scope, $stateParams, $location, Authentication, QuizAnswers, $anchorScroll) {
		$scope.authentication = Authentication;

		// Create new Quiz answer
		$scope.create = function() {
			// Create new Quiz answer object
			var quizAnswer = new QuizAnswers ({
				description: this.description
			});

			// Redirect after save
			quizAnswer.$save(function(response) {
				$location.path('quiz-answers/' + response._id);

				// Clear form fields
				$scope.description = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Quiz answer
		$scope.remove = function(quizAnswer) {
			if ( quizAnswer ) { 
				quizAnswer.$remove();

				for (var i in $scope.quizAnswers) {
					if ($scope.quizAnswers [i] === quizAnswer) {
						$scope.quizAnswers.splice(i, 1);
					}
				}
			} else {
				$scope.quizAnswer.$remove(function() {
					$location.path('quiz-answers');
				});
			}
		};

		// Update existing Quiz answer
		$scope.update = function() {
			var quizAnswer = $scope.quizAnswer;

			quizAnswer.$update(function() {
				$location.path('quiz-answers/' + quizAnswer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Quiz answers
		$scope.find = function() {
			$scope.quizAnswers = QuizAnswers.query();
		};

		// Find existing Quiz answer
		$scope.findOne = function() {
			$scope.quizAnswer = QuizAnswers.get({ 
				quizAnswerId: $stateParams.quizAnswerId
			});
		};
	}
]);

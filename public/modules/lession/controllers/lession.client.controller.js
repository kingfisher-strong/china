'use strict';

angular.module('lesson').controller('LessonController', ['$scope',
	function($scope) {
		$scope.showVideo = true;
		$scope.rating = 2;
		$scope.number = 22;

		$scope.showQuiz = function(){
			$scope.showVideo = false;
		};

		$scope.getNumber = function(num) {
			return new Array(num);
		};
	}
]);

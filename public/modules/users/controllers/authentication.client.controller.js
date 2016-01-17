'use strict';
/*global public_url:false */
/*global toastr:false */
/*global jQuery:false */
/*global current_level:false */
angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Lessons',
	function($scope, $http, $location, Authentication, Lessons) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
            if(angular.isDefined($scope.credentials.username)){
                $scope.credentials.username = $scope.credentials.username.toLowerCase();
            }
            else {
                $scope.credentials.username = $scope.credentials.email.toLowerCase();
            }
            $scope.credentials.email = $scope.credentials.email.toLowerCase();
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				Lessons.query({level: 1}, function(lessons){
					$scope.lessons = lessons;
					$location.path('lessons/' + $scope.lessons[0]._id);
				});
				// And redirect to the first lesson

			}).error(function(response) {
				$scope.error = response.message;
			});
			jQuery.cookie('deal', null, { path: '/' });
		};

		$scope.signin = function() {
            $scope.credentials.username = $scope.credentials.username.toLowerCase();
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
			jQuery.cookie('deal', null, { path: '/' });
		};
	}
]);

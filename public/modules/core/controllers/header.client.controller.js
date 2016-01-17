'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$http',
	function($scope, Authentication, Menus, $http) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$http.get('/users/me').then(function(res){
			$scope.current_user = res.data;
		});

		$scope.isAdmin = function(){
			if($scope.current_user){
				return $scope.current_user.roles.indexOf('admin') !== -1;
			}
			return false;

		};
	}
]);

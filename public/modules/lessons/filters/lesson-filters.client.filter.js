'use strict';

angular.module('lessons').filter('startFrom', [
	function() {
		return function (input, start) {
			if (input) {
				start = +start;
				return input.slice(start);
			}
			return [];
		};
	}
]).filter('to_trusted', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
});

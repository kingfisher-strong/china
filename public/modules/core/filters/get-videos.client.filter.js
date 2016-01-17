'use strict';

angular.module('core').filter('getVideos', [ 'Videos',
	function(Videos) {
		return function(input) {
			return input;
		};
	}
]).filter('offset', function() {
	return function(input, start) {
		start = parseInt(start, 10);
		return input.slice(start);
	};
}).filter('range', function() {
	return function(input, total) {
		total = parseInt(total);

		for (var i=0; i<total; i++) {
			input.push(i);
		}

		return input;
	};
}).filter('lessonPage', function() {
	return function(input, total) {
		total = Math.ceil(parseInt(total)/4);

		for (var i=0; i<total; i++) {
			input.push(i);
		}

		return input;
	};
}).filter('to_trusted', ['$sce', function($sce){
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]).filter('getChaper', [function(){
	return function(number) {
		return 'Chapter ' + (parseInt(number) + 1);
	};
}]);


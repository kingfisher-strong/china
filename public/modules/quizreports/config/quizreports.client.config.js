'use strict';

// Configuring the Articles module
angular.module('quizreports').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Quiz Reports', 'quizreports', 'dropdown', '/quizreports(/create)?');
		Menus.addSubMenuItem('topbar', 'quizreports', 'List Quizreports', 'quizreports');
		Menus.addSubMenuItem('topbar', 'quizreports', 'New Quizreport', 'quizreports/create');
	}
]);

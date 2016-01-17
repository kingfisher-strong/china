'use strict';

// Configuring the Articles module
angular.module('lessons').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Lessons', 'lessons', 'dropdown', '/lessons(/create)?');
		Menus.addSubMenuItem('topbar', 'lessons', 'List Lessons', 'lessons');
		Menus.addSubMenuItem('topbar', 'lessons', 'New Lesson', 'lessons/create');
	}
]);

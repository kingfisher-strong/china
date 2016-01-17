'use strict';

// Configuring the Articles module
angular.module('quiz-answers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Quiz Answers', 'quiz-answers', 'dropdown', '/quiz-answers(/create)?');
		Menus.addSubMenuItem('topbar', 'quiz-answers', 'List Quiz Answers', 'quiz-answers');
		Menus.addSubMenuItem('topbar', 'quiz-answers', 'New Answer', 'quiz-answers/create');
	}
]);

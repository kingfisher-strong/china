'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var streaks = require('../../app/controllers/streaks.server.controller');

	// Streaks Routes
	app.route('/streaks')
		.get(streaks.list)
		.post(users.requiresLogin, streaks.create);

	app.route('/streaks/:streakId')
		.get(streaks.read)
		.put(users.requiresLogin, streaks.hasAuthorization, streaks.update)
		.delete(users.requiresLogin, streaks.hasAuthorization, streaks.delete);

	// Finish by binding the Streak middleware
	app.param('streakId', streaks.streakByID);
};

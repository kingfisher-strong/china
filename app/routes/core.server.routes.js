'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

	app.get('/client_token', core.client_token);
	app.post('/checkout', core.checkout);
	app.post('/viewed_video', core.viewed_video);
	app.post('/lesson_passed', core.lesson_passed);
	app.post('/level_passed', core.level_passed);
	app.get('/superdeal', core.superdeal);
	app.get('/seen_tour', core.seen_tour);
	app.post('/unsubscribe', core.unsubscribe);
	app.get('/set_current_level', core.set_current_level);

	

};

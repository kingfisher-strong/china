'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var lessons = require('../../app/controllers/lessons.server.controller');
	// Requires multiparty
	var multiparty = require('connect-multiparty'),
		multipartMiddleware = multiparty();

	//app.route('/pdf_upload')
	//	.post(users.requiresLogin, multipartyMiddleware, articles.createWithUpload);

	// Lessons Routes
	app.route('/lessons')
		.get(lessons.list)
		.post(users.requiresLogin, users.hasAuthorization(['admin']), lessons.create);


	app.route('/lessons/:lessonId')
		.get(lessons.read)
		.put(users.requiresLogin, users.hasAuthorization(['admin']), lessons.update)
		.delete(users.requiresLogin, users.hasAuthorization(['admin']), lessons.delete);

	app.route('/lessons/:lessonId/pdf_file')
		.post(users.requiresLogin, multipartMiddleware, lessons.upload_pdf);

	app.route('/lessons/:lessonId/upload_mp3')
		.post(users.requiresLogin, multipartMiddleware, lessons.upload_mp3);

	app.route('/lessons/:lessonId/upload_thumbnail')
		.post(users.requiresLogin, multipartMiddleware, lessons.upload_thumbnail);

	// Finish by binding the Lesson middleware
	app.param('lessonId', lessons.lessonByID);
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Quizreport = mongoose.model('Quizreport'),
	Video = mongoose.model('Video'),
	_ = require('lodash');

/**
 * Create a Quizreport
 */
exports.create = function(req, res) {
	var quizreport = new Quizreport(req.body);
	quizreport.user = req.user;

	quizreport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizreport);
		}
	});
};

/**
 * Show the current Quizreport
 */
exports.read = function(req, res) {
	res.jsonp(req.quizreport);
};

/**
 * Update a Quizreport
 */
exports.update = function(req, res) {
	var quizreport = req.quizreport ;

	quizreport = _.extend(quizreport , req.body);

	quizreport.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizreport);
		}
	});
};

/**
 * Delete an Quizreport
 */
exports.delete = function(req, res) {
	var quizreport = req.quizreport ;

	quizreport.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizreport);
		}
	});
};

/**
 * List of Quizreports
 */
exports.list = function(req, res) { 
	Quizreport.find().sort('-created').populate('user', 'displayName').exec(function(err, quizreports) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizreports);
		}
	});
};

/**
 * Quizreport middleware
 */
exports.quizreportByID = function(req, res, next, id) { 
	Quizreport.findById(id).populate('quiz').populate('user', 'displayName').exec(function(err, quizreport) {
		if (err) return next(err);
		if (! quizreport) return next(new Error('Failed to load Quizreport ' + id));
		Video.findById(quizreport.quiz.video).populate('lesson').exec(function(err, video) {
			console.log(err, video);
			req.quizreport = quizreport ;
			if(video){
				req.quizreport.lesson_id = video.lesson._id;
				req.quizreport.lesson_name = video.lesson.name;
				req.quizreport.video_order = video.order;
			}

			next();
		});


	});
};

/**
 * Quizreport authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.quizreport.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

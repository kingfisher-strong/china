'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	QuizAnswer = mongoose.model('QuizAnswer'),
	Video = mongoose.model('Video'),
	_ = require('lodash');

/**
 * Create a Quiz answer
 */
exports.create = function(req, res) {
	var quizAnswer = new QuizAnswer(req.body);
	quizAnswer.user = req.user;

	quizAnswer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizAnswer);
		}
	});
};

/**
 * Show the current Quiz answer
 */
exports.read = function(req, res) {
	res.jsonp(req.quizAnswer);
};

/**
 * Update a Quiz answer
 */
exports.update = function(req, res) {
	var quizAnswer = req.quizAnswer ;

	quizAnswer = _.extend(quizAnswer , req.body);

	quizAnswer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizAnswer);
		}
	});
};

/**
 * Delete an Quiz answer
 */
exports.delete = function(req, res) {
	var quizAnswer = req.quizAnswer ;

	quizAnswer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quizAnswer);
		}
	});
};

/**
 * List of Quiz answers
 */
exports.list = function(req, res) {
	if(req.query.quiz){
		QuizAnswer.find({quiz: req.query.quiz}).sort('-created').populate('user', 'displayName').exec(function(err, quizAnswers) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(quizAnswers);
			}
		});
	}
	else {
		QuizAnswer.find().sort('-created').populate('user', 'displayName').exec(function(err, quizAnswers) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(quizAnswers);
			}
		});
	}

};

/**
 * Quiz answer middleware
 */
exports.quizAnswerByID = function(req, res, next, id) { 
	QuizAnswer.findById(id).populate('quiz').populate('user', 'displayName').exec(function(err, quizAnswer) {
		if (err) return next(err);
		if (! quizAnswer) return next(new Error('Failed to load Quiz answer ' + id));
		if(quizAnswer.quiz){
			Video.findById(quizAnswer.quiz.video).populate('lesson').exec(function(err, video) {
				console.log(err, video);
				req.quizAnswer = quizAnswer ;
				if(video){
					req.quizAnswer.lesson_id = video.lesson._id;
					req.quizAnswer.lesson_name = video.lesson.name;
					req.quizAnswer.video_order = video.order;
				}

				next();
			});
		}
		else {
			req.quizAnswer = quizAnswer ;
			next();

		}

	});
};

/**
 * Quiz answer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.quizAnswer.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

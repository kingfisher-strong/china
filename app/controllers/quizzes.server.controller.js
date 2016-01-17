'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Quiz = mongoose.model('Quiz'),
	_ = require('lodash');

/**
 * Create a Quiz
 */
exports.create = function(req, res) {
	var quiz = new Quiz(req.body);
	quiz.user = req.user;
	if ( quiz.is_correct == 'false') {
		quiz.is_correct = 'n';
	}
    else if ( quiz.is_correct == 'true') {
		quiz.is_correct = 'y';
	}
	quiz.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quiz);
		}
	});
};

/**
 * Show the current Quiz
 */
exports.read = function(req, res) {
	res.jsonp(req.quiz);
};

/**
 * Update a Quiz
 */
exports.update = function(req, res) {
	var quiz = req.quiz ;
	if ( quiz.is_correct !== 'y') {
		quiz.is_correct = 'n';
	}
	quiz = _.extend(quiz , req.body);

	quiz.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quiz);
		}
	});
};

/**
 * Delete an Quiz
 */
exports.delete = function(req, res) {
	var quiz = req.quiz ;

	quiz.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(quiz);
		}
	});
};

/**
 * List of Quizzes
 */
exports.list = function(req, res) {

	if(req.query.videoID){
		Quiz.findOne({video: req.query.videoID}).sort('-created').populate('user', 'displayName').exec(function(err, quiz) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(quiz);
			}
		});
	}
    else if(req.query.videoIDs){
		Quiz.find({video: {'$in':req.query.videoIDs.split(',')} }).sort('-created').populate('user', 'displayName').exec(function(err, quiz) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(quiz);
			}
		});
	}
	else {
		Quiz.find().sort('-created').populate('user', 'displayName').exec(function (err, quizzes) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(quizzes);
			}
		});
	}
};

/**
 * List of Quizzes
 */
exports.get_quizzes = function(req, res) {

	if(req.body.videoIDs){
		Quiz.find({video: {'$in':req.body.videoIDs.split(',')} }).sort('-created').populate('user', 'displayName').exec(function(err, quiz) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(quiz);
			}
		});
	}
	else {
		res.jsonp([]);
	}
};

/**
 * Quiz middleware
 */
exports.quizByID = function(req, res, next, id) { 
	Quiz.findById(id).populate('video').populate('user', 'displayName').exec(function(err, quiz) {
		if (err) return next(err);
		if (! quiz) return next(new Error('Failed to load Quiz ' + id));

		req.quiz = quiz ;
		next();
	});
};

/**
 * Quiz authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	//if (req.quiz.video.user !== req.user.id) {
	//	return res.status(403).send('User is not authorized');
	//}
	next();
};

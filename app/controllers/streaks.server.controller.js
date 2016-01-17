'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Streak = mongoose.model('Streak'),
	_ = require('lodash');

/**
 * Create a Streak
 */
exports.create = function(req, res) {
	var streak = new Streak(req.body);
	streak.user = req.user;

	streak.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(streak);
		}
	});
};

/**
 * Show the current Streak
 */
exports.read = function(req, res) {
	res.jsonp(req.streak);
};

/**
 * Update a Streak
 */
exports.update = function(req, res) {
	var streak = req.streak ;

	streak = _.extend(streak , req.body);

	streak.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(streak);
		}
	});
};

/**
 * Delete an Streak
 */
exports.delete = function(req, res) {
	var streak = req.streak ;

	streak.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(streak);
		}
	});
};

/**
 * List of Streaks
 */
exports.list = function(req, res) { 
	Streak.find().sort('-created').populate('user', 'displayName').exec(function(err, streaks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(streaks);
		}
	});
};

/**
 * Streak middleware
 */
exports.streakByID = function(req, res, next, id) { 
	Streak.findById(id).populate('user', 'displayName').exec(function(err, streak) {
		if (err) return next(err);
		if (! streak) return next(new Error('Failed to load Streak ' + id));
		req.streak = streak ;
		next();
	});
};

/**
 * Streak authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.streak.user.id !== req.user.id && req.user.roles.indexOf('admin') === -1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * VideoRating Schema
 */
var VideoRatingSchema = new Schema({
	rating: {
		type: Number,
		default: 0
	},
	video: {
		type: Schema.ObjectId,
		ref: 'Video'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('VideoRating', VideoRatingSchema);

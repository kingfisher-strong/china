'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Quiz Schema
 */
var QuizSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Quiz name',
		trim: true
	},
	type: {
		type: String,
		default: '',
		required: 'Please fill Quiz type',
		trim: true
	},
	answers: [{
		description: {
			type: String,
			default: '',
			required: 'Please fill Quiz answer',
			trim: true
		},
		is_correct: {
			type: String,
			default: 'n'
		}
	}],
	created: {
		type: Date,
		default: Date.now
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

mongoose.model('Quiz', QuizSchema);

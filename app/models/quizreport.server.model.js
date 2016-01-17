'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Quizreport Schema
 */
var QuizreportSchema = new Schema({
	description: {
		type: String,
		default: '',
		required: 'Please fill description',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	quiz: {
		type: Schema.ObjectId,
		ref: 'Quiz'
	},
	lesson_id: {
		type: String
	},
	lesson_name: {
		type: String
	},
	video_order: {
		type: Number
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Quizreport', QuizreportSchema);

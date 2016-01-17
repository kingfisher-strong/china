'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Streak Schema
 */
var StreakSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Streak name',
		trim: true
	},
	short_description: {
		type: String,
		default: '',
		required: 'Please fill description',
		trim: true
	},
	order: {
		type: Number,
		default: 0
	},
	Number: {
		type: Number,
		default: 0
	},
	reviewed: {
		type: Boolean,
		default: false
	},
	is_visible: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Streak', StreakSchema);

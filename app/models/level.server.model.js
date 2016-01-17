'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Level Schema
 */
var LevelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Level name',
		trim: true
	},
	introduction: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	order: {
		type: Number,
		default: 1,
		required: 'Please fill Level order',
		trim: true
	},
	is_published: {
		type: Boolean,
		default: false
	},
	words: {
		type: Number,
		default: 0,
		trim: true
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

mongoose.model('Level', LevelSchema);

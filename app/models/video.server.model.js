'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
        name: {
            type: String,
            default: '',
            required: 'Please fill Video name',
            trim: true
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        embed_code: {
            type: String,
            default: '',
            required: 'Please fill Video Frame',
            trim: true
        },
        mp3: {
            type: String,
            default: '',
            trim: true
        },
        rating: {
            type: Number,
            default: 0
        },
        order: {
            type: Number,
            default: 0
        },
        total_seconds: {
            type: Number,
            default: 0
        },
        quiz: [{
            name: {
                type: String
            },
            type: {
                type: String

            }
        }

        ],
        created: {
            type: Date,
            default: Date.now
        },
        lesson: {
            type: Schema.ObjectId,
            ref: 'Lesson'
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    });

mongoose.model('Video', VideoSchema);

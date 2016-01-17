'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Lesson Schema
 */
function onlyNumber(value) {
    return /[0-9]+/.test(value);
}

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var mustBetween = function (password) {
    return password && password > 0 && password < 21;
};

var LessonSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Lesson name',
        trim: true
    },
    pdf_file: {
        type: String,
        default: ''
    },
    thumbnail: {
        type: String,
        default: ''
    },
    mp3: {
        type: String,
        default: ''
    },
    story_time: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        min: 1,
        required: 'Please fill lesson number',
        validate: [mustBetween, 'Should write a number from 1-20'],
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    level: {
        type: Schema.ObjectId,
        required: 'Please select a level',
        ref: 'Level'
    },
    streak: {
        type: Schema.ObjectId,
        ref: 'Streak'
    },
    videos: [

        {
            name: {
                type: String
            },
            embed_code: {
                type: String
            },
            order: {
                type: Number
            }
        }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
mongoose.model('Lesson', LessonSchema);



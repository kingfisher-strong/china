'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QuizAnswer = mongoose.model('QuizAnswer');

/**
 * Globals
 */
var user, quizAnswer;

/**
 * Unit tests
 */
describe('Quiz answer Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			quizAnswer = new QuizAnswer({
				name: 'Quiz answer Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return quizAnswer.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			quizAnswer.name = '';

			return quizAnswer.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		QuizAnswer.remove().exec();
		User.remove().exec();

		done();
	});
});
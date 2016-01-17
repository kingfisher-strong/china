'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	QuizAnswer = mongoose.model('QuizAnswer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, quizAnswer;

/**
 * Quiz answer routes tests
 */
describe('Quiz answer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Quiz answer
		user.save(function() {
			quizAnswer = {
				name: 'Quiz answer Name'
			};

			done();
		});
	});

	it('should be able to save Quiz answer instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quiz answer
				agent.post('/quiz-answers')
					.send(quizAnswer)
					.expect(200)
					.end(function(quizAnswerSaveErr, quizAnswerSaveRes) {
						// Handle Quiz answer save error
						if (quizAnswerSaveErr) done(quizAnswerSaveErr);

						// Get a list of Quiz answers
						agent.get('/quiz-answers')
							.end(function(quizAnswersGetErr, quizAnswersGetRes) {
								// Handle Quiz answer save error
								if (quizAnswersGetErr) done(quizAnswersGetErr);

								// Get Quiz answers list
								var quizAnswers = quizAnswersGetRes.body;

								// Set assertions
								(quizAnswers[0].user._id).should.equal(userId);
								(quizAnswers[0].name).should.match('Quiz answer Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Quiz answer instance if not logged in', function(done) {
		agent.post('/quiz-answers')
			.send(quizAnswer)
			.expect(401)
			.end(function(quizAnswerSaveErr, quizAnswerSaveRes) {
				// Call the assertion callback
				done(quizAnswerSaveErr);
			});
	});

	it('should not be able to save Quiz answer instance if no name is provided', function(done) {
		// Invalidate name field
		quizAnswer.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quiz answer
				agent.post('/quiz-answers')
					.send(quizAnswer)
					.expect(400)
					.end(function(quizAnswerSaveErr, quizAnswerSaveRes) {
						// Set message assertion
						(quizAnswerSaveRes.body.message).should.match('Please fill Quiz answer name');
						
						// Handle Quiz answer save error
						done(quizAnswerSaveErr);
					});
			});
	});

	it('should be able to update Quiz answer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quiz answer
				agent.post('/quiz-answers')
					.send(quizAnswer)
					.expect(200)
					.end(function(quizAnswerSaveErr, quizAnswerSaveRes) {
						// Handle Quiz answer save error
						if (quizAnswerSaveErr) done(quizAnswerSaveErr);

						// Update Quiz answer name
						quizAnswer.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Quiz answer
						agent.put('/quiz-answers/' + quizAnswerSaveRes.body._id)
							.send(quizAnswer)
							.expect(200)
							.end(function(quizAnswerUpdateErr, quizAnswerUpdateRes) {
								// Handle Quiz answer update error
								if (quizAnswerUpdateErr) done(quizAnswerUpdateErr);

								// Set assertions
								(quizAnswerUpdateRes.body._id).should.equal(quizAnswerSaveRes.body._id);
								(quizAnswerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Quiz answers if not signed in', function(done) {
		// Create new Quiz answer model instance
		var quizAnswerObj = new QuizAnswer(quizAnswer);

		// Save the Quiz answer
		quizAnswerObj.save(function() {
			// Request Quiz answers
			request(app).get('/quiz-answers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Quiz answer if not signed in', function(done) {
		// Create new Quiz answer model instance
		var quizAnswerObj = new QuizAnswer(quizAnswer);

		// Save the Quiz answer
		quizAnswerObj.save(function() {
			request(app).get('/quiz-answers/' + quizAnswerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', quizAnswer.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Quiz answer instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quiz answer
				agent.post('/quiz-answers')
					.send(quizAnswer)
					.expect(200)
					.end(function(quizAnswerSaveErr, quizAnswerSaveRes) {
						// Handle Quiz answer save error
						if (quizAnswerSaveErr) done(quizAnswerSaveErr);

						// Delete existing Quiz answer
						agent.delete('/quiz-answers/' + quizAnswerSaveRes.body._id)
							.send(quizAnswer)
							.expect(200)
							.end(function(quizAnswerDeleteErr, quizAnswerDeleteRes) {
								// Handle Quiz answer error error
								if (quizAnswerDeleteErr) done(quizAnswerDeleteErr);

								// Set assertions
								(quizAnswerDeleteRes.body._id).should.equal(quizAnswerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Quiz answer instance if not signed in', function(done) {
		// Set Quiz answer user 
		quizAnswer.user = user;

		// Create new Quiz answer model instance
		var quizAnswerObj = new QuizAnswer(quizAnswer);

		// Save the Quiz answer
		quizAnswerObj.save(function() {
			// Try deleting Quiz answer
			request(app).delete('/quiz-answers/' + quizAnswerObj._id)
			.expect(401)
			.end(function(quizAnswerDeleteErr, quizAnswerDeleteRes) {
				// Set message assertion
				(quizAnswerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Quiz answer error error
				done(quizAnswerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		QuizAnswer.remove().exec();
		done();
	});
});
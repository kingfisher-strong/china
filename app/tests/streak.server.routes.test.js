'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Streak = mongoose.model('Streak'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, streak;

/**
 * Streak routes tests
 */
describe('Streak CRUD tests', function() {
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

		// Save a user to the test db and create new Streak
		user.save(function() {
			streak = {
				name: 'Streak Name'
			};

			done();
		});
	});

	it('should be able to save Streak instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Streak
				agent.post('/streaks')
					.send(streak)
					.expect(200)
					.end(function(streakSaveErr, streakSaveRes) {
						// Handle Streak save error
						if (streakSaveErr) done(streakSaveErr);

						// Get a list of Streaks
						agent.get('/streaks')
							.end(function(streaksGetErr, streaksGetRes) {
								// Handle Streak save error
								if (streaksGetErr) done(streaksGetErr);

								// Get Streaks list
								var streaks = streaksGetRes.body;

								// Set assertions
								(streaks[0].user._id).should.equal(userId);
								(streaks[0].name).should.match('Streak Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Streak instance if not logged in', function(done) {
		agent.post('/streaks')
			.send(streak)
			.expect(401)
			.end(function(streakSaveErr, streakSaveRes) {
				// Call the assertion callback
				done(streakSaveErr);
			});
	});

	it('should not be able to save Streak instance if no name is provided', function(done) {
		// Invalidate name field
		streak.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Streak
				agent.post('/streaks')
					.send(streak)
					.expect(400)
					.end(function(streakSaveErr, streakSaveRes) {
						// Set message assertion
						(streakSaveRes.body.message).should.match('Please fill Streak name');
						
						// Handle Streak save error
						done(streakSaveErr);
					});
			});
	});

	it('should be able to update Streak instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Streak
				agent.post('/streaks')
					.send(streak)
					.expect(200)
					.end(function(streakSaveErr, streakSaveRes) {
						// Handle Streak save error
						if (streakSaveErr) done(streakSaveErr);

						// Update Streak name
						streak.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Streak
						agent.put('/streaks/' + streakSaveRes.body._id)
							.send(streak)
							.expect(200)
							.end(function(streakUpdateErr, streakUpdateRes) {
								// Handle Streak update error
								if (streakUpdateErr) done(streakUpdateErr);

								// Set assertions
								(streakUpdateRes.body._id).should.equal(streakSaveRes.body._id);
								(streakUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Streaks if not signed in', function(done) {
		// Create new Streak model instance
		var streakObj = new Streak(streak);

		// Save the Streak
		streakObj.save(function() {
			// Request Streaks
			request(app).get('/streaks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Streak if not signed in', function(done) {
		// Create new Streak model instance
		var streakObj = new Streak(streak);

		// Save the Streak
		streakObj.save(function() {
			request(app).get('/streaks/' + streakObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', streak.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Streak instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Streak
				agent.post('/streaks')
					.send(streak)
					.expect(200)
					.end(function(streakSaveErr, streakSaveRes) {
						// Handle Streak save error
						if (streakSaveErr) done(streakSaveErr);

						// Delete existing Streak
						agent.delete('/streaks/' + streakSaveRes.body._id)
							.send(streak)
							.expect(200)
							.end(function(streakDeleteErr, streakDeleteRes) {
								// Handle Streak error error
								if (streakDeleteErr) done(streakDeleteErr);

								// Set assertions
								(streakDeleteRes.body._id).should.equal(streakSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Streak instance if not signed in', function(done) {
		// Set Streak user 
		streak.user = user;

		// Create new Streak model instance
		var streakObj = new Streak(streak);

		// Save the Streak
		streakObj.save(function() {
			// Try deleting Streak
			request(app).delete('/streaks/' + streakObj._id)
			.expect(401)
			.end(function(streakDeleteErr, streakDeleteRes) {
				// Set message assertion
				(streakDeleteRes.body.message).should.match('User is not logged in');

				// Handle Streak error error
				done(streakDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Streak.remove().exec();
		done();
	});
});
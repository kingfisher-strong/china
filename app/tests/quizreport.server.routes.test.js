'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Quizreport = mongoose.model('Quizreport'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, quizreport;

/**
 * Quizreport routes tests
 */
describe('Quizreport CRUD tests', function() {
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

		// Save a user to the test db and create new Quizreport
		user.save(function() {
			quizreport = {
				name: 'Quizreport Name'
			};

			done();
		});
	});

	it('should be able to save Quizreport instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quizreport
				agent.post('/quizreports')
					.send(quizreport)
					.expect(200)
					.end(function(quizreportSaveErr, quizreportSaveRes) {
						// Handle Quizreport save error
						if (quizreportSaveErr) done(quizreportSaveErr);

						// Get a list of Quizreports
						agent.get('/quizreports')
							.end(function(quizreportsGetErr, quizreportsGetRes) {
								// Handle Quizreport save error
								if (quizreportsGetErr) done(quizreportsGetErr);

								// Get Quizreports list
								var quizreports = quizreportsGetRes.body;

								// Set assertions
								(quizreports[0].user._id).should.equal(userId);
								(quizreports[0].name).should.match('Quizreport Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Quizreport instance if not logged in', function(done) {
		agent.post('/quizreports')
			.send(quizreport)
			.expect(401)
			.end(function(quizreportSaveErr, quizreportSaveRes) {
				// Call the assertion callback
				done(quizreportSaveErr);
			});
	});

	it('should not be able to save Quizreport instance if no name is provided', function(done) {
		// Invalidate name field
		quizreport.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quizreport
				agent.post('/quizreports')
					.send(quizreport)
					.expect(400)
					.end(function(quizreportSaveErr, quizreportSaveRes) {
						// Set message assertion
						(quizreportSaveRes.body.message).should.match('Please fill Quizreport name');
						
						// Handle Quizreport save error
						done(quizreportSaveErr);
					});
			});
	});

	it('should be able to update Quizreport instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quizreport
				agent.post('/quizreports')
					.send(quizreport)
					.expect(200)
					.end(function(quizreportSaveErr, quizreportSaveRes) {
						// Handle Quizreport save error
						if (quizreportSaveErr) done(quizreportSaveErr);

						// Update Quizreport name
						quizreport.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Quizreport
						agent.put('/quizreports/' + quizreportSaveRes.body._id)
							.send(quizreport)
							.expect(200)
							.end(function(quizreportUpdateErr, quizreportUpdateRes) {
								// Handle Quizreport update error
								if (quizreportUpdateErr) done(quizreportUpdateErr);

								// Set assertions
								(quizreportUpdateRes.body._id).should.equal(quizreportSaveRes.body._id);
								(quizreportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Quizreports if not signed in', function(done) {
		// Create new Quizreport model instance
		var quizreportObj = new Quizreport(quizreport);

		// Save the Quizreport
		quizreportObj.save(function() {
			// Request Quizreports
			request(app).get('/quizreports')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Quizreport if not signed in', function(done) {
		// Create new Quizreport model instance
		var quizreportObj = new Quizreport(quizreport);

		// Save the Quizreport
		quizreportObj.save(function() {
			request(app).get('/quizreports/' + quizreportObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', quizreport.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Quizreport instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Quizreport
				agent.post('/quizreports')
					.send(quizreport)
					.expect(200)
					.end(function(quizreportSaveErr, quizreportSaveRes) {
						// Handle Quizreport save error
						if (quizreportSaveErr) done(quizreportSaveErr);

						// Delete existing Quizreport
						agent.delete('/quizreports/' + quizreportSaveRes.body._id)
							.send(quizreport)
							.expect(200)
							.end(function(quizreportDeleteErr, quizreportDeleteRes) {
								// Handle Quizreport error error
								if (quizreportDeleteErr) done(quizreportDeleteErr);

								// Set assertions
								(quizreportDeleteRes.body._id).should.equal(quizreportSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Quizreport instance if not signed in', function(done) {
		// Set Quizreport user 
		quizreport.user = user;

		// Create new Quizreport model instance
		var quizreportObj = new Quizreport(quizreport);

		// Save the Quizreport
		quizreportObj.save(function() {
			// Try deleting Quizreport
			request(app).delete('/quizreports/' + quizreportObj._id)
			.expect(401)
			.end(function(quizreportDeleteErr, quizreportDeleteRes) {
				// Set message assertion
				(quizreportDeleteRes.body.message).should.match('User is not logged in');

				// Handle Quizreport error error
				done(quizreportDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Quizreport.remove().exec();
		done();
	});
});
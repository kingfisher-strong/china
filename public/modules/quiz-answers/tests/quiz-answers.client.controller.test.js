'use strict';

(function() {
	// Quiz answers Controller Spec
	describe('Quiz answers Controller Tests', function() {
		// Initialize global variables
		var QuizAnswersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Quiz answers controller.
			QuizAnswersController = $controller('QuizAnswersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Quiz answer object fetched from XHR', inject(function(QuizAnswers) {
			// Create sample Quiz answer using the Quiz answers service
			var sampleQuizAnswer = new QuizAnswers({
				name: 'New Quiz answer'
			});

			// Create a sample Quiz answers array that includes the new Quiz answer
			var sampleQuizAnswers = [sampleQuizAnswer];

			// Set GET response
			$httpBackend.expectGET('quiz-answers').respond(sampleQuizAnswers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.quizAnswers).toEqualData(sampleQuizAnswers);
		}));

		it('$scope.findOne() should create an array with one Quiz answer object fetched from XHR using a quizAnswerId URL parameter', inject(function(QuizAnswers) {
			// Define a sample Quiz answer object
			var sampleQuizAnswer = new QuizAnswers({
				name: 'New Quiz answer'
			});

			// Set the URL parameter
			$stateParams.quizAnswerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/quiz-answers\/([0-9a-fA-F]{24})$/).respond(sampleQuizAnswer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.quizAnswer).toEqualData(sampleQuizAnswer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(QuizAnswers) {
			// Create a sample Quiz answer object
			var sampleQuizAnswerPostData = new QuizAnswers({
				name: 'New Quiz answer'
			});

			// Create a sample Quiz answer response
			var sampleQuizAnswerResponse = new QuizAnswers({
				_id: '525cf20451979dea2c000001',
				name: 'New Quiz answer'
			});

			// Fixture mock form input values
			scope.name = 'New Quiz answer';

			// Set POST response
			$httpBackend.expectPOST('quiz-answers', sampleQuizAnswerPostData).respond(sampleQuizAnswerResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Quiz answer was created
			expect($location.path()).toBe('/quiz-answers/' + sampleQuizAnswerResponse._id);
		}));

		it('$scope.update() should update a valid Quiz answer', inject(function(QuizAnswers) {
			// Define a sample Quiz answer put data
			var sampleQuizAnswerPutData = new QuizAnswers({
				_id: '525cf20451979dea2c000001',
				name: 'New Quiz answer'
			});

			// Mock Quiz answer in scope
			scope.quizAnswer = sampleQuizAnswerPutData;

			// Set PUT response
			$httpBackend.expectPUT(/quiz-answers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/quiz-answers/' + sampleQuizAnswerPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid quizAnswerId and remove the Quiz answer from the scope', inject(function(QuizAnswers) {
			// Create new Quiz answer object
			var sampleQuizAnswer = new QuizAnswers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Quiz answers array and include the Quiz answer
			scope.quizAnswers = [sampleQuizAnswer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/quiz-answers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQuizAnswer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.quizAnswers.length).toBe(0);
		}));
	});
}());
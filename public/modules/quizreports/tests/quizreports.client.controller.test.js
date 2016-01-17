'use strict';

(function() {
	// Quizreports Controller Spec
	describe('Quizreports Controller Tests', function() {
		// Initialize global variables
		var QuizreportsController,
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

			// Initialize the Quizreports controller.
			QuizreportsController = $controller('QuizreportsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Quizreport object fetched from XHR', inject(function(Quizreports) {
			// Create sample Quizreport using the Quizreports service
			var sampleQuizreport = new Quizreports({
				name: 'New Quizreport'
			});

			// Create a sample Quizreports array that includes the new Quizreport
			var sampleQuizreports = [sampleQuizreport];

			// Set GET response
			$httpBackend.expectGET('quizreports').respond(sampleQuizreports);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.quizreports).toEqualData(sampleQuizreports);
		}));

		it('$scope.findOne() should create an array with one Quizreport object fetched from XHR using a quizreportId URL parameter', inject(function(Quizreports) {
			// Define a sample Quizreport object
			var sampleQuizreport = new Quizreports({
				name: 'New Quizreport'
			});

			// Set the URL parameter
			$stateParams.quizreportId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/quizreports\/([0-9a-fA-F]{24})$/).respond(sampleQuizreport);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.quizreport).toEqualData(sampleQuizreport);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Quizreports) {
			// Create a sample Quizreport object
			var sampleQuizreportPostData = new Quizreports({
				name: 'New Quizreport'
			});

			// Create a sample Quizreport response
			var sampleQuizreportResponse = new Quizreports({
				_id: '525cf20451979dea2c000001',
				name: 'New Quizreport'
			});

			// Fixture mock form input values
			scope.name = 'New Quizreport';

			// Set POST response
			$httpBackend.expectPOST('quizreports', sampleQuizreportPostData).respond(sampleQuizreportResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Quizreport was created
			expect($location.path()).toBe('/quizreports/' + sampleQuizreportResponse._id);
		}));

		it('$scope.update() should update a valid Quizreport', inject(function(Quizreports) {
			// Define a sample Quizreport put data
			var sampleQuizreportPutData = new Quizreports({
				_id: '525cf20451979dea2c000001',
				name: 'New Quizreport'
			});

			// Mock Quizreport in scope
			scope.quizreport = sampleQuizreportPutData;

			// Set PUT response
			$httpBackend.expectPUT(/quizreports\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/quizreports/' + sampleQuizreportPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid quizreportId and remove the Quizreport from the scope', inject(function(Quizreports) {
			// Create new Quizreport object
			var sampleQuizreport = new Quizreports({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Quizreports array and include the Quizreport
			scope.quizreports = [sampleQuizreport];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/quizreports\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQuizreport);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.quizreports.length).toBe(0);
		}));
	});
}());
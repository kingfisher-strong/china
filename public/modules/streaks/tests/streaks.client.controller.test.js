'use strict';

(function() {
	// Streaks Controller Spec
	describe('Streaks Controller Tests', function() {
		// Initialize global variables
		var StreaksController,
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

			// Initialize the Streaks controller.
			StreaksController = $controller('StreaksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Streak object fetched from XHR', inject(function(Streaks) {
			// Create sample Streak using the Streaks service
			var sampleStreak = new Streaks({
				name: 'New Streak'
			});

			// Create a sample Streaks array that includes the new Streak
			var sampleStreaks = [sampleStreak];

			// Set GET response
			$httpBackend.expectGET('streaks').respond(sampleStreaks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.streaks).toEqualData(sampleStreaks);
		}));

		it('$scope.findOne() should create an array with one Streak object fetched from XHR using a streakId URL parameter', inject(function(Streaks) {
			// Define a sample Streak object
			var sampleStreak = new Streaks({
				name: 'New Streak'
			});

			// Set the URL parameter
			$stateParams.streakId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/streaks\/([0-9a-fA-F]{24})$/).respond(sampleStreak);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.streak).toEqualData(sampleStreak);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Streaks) {
			// Create a sample Streak object
			var sampleStreakPostData = new Streaks({
				name: 'New Streak'
			});

			// Create a sample Streak response
			var sampleStreakResponse = new Streaks({
				_id: '525cf20451979dea2c000001',
				name: 'New Streak'
			});

			// Fixture mock form input values
			scope.name = 'New Streak';

			// Set POST response
			$httpBackend.expectPOST('streaks', sampleStreakPostData).respond(sampleStreakResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Streak was created
			expect($location.path()).toBe('/streaks/' + sampleStreakResponse._id);
		}));

		it('$scope.update() should update a valid Streak', inject(function(Streaks) {
			// Define a sample Streak put data
			var sampleStreakPutData = new Streaks({
				_id: '525cf20451979dea2c000001',
				name: 'New Streak'
			});

			// Mock Streak in scope
			scope.streak = sampleStreakPutData;

			// Set PUT response
			$httpBackend.expectPUT(/streaks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/streaks/' + sampleStreakPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid streakId and remove the Streak from the scope', inject(function(Streaks) {
			// Create new Streak object
			var sampleStreak = new Streaks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Streaks array and include the Streak
			scope.streaks = [sampleStreak];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/streaks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStreak);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.streaks.length).toBe(0);
		}));
	});
}());
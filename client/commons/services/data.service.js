/* IIFE wrapper */
(function() {
	/**
	 * Service: dataService
	 */
	angular
		.module('spapp')
		.service('dataService', dataService);
	
	/**
	 * DataService definition.
	 * Wraps the call to nodeJS API into a function (to accept coordinates data).
	 * Returns location data for specified coordinates.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	dataService.$inject = ['$http', 'authService'];
	function dataService($http, authService) {
		/**
		 * Loads and returns locations promise for specified coordinates
		 * and fixed location radius.
		 * Note: use fixed values in case google API is down
		 * $http.get('/api/locations?lat=45.48288&lng=-73.574884&radius=5');
		 */
		var locationsByCoordinates = function(lat, lng) {
			return $http.get('/api/locations?lat=' + lat + '&lng=' + lng + '&radius=20');
		};

		/**
		 * Loads and returns a location promise for specified location ID.
		 */
		var locationById = function(locationid) {
			return $http.get('/api/locations/' + locationid);
		};

		/**
		 * Saves location review for specified location ID.
		 * Appends JWT to the header for user authentication.
		 */
		var addReviewById = function(locationid, data) {
			return $http.post('/api/locations/' + locationid + '/reviews', data, {
				headers: {
					Authorization: 'Bearer '+ authService.getToken()
				}
			});
		}
	
		return {
			getLocations: locationsByCoordinates,
			getLocationById: locationById,
			addReview: addReviewById
		};
	}
})();
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
	dataService.$inject = ['$http'];
	function dataService($http) {
		var locationsByCoordinates = function(lat, lng) {
			return $http.get('/api/locations?lat=' + lat + '&lng=' + lng + '&radius=20');
			//return $http.get('/api/locations?lat=45.48288&lng=-73.574884&radius=5');
		};

		var locationById = function(locationid) {
			return $http.get('/api/locations/' + locationid);
		};
	
		return {
			getLocations: locationsByCoordinates,
			getLocationById: locationById
		};
	}
})();
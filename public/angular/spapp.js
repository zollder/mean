/**
 * http://usejsdoc.org/
 */
angular.module('spapp', []);

/**
 * Controller: locationListCtrl
 * A function holding controller code.
 * Contains callback definitions for scenarios: success, error, or not supported.
 * Uses data service to fetch location data and attaches it to the scope.
 * Performs basic error handling.
 */
var locationListCtrl = function($scope, dataService, geoService) {
	$scope.message = "Checking location ...";

	// success (pass position object to native geolocation API)
	// see: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
	$scope.getData = function(position) {
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;

		$scope.message = "Searching for nearby places";

		dataService.getLocations(lat, lng).then(
			function(response) {
				$scope.message = response.data.length > 0 ? "" : "No locations found";
				$scope.data = { locations: response.data };
			},
			function(er) {
				$scope.message = "Sorry, something's gone wrong ";
				console.log(er);
			});
	};

	// error
	$scope.showError = function(error) {
		$scope.$apply(function() {
			$scope.message = error.message;
		});
	};

	// not supported
	$scope.noGeo = function(){
		$scope.$apply(function() {
			$scope.message = "Geolocation not supported by browser.";
		});
	};

	// get coordinates of the current user location
	geoService.getPosition($scope.getData, $scope.showError, $scope.noGeo);
	
};


/**
 * Service: dataService
 * Wraps the call to nodeJS API into a function (to accept coordinates data).
 * Returns location data for specified coordinates.
 * API key: AIzaSyCOIeSjjwgYZws_-lgnYMf0thqFh8D5B-w
 */
var dataService = function($http) {
	var locationsByCoordinates = function(lat, lng) {
		return $http.get('/api/locations?lat=' + lat + '&lng=' + lng + '&radius=20');
//		return $http.get('/api/locations?lat=45.48288&lng=-73.574884&radius=5');
	};

	return {
		getLocations: locationsByCoordinates
	};
};

/**
 * Service: geoService wrapper around browser-based "navigator" feature.
 * Exposes getPosition() service to external callers.
 * Returns current user location (user-accepted only).
 * Performs basic error handling.
 */
var geoService = function() {
	// define a function accepting 3 callback functions
	var getPosition = function(cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			// call native method, if geo is supported
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		} else {
			// fire/execute "noGeo" if geo isn't supported
			cbNoGeo();
		}
	};
	
	// expose the function to external users
	return {
		getPosition: getPosition
	};
};

/**
 * Add modules/components/services to the application.
 */
angular
	.module('spapp')
	.controller('locationListCtrl', locationListCtrl)
	.filter('formatDistance', formatDistance)
	.directive('ratingStars', ratingStars)
	.service('dataService', dataService)
	.service('geoService', geoService);

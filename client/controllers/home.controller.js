/* IIFE wrapper */
(function() {
	/**
	 * Declare and add home page controller to the application.
	 */
	angular
		.module('spapp')
		.controller('homeCtrl', homeCtrl);
	
	/**
	 * Defines home controller.
	 * Binds some data for header and sidebar.
	 * Is bound to the scope with controllerAs option.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	homeCtrl.$inject = ['$scope', 'dataService', 'geoService'];
	function homeCtrl($scope, dataService, geoService) {
		// controller hook, binds controller to the scope (controllerAs)
		var vm = this;

		vm.pageHeader = {
			title: 'Mean PG',
			strapline: ': free nearby WiFi spots'
		};

		vm.sidebar = {
			content: "Looking for wifi and a seat? We help you find places to work when out and about." +
			"Perhaps with coffee, cake or a pint? Let us help you find the place you're looking for."
		};
		
		vm.message = "Checking location ...";
		
		// success (pass position object to native geolocation API)
		// see: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
		vm.getData = function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			
			vm.message = "Searching for nearby places";
			
			dataService.getLocations(lat, lng)
				.then(
					function(response) {
						vm.message = response.data.length > 0 ? "" : "No locations found";
						vm.data = { locations: response.data };
					},
					function(er) {
						vm.message = "Sorry, something's gone wrong ";
						console.log(er);
					});
		};
		
		// error
		vm.showError = function(error) {
			$scope.$apply(function() {
				vm.message = error.message;
				// TODO: remove this code once geoservice is up
				dataService.getLocations(0, 0)
					.then(
						function(response) {
							vm.message = response.data.length > 0 ? "" : "No locations found";
							vm.data = { locations: response.data };
						},
						function(er) {
							vm.message = "Sorry, something's gone wrong ";
							console.log(er);
						});
			});
		};
		
		// not supported
		vm.noGeo = function(){
			$scope.$apply(function() {
				vm.message = "Geolocation not supported by browser.";
			});
		};
		
		// get coordinates of the current user location
		geoService.getPosition(vm.getData, vm.showError, vm.noGeo);
	}
})();
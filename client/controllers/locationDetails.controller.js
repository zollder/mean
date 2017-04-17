/* IIFE wrapper */
(function() {
	/**
	 * Declare and add location details page controller to the application.
	 */
	angular
		.module('spapp')
		.controller('locationDetailsCtrl', locationDetailsCtrl);
	
	/**
	 * Defines location details controller.
	 * Is bound to the scope with controllerAs option.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	locationDetailsCtrl.$inject = ['$routeParams', '$uibModal', 'dataService'];
	function locationDetailsCtrl($routeParams, $uibModal, dataService) {
		// controller hook, binds controller to the scope (controllerAs)
		var vm = this;
		vm.locationid = $routeParams.locationid;
		
		vm.pageHeader = {
			title: vm.locationid
		};

		vm.message = "Retrieving location ...";
		
		dataService.getLocationById(vm.locationid)
			.then(
				function(response) {
					vm.message = response.data.length > 0 ? "" : "No locations found";
					vm.data = { location: response.data };
					vm.pageHeader = {
						title: vm.data.location.name
					};
				},
				function(er) {
					vm.message = "Sorry, something's gone wrong ";
					console.log(er);
				});
		
		vm.openReviewForm = function() {
			var modalInstance = $uibModal.open({
				templateUrl: '/views/reviewModal.view.html',
				controller: 'reviewModalCtrl as vm',
				resolve: {
					locationData: function() {	// map parameter to a function
						// should return an object or a single value
						return {
							locationId: vm.locationid,
							locationName: vm.data.location.name
						};
					}
				}
			});
		};
	}
})();
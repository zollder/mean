/* IIFE wrapper */
(function() {
	/**
	 * Declare and add review modal controller to the application.
	 */
	angular
		.module('spapp')
		.controller('reviewModalCtrl', reviewModalCtrl);
	
	/**
	 * Defines "Review" modal controller.
	 * Binds some data for header and sidebar.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	reviewModalCtrl.$inject = ['$uibModalInstance', 'dataService', 'locationData'];
	function reviewModalCtrl($uibModalInstance, dataService, locationData) {
		var vm = this;
		vm.locationData = locationData;

		vm.modal = {
			// pass saved review data to the parent controller
			close: function(result) {
				$uibModalInstance.close(result);
			},
			// just close the modal
			cancel: function() {
				$uibModalInstance.dismiss('cancel');
			}
		};

		vm.onSubmit = function() {
			vm.formError = "";
			if (!vm.formData.name || !vm.formData.rating || ! vm.formData.reviewText) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				console.log(vm.formData);
				vm.addReview(vm.locationData.locationId, vm.formData);
			}
		};

		vm.addReview = function(locationId, formData) {
			dataService
				.addReview(locationId, {
					author: formData.name,
					rating: formData.rating,
					reviewText: formData.reviewText
				})
				.then(
					function(data) {
						console.log("Review successfully saved.");
						vm.modal.close(data);
					},
					function(error) {
						vm.formError = "Error saving review, try again.";
					});
			return false;
		};
	}
})();
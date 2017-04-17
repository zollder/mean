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
	reviewModalCtrl.$inject = ['$uibModalInstance', 'locationData'];
	function reviewModalCtrl($uibModalInstance, locationData) {
		var vm = this;
		vm.locationData = locationData;

		vm.modal = {
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
				return false;
			}
		};
	}
})();
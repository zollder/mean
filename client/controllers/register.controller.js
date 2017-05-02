/* IIFE wrapper */
(function() {
	/**
	 * Declare and add registration page controller to the application.
	 */
	angular
		.module('spapp')
		.controller('registerCtrl', registerCtrl);
	
	/**
	 * Defines user registration page controller.
	 * Binds some data for header and sidebar.
	 * Is bound to the scope with controllerAs option.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	registerCtrl.$inject = ['$location', 'authService'];
	function registerCtrl($location, authService) {
		// controller hook, binds controller to the scope (controllerAs)
		var vm = this;

		vm.pageHeader = {
			title: ' Mean PG user account registration'
		};

		// initialize user credentials
		vm.credentials = {
			name: "",
			email: "",
			password: ""
		};

		/*
		 * Last visited page - "page" parameter from the request string.
		 * Is passed as a parameter when user clicks "login".
		 */
		vm.returnPage = $location.search().page || '/';

		/*
		 * Registers user.
		 * Saves token data in a local browser storage.
		 * Redirects the user to the last visited page.
		 */
		vm.onSubmit = function() {
			vm.formError = "";
			if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.register();
			}
		};
		
		vm.register = function() {
			vm.formError = "";
			authService.register(vm.credentials)
				.then(
					function(response) {
						console.log(JSON.stringify(response.data));
						authService.saveToken(response.data.token);
						
						// clear query string and redirect
						$location.search('page', null);
						$location.path(vm.returnPage);
					},
					function(error) {
						vm.formError = error;
					});
		};
	}
})();
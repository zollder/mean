/* IIFE wrapper */
(function() {
	/**
	 * Declare and add login page controller to the application.
	 */
	angular
		.module('spapp')
		.controller('loginCtrl', loginCtrl);
	
	/**
	 * Defines user login page controller.
	 * Binds some data for header and sidebar.
	 * Is bound to the scope with controllerAs option.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	loginCtrl.$inject = ['$location', 'authService'];
	function loginCtrl($location, authService) {
		// controller hook, binds controller to the scope (controllerAs)
		var vm = this;

		vm.pageHeader = {
			title: ' Mean PG user account login'
		};

		// initialize user credentials
		vm.credentials = {
			email: "",
			password: ""
		};

		/*
		 * Last visited page - "page" parameter from the request string.
		 * Is passed as a parameter when user clicks "register".
		 */
		vm.returnPage = $location.search().page || '/';

		/*
		 * User sign in.
		 * Saves token data in a local browser storage.
		 * Redirects the user to the last visited page.
		 */
		vm.onSubmit = function() {
			vm.formError = "";
			if (!vm.credentials.email || !vm.credentials.password) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.login();
			}
		};
		
		vm.login = function() {
			vm.formError = "";
			authService.login(vm.credentials)
				.then(
					function(response) {
						console.log("User login: " + JSON.stringify(response.data));
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
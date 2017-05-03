/* IIFE wrapper */
(function() {
	/**
	 * Declare and add navigation controller for an associated directive.
	 */
	angular
		.module('spapp')
		.controller('navigationCtrl', navigationCtrl);
	
	/**
	 * Defines navigation directive's controller.
	 * Binds some data for header and sidebar.
	 * Is bound to the scope with controllerAs option.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	navigationCtrl.$inject = ['$location', 'authService'];
	function navigationCtrl($location, authService) {
		/* Controller hook (internal reference), binds controller to the scope. */
		var vm = this;

		// current page holder, login link parameter
		vm.currentPath = $location.path();

		// true, if the user is signed in
		vm.isLoggedIn = authService.isLoggedIn();

		// currently signed in user holder
		vm.currentUser = authService.getCurrentUser();

		/*
		 * Logs out currently signed in user.
		 * Redirects to the home page.
		 * TODO: fix refresh upon "logout" issue
		 */
		vm.logout = function() {
			authService.logout();
			$location.path('/');
		};
	}
})();
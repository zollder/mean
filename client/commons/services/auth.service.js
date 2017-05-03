/* IIFE wrapper */
(function() {
	/**
	 * Authentication service implementation.
	 */
	angular
		.module('spapp')
		.service('authService', authService);
	
	/**
	 * Authentication service definition.
	 * Inject parameters as an array of strings to avoid issues at minification.
	 */
	authService.$inject = ['$http', '$window'];
	function authService($http, $window) {
		/*
		 * Saves authentication (JWT) data in the browser's local storage.
		 */
		var saveJwtToken = function(token) {
			$window.localStorage['mean-spa-token'] = token;
		};

		/*
		 * Reads and returns authentication (JWT) data
		 * from the browser's local storage.
		 */
		var getJwtToken = function() {
			return $window.localStorage['mean-spa-token'];
		};

		/*
		 * Registers a user with specified user details.
		 * Saves registered user data in the browser's local storage.
		 */
		var registerUser = function(user) {
			return $http.post('/api/register', user);
		};

		/*
		 * Logs in a user with specified user login details.
		 * Saves generated JWT token in the browser's local storage.
		 */
		var loginUser = function(user) {
			return $http.post('/api/login', user);
		};

		/*
		 * Logs current user out by removing associated JWT data
		 * from the browser's local storage.
		 */
		var logoutUser = function() {
			$window.localStorage.removeItem('mean-spa-token');
		};

		/*
		 * Verifies if the current user is logged in (true/false).
		 * Reads saved token, decodes it, validates exp date.
		 */
		var isLoggedIn = function() {
			var token = getJwtToken();
			if (token) {
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now()/1000;
			} else {
				return false;
			}
		};

		/*
		 * Retrieves and returns name and email of the currently logged in user.
		 * Reads saved token, decodes user info, returns user details.
		 */
		var getCurrentUser = function() {
			if (isLoggedIn()) {
				var token = getJwtToken();
				var userData = JSON.parse($window.atob(token.split('.')[1]));
				return {
					name: userData.name,
					email: userData.email
				}
			}
		};

		return {
			saveToken: saveJwtToken,
			getToken: getJwtToken,
			register: registerUser,
			login: loginUser,
			logout: logoutUser,
			isLoggedIn: isLoggedIn,
			getCurrentUser: getCurrentUser
		};
	}
})();
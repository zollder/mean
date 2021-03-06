/* IIFE wrapper */
(function() {
	/**
	 * Angular module setter.
	 * http://usejsdoc.org/
	 */
	angular.module('spapp',
			['ngRoute', 'ngSanitize', 'ui.bootstrap']);
	
	/**
	 * Angular config function.
	 * Holds application route definitions.
	 * Note: templates are injected into the layout.jade div(ng-view)
	 * @param $routeProvider
	 */
	function config($routeProvider, $locationProvider, $qProvider) {

		$routeProvider
			.when('/', {
				templateUrl: '/views/home.view.html',
				controller: 'homeCtrl',
				controllerAs: 'vm'
			})
			.when('/locations/:locationid', {
				templateUrl: '/views/locationDetails.view.html',
				controller: 'locationDetailsCtrl',
				controllerAs: 'vm'
			})
			.when('/about', {
				templateUrl: '/commons/views/generic.view.html',
				controller: 'aboutCtrl',
				controllerAs: 'vm'
			})
			.when('/register', {
				templateUrl: '/views/register.view.html',
				controller: 'registerCtrl',
				controllerAs: 'vm'
			})
			.when('/login', {
				templateUrl: '/views/login.view.html',
				controller: 'loginCtrl',
				controllerAs: 'vm'
			})
			.otherwise({redirectTo: '/'});

		// enable html5Mode for pushstate ('#'-less URLs)
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$qProvider.errorOnUnhandledRejections(false);
	}
	
	/*
	 * Add config to module.
	 * Pass config through route provider as dependency.
	 */
	angular
		.module('spapp')
		.config(['$routeProvider', '$locationProvider', '$qProvider', config]);
})();
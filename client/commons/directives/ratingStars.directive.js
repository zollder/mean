/* IIFE wrapper */
(function() {
	/**
	 * Declare and add rating stars directive to the application.
	 */
	angular
		.module('spapp')
		.directive('ratingStars', ratingStars);
	
	/**
	 * Directive: ratingStars
	 * Returns a simple template that outputs the rating as a number.
	 */
	function ratingStars() {
		return {
			// restrict to elements & attribute
			restrict: 'EA',
			// add an isolated directive's scope
			scope: {
				thisRating: '=rating' // get value from "rating" attribute
			},
			// template : "{{ thisRating }}"
			templateUrl: '/commons/directives/templates/ratingStars.template.html'
		};
	}
})();
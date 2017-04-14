/* IIFE wrapper */
(function() {
	angular
		.module('spapp')
		.directive('navigation', navigation);
	
	/**
	 * Directive: navigation bar header
	 * Returns a simple template that outputs the page header with navigation bar.
	 */
	function navigation() {
		return {
			restrict: 'EA',
			templateUrl: '/commons/directives/navigation.template.html'
		};
	}
})();
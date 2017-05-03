/* IIFE wrapper */
(function() {
	angular
		.module('spapp')
		.directive('navigation', navigation);
	
	/**
	 * Directive: navigation bar header
	 * Returns a simple template that outputs the page header with navigation bar.
	 * Sets the directive's controller with the inline version of the controllerAs syntax.
	 */
	function navigation() {
		return {
			restrict: 'EA',
			templateUrl: '/commons/directives/templates/navigation.template.html',
			controller: 'navigationCtrl as navvm'	// use another vm name to avoid conflicts
		};
	}
})();
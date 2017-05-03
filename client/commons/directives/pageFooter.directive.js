/* IIFE wrapper */
(function() {
	angular
		.module('spapp')
		.directive('pageFooter', pageFooter);
	
	/**
	 * Directive: footer generic
	 * Returns a simple template that outputs the generic page footer.
	 */
	function pageFooter() {
		return {
			restrict: 'EA',
			templateUrl: '/commons/directives/templates/pageFooter.template.html'
		};
	}
})();
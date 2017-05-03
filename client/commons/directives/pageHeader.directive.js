/* IIFE wrapper */
(function() {
	angular
		.module('spapp')
		.directive('pageHeader', pageHeader);
	
	/**
	 * Directive: header generic
	 * Returns a simple template that outputs the generic page header with dynamic title.
	 */
	function pageHeader() {
		return {
			restrict: 'EA',
			scope: {
				content: '=content' // header data object
			},
			templateUrl: '/commons/directives/templates/pageHeader.template.html'
		};
	}
})();
/* IIFE wrapper */
(function() {
	/**
	 * Declare and add line breaks filter to the application.
	 */
	angular
		.module('spapp')
		.filter('transformLineBreaks', transformLineBreaks);
	
	/**
	 * Filter: transform line breaks
	 * Replaces each instance of \n with a <br/> tag.
	 */
	function transformLineBreaks() {
		// don't process, return a processing function instead
		return function(text) {
			var output = text.replace(/\n/g, '<br/>');
			return output;
		};
	}
})();
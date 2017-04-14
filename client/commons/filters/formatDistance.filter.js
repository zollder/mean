/* IIFE wrapper */
(function() {
	/**
	 * Declare and add format distance filter to the application.
	 */
	angular
		.module('spapp')
		.filter('formatDistance', formatDistance);
	
	/**
	 * Helper function to verify if the specified value is numeric.
	 */
	var isNumeric = function(number) {
		return !isNaN(parseFloat(number)) && isFinite(number);
	};
	
	/**
	 * Filter: format distance
	 * Convert the distance to convenient format (m or km)
	 * based on the distance value (less or greater than 1km).
	 */
	function formatDistance() {
		// don't process, return a processing function instead
		return function(distance) {
			var distanceVal, unit;
			if (distance && isNumeric(distance)) {
				if (distance > 1) {
					distanceVal = parseFloat(distance).toFixed(1);
					unit = 'km';
				} else {
					distanceVal = parseInt(distance * 1000, 10);
					unit = 'm';
				}
				return distanceVal + unit;
			} else {
				return "?";
			}
		};
	}
})();
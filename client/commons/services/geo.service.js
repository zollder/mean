/* IIFE wrapper */
(function() {
	/**
	 * Service: geoService
	 */
	angular
		.module('spapp')
		.service('geoService', geoService);
	
	/**
	 * GeoService wrapper around browser-based "navigator" feature.
	 * Exposes getPosition() service to external callers.
	 * Returns current user location (user-accepted only).
	 * Performs basic error handling.
	 */
	function geoService() {
		// define a function accepting 3 callback functions
		var getPosition = function(cbSuccess, cbError, cbNoGeo) {
			if (navigator.geolocation) {
				// call native method, if geo is supported
				navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
			} else {
				// fire/execute "noGeo" if geo isn't supported
				cbNoGeo();
			}
		};
		
		// expose the function to external users
		return {
			getPosition: getPosition
		};
	}
})();

var mongoose = require( 'mongoose' );	// gives the controller access to DB connection
var locationDao = mongoose.model('Location');

/* Utility function to build API response with specified status and content. */
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.jsonp(content);
};

/**
 * Distance converter.
 */
var converter = function() {
	var kmToM = function(distance) {
		return parseFloat(distance * 1000);
	};

	var mToKm = function(distance) {
		return parseFloat(distance / 1000);
	};

	// expose functions
	return {
		kmToM : kmToM,
		mToKm : mToKm
	};
}();

/**
 * Builds a list of location from the DB response.
 */
var builder = function(result) {
	var getLocationsList = function(results) {
		var locations = [];
		results.forEach(function(doc) {
			locations.push(
				{
					distance: converter.mToKm(doc.dis),
					name: doc.obj.name,
					address: doc.obj.address,
					rating: doc.obj.rating,
					facilities: doc.obj.facilities,
					id: doc.obj._id
				});
		});
		return locations;
	};

	// expose the function
	return {
		getLocations : getLocationsList
	};
}();

/**
 * Loads and returns a list of locations around the point
 * with specified coordinates and a given radius.
 * - mandatory params: latitude, longitude
 * - optional params: radius or max distance from the point (defaults to 20)
 */
module.exports.getLocationsByDistance = function(req, res) {
	if (!req.query) {
		sendJsonResponse(res, 404, { "message":"Missing query."});
		return;
	}

	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	if (!lng || !lat) {
		sendJsonResponse(res, 404, { "message":"Invalid or missing coordinates."});
		return;
	}

	// geoJson
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	// geo options (type, max distance, max items)
	var options = {
		spherical: true,
		maxDistance: converter.kmToM(parseFloat(req.query.radius || 0))
	};
	console.log("GEO OPTIONS: " + JSON.stringify(options));
	locationDao.geoNear(point, options, function(error, results, stats) {
		if (error) {
			sendJsonResponse(res, 404, error);
			return;
		}
		if (!results) {
			sendJsonResponse(res, 404, stats);
			return;
		}
		console.log(results);
		console.log(stats);
		sendJsonResponse(res, 200, builder.getLocations(results));
	});
};

/**
 * Loads and returns a location for specified location ID.
 * - builds DB query and provides is to the model
 * - executes the query and specified callback function
 * - handles errors, if any
 */
module.exports.getLocationById = function(req, res) {
	if (!req.params) {
		sendJsonResponse(res, 404, { "message":"Missing params."});
		return;
	}
	var locationId = req.params.locationId;
	if (!locationId){
		sendJsonResponse(res, 404, { "message":"Missing locationId."});
		return;
	}

	locationDao.findById(locationId)
		.exec(
			function(error, location) {
				if (!location) {
					sendJsonResponse(res, 404, { "message":"Location not found for specified ID:" + locationId });
					return;
				}
				if (error) {
					sendJsonResponse(res, 404, error);
					return;
				}
				sendJsonResponse(res, 200, location);
			}
		);
};

/**
 * Creates a new location.
 * Returns saved location or reports an error.
 */
module.exports.createLocation = function(req, res) {
	if (!req.body) {
		sendJsonResponse(res, 404, { "message":"Missing or invalid location data."});
		return;
	}
	// build locations object from request
	var data = {
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(','),
		geolocation: {
			coordinates: [
   				parseFloat(req.body.lng) || 0,
   				parseFloat(req.body.lat) || 0
			]
		},
		openingTimes: [
   			{
   				days: req.body.days1,
   				opening: req.body.opening1,
   				closing: req.body.closing1,
   				closed: req.body.closed1
   			},
   			{
   				days: req.body.days2 || "",
   				opening: req.body.opening2 || "",
   				closing: req.body.closing2 || "",
   				closed: req.body.closed2 || true
   			}
		]
	};
	// persist and report
	locationDao.create(data, function(error, location) {
		if (error) {
			sendJsonResponse(res, 400, error);
			return;
		}
		sendJsonResponse(res, 200, location);
	});
};

/**
 * Updates location with specified location ID.
 */
module.exports.updateLocation = function(req, res) {
	if (!req.params) {
		sendJsonResponse(res, 404, { "message":"Undefined parameters."});
		return;
	}

	var locationId = req.params.locationId;
	if (!locationId) {
		sendJsonResponse(res, 404, { "message":"Missing location ID."});
		return;
	}

	// find -> update -> persist
	locationDao.findById(locationId)
		.select('-reviews -rating')	// exclude these
		.exec(
			function(error, location) {
				if (error) {
					sendJsonResponse(res, 404, error);
					return;
				}
				if (!location) {
					sendJsonResponse(res, 404, { "message":"Location not found for specified ID:" + locationId});
					return;
				}

				// update model
				location.name = req.body.name || location.name;
				location.address = req.body.address || location.address;
				location.facilities = req.body.facilities ? req.body.facilities.split(",") : location.facilities;
				location.coordinates = [ parseFloat(req.body.lng), parseFloat(req.body.lat) ];
				location.openingTimes = [
	                {
	                	days: req.body.days1 || location.openingTimes[0].days,
	                	opening: req.body.opening1 || location.openingTimes[0].opening,
	                	closing: req.body.closing1 || location.openingTimes[0].closing,
	                	closed: req.body.closed1 || !!location.openingTimes[0].closed
					},
	                {
	                	days: req.body.days2 || location.openingTimes[1].days,
	                	opening: req.body.opening2 || location.openingTimes[1].opening,
	                	closing: req.body.closing2 || location.openingTimes[1].closing,
	                	closed: req.body.closed2 || !!location.openingTimes[1].closed
					}
                ];

				// save changes
				location.save(function(error, location) {
					if (error) {
						sendJsonResponse(res, 404, error);
					} else {
						sendJsonResponse(res, 200, location);
					}
				});
			}
		);
};

/**
 * Removes/deletes location with specified ID.
 */
module.exports.removeLocation = function(req, res) {
	if (!req.params) {
		sendJsonResponse(res, 404, { "message":"Undefined parameters."});
		return;
	}

	var locationId = req.params.locationId;
	if (!locationId) {
		sendJsonResponse(res, 404, { "message":"Missing location ID."});
	} else {
		locationDao.findByIdAndRemove(locationId)
			.exec(function(error, location) {
				if (error) {
					sendJsonResponse(res, 404, error);
					return;
				}
				sendJsonResponse(res, 204, { "message":"Successfully removed."});
			});
	}
};

module.exports.getLocationReviews = function(req, res) {
	sendJsonResponse(res, 200, {"status":"success"});
};
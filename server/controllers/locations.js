
var request = require('request');

var apiOptions = {
	server: "http://localhost:3000"	
};

if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://stark-garden-46120.herokuapp.com/";
}

/**
 * Loads a list of locations for specified coordinates.
 * Renders home page.
 */
module.exports.home = function(req, res) {
	var path = "/api/locations";
	var requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {},
		// TODO: fix coordinates
		qs: {
			lng: -73.624151,
			lat: 45.496845,
			radius: 20
		}
	};

	request(requestOptions, function(error, response, body) {
		if (error) {
			console.log(error);
			return;
		}

		if (response.statusCode === 200 && body.length) {
			body.forEach(function(location) {
				var numDistance, unit;
				if (location.distance > 1) {
					numDistance = parseFloat(location.distance).toFixed(1);
					unit = 'km';
				} else {
					numDistance = parseInt(location.distance * 1000, 10);
					unit = 'm';
				}
				location.distance = numDistance + unit;
				return location;
			});			
		}
		renderHome(req, res, body);
	});
};

/**
 * Loads location info for specified location ID.
 * Renders location info page.
 */
module.exports.locationInfo = function(req, res) {
	getLocationDetails(req, res, function(req, res, responseData) {
		renderLocationDetails(req, res, responseData);
	});
};

/**
 * Renders 'Add Review' form.
 */
module.exports.addReview = function(req, res) {
	getLocationDetails(req, res, function(req, res, responseData) {
		renderReviewForm(req, res, responseData);
	});
};

/**
 * Saves new location review form data.
 */
module.exports.saveReview = function(req, res) {
	var locationId = req.params.locationId;
	var path = "/api/locations/" + locationId + "/reviews";
	var postData = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};
	var requestOptions = {
		url: apiOptions.server + path,
		method: "POST",
		json: postData
	};

	request(requestOptions, function(error, response, body) {
		if (error) {
			console.log(error);
			return;
		}
		
		if (response.statusCode != 201) {
			showError(req, res, response.statusCode);
			return;
		}

		res.redirect('/location/' + locationId);
	});
};

/**
 * Loads location details by location ID.
 * Performs basic error handling.
 * Executes callback upon successful response.
 */
var getLocationDetails = function(req, res, callback) {
	if (!req || !req.params) {
		console.log("Invalid request")
		return;
	}

	var path = "/api/locations/" + req.params.locationId;
	var requestOptions = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};

	request(requestOptions, function(error, response, body) {
		if (error) {
			console.log(error);
			return;
		} else if (response.statusCode != 200) {
			showError(req, res, response.statusCode);
		} else {
			var data = body;
			// TODO: fix coordinates
			data.coordinates = {
					lat: 51.455041,
					lng: -0.9690884
			};
			callback(req, res, data);
		}
	});
};

/** Renders home page. */
var renderHome = function(request, result, responseData) {
	var message;
	if (!(responseData instanceof Array)) {
		message = "API error";
		responseData = [];
	} else if (!responseData.length) {
		message = "No places found nearby";
	}

	result.render('locations-list', {
		title: 'MEAN - find a place to work with WiFi',
		pageHeader: {
			title: 'WiFi Locations: ',
			strapline: 'free nearby WiFi spots'
		},
		sidebar: "Looking for wifi and a seat? We help you find places to work when out and about." +
		            "Perhaps with coffee, cake or a pint? Let us help you find the place you're looking for.",
		locations: responseData,
		message: message
	});
	
};

/** Renders location details page. */
var renderLocationDetails = function(request, result, locationDetails) {
	console.log("Location details name: " + locationDetails.name);
	result.render('location-info',
	{
		title: locationDetails.name,
		pageHeader: { title: locationDetails.name },
		sidebar: {
			context: "Simon's cafe is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
			callToAction: "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
		},
		location: locationDetails
	});
};

/** Renders location review form. */
var renderReviewForm = function(req, res, locationDetails) {
	res.render('location-review-form', {
		submitButton: { title: 'Add Review' },
		pageHeader: { title: "Review " + locationDetails.name },
	});
};

/** Render error page for non 200 status codes. */
var showError = function(req, res, code) {
	var title, content;
	if (code === 404) {
		title = "404, page not found";
		content = "The page doesn't exist. Sorry.";
	} else {
		title = code + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}

	res.status(code);
	res.render('generic-text', {
		title: title,
		content: content
	});
};
var passport = require( 'passport' );
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');

/* Utility function to build API response with specified status and content. */
var sendJsonResponse = function(response, status, content) {
	response.status(status);
	response.jsonp(content);
};

/**
 * Register endpoint.
 * - validates incoming data
 * - creates new User instance (model)
 * - saves created instance
 * - returns JWT upon successful registration
 */
module.exports.register = function(req, res) {
	if (!req.body || !req.body.name || !req.body.email) {
		sendJsonResponse(res, 404, { "message":"Missing user data."});
		return;
	}

	var user = new User();
	user.name = req.body.name;
	user.email = req.body.email;
	user.setPassword(req.body.pswd);

	user.save(function(error) {
		var token;
		if (error) {
			sendJsonResponse(res, 404, error);
		} else {
			token = user.generateJwt();
			sendJsonResponse(res, 200, {"token" : token});
		}
	});
};

/**
 * Login endpoint.
 * Accepts authentication strategy name and a authentication function (callback) as parameters.
 * 
 * - returns JWT upon successful registration
 */
module.exports.login = function(req, res) {
	if (!req.body || !req.body.email || !req.body.pswd) {
		sendJsonResponse(res, 404, { "message":"Missing login credentials."});
		return;
	}

	passport.authenticate('local', function(error, user, info) {
		if (error) {
			sendJsonResponse(res, 404, error);
		}

		if (user) {
			sendJsonResponse(res, 200, {"token" : user.generateJwt()});
		} else {
			sendJSONresponse(res, 401, info);	// return reason for failure
		}
	}) (req, res);	// make sure these are available to passport
};
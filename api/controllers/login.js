var passport = require('passport');
var mongoose = require( 'mongoose' );
var User = mongoose.model('User');

/* Utility function to build API response with specified status and content. */
var sendJsonResponse = function(response, status, content) {
	response.status(status);
	response.jsonp(content);
};

/**
 * Registers a new user:
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
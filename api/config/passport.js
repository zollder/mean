/*
 * Authentication configuration note.
 * Use Passport Node module to authentication application users.
 * Supports several authentication strategies (..., local, OAuth, etc.).
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

/*
 * Configure local authentication strategy:
 * 1. Override usernameField to use email(s) as username(s).
 * 2. Configure user authenticator.
 * 3. Construct and use.
 */
var options = {usernameField: 'email'};
var authenticator = function(username, password, done) {
	User.findOne(
		{ email: username },
		function(error, userData) {
			if (error) {
				return done(error);
			}
			if (!userData) {
				return done(null, false, { message: 'User not found.' });
			}
			if (!userData.isValidPassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, userData);
		});
};

/* Strategy constructor */
var strategy = new LocalStrategy(options, authenticator);
passport.use(strategy);
var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

/*
 * Defines "user" schema.
 */
var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	hash: String,
	salt: String,
	createdOn: {
		type:Date,
		"default": Date.now
	}
});

/*
 * Sets a password (with salt) for user schema.
 * Generates salt and hash for a user and adds it to the model instance.
 */
userSchema.methods.setPassword = function(passwd) {
	// create a random string for salt
	this.salt = crypto.randomBytes(16).toString('hex');

	// create encrypted password hash
	this.hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
};

/*
 * Validates submitted user password.
 * Verifies if the password matches the one on record for the current user model.
 * Returns true on match, or false otherwise.
 */
userSchema.methods.isValidPassword = function(passwd) {
	var passHash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
	return this.hash === passHash;
};

/*
 * Generates JWT for current user model payload.
 * Returns generated token.
 */
userSchema.methods.generateJwt = function() {
	// calculate expiry date
	var exDate = new Date();
	exDate.setDate(exDate.getDate() + 5);

	// create payload
	var data = {
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(exDate.getTime()/1000)
	};

	// DO NOT KEEP THE SECRET IN THE CODE!
	// don't forget to configure the secret in prod env
	return jwt.sign(data, rocess.env.JWT_SECRET);
};

mongoose.model('User', userSchema);
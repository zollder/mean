var mongoose = require('mongoose');
var readline = require('readline');

// test using: $ NODE_ENV=production MONGODB_URI=mongodb://<username>:<password>@<host>:<port>/<db-name> nodemon
var dbUrl = process.env.MONGODB_URI;
mongoose.connect(dbUrl);

// Log Mongoose events
mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbUrl);
});

mongoose.connection.on('error', function(error) {
	console.log('Mongoose connection error: ' + error);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

/*
 * Emulate SIGINT event on Windows OS (default on UNIX systems).
 */ 
if (process.platform === "win32") {
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	rl.on("SIGINT", function() {
		process.emit ("SIGINT");
	});
}

/*
 * Gracefully shuts down DB connection and invokes provided callback.
 */
var shutdown = function(message, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected via ' + message);
		callback();
	});
};

/*
 * Captures nodemon restart event (system's SIGUSR2) and closes DB connection.
 * Kills Node process and emits SIGUSR2 again, once the connection is closed.
 */
process.once('SIGUSR2', function() {
	shutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

/*
 * Listens to NodeJS process for SIGINT event emitted on application termination.
 * Gracefully shuts down DB connection and kills the Node process.
 */
process.once('SIGINT', function() {
	shutdown('application termination', function() {
		process.exit(0);
	});
});

/*
 * Listens to NodeJS process for SIGTERM event emitted on Heroku process termination.
 * Gracefully shuts down DB connection and kills the Node process.
 */
process.once('SIGTERM', function() {
	shutdown('Heroku process termination', function() {
		process.exit(0);
	});
});

// bring in defined schemas and models
require('./locations-model');
require('./users-model');
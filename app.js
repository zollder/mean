// environment variables module
require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// minify/uglify
/*var uglifyJs = require("uglify-js");
var fs = require('fs');*/

var passport = require('passport');	// before model

/* Import the model and authentication strategy. */
require('./api/models/db');
require('./api/config/passport');	// after model

var routesApi = require('./api/routes/index');

var app = express();

// view engine setup (required to report server errors)
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'jade');
/*
 * List the files to be minified and uglified in an array,
 * uglify/minify and save to the file system.
 * Note: link the resulting file to the core layout, replacing individual file links.
 */ 
/*var clientFiles = [
	'client/spapp.js',
	'client/controllers/home.controller.js',
	'client/commons/directives/ratingStars.directive.js',
	'client/commons/filters/formatDistance.filter.js',
	'client/commons/services/data.service.js',
	'client/commons/services/geo.service.js'
];
var uglified = uglifyJs.minify(clientFiles, { compress : false });
fs.writeFile('public/angular/spapp.min.js', uglified.code, function(error) {
	if (error) {
		console.log(error);
	} else {
		console.log('Script generated and saved: spapp.min.js');
	}
});*/

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static content from these locations
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

// initialize authentication after static and before API routes (protected)
app.use(passport.initialize());

// API routes
app.use('/api', routesApi);

app.use(function(req, res) {
	res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// catch and handle unauthorized errors (invalid or missing JWT tokens)
app.use(function(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(err.status || 401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
